import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChart({ data = [], title }) {
  const labels = data.map(d => d.month);
  const income = data.map(d => d.income || 0);
  const expense = data.map(d => d.expense || 0);
  const chartData = {
    labels,
    datasets: [
      { label: 'Income', data: income, tension: 0.3 },
      { label: 'Expense', data: expense, tension: 0.3 },
    ],
  };
  return (
    <div>
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
}
