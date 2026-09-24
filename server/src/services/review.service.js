const ReviewEvent = require('../models/ReviewEvent');
const RestaurantSettings = require('../models/RestaurantSettings');
const { AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { createAuditLog } = require('./audit.service');

/**
 * Track a review link click
 */
const trackReviewClick = async (guestId, source, auditCtx = {}) => {
  const event = await ReviewEvent.create({
    guestId,
    type: 'CLICK',
    source,
  });

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.REVIEW_CLICKED,
    entityType: ENTITY_TYPES.REVIEW,
    entityId: event._id,
    metadata: { guestId, source },
  });

  // Return the Google review URL from settings
  const settings = await RestaurantSettings.findOne();
  return {
    event,
    reviewUrl: settings?.googleReviewUrl || '',
  };
};

module.exports = { trackReviewClick };
