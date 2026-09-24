const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { ROLES, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { AuthenticationError, ValidationError, NotFoundError } = require('../utils/errors');
const { createAuditLog } = require('./audit.service');

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
 * Guest login — phone-based with dev OTP
 */
const guestRequestOtp = async (phone) => {
  if (!phone || phone.length < 10) {
    throw new ValidationError('Valid phone number is required');
  }

  // Find or create guest
  let user = await User.findOne({ phone, role: ROLES.GUEST });

  if (!user) {
    user = await User.create({
      name: 'Guest',
      phone,
      role: ROLES.GUEST,
    });
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  // Dev OTP — in production, replace with SMS provider
  const otp = env.isDevelopment ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  user.devOtp = otp;
  user.devOtpExpiry = expiry;
  await user.save();

  if (env.isDevelopment) {
    return { message: 'OTP sent', devOtp: otp };
  }

  // In production: send SMS here
  return { message: 'OTP sent to your phone' };
};

/**
 * Verify guest OTP and return tokens
 */
const guestVerifyOtp = async (phone, otp, auditCtx = {}) => {
  const user = await User.findOne({ phone, role: ROLES.GUEST })
    .select('+devOtp +devOtpExpiry +refreshToken');

  if (!user) {
    throw new AuthenticationError('Invalid phone number');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  // Verify OTP
  if (!user.devOtp || user.devOtp !== otp) {
    throw new AuthenticationError('Invalid OTP');
  }

  if (user.devOtpExpiry < new Date()) {
    throw new AuthenticationError('OTP expired');
  }

  // Clear OTP
  user.devOtp = undefined;
  user.devOtpExpiry = undefined;
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
    metadata: { method: 'phone_otp' },
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
  guestVerifyOtp,
  staffLogin,
  refreshAccessToken,
  logout,
  updateGuestProfile,
  generateTokens,
};
