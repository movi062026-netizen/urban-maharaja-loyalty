const { body, oneOf } = require('express-validator');

const guestOtpRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address'),
];

const customerRegisterRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name contains invalid characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .custom((phone) => {
      const digits = String(phone).replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        throw new Error('Mobile number must be between 10 and 15 digits');
      }
      return true;
    }),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 128 }).withMessage('Password must be between 6 and 128 characters')
    .custom((password) => {
      if (typeof password === 'string' && password.trim().length === 0) {
        throw new Error('Password cannot be composed solely of whitespace');
      }
      return true;
    }),
];

const guestLoginRules = [
  body().custom((value) => {
    const raw = value.identifier || value.email || value.phone;
    if (!raw || !String(raw).trim()) {
      throw new Error('Email address or mobile number is required');
    }
    const clean = String(raw).trim();
    if (clean.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clean)) {
        throw new Error('Please enter a valid email address');
      }
    } else {
      const digits = clean.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        throw new Error('Mobile number must be between 10 and 15 digits');
      }
    }
    return true;
  }),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 1, max: 128 }).withMessage('Password length is invalid'),
];

const guestVerifyRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP code is required')
    .isLength({ min: 4, max: 6 }).withMessage('OTP must be 4-6 digits'),
];

const staffLoginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const refreshTokenRules = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
];

const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email'),
];

const googleAuthRules = [
  body().custom((value) => {
    if (!value.idToken && !value.credential && !value.token) {
      throw new Error('Google credential or idToken is required');
    }
    return true;
  }),
];

module.exports = {
  guestOtpRules,
  guestVerifyRules,
  customerRegisterRules,
  guestLoginRules,
  staffLoginRules,
  googleAuthRules,
  refreshTokenRules,
  updateProfileRules,
};
