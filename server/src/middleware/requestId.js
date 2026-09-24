const { v4: uuidv4 } = require('uuid');

/**
 * Attaches a unique request ID to every incoming request
 * for tracing and debugging across logs.
 */
const requestId = (req, res, next) => {
  req.requestId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

module.exports = requestId;
