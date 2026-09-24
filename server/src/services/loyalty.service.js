const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const LoyaltyCard = require('../models/LoyaltyCard');
const Stamp = require('../models/Stamp');
const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const RestaurantSettings = require('../models/RestaurantSettings');
const { LOYALTY_STATUS, STAMP_STATUS, REDEMPTION_STATUS, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { NotFoundError, ConflictError, ValidationError, AuthorizationError } = require('../utils/errors');
const { createAuditLog } = require('./audit.service');
const { cache } = require('../integrations/redis');

/**
 * Get or create active loyalty card for a guest
 */
const getOrCreateActiveCard = async (guestId) => {
  let card = await LoyaltyCard.findOne({
    guestId,
    status: LOYALTY_STATUS.ACTIVE,
  });

  if (!card) {
    // Get target stamps from settings
    const settings = await RestaurantSettings.findOne();
    const targetStamps = settings?.loyaltyConfig?.targetStamps || 5;

    // Calculate cycle number
    const completedCards = await LoyaltyCard.countDocuments({
      guestId,
      status: LOYALTY_STATUS.COMPLETED,
    });

    card = await LoyaltyCard.create({
      guestId,
      currentStamps: 0,
      targetStamps,
      status: LOYALTY_STATUS.ACTIVE,
      cycleNumber: completedCards + 1,
    });
  }

  return card;
};

/**
 * Get guest's loyalty card with full details and cycle history
 */
const getGuestLoyaltyCard = async (guestId) => {
  // Try Redis cache first
  const cached = await cache.getCachedGuestCard(guestId);
  if (cached) return cached;

  const card = await getOrCreateActiveCard(guestId);

  // Fetch all cards for this guest to track cycle history (Cycle 1, 2, 3...)
  const allCards = await LoyaltyCard.find({ guestId }).sort({ cycleNumber: -1 });

  // Fetch all approved stamps for the current card
  const stamps = await Stamp.find({
    loyaltyCardId: card._id,
    status: STAMP_STATUS.APPROVED,
  })
    .sort({ approvedAt: -1 })
    .populate('approvedBy', 'name');

  // Check all available unredeemed rewards for this guest across any cycle
  const availableRedemptions = await RewardRedemption.find({
    guestId,
    status: REDEMPTION_STATUS.AVAILABLE,
  }).populate('rewardId', 'title description rewardType validityDays');

  const totalCompletedCycles = allCards.filter(c => c.status === LOYALTY_STATUS.COMPLETED).length;
  const totalApprovedStamps = await Stamp.countDocuments({ guestId, status: STAMP_STATUS.APPROVED });

  const result = {
    card,
    allCards,
    stamps,
    availableRedemptions,
    stampsRemaining: Math.max(0, card.targetStamps - card.currentStamps),
    isComplete: card.currentStamps >= card.targetStamps,
    totalCompletedCycles,
    totalApprovedStamps,
  };

  // Cache in Redis (30 seconds)
  await cache.setCachedGuestCard(guestId, result);

  return result;
};

/**
 * Start next royal card cycle for a patron (Cycle 2, Cycle 3, etc.)
 */
const startNextCycle = async (guestId) => {
  const activeCard = await LoyaltyCard.findOne({ guestId, status: LOYALTY_STATUS.ACTIVE });
  if (activeCard && activeCard.currentStamps < activeCard.targetStamps) {
    return activeCard; // Current cycle is still in progress
  }

  if (activeCard) {
    activeCard.status = LOYALTY_STATUS.COMPLETED;
    await activeCard.save();
  }

  const completedCount = await LoyaltyCard.countDocuments({ guestId, status: LOYALTY_STATUS.COMPLETED });
  const settings = await RestaurantSettings.findOne();
  const targetStamps = settings?.loyaltyConfig?.targetStamps || 5;

  const newCard = await LoyaltyCard.create({
    guestId,
    currentStamps: 0,
    targetStamps,
    status: LOYALTY_STATUS.ACTIVE,
    cycleNumber: completedCount + 1,
  });

  cache.invalidateGuestCaches(guestId).catch(() => {});
  return newCard;
};

/**
 * Request a stamp for a guest visit (creates a PENDING stamp)
 * Can be called by staff OR guest requesting verification.
 */
const requestStamp = async (guestId, staffId = null, auditCtx = {}) => {
  const card = await getOrCreateActiveCard(guestId);

  if (card.status !== LOYALTY_STATUS.ACTIVE) {
    throw new ConflictError('Loyalty card is not active');
  }

  // Prevent duplicate pending stamps for the same guest visit
  const existingPending = await Stamp.findOne({
    guestId,
    loyaltyCardId: card._id,
    status: STAMP_STATUS.PENDING,
  });
  if (existingPending) {
    return existingPending;
  }

  // Generate unique visit ID
  const visitId = `visit-${guestId}-${Date.now()}-${uuidv4().slice(0, 8)}`;

  const stamp = await Stamp.create({
    guestId,
    loyaltyCardId: card._id,
    visitId,
    status: STAMP_STATUS.PENDING,
  });

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.STAMP_REQUESTED,
    entityType: ENTITY_TYPES.STAMP,
    entityId: stamp._id,
    metadata: { guestId, loyaltyCardId: card._id, requestedBy: staffId ? 'STAFF' : 'GUEST' },
  });

  cache.invalidateGuestCaches(guestId).catch(() => {});

  return stamp;
};

