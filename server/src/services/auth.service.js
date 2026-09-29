const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { ROLES, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { AuthenticationError, ValidationError, NotFoundError } = require('../utils/errors');
const { createAuditLog } = require('./audit.service');
const { cache } = require('../integrations/redis');
const { sendPasswordResetEmail } = require('../integrations/email');
const logger = require('../config/logger');

/**
 * Generate access + refresh token pair
 */
const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });

  return { accessToken, refreshToken };
};

/**
 * Guest login request — Email OTP only
 */
const guestRequestOtp = async (identifier) => {
  let email = null;

  if (typeof identifier === 'object' && identifier !== null) {
    email = identifier.email?.trim().toLowerCase();
  } else if (typeof identifier === 'string') {
    email = identifier.trim().toLowerCase();
  }

  if (!email || !email.includes('@')) {
    throw new ValidationError('A valid email address is required');
  }

  const cacheKey = email;

  // Rate limit OTP requests via Redis
  const attempts = await cache.trackOtpAttempt(cacheKey);
  if (attempts && attempts > 5) {
    throw new ValidationError('Too many OTP requests. Please wait a few moments before trying again.');
  }

  // Find or create guest
  let user = await User.findOne({ email, role: ROLES.GUEST });

  if (!user) {
    // Check if email already belongs to a staff/admin
    const staffUser = await User.findOne({ email });
    if (staffUser && staffUser.role !== ROLES.GUEST) {
      throw new ValidationError('This email is associated with a staff terminal. Please use staff login.');
    }

    const userData = {
      name: email.split('@')[0].replace(/[._-]/g, ' '),
      email,
      role: ROLES.GUEST,
    };

    user = await User.create(userData);

    // Automatically provision their Digital Maharaja Card
    const { getOrCreateActiveCard } = require('./loyalty.service');
    await getOrCreateActiveCard(user._id);
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account has been deactivated. Please contact restaurant concierge.');
  }

  // Generate 6-digit OTP
  const otp = env.isDevelopment ? '123456' : String(Math.floor(100000 + Math.random() * 900000));

  // Store OTP in Redis (5-minute TTL)
  await cache.storeOtp(cacheKey, otp);

  // MongoDB fallback
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  user.devOtp = otp;
  user.devOtpExpiry = expiry;
  await user.save();

  return {
    message: `Royal verification seal dispatched to ${email}`,
    devOtp: env.isDevelopment ? otp : undefined,
    email,
  };
};

/**
 * Customer Registration — Name + Email + Phone + Password
 */
const customerRegister = async ({ name, email, phone, password }) => {
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    throw new ValidationError('Please provide your full noble name (between 2 and 100 characters)');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    throw new ValidationError('A valid email address is required (e.g., patron@example.com)');
  }
  const normalizedPhone = phone ? String(phone).trim().replace(/\D/g, '') : '';
  if (!normalizedPhone || normalizedPhone.length < 10 || normalizedPhone.length > 15) {
    throw new ValidationError('A valid mobile number between 10 and 15 digits is required');
  }
  if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
    throw new ValidationError('Password must be between 6 and 128 characters');
  }
  if (password.trim().length === 0) {
    throw new ValidationError('Password cannot be composed solely of whitespace');
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check if email or phone is reserved for staff
  const staffWithEmail = await User.findOne({ email: normalizedEmail });
  if (staffWithEmail && staffWithEmail.role !== ROLES.GUEST) {
    throw new ValidationError('This email is reserved for staff terminal access.');
  }

  const staffWithPhone = await User.findOne({ phone: normalizedPhone });
  if (staffWithPhone && staffWithPhone.role !== ROLES.GUEST) {
    throw new ValidationError('This phone number is reserved for staff terminal access.');
  }

  // 2. Check if a guest already exists with this email OR phone
  let existingUser = await User.findOne({
    role: ROLES.GUEST,
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
  }).select('+password');

  if (existingUser) {
    if (existingUser.password) {
      throw new ValidationError('An account with this email or mobile number already exists. Please sign in.');
    }

    // Existing guest without password (e.g. created via OTP earlier) -> set password & update details
    existingUser.name = name.trim();
    existingUser.email = normalizedEmail;
    existingUser.phone = normalizedPhone;
    existingUser.password = password; // Trigger pre('save') hash
    await existingUser.save();

    // Ensure active loyalty card exists
    const { getOrCreateActiveCard } = require('./loyalty.service');
    await getOrCreateActiveCard(existingUser._id);

    return guestRequestOtp({ email: normalizedEmail });
  }

  // 3. Create new guest patron safely
  const userData = {
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password, // Trigger pre('save') hash in User model
    role: ROLES.GUEST,
  };

  const user = await User.create(userData);

  // Automatically provision their Digital Maharaja Card
  const { getOrCreateActiveCard } = require('./loyalty.service');
  await getOrCreateActiveCard(user._id);

  // Generate and dispatch verification OTP
  const otp = env.isDevelopment ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
  await cache.storeOtp(normalizedEmail, otp);

  user.devOtp = otp;
  user.devOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  return {
    message: `Imperial account created. Verification OTP dispatched to ${normalizedEmail}`,
    devOtp: env.isDevelopment ? otp : undefined,
    email: normalizedEmail,
    phone: normalizedPhone,
  };
};

