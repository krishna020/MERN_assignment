import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ data = [], title }) {
  const labels = data.map(d => d.label);
  const income = data.map(d => d.income || 0);
  const expense = data.map(d => d.expense || 0);
  const chartData = { labels, datasets: [{ label: 'Income', data: income }, { label: 'Expense', data: expense }] };
  return (
    <div>
      <h3>{title}</h3>
      <Bar data={chartData} />
    </div>
  );
}
