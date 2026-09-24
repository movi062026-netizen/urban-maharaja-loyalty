const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { ROLES, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { AuthenticationError, ValidationError, NotFoundError } = require('../utils/errors');
const { createAuditLog } = require('./audit.service');
const { cache } = require('../integrations/redis');

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
 * Guest login request — supports Email OTP (primary) and Phone OTP (fallback)
 */
const guestRequestOtp = async (identifier) => {
  let email = null;
  let phone = null;

  if (typeof identifier === 'object' && identifier !== null) {
    email = identifier.email?.trim().toLowerCase();
    phone = identifier.phone?.trim();
  } else if (typeof identifier === 'string') {
    if (identifier.includes('@')) {
      email = identifier.trim().toLowerCase();
    } else {
      phone = identifier.trim();
    }
  }

  if (!email && (!phone || phone.length < 10)) {
    throw new ValidationError('A valid email address or 10-digit mobile number is required');
  }

  const cacheKey = email || phone;

  // Rate limit OTP requests via Redis
  const attempts = await cache.trackOtpAttempt(cacheKey);
  if (attempts && attempts > 5) {
    throw new ValidationError('Too many OTP requests. Please wait a few moments before trying again.');
  }

  // Find or create guest
  const query = email ? { email, role: ROLES.GUEST } : { phone, role: ROLES.GUEST };
  let user = await User.findOne(query);

  if (!user) {
    // Check if email already belongs to a staff/admin
    if (email) {
      const staffUser = await User.findOne({ email });
      if (staffUser && staffUser.role !== ROLES.GUEST) {
        throw new ValidationError('This email is associated with a staff terminal. Please use staff login.');
      }
    }

    user = await User.create({
      name: email ? email.split('@')[0].replace(/[._-]/g, ' ') : 'Sovereign Guest',
      email: email || undefined,
      phone: phone || undefined,
      role: ROLES.GUEST,
    });

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

  if (env.isDevelopment) {
    return {
      message: email ? `Royal seal dispatched to ${email}` : `OTP sent to ${phone}`,
      devOtp: otp,
      email,
      phone,
    };
  }

  return {
    message: email ? `Royal verification seal dispatched to ${email}` : `OTP dispatched to ${phone}`,
    email,
    phone,
  };
};

/**
 * Customer Registration — Name + Email (+ Phone optional)
 */
const customerRegister = async ({ name, email, phone }) => {
  if (!name || name.trim().length < 2) {
    throw new ValidationError('Please provide your noble name (at least 2 characters)');
  }
  if (!email || !email.includes('@')) {
    throw new ValidationError('A valid email address is required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone?.trim() || undefined;

  // Check if email is already taken
  let existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    if (existingUser.role !== ROLES.GUEST) {
      throw new ValidationError('This email is reserved for staff authentication.');
    }
    // If already a guest, update name if needed & send OTP
    if (name && (!existingUser.name || existingUser.name === 'Guest')) {
      existingUser.name = name.trim();
    }
    if (normalizedPhone && !existingUser.phone) {
      existingUser.phone = normalizedPhone;
    }
    await existingUser.save();

    // Ensure active loyalty card exists
    const { getOrCreateActiveCard } = require('./loyalty.service');
    await getOrCreateActiveCard(existingUser._id);

    return guestRequestOtp(normalizedEmail);
  }

  // Create new guest patron
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    role: ROLES.GUEST,
  });

  // Automatically provision their Digital Maharaja Card
  const { getOrCreateActiveCard } = require('./loyalty.service');
  await getOrCreateActiveCard(user._id);

  // Generate and dispatch OTP
  const otp = env.isDevelopment ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
  await cache.storeOtp(normalizedEmail, otp);

  user.devOtp = otp;
  user.devOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  return {
    message: `Imperial account created. Verification OTP dispatched to ${normalizedEmail}`,
    devOtp: env.isDevelopment ? otp : undefined,
    email: normalizedEmail,
  };
};

/**
 * Verify guest OTP and return tokens
 */
const guestVerifyOtp = async (identifier, otp, auditCtx = {}) => {
  let email = null;
  let phone = null;
  let code = otp;

  if (typeof identifier === 'object' && identifier !== null) {
    email = identifier.email?.trim().toLowerCase();
    phone = identifier.phone?.trim();
    code = identifier.otp || otp;
  } else if (typeof identifier === 'string') {
    if (identifier.includes('@')) {
      email = identifier.trim().toLowerCase();
    } else {
      phone = identifier.trim();
    }
  }

  if (!email && !phone) {
    throw new ValidationError('Email or phone number is required');
  }
  if (!code) {
    throw new ValidationError('OTP is required');
  }

  const query = email ? { email, role: ROLES.GUEST } : { phone, role: ROLES.GUEST };
  const user = await User.findOne(query).select('+devOtp +devOtpExpiry +refreshToken');

  if (!user) {
    throw new AuthenticationError('Guest account not found. Please register first.');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated. Please contact concierge.');
  }

  const cacheKey = email || phone;

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
    metadata: { method: email ? 'email_otp' : 'phone_otp', otpSource: redisOtp ? 'redis' : 'mongodb' },
  });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Staff/Admin login with email + password
 */
const staffLogin = async (email, password, auditCtx = {}) => {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const user = await User.findOne({
    email,
    role: { $in: [ROLES.STAFF, ROLES.ADMIN] },
  }).select('+password +refreshToken');

  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid credentials');
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
    metadata: { method: 'email_password' },
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

module.exports = {
  guestRequestOtp,
  customerRegister,
  guestVerifyOtp,
  staffLogin,
  refreshAccessToken,
  logout,
  updateGuestProfile,
  generateTokens,
};