/**
 * Verify guest OTP and return tokens
 */
const guestVerifyOtp = async (identifier, otp, auditCtx = {}) => {
  let email = null;
  let code = otp;

  if (typeof identifier === 'object' && identifier !== null) {
    email = identifier.email?.trim().toLowerCase();
    code = identifier.otp || otp;
  } else if (typeof identifier === 'string') {
    email = identifier.trim().toLowerCase();
  }

  if (!email || !email.includes('@')) {
    throw new ValidationError('A valid email address is required');
  }
  if (!code) {
    throw new ValidationError('OTP is required');
  }

  const user = await User.findOne({ email, role: ROLES.GUEST }).select('+devOtp +devOtpExpiry +refreshToken');

  if (!user) {
    throw new AuthenticationError('Guest account not found. Please register first.');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated. Please contact concierge.');
  }

  const cacheKey = email;

  // Verify OTP — try Redis first, fallback to MongoDB
  const redisOtp = await cache.getOtp(cacheKey);
  const storedOtp = redisOtp || user.devOtp;

  if (!storedOtp || String(storedOtp) !== String(code).trim()) {
    throw new AuthenticationError('Invalid OTP code. Please verify the code.');
  }

  // Check expiry if using MongoDB fallback
  if (!redisOtp && user.devOtpExpiry < new Date()) {
    throw new AuthenticationError('OTP expired. Please request a new verification code.');
  }

  // Clear OTP
  await cache.deleteOtp(cacheKey);
  user.devOtp = undefined;
  user.devOtpExpiry = undefined;
  user.lastLoginAt = new Date();

  // Provision loyalty card if missing
  const { getOrCreateActiveCard } = require('./loyalty.service');
  await getOrCreateActiveCard(user._id);

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Store session in Redis
  await cache.setSession(user._id.toString(), {
    role: user.role,
    loginAt: new Date().toISOString(),
  });

  // Audit
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.LOGIN,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: { method: 'email_otp', otpSource: redisOtp ? 'redis' : 'mongodb' },
  });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Guest login with email or phone + password
 */
const guestPasswordLogin = async (identifier, password, auditCtx = {}) => {
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    throw new ValidationError('Email address or mobile number is required');
  }
  if (!password || typeof password !== 'string' || password.length === 0) {
    throw new ValidationError('Password is required');
  }
  if (password.length > 128) {
    throw new ValidationError('Password length exceeds maximum allowed');
  }

  const rawIdentifier = identifier.trim();
  let user;
  let method = 'guest_password';

  if (rawIdentifier.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawIdentifier)) {
      throw new ValidationError('Please enter a valid email address');
    }
    const email = rawIdentifier.toLowerCase();
    user = await User.findOne({
      email,
      role: ROLES.GUEST,
    }).select('+password +refreshToken');
    method = 'guest_password_email';
  } else {
    const phone = rawIdentifier.replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 15) {
      throw new ValidationError('Please enter a valid 10-15 digit mobile number or email address');
    }
    user = await User.findOne({
      phone,
      role: ROLES.GUEST,
    }).select('+password +refreshToken');
    method = 'guest_password_phone';
  }

  if (!user || !user.password) {
    throw new AuthenticationError('Invalid credentials. If you signed up with Google or Email OTP, please use that method.');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated. Please contact restaurant concierge.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid email/mobile number or password');
  }

  user.lastLoginAt = new Date();
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Provision loyalty card if missing
  const { getOrCreateActiveCard } = require('./loyalty.service');
  await getOrCreateActiveCard(user._id);

  // Store session in Redis
  await cache.setSession(user._id.toString(), {
    role: user.role,
    loginAt: new Date().toISOString(),
  });

  // Audit
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.LOGIN,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: { method },
  });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Administrator login with email + password (Strictly ADMIN role)
 */
