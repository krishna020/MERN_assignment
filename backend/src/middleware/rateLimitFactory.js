const rateLimit = require('express-rate-limit');

exports.create = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    handler: (req, res) => res.status(429).json({ error: message || 'Too many requests' }),
  });
