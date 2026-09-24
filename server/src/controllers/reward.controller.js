const rewardService = require('../services/reward.service');
const { auditContext } = require('../services/audit.service');
const { success, paginated } = require('../utils/response');
const { PAGINATION } = require('../constants');

// Get active rewards (public/guest)
const getActiveRewards = async (req, res, next) => {
  try {
    const rewards = await rewardService.getActiveRewards();
    success(res, { rewards }, 'Rewards retrieved');
  } catch (error) {
    next(error);
  }
};

// Get all rewards (admin)
const getAllRewards = async (req, res, next) => {
  try {
    const rewards = await rewardService.getAllRewards();
    success(res, { rewards }, 'All rewards retrieved');
  } catch (error) {
    next(error);
  }
};

// Get reward by ID
const getReward = async (req, res, next) => {
  try {
    const reward = await rewardService.getRewardById(req.params.id);
    success(res, { reward }, 'Reward retrieved');
  } catch (error) {
    next(error);
  }
};

// Create reward (admin)
const createReward = async (req, res, next) => {
  try {
    const reward = await rewardService.createReward(req.body, auditContext(req));
    success(res, { reward }, 'Reward created', 201);
  } catch (error) {
    next(error);
  }
};

// Update reward (admin)
const updateReward = async (req, res, next) => {
  try {
    const reward = await rewardService.updateReward(req.params.id, req.body, auditContext(req));
    success(res, { reward }, 'Reward updated');
  } catch (error) {
    next(error);
  }
};

// Redeem reward (staff/admin)
const redeemReward = async (req, res, next) => {
  try {
    const redemption = await rewardService.redeemReward(
      req.params.id,
      req.user.id,
      auditContext(req)
    );
    success(res, { redemption }, 'Reward redeemed successfully');
  } catch (error) {
    next(error);
  }
};

// Get guest's redemptions
const getMyRedemptions = async (req, res, next) => {
  try {
    const redemptions = await rewardService.getGuestRedemptions(req.user.id);
    success(res, { redemptions }, 'Redemptions retrieved');
  } catch (error) {
    next(error);
  }
};

// Get all redemptions (admin, paginated)
const getAllRedemptions = async (req, res, next) => {
  try {
    const page = Math.min(Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1), 1000);
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const result = await rewardService.getAllRedemptions(page, limit, req.query);
    paginated(res, result.redemptions, result.pagination, 'Redemptions retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveRewards,
  getAllRewards,
  getReward,
  createReward,
  updateReward,
  redeemReward,
  getMyRedemptions,
  getAllRedemptions,
};
