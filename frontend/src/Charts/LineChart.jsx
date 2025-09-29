import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChart({ data = [], title }) {
  if (!data || data.length === 0) {
    return (
      <div>
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const labels = data.map((d) => d.month);
  const income = data.map((d) => d.income);
  const expense = data.map((d) => d.expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: income,
        borderColor: "green",
        backgroundColor: "rgba(75,192,192,0.3)",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: expense,
        borderColor: "red",
        backgroundColor: "rgba(255,99,132,0.3)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
}
