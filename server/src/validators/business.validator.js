const { body, param, query } = require('express-validator');

const stampRequestRules = [
  body('guestId')
    .notEmpty().withMessage('Guest ID is required')
    .isMongoId().withMessage('Invalid guest ID'),
];

const stampActionRules = [
  param('id')
    .isMongoId().withMessage('Invalid stamp ID'),
];

const rejectStampRules = [
  param('id')
    .isMongoId().withMessage('Invalid stamp ID'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
];

const createRewardRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('requiredStamps')
    .notEmpty().withMessage('Required stamps is required')
    .isInt({ min: 1 }).withMessage('Required stamps must be at least 1'),
  body('validityDays')
    .optional()
    .isInt({ min: 1 }).withMessage('Validity must be at least 1 day'),
  body('rewardType')
    .optional()
    .isIn(['COMPLIMENTARY_ITEM', 'DISCOUNT_PERCENTAGE', 'DISCOUNT_FLAT', 'FREE_BEVERAGE', 'SPECIAL_EXPERIENCE', 'CUSTOM'])
    .withMessage('Invalid reward type'),
];

const updateRewardRules = [
  param('id').isMongoId().withMessage('Invalid reward ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('requiredStamps')
    .optional()
    .isInt({ min: 1 }).withMessage('Required stamps must be at least 1'),
  body('validityDays')
    .optional()
    .isInt({ min: 1 }).withMessage('Validity must be at least 1 day'),
];

const redeemRules = [
  param('id').trim().notEmpty().withMessage('Redemption ID or voucher code is required'),
];

const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid ID'),
];

const searchRules = [
  query('phone')
    .optional()
    .trim(),
  query('email')
    .optional()
    .trim(),
  query('query')
    .optional()
    .trim(),
];

const createStaffRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),
  body('password')
    .isString().withMessage('Password is required')
    .isLength({ min: 10, max: 128 }).withMessage('Password must be 10-128 characters')
    .matches(/[a-z]/).withMessage('Password needs a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password needs an uppercase letter')
    .matches(/[0-9]/).withMessage('Password needs a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password needs a symbol'),
  body('role')
    .optional()
    .equals('STAFF').withMessage('Only STAFF accounts can be created here'),
];

const updateStaffRules = [
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false'),
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('password')
    .optional()
    .isString()
    .isLength({ min: 10, max: 128 }).withMessage('Password must be 10-128 characters')
    .matches(/[a-z]/).withMessage('Password needs a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password needs an uppercase letter')
    .matches(/[0-9]/).withMessage('Password needs a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password needs a symbol'),
];

const bookingRules = [
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('phone').isString().trim().matches(/^[+\d][\d\s-]{8,18}$/).withMessage('Enter a valid phone number'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('date').optional().isString().isLength({ max: 20 }),
  body('time').optional().isString().isLength({ max: 20 }),
  body('guests').optional().isString().isLength({ max: 40 }),
  body('seating').optional().isString().isLength({ max: 60 }),
  body('notes').optional().isString().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

module.exports = {
  stampRequestRules,
  stampActionRules,
  rejectStampRules,
  createRewardRules,
  updateRewardRules,
  redeemRules,
  paginationRules,
  mongoIdParam,
  searchRules,
  createStaffRules,
  updateStaffRules,
  bookingRules,
};
