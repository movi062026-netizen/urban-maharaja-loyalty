const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const {
  guestOtpRules,
  guestVerifyRules,
  staffLoginRules,
  refreshTokenRules,
  updateProfileRules,
} = require('../validators/auth.validator');

// Guest auth
router.post('/guest/request-otp', authLimiter, guestOtpRules, validate, authController.guestRequestOtp);
router.post('/guest/verify-otp', authLimiter, guestVerifyRules, validate, authController.guestVerifyOtp);

// Staff/Admin auth
router.post('/admin/login', authLimiter, staffLoginRules, validate, authController.staffLogin);

// Token management
router.post('/refresh', refreshTokenRules, validate, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

// Profile
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, updateProfileRules, validate, authController.updateProfile);

module.exports = router;
