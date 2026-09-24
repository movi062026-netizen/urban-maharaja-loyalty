const adminService = require('../services/admin.service');
const { success, paginated } = require('../utils/response');
const { PAGINATION } = require('../constants');

const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    success(res, stats, 'Dashboard stats retrieved');
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const [guestGrowth, stampsOverTime, redemptionsOverTime] = await Promise.all([
      adminService.getGuestGrowth(days),
      adminService.getStampsOverTime(days),
      adminService.getRedemptionsOverTime(days),
    ]);
    success(res, { guestGrowth, stampsOverTime, redemptionsOverTime }, 'Analytics retrieved');
  } catch (error) {
    next(error);
  }
};

const getGuests = async (req, res, next) => {
  try {
    const page = Math.min(Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1), 1000);
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const result = await adminService.getGuestsList(page, limit, req.query.search);
    paginated(res, result.guests, result.pagination, 'Guests retrieved');
  } catch (error) {
    next(error);
  }
};

const getGuestDetail = async (req, res, next) => {
  try {
    const data = await adminService.getGuestDetail(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Guest not found', details: [] },
      });
    }
    success(res, data, 'Guest detail retrieved');
  } catch (error) {
    next(error);
  }
};

const getStamps = async (req, res, next) => {
  try {
    const page = Math.min(Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1), 1000);
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const result = await adminService.getStampsList(page, limit, req.query);
    paginated(res, result.stamps, result.pagination, 'Stamps retrieved');
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const page = Math.min(Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1), 1000);
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const result = await adminService.getAuditLogs(page, limit, req.query);
    paginated(res, result.logs, result.pagination, 'Audit logs retrieved');
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const activity = await adminService.getRecentActivity();
    success(res, { activity }, 'Recent activity retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAnalytics,
  getGuests,
  getGuestDetail,
  getStamps,
  getAuditLogs,
  getRecentActivity,
};
