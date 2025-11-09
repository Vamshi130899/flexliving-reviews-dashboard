import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ reviews = [] }) => {
  // Count occurrences of each sentiment
  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  reviews.forEach((r) => {
    if (r.sentiment in counts) {
      counts[r.sentiment]++;
    }
  });

  // Filter out sentiments with 0 counts
  const labels = Object.keys(counts).filter((key) => counts[key] > 0);
  const dataValues = labels.map((label) => counts[label]);

  // Map correct colors for active sentiments
  const colorMap = {
    Positive: "#22c52dff", // green
    Neutral: "#eab308", // yellow
    Negative: "#ef4444", // red
  };

  const backgroundColors = labels.map((label) => colorMap[label]);

  // Chart.js
  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Optional chart configuration
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Fallback for no reviews
  if (reviews.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center text-gray-500">
        No review data available
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-center mb-4 text-sky-700 dark:text-gray-100">
        Sentiment Distribution
      </h3>
      <div className="flex justify-center">
        <div className="w-64 h-64">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;
