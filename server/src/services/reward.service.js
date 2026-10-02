const mongoose = require('mongoose');
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
  const rewards = await Reward.find().sort({ createdAt: -1 }).lean();

  // Aggregate claim counts per reward
  const claimCounts = await RewardRedemption.aggregate([
    { $group: {
      _id: '$rewardId',
      totalClaimed: { $sum: 1 },
      totalRedeemed: { $sum: { $cond: [{ $eq: ['$status', REDEMPTION_STATUS.REDEEMED] }, 1, 0] } },
      totalAvailable: { $sum: { $cond: [{ $eq: ['$status', REDEMPTION_STATUS.AVAILABLE] }, 1, 0] } },
    }},
  ]);

  const countsMap = {};
  for (const c of claimCounts) {
    countsMap[c._id.toString()] = {
      totalClaimed: c.totalClaimed,
      totalRedeemed: c.totalRedeemed,
      totalAvailable: c.totalAvailable,
    };
  }

  return rewards.map(r => ({
    ...r,
    claimStats: countsMap[r._id.toString()] || { totalClaimed: 0, totalRedeemed: 0, totalAvailable: 0 },
  }));
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
  let redemption;
  const cleanId = String(redemptionId || '').trim();

  // 1. Try finding by MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    redemption = await RewardRedemption.findById(cleanId)
      .populate('rewardId', 'title description')
      .populate('guestId', 'name phone');
  }

  // 2. Try finding by Voucher Code (e.g. UM-RW-9D3A8F)
  if (!redemption) {
    const cleanCode = cleanId.toUpperCase();
    redemption = await RewardRedemption.findOne({
      $or: [
        { code: cleanCode },
        { code: cleanCode.replace(/^UM-RW-/, '') },
      ],
    })
      .populate('rewardId', 'title description')
      .populate('guestId', 'name phone');
  }

  // 3. Fallback: match by the last 6 characters of ObjectId or code
  if (!redemption && cleanId.length >= 6) {
    const last6 = cleanId.slice(-6).toUpperCase();
    const allAvailable = await RewardRedemption.find({ status: REDEMPTION_STATUS.AVAILABLE })
      .populate('rewardId', 'title description')
      .populate('guestId', 'name phone');
    redemption = allAvailable.find(
      (r) =>
        r._id.toString().slice(-6).toUpperCase() === last6 ||
        (r.code && r.code.toUpperCase().endsWith(last6))
    );
  }

  if (!redemption) throw new NotFoundError('Voucher redemption record not found');

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
