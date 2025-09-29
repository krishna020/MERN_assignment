const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.on('error', (e) => console.error('Redis error', e));
(async () => { await client.connect(); console.log('Connected to Redis'); })();
module.exports = client;
