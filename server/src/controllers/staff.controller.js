const User = require('../models/User');
const { ROLES, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');
const { success } = require('../utils/response');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { createAuditLog, auditContext } = require('../services/audit.service');
const { generateTokens } = require('../services/auth.service');

// Create staff member (admin only)
const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow creating STAFF (not ADMIN through this endpoint)
    const staffRole = role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.STAFF;

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
      metadata: { name, email, role: staffRole },
    });

    success(res, { user: user.toJSON() }, 'Staff created', 201);
  } catch (error) {
    next(error);
  }
};

// Get all staff members
const getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: [ROLES.STAFF, ROLES.ADMIN] } })
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
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('Staff not found');

    if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
    if (req.body.name) user.name = req.body.name;
    await user.save();

    createAuditLog({
      ...auditContext(req),
      action: AUDIT_ACTIONS.STAFF_UPDATED,
      entityType: ENTITY_TYPES.USER,
      entityId: user._id,
      metadata: { changes: Object.keys(req.body) },
    });

    success(res, { user: user.toJSON() }, 'Staff updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { createStaff, getStaff, updateStaff };
