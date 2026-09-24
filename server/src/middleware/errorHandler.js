const logger = require('../config/logger');
const { AppError } = require('../utils/errors');
const env = require('../config/env');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, _next) => {
  // Log the error
  const logMeta = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode: err.statusCode || 500,
  };

  if (err.isOperational) {
    logger.warn(err.message, logMeta);
  } else {
    logger.error(err.message, { ...logMeta, stack: err.stack });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: `Duplicate value for ${field}`,
        details: [],
      },
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: `Invalid ${err.path}: ${err.value}`,
        details: [],
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid token',
        details: [],
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Token expired',
        details: [],
      },
    });
  }

  // Operational errors (AppError subclasses)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  // Unknown errors — never expose stack traces in production
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.isProduction ? 'An unexpected error occurred' : err.message,
      details: [],
    },
  });
};

/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      details: [],
    },
  });
};

module.exports = { errorHandler, notFoundHandler };
