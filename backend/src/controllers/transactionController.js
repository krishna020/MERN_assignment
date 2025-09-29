// /backend/src/controllers/transactionController.js
const db = require('../db');
const redis = require('../redis');

exports.create = async (req, res) => {
  const { amount, type, category_id, description, transaction_date } = req.body;
  const userId = req.user.id;
  const q = `INSERT INTO transactions(user_id, amount, type, category_id, description, transaction_date)
             VALUES($1,$2,$3,$4,$5,$6) RETURNING *`;
  const { rows } = await db.query(q, [userId, amount, type, category_id, description, transaction_date || new Date()]);
  // invalidate caches for this user
  await Promise.all([
    redis.del(`analytics:${userId}`),
    redis.del(`categories`),
  ].map(p => p.catch(console.error)));
  res.status(201).json(rows[0]);
};

exports.list = async (req, res) => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page || 1));
  const limit = Math.min(100, parseInt(req.query.limit || 20));
  const offset = (page - 1) * limit;

  const q = `SELECT t.*, c.name as category_name FROM transactions t
             LEFT JOIN categories c ON c.id=t.category_id
             WHERE t.user_id = $1
             ORDER BY transaction_date DESC
             LIMIT $2 OFFSET $3`;
  const { rows } = await db.query(q, [userId, limit, offset]);
  const { rows: countRows } = await db.query('SELECT COUNT(*) as total FROM transactions WHERE user_id=$1', [userId]);
  res.json({ data: rows, meta: { page, limit, total: parseInt(countRows[0].total, 10) } });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { amount, type, category_id, description, transaction_date } = req.body;
  
  const ownerCheck = await db.query('SELECT id FROM transactions WHERE id=$1 AND user_id=$2', [id, userId]);
  if (!ownerCheck.rowCount) return res.status(403).json({ error: 'Not allowed' });
  const q = `UPDATE transactions SET amount=$1,type=$2,category_id=$3,description=$4,transaction_date=$5 WHERE id=$6 RETURNING *`;
  const { rows } = await db.query(q, [amount, type, category_id, description, transaction_date || new Date(), id]);
  await Promise.all([redis.del(`analytics:${userId}`), redis.del(`categories`)]);
  res.json(rows[0]);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const del = await db.query('DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING *', [id, userId]);
  if (!del.rowCount) return res.status(404).json({ error: 'Not found' });
  await Promise.all([redis.del(`analytics:${userId}`), redis.del(`categories`)]);
  res.json({ success: true });
};
