import React, { useEffect, useState, useMemo } from "react";
import api from "../api/api";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/analytics")
      .then((res) => {
        console.log("API /analytics response:", res.data); // 👈 debug log
        if (mounted) setData(res.data);
      })
      .catch((err) => {
        console.error("Analytics fetch error:", err);
        if (mounted) setData(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const lineData = useMemo(() => {
    if (!data || !data.monthly || !Array.isArray(data.monthly)) {
      return { labels: [], datasets: [] };
    }

    const labels = data.monthly.map((m) => m.month || "Unknown");
    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: data.monthly.map((m) => Number(m.income || 0)),
          borderColor: "green",
          backgroundColor: "rgba(75,192,192,0.3)",
          tension: 0.3,
        },
        {
          label: "Expense",
          data: data.monthly.map((m) => Number(m.expense || 0)),
          borderColor: "red",
          backgroundColor: "rgba(255,99,132,0.3)",
          tension: 0.3,
        },
      ],
    };
  }, [data]);

  const pieData = useMemo(() => {
    if (!data || !data.categoryBreakdown || !Array.isArray(data.categoryBreakdown)) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: data.categoryBreakdown.map((c) => c.name || "Uncategorized"),
      datasets: [
        {
          data: data.categoryBreakdown.map((c) => Number(c.total || 0)),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4CAF50",
            "#9C27B0",
            "#FF9800",
          ],
        },
      ],
    };
  }, [data]);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>No analytics available</div>;

  return (
    <div className="container" style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <div
        className="chartRow"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div className="card" style={{ padding: 20, border: "1px solid #ddd" }}>
          <h3>Monthly trends</h3>
          {lineData.labels.length ? (
            <Line data={lineData} />
          ) : (
            <p>No monthly data available</p>
          )}
        </div>
        <div className="card" style={{ padding: 20, border: "1px solid #ddd" }}>
          <h3>Expenses by Category</h3>
          {pieData.labels.length ? (
            <Pie data={pieData} />
          ) : (
            <p>No category data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
