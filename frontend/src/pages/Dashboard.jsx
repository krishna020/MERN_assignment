import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/api';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=> {
    let mounted = true;
    api.get('/analytics').then(res=> {
      if(mounted) setData(res.data);
    }).catch(() => {
      if(mounted) setData(null);
    }).finally(()=> mounted && setLoading(false));
    return ()=> mounted = false;
  }, []);

  const lineData = useMemo(()=> {
    if(!data) return { labels: [], datasets: [] };
    const labels = data.monthly.map(m => m.month);
    return {
      labels,
      datasets: [
        { label: 'Income', data: data.monthly.map(m => Number(m.income || 0)), tension: 0.3 },
        { label: 'Expense', data: data.monthly.map(m => Number(m.expense || 0)), tension: 0.3 }
      ]
    };
  }, [data]);

  const pieData = useMemo(()=> {
    if(!data) return { labels: [], datasets: [] };
    return {
      labels: data.categoryBreakdown.map(c => c.name || 'Uncategorized'),
      datasets: [{ data: data.categoryBreakdown.map(c => Number(c.total || 0)) }]
    };
  }, [data]);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>No analytics available</div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="chartRow">
        <div className="card"><h3>Monthly trends</h3><Line data={lineData} /></div>
        <div className="card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
      </div>
    </div>
  );
}
