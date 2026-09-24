const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const { REDEMPTION_STATUS, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { NotFoundError, ConflictError, AuthorizationError } = require('../utils/errors');
const { createAuditLog } = require('./audit.service');
const { cache } = require('../integrations/redis');

/**
 * Get all active rewards (cached with Redis, 5-min TTL)
 */
const getActiveRewards = async () => {
  const cached = await cache.getCachedActiveRewards();
  if (cached) {
    return cached;
  }

  const rewards = await Reward.find({ isActive: true }).sort({ requiredStamps: 1 });
  const plainRewards = rewards.map((r) => (r.toObject ? r.toObject() : r));
  await cache.setCachedActiveRewards(plainRewards);
  return rewards;
};

/**
 * Get all rewards (admin)
 */
const getAllRewards = async () => {
  return Reward.find().sort({ createdAt: -1 });
};

/**
 * Get reward by ID
 */
const getRewardById = async (rewardId) => {
  const reward = await Reward.findById(rewardId);
  if (!reward) throw new NotFoundError('Reward not found');
  return reward;
};

/**
 * Create a new reward (admin) — invalidates active rewards cache
 */
const createReward = async (data, auditCtx = {}) => {
  const reward = await Reward.create(data);

  // Invalidate active rewards cache
  await cache.invalidateRewardCaches();

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.REWARD_CREATED,
    entityType: ENTITY_TYPES.REWARD,
    entityId: reward._id,
    metadata: { title: reward.title, requiredStamps: reward.requiredStamps },
  });

  return reward;
};

/**
 * Update a reward (admin) — invalidates active rewards cache
 */
const updateReward = async (rewardId, data, auditCtx = {}) => {
  const reward = await Reward.findById(rewardId);
  if (!reward) throw new NotFoundError('Reward not found');

  Object.assign(reward, data);
  await reward.save();

  // Invalidate active rewards cache
  await cache.invalidateRewardCaches();

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.REWARD_UPDATED,
    entityType: ENTITY_TYPES.REWARD,
    entityId: reward._id,
    metadata: { title: reward.title, changes: Object.keys(data) },
  });

  return reward;
};

/**
 * Redeem a reward (staff/admin action) — invalidates guest cache
 */
const redeemReward = async (redemptionId, staffId, auditCtx = {}) => {
  const redemption = await RewardRedemption.findById(redemptionId)
    .populate('rewardId', 'title description')
    .populate('guestId', 'name phone');

  if (!redemption) throw new NotFoundError('Redemption not found');

  if (redemption.status === REDEMPTION_STATUS.REDEEMED) {
    throw new ConflictError('Reward has already been redeemed');
  }

  if (redemption.status === REDEMPTION_STATUS.EXPIRED) {
    throw new ConflictError('Reward has expired');
  }

  // Check expiry
  if (redemption.expiresAt && redemption.expiresAt < new Date()) {
    redemption.status = REDEMPTION_STATUS.EXPIRED;
    await redemption.save();
    throw new ConflictError('Reward has expired');
  }

  redemption.status = REDEMPTION_STATUS.REDEEMED;
  redemption.redeemedBy = staffId;
  redemption.redeemedAt = new Date();
  await redemption.save();

  // Invalidate guest cache and dashboard cache
  const guestId = redemption.guestId?._id || redemption.guestId;
  cache.invalidateGuestCaches(guestId).catch(() => {});

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.REWARD_REDEEMED,
    entityType: ENTITY_TYPES.REDEMPTION,
    entityId: redemption._id,
    metadata: {
      guestId: guestId,
      rewardTitle: redemption.rewardId?.title,
    },
  });

  return redemption;
};

/**
 * Get guest's redemptions
 */
const getGuestRedemptions = async (guestId) => {
  return RewardRedemption.find({ guestId })
    .populate('rewardId', 'title description rewardType validityDays')
    .populate('redeemedBy', 'name')
    .sort({ createdAt: -1 });
};

/**
 * Get all redemptions (admin, paginated)
 */
const getAllRedemptions = async (page = 1, limit = 20, filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.guestId) query.guestId = filters.guestId;

  const total = await RewardRedemption.countDocuments(query);
  const redemptions = await RewardRedemption.find(query)
    .populate('guestId', 'name phone')
    .populate('rewardId', 'title description')
    .populate('redeemedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    redemptions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getActiveRewards,
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  redeemReward,
  getGuestRedemptions,
  getAllRedemptions,
};
