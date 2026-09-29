const loyaltyService = require('../services/loyalty.service');
const { auditContext } = require('../services/audit.service');
const { success } = require('../utils/response');

// Guest gets their own loyalty card
const getMyCard = async (req, res, next) => {
  try {
    const data = await loyaltyService.getGuestLoyaltyCard(req.user.id);
    success(res, data, 'Loyalty card retrieved');
  } catch (error) {
    next(error);
  }
};

// Guest gets their stamps
const getMyStamps = async (req, res, next) => {
  try {
    const stamps = await loyaltyService.getGuestStamps(req.user.id);
    success(res, { stamps }, 'Stamps retrieved');
  } catch (error) {
    next(error);
  }
};

// Guest gets their visit history
const getMyHistory = async (req, res, next) => {
  try {
    const history = await loyaltyService.getGuestHistory(req.user.id);
    success(res, { history }, 'History retrieved');
  } catch (error) {
    next(error);
  }
};

// Staff requests a stamp for a guest
const requestStamp = async (req, res, next) => {
  try {
    const billPayload = {
      billBuffer: req.file?.buffer,
      billAmount: req.body.billAmount,
      billNumber: req.body.billNumber,
      billDate: req.body.billDate,
      billUrl: req.body.billUrl,
    };
    const stamp = await loyaltyService.requestStamp(
      req.body.guestId,
      req.user.id,
      auditContext(req),
      billPayload
    );
    success(res, { stamp }, 'Stamp requested', 201);
  } catch (error) {
    next(error);
  }
};

// Staff approves a pending stamp
const approveStamp = async (req, res, next) => {
  try {
    const result = await loyaltyService.approveStamp(
      req.params.id,
      req.user.id,
      auditContext(req)
    );
    success(res, result, 'Stamp approved');
  } catch (error) {
    next(error);
  }
};

// Staff rejects a pending stamp
const rejectStamp = async (req, res, next) => {
  try {
    const stamp = await loyaltyService.rejectStamp(
      req.params.id,
      req.user.id,
      req.body.reason,
      auditContext(req)
    );
    success(res, { stamp }, 'Stamp rejected');
  } catch (error) {
    next(error);
  }
};

// Staff searches for a guest by email or phone
const searchGuest = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const { ROLES } = require('../constants');
    const searchTerm = (req.query.query || req.query.phone || req.query.email || '').trim();

    if (!searchTerm) {
      return success(res, { guest: null }, 'Search term required');
    }

    let query;
    if (searchTerm.includes('@')) {
      query = { email: searchTerm.toLowerCase(), role: ROLES.GUEST };
    } else {
      query = {
        role: ROLES.GUEST,
        $or: [
          { phone: searchTerm },
          { email: searchTerm.toLowerCase() },
          { name: new RegExp(searchTerm, 'i') },
        ],
      };
    }

    const guest = await User.findOne(query).select('name phone email lastLoginAt');

    if (!guest) {
      return success(res, { guest: null }, 'Guest not found');
    }

    const loyaltyData = await loyaltyService.getGuestLoyaltyCard(guest._id);

    success(res, { guest, loyalty: loyaltyData }, 'Guest found');
  } catch (error) {
    next(error);
  }
};

// Guest triggers beginning of next cycle (Cycle 2, 3, etc.)
const startNextCycle = async (req, res, next) => {
  try {
    const card = await loyaltyService.startNextCycle(req.user.id);
    success(res, { card }, 'Next Maharaja Card cycle activated');
  } catch (error) {
    next(error);
  }
};

// Guest requests a stamp for their current dining visit
const requestMyStamp = async (req, res, next) => {
  try {
    const billPayload = {
      billBuffer: req.file?.buffer,
      billAmount: req.body.billAmount,
      billNumber: req.body.billNumber,
      billDate: req.body.billDate,
      billUrl: req.body.billUrl,
    };
    const stamp = await loyaltyService.requestStamp(
      req.user.id,
      null,
      auditContext(req),
      billPayload
    );
    success(res, { stamp }, 'Dining seal requested from royal concierge', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCard,
  getMyStamps,
  getMyHistory,
  startNextCycle,
  requestMyStamp,
  requestStamp,
  approveStamp,
  rejectStamp,
  searchGuest,
};
