const redisClient = require('../redis');

module.exports = function cache(keyFn, ttlSeconds = 60) {
  return async (req, res, next) => {
    try {
      const key = keyFn(req);
      const cached = await redisClient.get(key);
      if (cached) return res.json(JSON.parse(cached));
     
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (body) redisClient.setEx(key, ttlSeconds, JSON.stringify(body)).catch(console.error);
        return originalJson(body);
      };
      next();
    } catch (err) {
      console.error('Cache middleware error', err);
      next();
    }
  };
};
