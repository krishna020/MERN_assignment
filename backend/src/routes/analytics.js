const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cache = require('../middleware/cache');
const { getAnalytics } = require('../controllers/analyticsController');


router.get('/', auth, cache((req) => `analytics:${req.user.id}`, 900), getAnalytics);

module.exports = router;
