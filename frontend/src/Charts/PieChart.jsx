import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data = [], title }) {
  if (!data || data.length === 0) {
    return (
      <div>
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const labels = data.map((d) => d.category);
  const values = data.map((d) => d.amount);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4CAF50",
          "#9C27B0",
          "#FF9800",
        ],
      },
    ],
  };

  return (
    <div>
      <h3>{title}</h3>
      <Pie data={chartData} />
    </div>
  );
}
