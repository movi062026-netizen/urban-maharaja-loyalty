const router = require('express').Router();
const loyaltyController = require('../controllers/loyalty.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { operationLimiter } = require('../middleware/rateLimiter');
const { uploadBill } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { ROLES } = require('../constants');
const {
  stampRequestRules,
  stampActionRules,
  rejectStampRules,
  searchRules,
} = require('../validators/business.validator');

// Guest endpoints
router.get('/cards/me', authenticate, authorize(ROLES.GUEST), loyaltyController.getMyCard);
router.post('/cards/next-cycle', authenticate, authorize(ROLES.GUEST), loyaltyController.startNextCycle);
router.get('/stamps/me', authenticate, authorize(ROLES.GUEST), loyaltyController.getMyStamps);
router.post(
  '/stamps/request-my-stamp',
  authenticate,
  authorize(ROLES.GUEST),
  operationLimiter,
  uploadBill,
  loyaltyController.requestMyStamp
);
router.get('/history/me', authenticate, authorize(ROLES.GUEST), loyaltyController.getMyHistory);
router.post('/rewards/claim', authenticate, authorize(ROLES.GUEST), operationLimiter, loyaltyController.claimReward);

// Staff endpoints
router.get(
  '/guests/search',
  authenticate,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  searchRules,
  validate,
  loyaltyController.searchGuest
);

router.post(
  '/stamps',
  authenticate,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  operationLimiter,
  uploadBill,
  stampRequestRules,
  validate,
  loyaltyController.requestStamp
);

router.patch(
  '/stamps/:id/approve',
  authenticate,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  operationLimiter,
  stampActionRules,
  validate,
  loyaltyController.approveStamp
);

router.patch(
  '/stamps/:id/reject',
  authenticate,
  authorize(ROLES.STAFF, ROLES.ADMIN),
  rejectStampRules,
  validate,
  loyaltyController.rejectStamp
);

module.exports = router;
