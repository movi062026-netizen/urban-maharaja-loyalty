const { body } = require('express-validator');

const guestOtpRules = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be 10-15 characters'),
];

const guestVerifyRules = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
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

module.exports = {
  guestOtpRules,
  guestVerifyRules,
  staffLoginRules,
  refreshTokenRules,
  updateProfileRules,
};
