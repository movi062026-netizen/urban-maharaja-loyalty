const User = require('../models/User');
const { ROLES, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { success } = require('../utils/response');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { createAuditLog, auditContext } = require('../services/audit.service');

// Create staff member (admin only)
const createStaff = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // This endpoint only ever creates floor STAFF. Admin accounts are provisioned
    // out-of-band with `npm run create-admin`, never through the web app.
    const staffRole = ROLES.STAFF;

    const existing = await User.findOne({ email });
    if (existing) throw new ConflictError('Email already in use');

    const user = await User.create({
      name,
      email,
      password,
      role: staffRole,
    });

    createAuditLog({
      ...auditContext(req),
      action: AUDIT_ACTIONS.STAFF_CREATED,
      entityType: ENTITY_TYPES.USER,
      entityId: user._id,
      metadata: { name, email, role: staffRole, createdBy: req.user.id },
    });

    success(res, { user: user.toJSON() }, 'Staff created', 201);
  } catch (error) {
    next(error);
  }
};

// Get all staff members
const getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: ROLES.STAFF })
      .select('name email role isActive lastLoginAt createdAt')
      .sort({ createdAt: -1 });
    success(res, { staff }, 'Staff retrieved');
  } catch (error) {
    next(error);
  }
};

// Update staff status
const updateStaff = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('+refreshToken');
    if (!user || user.role !== ROLES.STAFF) throw new NotFoundError('Staff not found');

    const changes = [];
    if (typeof req.body.isActive === 'boolean' && req.body.isActive !== user.isActive) {
      user.isActive = req.body.isActive;
      // Deactivation ends every session immediately
      if (!user.isActive) user.refreshToken = null;
      changes.push('isActive');
    }
    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      user.name = req.body.name.trim().slice(0, 100);
      changes.push('name');
    }
    if (typeof req.body.password === 'string' && req.body.password) {
      user.password = req.body.password; // hashed by pre('save')
      user.refreshToken = null;
      changes.push('password');
    }
    await user.save();

    createAuditLog({
      ...auditContext(req),
      action: AUDIT_ACTIONS.STAFF_UPDATED,
      entityType: ENTITY_TYPES.USER,
      entityId: user._id,
      metadata: { changes },
    });

    success(res, { user: user.toJSON() }, 'Staff updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { createStaff, getStaff, updateStaff };
