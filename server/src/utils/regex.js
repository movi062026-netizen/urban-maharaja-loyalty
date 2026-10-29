/**
 * Escape user text so it is matched literally inside a MongoDB $regex
 * (prevents regex injection / catastrophic backtracking).
 */
const escapeRegex = (value) => String(value).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { escapeRegex };
