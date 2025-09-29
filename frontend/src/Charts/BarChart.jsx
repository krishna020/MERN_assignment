import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ data = [], title }) {
  if (!data || data.length === 0) {
    return (
      <div>
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const labels = data.map((d) => d.label);
  const income = data.map((d) => d.income);
  const expense = data.map((d) => d.expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: income,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "green",
        borderWidth: 1,
      },
      {
        label: "Expense",
        data: expense,
        backgroundColor: "rgba(255,99,132,0.6)",
        borderColor: "red",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>{title}</h3>
      <Bar data={chartData} />
    </div>
  );
}
