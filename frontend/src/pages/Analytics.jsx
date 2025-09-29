import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getCache, setCache } from "../api/cache";
import { useAuth } from "../context/AuthContext";
import PieChart from "../Charts/PieChart";
import LineChart from "../Charts/LineChart";
import BarChart from "../Charts/BarChart";

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!user) return;

    const CACHE_KEY = `analytics:${user.id}`;
    try {
      const cached = getCache(CACHE_KEY);
      if (cached && cached.monthly?.length) {
        setData(cached);
        setLoading(false);
        return;
      }

      const res = await api.get("/analytics");
      console.log("Analytics API response:", res.data);

      // ✅ Use correct keys from backend
      const monthly = (res.data.monthly || []).map(m => ({
        month: m.month,
        income: Number(m.income) || 0,
        expense: Number(m.expense) || 0,
      }));

      const categoryBreakdown = (res.data.categoryBreakdown || []).map(c => ({
        category: c.category || "Uncategorized",
        amount: Number(c.amount) || 0,
      }));

      const incomeVsExpense = (res.data.incomeVsExpense || []).map(i => ({
        label: i.label,
        income: Number(i.income) || 0,
        expense: Number(i.expense) || 0,
      }));

      const transformed = { monthly, categoryBreakdown, incomeVsExpense };

      setData(transformed);
      setCache(CACHE_KEY, transformed, 15 * 60 * 1000);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  if (loading) return <div style={{ padding: 20 }}>Loading analytics...</div>;
  if (!data) return <div style={{ padding: 20 }}>No analytics available</div>;

  console.log("Final transformed data:", data);

  const totalIncome = data.monthly.reduce((s, m) => s + m.income, 0);
  const totalExpense = data.monthly.reduce((s, m) => s + m.expense, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard & Analytics</h2>

      {/* Overview cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Total Income</h3>
          <p style={{ fontSize: 22, color: "green" }}>+{totalIncome}</p>
        </div>
        <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Total Expense</h3>
          <p style={{ fontSize: 22, color: "red" }}>-{totalExpense}</p>
        </div>
        <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Balance</h3>
          <p
            style={{
              fontSize: 22,
              color: balance >= 0 ? "green" : "red",
            }}
          >
            {balance}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
          <PieChart
            data={data.categoryBreakdown}
            title="Category-wise Expenses"
          />
        </div>
        <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
          <LineChart data={data.monthly} title="Monthly Income vs Expense" />
        </div>
        <div
          style={{
            gridColumn: "1 / -1",
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <BarChart
            data={data.incomeVsExpense}
            title="Income vs Expense Trends"
          />
        </div>
      </div>
    </div>
  );
}
