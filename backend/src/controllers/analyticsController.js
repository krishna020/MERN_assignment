
const db = require('../db');

exports.getAnalytics = async (req, res) => {
  const userId = req.user.id;

  // monthly totals (last 12 months)
  const monthlyQ = `
    SELECT to_char(date_trunc('month', transaction_date),'YYYY-MM') as month,
           SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
           SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE user_id=$1 AND transaction_date > now() - interval '12 months'
    GROUP BY 1 ORDER BY 1;
  `;
  const catQ = `
    SELECT c.name, SUM(t.amount) as total
    FROM transactions t
    LEFT JOIN categories c ON c.id=t.category_id
    WHERE t.user_id=$1 AND t.type='expense'
    GROUP BY c.name ORDER BY total DESC;
  `;

  const [monthlyRes, catRes] = await Promise.all([db.query(monthlyQ, [userId]), db.query(catQ, [userId])]);

  res.json({
    monthly: monthlyRes.rows,
    categoryBreakdown: catRes.rows
  });
};
