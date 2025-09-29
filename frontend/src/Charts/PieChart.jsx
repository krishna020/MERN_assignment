import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data = [], title }) {
  const labels = data.map(d => d.category);
  const values = data.map(d => d.amount);
  const chartData = { labels, datasets: [{ data: values }] };
  return (
    <div>
      <h3>{title}</h3>
      <Pie data={chartData} />
    </div>
  );
}
