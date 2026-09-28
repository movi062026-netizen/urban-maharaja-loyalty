const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const {
  authLimiter,
  passwordLoginTokenBucket,
  guestOtpTokenBucket,
  googleAuthTokenBucket,
} = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const {
  guestOtpRules,
  guestVerifyRules,
  customerRegisterRules,
  guestLoginRules,
  staffLoginRules,
  googleAuthRules,
  refreshTokenRules,
  updateProfileRules,
} = require('../validators/auth.validator');

// Guest auth (Protected by Token Bucket rate limiter)
router.post('/guest/login', passwordLoginTokenBucket, guestLoginRules, validate, authController.guestPasswordLogin);
router.post('/guest/request-otp', guestOtpTokenBucket, guestOtpRules, validate, authController.guestRequestOtp);
router.post('/guest/verify-otp', guestOtpTokenBucket, guestVerifyRules, validate, authController.guestVerifyOtp);
router.post('/guest/register', guestOtpTokenBucket, customerRegisterRules, validate, authController.customerRegister);

// Google OAuth Login & Registration (Protected by Token Bucket rate limiter)
router.post('/google', googleAuthTokenBucket, googleAuthRules, validate, authController.googleLogin);
router.post('/guest/google', googleAuthTokenBucket, googleAuthRules, validate, authController.googleLogin);

// Staff & Admin auth (Email & Password Protected by Token Bucket rate limiter)
router.post('/admin/login', passwordLoginTokenBucket, staffLoginRules, validate, authController.adminLogin);
router.post('/staff/login', passwordLoginTokenBucket, staffLoginRules, validate, authController.staffLogin);

// Token management
router.post('/refresh', refreshTokenRules, validate, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

// Profile
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, updateProfileRules, validate, authController.updateProfile);

module.exports = router;
