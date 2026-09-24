const reviewService = require('../services/review.service');
const surpriseService = require('../services/surprise.service');
const { auditContext } = require('../services/audit.service');
const { success } = require('../utils/response');

const trackReviewClick = async (req, res, next) => {
  try {
    const result = await reviewService.trackReviewClick(
      req.user.id,
      req.body.source,
      auditContext(req)
    );
    success(res, result, 'Review click tracked');
  } catch (error) {
    next(error);
  }
};

const playRoyalSurprise = async (req, res, next) => {
  try {
    const result = await surpriseService.playRoyalSurprise(req.user.id, auditContext(req));
    success(res, result, 'Royal surprise played');
  } catch (error) {
    next(error);
  }
};

module.exports = { trackReviewClick, playRoyalSurprise };
