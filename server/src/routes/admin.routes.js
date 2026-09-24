const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const rewardController = require('../controllers/reward.controller');
const staffController = require('../controllers/staff.controller');
const settingsController = require('../controllers/settings.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ROLES } = require('../constants');
const { paginationRules, createStaffRules, mongoIdParam } = require('../validators/business.validator');

// All terminal routes require authentication
router.use(authenticate);

// Dashboard & Analytics (accessible by both Admin and Staff)
router.get('/dashboard', authorize(ROLES.ADMIN, ROLES.STAFF), adminController.getDashboard);
router.get('/analytics', authorize(ROLES.ADMIN, ROLES.STAFF), adminController.getAnalytics);
router.get('/activity', authorize(ROLES.ADMIN, ROLES.STAFF), adminController.getRecentActivity);

// Guest management (accessible by both Admin and Staff)
router.get('/guests', authorize(ROLES.ADMIN, ROLES.STAFF), paginationRules, validate, adminController.getGuests);
router.get('/guests/:id', authorize(ROLES.ADMIN, ROLES.STAFF), mongoIdParam, validate, adminController.getGuestDetail);

// Stamp management (accessible by both Admin and Staff)
router.get('/stamps', authorize(ROLES.ADMIN, ROLES.STAFF), paginationRules, validate, adminController.getStamps);

// Reward management (accessible by both Admin and Staff)
router.get('/rewards', authorize(ROLES.ADMIN, ROLES.STAFF), rewardController.getAllRewards);

// Redemption management (accessible by both Admin and Staff)
router.get('/redemptions', authorize(ROLES.ADMIN, ROLES.STAFF), paginationRules, validate, rewardController.getAllRedemptions);

// Staff management & Credential Creation (Admin Only)
router.get('/staff', authorize(ROLES.ADMIN), staffController.getStaff);
router.post('/staff', authorize(ROLES.ADMIN), createStaffRules, validate, staffController.createStaff);
router.patch('/staff/:id', authorize(ROLES.ADMIN), mongoIdParam, validate, staffController.updateStaff);

// Settings (Admin Only)
router.get('/settings', authorize(ROLES.ADMIN), settingsController.getSettings);
router.patch('/settings', authorize(ROLES.ADMIN), settingsController.updateSettings);

// Audit logs (Admin Only)
router.get('/audit-logs', authorize(ROLES.ADMIN), paginationRules, validate, adminController.getAuditLogs);

module.exports = router;
