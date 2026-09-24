const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const User = require('../models/User');

/**
 * Authenticate JWT token from Authorization header.
 * Attaches req.user with { id, role }.
 */
const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // Verify user still exists and is active
    const user = await User.findById(decoded.id).select('_id name role isActive');
    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }
    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    // JWT errors will be caught by the error handler
    next(error);
  }
};

/**
 * Authorization middleware factory.
 * Restricts access to specific roles.
 *
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('Not authenticated'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
