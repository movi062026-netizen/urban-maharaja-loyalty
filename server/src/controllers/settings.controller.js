const settingsService = require('../services/settings.service');
const { auditContext } = require('../services/audit.service');
const { success } = require('../utils/response');

const getSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getSettings();
    success(res, { settings }, 'Settings retrieved');
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.updateSettings(req.body, auditContext(req));
    success(res, { settings }, 'Settings updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
