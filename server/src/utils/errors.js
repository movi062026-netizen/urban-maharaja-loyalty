const { ERROR_CODES } = require('../constants');

class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, ERROR_CODES.AUTHENTICATION_ERROR);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, ERROR_CODES.AUTHORIZATION_ERROR);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, ERROR_CODES.CONFLICT);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, ERROR_CODES.RATE_LIMIT);
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database error') {
    super(message, 500, ERROR_CODES.DATABASE_ERROR);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
};
