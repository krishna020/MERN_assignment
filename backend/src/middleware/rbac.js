module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};
