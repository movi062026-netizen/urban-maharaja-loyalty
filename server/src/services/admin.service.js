const User = require('../models/User');
const LoyaltyCard = require('../models/LoyaltyCard');
const Stamp = require('../models/Stamp');
const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const ReviewEvent = require('../models/ReviewEvent');
const AuditLog = require('../models/AuditLog');
const { ROLES, STAMP_STATUS, REDEMPTION_STATUS, LOYALTY_STATUS } = require('../constants');
const { cache } = require('../integrations/redis');

/**
 * Get dashboard overview stats
 */
const getDashboardStats = async () => {
  // Try Redis cache first
  const cached = await cache.getCachedDashboard();
  if (cached) return cached;
  const [
    totalGuests,
    totalStamps,
    approvedStamps,
    pendingStamps,
    totalRewardsUnlocked,
    totalRewardsRedeemed,
    totalReviewClicks,
    activeCards,
    completedCards,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.GUEST, isActive: true }),
    Stamp.countDocuments(),
    Stamp.countDocuments({ status: STAMP_STATUS.APPROVED }),
    Stamp.countDocuments({ status: STAMP_STATUS.PENDING }),
    RewardRedemption.countDocuments(),
    RewardRedemption.countDocuments({ status: REDEMPTION_STATUS.REDEEMED }),
    ReviewEvent.countDocuments(),
    LoyaltyCard.countDocuments({ status: LOYALTY_STATUS.ACTIVE }),
    LoyaltyCard.countDocuments({ status: LOYALTY_STATUS.COMPLETED }),
  ]);

  const result = {
    totalGuests,
    totalVisits: approvedStamps,
    totalStamps: approvedStamps,
    pendingStamps,
    totalRewardsUnlocked,
    totalRewardsRedeemed,
    totalReviewClicks,
    activeCards,
    completedCards,
  };

  // Cache in Redis (1 minute)
  await cache.setCachedDashboard(result);

  return result;
};

/**
 * Get guest growth over time (last 30 days)
 */
const getGuestGrowth = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await User.aggregate([
    { $match: { role: ROLES.GUEST, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return data.map((d) => ({ date: d._id, count: d.count }));
};

/**
 * Get stamps over time
 */
const getStampsOverTime = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await Stamp.aggregate([
    { $match: { status: STAMP_STATUS.APPROVED, approvedAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$approvedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return data.map((d) => ({ date: d._id, count: d.count }));
};

/**
 * Get redemptions over time
 */
const getRedemptionsOverTime = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await RewardRedemption.aggregate([
    { $match: { status: REDEMPTION_STATUS.REDEEMED, redeemedAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$redeemedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return data.map((d) => ({ date: d._id, count: d.count }));
};

/**
 * Get recent activity (audit logs)
 */
const getRecentActivity = async (limit = 20) => {
  return AuditLog.find()
    .populate('actorId', 'name role')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get paginated guests list (admin)
 */
const getGuestsList = async (page = 1, limit = 20, search = '') => {
  const query = { role: ROLES.GUEST };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const guests = await User.find(query)
    .select('name phone email isActive lastLoginAt createdAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    guests,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get detailed guest info (admin)
 */
const getGuestDetail = async (guestId) => {
  const guest = await User.findById(guestId).select('name phone email isActive lastLoginAt createdAt');
  if (!guest) return null;

  const cards = await LoyaltyCard.find({ guestId }).sort({ cycleNumber: -1 });
  const stamps = await Stamp.find({ guestId })
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 });
  const redemptions = await RewardRedemption.find({ guestId })
    .populate('rewardId', 'title')
    .populate('redeemedBy', 'name')
    .sort({ createdAt: -1 });

  return { guest, cards, stamps, redemptions };
};

/**
 * Get paginated stamps (admin)
 */
const getStampsList = async (page = 1, limit = 20, filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.guestId) query.guestId = filters.guestId;

  const total = await Stamp.countDocuments(query);
  const stamps = await Stamp.find(query)
    .populate('guestId', 'name phone')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    stamps,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get paginated audit logs (admin)
 */
const getAuditLogs = async (page = 1, limit = 20, filters = {}) => {
  const query = {};
  if (filters.action) query.action = filters.action;
  if (filters.actorId) query.actorId = filters.actorId;

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate('actorId', 'name role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

module.exports = {
  getDashboardStats,
  getGuestGrowth,
  getStampsOverTime,
  getRedemptionsOverTime,
  getRecentActivity,
  getGuestsList,
  getGuestDetail,
  getStampsList,
  getAuditLogs,
};
