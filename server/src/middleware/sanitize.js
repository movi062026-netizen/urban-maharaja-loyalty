/**
 * Strips MongoDB operator keys ($gt, $where, ...) and dotted paths from
 * request input so user data can never be interpreted as a query operator.
 * Mutates in place because req.query is a getter in newer Express versions.
 */
const MAX_DEPTH = 10;

const clean = (value, depth = 0) => {
  if (!value || typeof value !== 'object' || depth > MAX_DEPTH) return;
  if (Buffer.isBuffer(value)) return;

  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.') || key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete value[key];
    } else {
      clean(value[key], depth + 1);
    }
  }
};

const sanitizeInput = (req, _res, next) => {
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
};

module.exports = { sanitizeInput };