/**
 * Approve a pending stamp — TRANSACTIONAL
 * Updates stamp, loyalty card, and checks reward eligibility.
 */
const approveStamp = async (stampId, staffId, auditCtx = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const stamp = await Stamp.findById(stampId).session(session);
    if (!stamp) throw new NotFoundError('Stamp not found');
    if (stamp.status !== STAMP_STATUS.PENDING) {
      throw new ConflictError(`Stamp is already ${stamp.status.toLowerCase()}`);
    }

    // Update stamp
    stamp.status = STAMP_STATUS.APPROVED;
    stamp.approvedBy = staffId;
    stamp.approvedAt = new Date();
    await stamp.save({ session });

    // Update loyalty card
    const card = await LoyaltyCard.findById(stamp.loyaltyCardId).session(session);
    if (!card) throw new NotFoundError('Loyalty card not found');

    card.currentStamps += 1;

    // Check if target reached
    let rewardUnlocked = null;
    if (card.currentStamps >= card.targetStamps) {
      card.status = LOYALTY_STATUS.COMPLETED;

      // Find eligible active rewards
      const rewards = await Reward.find({
        isActive: true,
        requiredStamps: { $lte: card.targetStamps },
      }).session(session);

      // Create reward redemptions
      for (const reward of rewards) {
        const existing = await RewardRedemption.findOne({
          guestId: stamp.guestId,
          rewardId: reward._id,
          loyaltyCardId: card._id,
        }).session(session);

        if (!existing) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + reward.validityDays);

          await RewardRedemption.create(
            [
              {
                guestId: stamp.guestId,
                rewardId: reward._id,
                loyaltyCardId: card._id,
                status: REDEMPTION_STATUS.AVAILABLE,
                expiresAt,
              },
            ],
            { session }
          );

          rewardUnlocked = reward;

          createAuditLog({
            ...auditCtx,
            action: AUDIT_ACTIONS.REWARD_UNLOCKED,
            entityType: ENTITY_TYPES.REDEMPTION,
            entityId: reward._id,
            metadata: { guestId: stamp.guestId, rewardTitle: reward.title },
          });
        }
      }
    }

    await card.save({ session });

    // Audit stamp approval
    createAuditLog({
      ...auditCtx,
      action: AUDIT_ACTIONS.STAMP_APPROVED,
      entityType: ENTITY_TYPES.STAMP,
      entityId: stamp._id,
      metadata: {
        guestId: stamp.guestId,
        currentStamps: card.currentStamps,
        targetStamps: card.targetStamps,
      },
    });

    await session.commitTransaction();

    // Invalidate guest card and dashboard caches in Redis
    cache.invalidateGuestCaches(stamp.guestId).catch(() => {});

    return {
      stamp,
      card,
      rewardUnlocked,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Reject a pending stamp
 */
const rejectStamp = async (stampId, staffId, reason, auditCtx = {}) => {
  const stamp = await Stamp.findById(stampId);
  if (!stamp) throw new NotFoundError('Stamp not found');
  if (stamp.status !== STAMP_STATUS.PENDING) {
    throw new ConflictError(`Stamp is already ${stamp.status.toLowerCase()}`);
  }

  stamp.status = STAMP_STATUS.REJECTED;
  stamp.approvedBy = staffId;
  stamp.rejectionReason = reason || 'No reason provided';
  await stamp.save();

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.STAMP_REJECTED,
    entityType: ENTITY_TYPES.STAMP,
    entityId: stamp._id,
    metadata: { guestId: stamp.guestId, reason },
  });

  // Invalidate guest card cache in Redis
  cache.invalidateGuestCard(stamp.guestId).catch(() => {});

  return stamp;
};

/**
 * Get all stamps for a guest
 */
const getGuestStamps = async (guestId, loyaltyCardId = null) => {
  const filter = { guestId };
  if (loyaltyCardId) filter.loyaltyCardId = loyaltyCardId;

  return Stamp.find(filter)
    .sort({ createdAt: -1 })
    .populate('approvedBy', 'name');
};

/**
 * Get guest visit history (all loyalty cards)
 */
const getGuestHistory = async (guestId) => {
  const cards = await LoyaltyCard.find({ guestId }).sort({ cycleNumber: -1 });
  const history = [];

  for (const card of cards) {
    const stamps = await Stamp.find({ loyaltyCardId: card._id })
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'name');

    const redemptions = await RewardRedemption.find({ loyaltyCardId: card._id })
      .populate('rewardId', 'title description')
      .populate('redeemedBy', 'name');

    history.push({ card, stamps, redemptions });
  }

  return history;
};

module.exports = {
  getOrCreateActiveCard,
  getGuestLoyaltyCard,
  startNextCycle,
  requestStamp,
  approveStamp,
  rejectStamp,
  getGuestStamps,
  getGuestHistory,
};
