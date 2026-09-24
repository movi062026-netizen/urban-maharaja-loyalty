const RestaurantSettings = require('../models/RestaurantSettings');
const { AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { createAuditLog } = require('./audit.service');

/**
 * Get settings (create default if none exist)
 */
const getSettings = async () => {
  let settings = await RestaurantSettings.findOne();
  if (!settings) {
    settings = await RestaurantSettings.create({});
  }
  return settings;
};

/**
 * Update settings (admin)
 */
const updateSettings = async (data, auditCtx = {}) => {
  let settings = await RestaurantSettings.findOne();
  if (!settings) {
    settings = await RestaurantSettings.create({});
  }

  // Only allow known fields to be updated
  const allowedFields = [
    'restaurantName', 'tagline', 'logo', 'address', 'phone', 'email',
    'openingHours', 'googleReviewUrl', 'googleMapsUrl', 'reservationUrl',
    'loyaltyConfig', 'brandConfig', 'socialMedia',
  ];

  const changes = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      // For nested objects, merge rather than replace
      if (typeof data[field] === 'object' && !Array.isArray(data[field]) && settings[field]) {
        settings[field] = { ...settings[field].toObject?.() || settings[field], ...data[field] };
      } else {
        settings[field] = data[field];
      }
      changes[field] = true;
    }
  }

  await settings.save();

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.SETTINGS_UPDATED,
    entityType: ENTITY_TYPES.SETTINGS,
    entityId: settings._id,
    metadata: { updatedFields: Object.keys(changes) },
  });

  return settings;
};

module.exports = { getSettings, updateSettings };
