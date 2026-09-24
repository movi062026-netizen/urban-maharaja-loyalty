const router = require('express').Router();
const rewardController = require('../controllers/reward.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { operationLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { ROLES } = require('../constants');
const {
  createRewardRules,
  updateRewardRules,
  redeemRules,
  mongoIdParam,
} = require('../validators/business.validator');

// Public / Guest
router.get('/', rewardController.getActiveRewards);
router.get('/me', authenticate, authorize(ROLES.GUEST), rewardController.getMyRedemptions);

// Single reward
router.get('/:id', mongoIdParam, validate, rewardController.getReward);

// Admin reward management
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  createRewardRules,
  validate,
  rewardController.createReward
);

router.patch(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  updateRewardRules,
  validate,
  rewardController.updateReward
);

// Redemption (staff/admin)
router.post(
  '/:id/redeem',
  authenticate,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  operationLimiter,
  redeemRules,
  validate,
  rewardController.redeemReward
);

module.exports = router;
