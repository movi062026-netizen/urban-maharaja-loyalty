const { body, oneOf } = require('express-validator');

const guestOtpRules = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be 10-15 characters'),
  body().custom((value) => {
    if (!value.email && !value.phone) {
      throw new Error('Either email or phone number is required');
    }
    return true;
  }),
];

const customerRegisterRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Your name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('phone')
    .optional()
    .trim(),
];

const guestVerifyRules = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP code is required')
    .isLength({ min: 4, max: 6 }).withMessage('OTP must be 4-6 digits'),
  body().custom((value) => {
    if (!value.email && !value.phone) {
      throw new Error('Either email or phone number is required to verify OTP');
    }
    return true;
  }),
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
  staffLoginRules,
  googleAuthRules,
  refreshTokenRules,
  updateProfileRules,
};