const adminLogin = async (email, password, auditCtx = {}) => {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password +refreshToken');

  if (!user || !user.password) {
    throw new AuthenticationError('Invalid administrator credentials');
  }

  if (user.role !== ROLES.ADMIN) {
    if (user.role === ROLES.STAFF) {
      throw new AuthenticationError('Staff account detected. Please use the Staff Concierge Terminal at /staff/login.');
    }
    throw new AuthenticationError('Access denied. This portal is strictly restricted to Administrators.');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Administrator account is deactivated. Contact system management.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid administrator credentials');
  }

  user.lastLoginAt = new Date();
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Audit
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.LOGIN,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: { method: 'admin_password' },
  });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Floor Staff / Concierge login with email + password (Strictly STAFF role)
 */
const staffLogin = async (email, password, auditCtx = {}) => {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password +refreshToken');

  if (!user || !user.password) {
    throw new AuthenticationError('Invalid staff credentials');
  }

  if (user.role !== ROLES.STAFF) {
    if (user.role === ROLES.ADMIN) {
      throw new AuthenticationError('Administrator account detected. Please use the Administrator Portal at /admin/login.');
    }
    throw new AuthenticationError('Access denied. This terminal is strictly restricted to Concierge & Floor Staff.');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Staff account is deactivated. Contact administrator.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid staff credentials');
  }

  user.lastLoginAt = new Date();
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Audit
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.LOGIN,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: { method: 'staff_password' },
  });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token required');
  }

  const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw new AuthenticationError('Invalid refresh token');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { tokens };
};

/**
 * Logout — clear refresh token
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  // Clear Redis session
  await cache.removeSession(String(userId));
};

/**
 * Update guest profile
 */
const updateGuestProfile = async (userId, { name, email }) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  if (name) user.name = name;
  if (email) user.email = email;
  await user.save();

  return user.toJSON();
};

/**
 * Google OAuth Login & Registration
 */
const googleLogin = async (idToken, auditCtx = {}) => {
  const { verifyGoogleIdToken } = require('../integrations/google');
  const googleProfile = await verifyGoogleIdToken(idToken);
  const { googleId, email, name, picture } = googleProfile;

  // Search for existing user by googleId OR email
  let user = await User.findOne({
    $or: [{ googleId }, { email: email.toLowerCase() }],
  }).select('+refreshToken');

  let isNewUser = false;

  if (user) {
    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated. Please contact restaurant administration.');
    }

    // Link googleId and avatar if not present
    let modified = false;
    if (!user.googleId) {
      user.googleId = googleId;
      modified = true;
    }
    if (picture && !user.avatar) {
      user.avatar = picture;
      modified = true;
    }
    if (name && (!user.name || user.name === 'Guest' || user.name === 'Sovereign Guest')) {
      user.name = name;
      modified = true;
    }

    user.lastLoginAt = new Date();
    if (modified) await user.save();
  } else {
    // Register new patron
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      googleId,
      avatar: picture,
      role: ROLES.GUEST,
      isActive: true,
      lastLoginAt: new Date(),
    });
    isNewUser = true;
  }

  // Ensure active loyalty card exists if guest
  if (user.role === ROLES.GUEST) {
    const { getOrCreateActiveCard } = require('./loyalty.service');
    await getOrCreateActiveCard(user._id);
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Store session in Redis
  await cache.setSession(user._id.toString(), {
    role: user.role,
    loginAt: new Date().toISOString(),
    method: 'google',
  });

  // Audit log
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.LOGIN,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: {
      method: 'google_oauth',
      isNewUser,
      email: user.email,
    },
  });

  return {
    user: user.toJSON(),
    tokens,
    isNewUser,
  };
};

/**
 * Forgot Password — Request royal password reset seal via Resend
 * 
 * Works universally for Patrons, Staff, and Admin users.
 */
