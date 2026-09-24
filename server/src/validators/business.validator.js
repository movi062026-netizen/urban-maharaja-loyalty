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
  param('id').isMongoId().withMessage('Invalid redemption ID'),
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
    .trim()
    .isLength({ min: 4 }).withMessage('Search query too short'),
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
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['STAFF', 'ADMIN']).withMessage('Role must be STAFF or ADMIN'),
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
};
