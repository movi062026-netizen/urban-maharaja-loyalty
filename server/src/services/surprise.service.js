const RestaurantSettings = require('../models/RestaurantSettings');
const { AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { createAuditLog } = require('./audit.service');

/**
 * Play Royal Surprise scratch card (server-side reward selection)
 */
const playRoyalSurprise = async (guestId, auditCtx = {}) => {
  const settings = await RestaurantSettings.findOne();

  if (!settings?.loyaltyConfig?.isRoyalSurpriseEnabled) {
    return { enabled: false, result: null };
  }

  const options = settings.loyaltyConfig.royalSurpriseOptions || [];
  if (options.length === 0) {
    return { enabled: true, result: null };
  }

  // Server-side weighted random selection
  const totalProbability = options.reduce((sum, opt) => sum + (opt.probability || 0), 0);
  let random = Math.random() * totalProbability;

  let selectedOption = options[options.length - 1]; // fallback
  for (const option of options) {
    random -= option.probability || 0;
    if (random <= 0) {
      selectedOption = option;
      break;
    }
  }

  createAuditLog({
    ...auditCtx,
    action: AUDIT_ACTIONS.ROYAL_SURPRISE_PLAYED,
    entityType: ENTITY_TYPES.USER,
    entityId: guestId,
    metadata: { result: selectedOption.title },
  });

  return {
    enabled: true,
    result: {
      title: selectedOption.title,
      description: selectedOption.description,
    },
  };
};

module.exports = { playRoyalSurprise };
