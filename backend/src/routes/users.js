const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const db = require('../db');

// Get all users (admin only)
router.get('/', auth, rbac('admin'), async (req, res) => {
  const { rows } = await db.query('SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

// Update user role (admin only)
router.put('/:id/role', auth, rbac('admin'), async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  const { rows } = await db.query('UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role', [role, id]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

// Delete user (admin only)
router.delete('/:id', auth, rbac('admin'), async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await db.query('DELETE FROM users WHERE id=$1', [id]);
  if (!rowCount) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
