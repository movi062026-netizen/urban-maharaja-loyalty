const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const rewardController = require('../controllers/reward.controller');
const staffController = require('../controllers/staff.controller');
const settingsController = require('../controllers/settings.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ROLES } = require('../constants');
const { paginationRules, createStaffRules, mongoIdParam } = require('../validators/business.validator');

// All admin routes require ADMIN role
router.use(authenticate, authorize(ROLES.ADMIN));

// Dashboard
router.get('/dashboard', adminController.getDashboard);
router.get('/analytics', adminController.getAnalytics);
router.get('/activity', adminController.getRecentActivity);

// Guest management
router.get('/guests', paginationRules, validate, adminController.getGuests);
router.get('/guests/:id', mongoIdParam, validate, adminController.getGuestDetail);

// Stamp management
router.get('/stamps', paginationRules, validate, adminController.getStamps);

// Reward management (admin CRUD)
router.get('/rewards', rewardController.getAllRewards);

// Redemption management
router.get('/redemptions', paginationRules, validate, rewardController.getAllRedemptions);

// Staff management
router.get('/staff', staffController.getStaff);
router.post('/staff', createStaffRules, validate, staffController.createStaff);
router.patch('/staff/:id', mongoIdParam, validate, staffController.updateStaff);

// Settings
router.get('/settings', settingsController.getSettings);
router.patch('/settings', settingsController.updateSettings);

// Audit logs
router.get('/audit-logs', paginationRules, validate, adminController.getAuditLogs);

module.exports = router;
