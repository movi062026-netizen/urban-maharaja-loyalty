const AuditLog = require('../models/AuditLog');
const logger = require('../config/logger');

/**
 * Create an audit log entry.
 * Never throws — audit logging should not break business operations.
 */
const createAuditLog = async ({
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  metadata = {},
  ipAddress,
  userAgent,
}) => {
  try {
    await AuditLog.create({
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    // Never let audit failures break the main flow
    logger.error('Failed to create audit log', {
      error: error.message,
      action,
      entityType,
      entityId,
    });
  }
};

/**
 * Build audit context from request
 */
const auditContext = (req) => ({
  actorId: req.user?.id,
  actorRole: req.user?.role,
  ipAddress: req.ip || req.connection?.remoteAddress,
  userAgent: req.headers['user-agent'],
});

module.exports = { createAuditLog, auditContext };
