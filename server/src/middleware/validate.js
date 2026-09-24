const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Middleware that checks express-validator results
 * and throws a ValidationError if any exist.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    throw new ValidationError('Validation failed', details);
  }
  next();
};

module.exports = validate;