const forgotPassword = async (email, auditCtx = {}) => {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('A valid royal email address is required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new ValidationError('Please provide a valid royal email address');
  }

  // Rate limit password reset requests per email
  const attempts = await cache.trackResetAttempt(normalizedEmail);
  if (attempts && attempts > 5) {
    throw new ValidationError('Too many password reset requests. Please wait 15 minutes before attempting again.');
  }

  // Search user across all roles
  const user = await User.findOne({ email: normalizedEmail }).select('+password +resetPasswordOtp +resetPasswordExpires');

  // Generic secure message to prevent email enumeration
  const standardMessage = 'If an account exists with this email address, a royal password reset seal has been dispatched.';

  if (!user) {
    logger.info(`Password reset requested for non-existent email: ${normalizedEmail}`);
    return {
      message: standardMessage,
      email: normalizedEmail,
    };
  }

  if (!user.isActive) {
    throw new AuthenticationError('This account has been deactivated. Please contact restaurant administration.');
  }

  // Generate 6-digit OTP code
  const otp = env.isDevelopment && !env.RESEND_API_KEY ? '123456' : String(Math.floor(100000 + Math.random() * 900000));

  // Store OTP in Redis with 15-minute TTL
  await cache.storeResetOtp(normalizedEmail, otp);

  // Fallback in MongoDB
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  await user.save();

  // Send missive via Resend email service
  const emailResult = await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    otp,
  });

  if (!emailResult.success) {
    logger.warn(`Resend email dispatch notice for ${normalizedEmail}: ${emailResult.error || 'Check Resend credentials'}`);
  }

  // Audit log
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.PASSWORD_RESET_REQUESTED,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: {
      email: user.email,
      dispatchedViaResend: emailResult.success,
    },
  });

  return {
    message: emailResult.success
      ? `Royal password reset seal successfully dispatched to ${normalizedEmail} via Resend.`
      : standardMessage,
    email: normalizedEmail,
    devOtp: env.isDevelopment ? otp : undefined,
  };
};

/**
 * Reset Password — Verify 6-digit seal and update secret password
 */
const resetPassword = async ({ email, otp, newPassword }, auditCtx = {}) => {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('A valid royal email address is required');
  }
  if (!otp || typeof otp !== 'string' || !otp.trim()) {
    throw new ValidationError('The 6-digit imperial verification seal is required');
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 128) {
    throw new ValidationError('New password must be between 6 and 128 characters');
  }
  if (newPassword.trim().length === 0) {
    throw new ValidationError('Password cannot consist entirely of whitespace');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();

  const user = await User.findOne({ email: normalizedEmail }).select('+password +resetPasswordOtp +resetPasswordExpires');

  if (!user) {
    throw new ValidationError('No royal account found matching this email address');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated. Please contact restaurant administration.');
  }

  // Verify OTP from Redis first, fallback to MongoDB
  const redisOtp = await cache.getResetOtp(normalizedEmail);
  const storedOtp = redisOtp || user.resetPasswordOtp;

  if (!storedOtp || String(storedOtp).trim() !== cleanOtp) {
    throw new AuthenticationError('Invalid imperial verification seal. Please verify the code or request a new seal.');
  }

  // Expiration check for MongoDB fallback
  if (!redisOtp && user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
    throw new AuthenticationError('Imperial verification seal has expired. Please request a new seal.');
  }

  // Update password & clear reset OTP
  user.password = newPassword; // Triggers pre('save') bcrypt hash
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = null; // Revoke old sessions
  await user.save();

  // Clear Redis entries
  await cache.deleteResetOtp(normalizedEmail);
  await cache.removeSession(user._id.toString());

  // Audit log
  createAuditLog({
    ...auditCtx,
    actorId: user._id,
    actorRole: user.role,
    action: AUDIT_ACTIONS.PASSWORD_RESET_COMPLETED,
    entityType: ENTITY_TYPES.USER,
    entityId: user._id,
    metadata: {
      email: user.email,
    },
  });

  return {
    message: 'Imperial credentials updated successfully. You may now sign in with your new secret password.',
    email: normalizedEmail,
  };
};

module.exports = {
  guestRequestOtp,
  customerRegister,
  guestVerifyOtp,
  guestPasswordLogin,
  adminLogin,
  staffLogin,
  googleLogin,
  refreshAccessToken,
  logout,
  updateGuestProfile,
  generateTokens,
  forgotPassword,
  resetPassword,
};

