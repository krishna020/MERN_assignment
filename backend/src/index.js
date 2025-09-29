require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const transRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const usersRoutes = require('./routes/users');
const { create } = require('./middleware/rateLimitFactory');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// rate limits
app.use('/api/auth', create({ windowMs: 15*60*1000, max: 5, message: 'Too many auth attempts' }));
app.use('/api/transactions', create({ windowMs: 60*60*1000, max: 100 }));
app.use('/api/analytics', create({ windowMs: 60*60*1000, max: 50 }));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', usersRoutes);

// swagger (implement swagger.js)
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
