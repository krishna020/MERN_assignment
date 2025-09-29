//const rateLimit = require('express-rate-limit');

// exports.create = ({ windowMs, max, message }) =>
//   rateLimit({
//     windowMs,
//     max,
//     handler: (req, res) => res.status(429).json({ error: message || 'Too many requests' }),
//   });


  const rateLimit = require('express-rate-limit');

exports.create = (options = {}) => {
  // sensible defaults per route type
  const defaults = {
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 500,                   // allow up to 500 requests per IP
    standardHeaders: true,      // return rate limit info in headers
    legacyHeaders: false,       // disable X-RateLimit headers
    message: { error: 'Too many requests, please try again later.' }
  };

  return rateLimit({
    ...defaults,
    ...options, // override if you pass custom
  });
};
