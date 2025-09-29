import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { getCache, setCache } from '../api/cache';
import PieChart from '../Charts/PieChart';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';

export default function Analytics() {
  const [data, setData] = useState(null);
  const CACHE_KEY = 'analytics:me';

  const fetchAnalytics = async () => {
    const cached = getCache(CACHE_KEY);
    if (cached) { setData(cached); return; }
    const res = await api.get('/analytics');
    setData(res.data);
    setCache(CACHE_KEY, res.data, 15 * 60 * 1000); // 15 mins
  };

  useEffect(() => { fetchAnalytics(); }, []);

  if (!data) return <div style={{ padding: 20 }}>Loading analytics...</div>;

  // assume data shape:
  // { monthly: [{month:'2025-01', income:..., expense:...}, ...], categoryBreakdown: [{category, amount}], incomeVsExpense: [{label, income, expense}] }

  return (
    <div style={{ padding: 20 }}>
      <h2>Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div><PieChart data={data.categoryBreakdown} title="Category breakdown" /></div>
        <div><LineChart data={data.monthly} title="Monthly trend" /></div>
        <div style={{ gridColumn: '1 / -1' }}><BarChart data={data.incomeVsExpense} title="Income vs Expense" /></div>
      </div>
    </div>
  );
}
