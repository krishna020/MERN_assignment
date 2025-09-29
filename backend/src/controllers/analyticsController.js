const db = require('../db');

exports.getAnalytics = async (req, res) => {
  try {
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

    const [monthlyRes, catRes] = await Promise.all([
      db.query(monthlyQ, [userId]),
      db.query(catQ, [userId]),
    ]);

    // normalize monthly
    const monthly = monthlyRes.rows.map(r => ({
      month: r.month,
      income: Number(r.income) || 0,
      expense: Number(r.expense) || 0,
    }));

    // normalize categories
    const categoryBreakdown = catRes.rows.map(r => ({
      category: r.name || "Uncategorized",
      amount: Number(r.total) || 0,
    }));

    // income vs expense (reuse monthly)
    const incomeVsExpense = monthly.map(m => ({
      label: m.month,
      income: m.income,
      expense: m.expense,
    }));

    res.json({
      monthly,
      categoryBreakdown,
      incomeVsExpense,
    });
  } catch (err) {
    console.error("Analytics error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
