import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryChart = ({ books }) => {
  // Define quantity ranges
  const quantityRanges = [
    { label: "0-5", min: 0, max: 5 },
    { label: "6-10", min: 6, max: 10 },
    { label: "11-20", min: 11, max: 20 },
    { label: "21-50", min: 21, max: 50 },
    { label: "51-100", min: 51, max: 100 },
    { label: "101-200", min: 101, max: 200 },
    { label: "201-300", min: 201, max: 300 },
    { label: "301-400", min: 301, max: 400 },
    { label: "401-500", min: 401, max: 500 },
    { label: "501-600", min: 501, max: 600 },
    { label: "601+", min: 601, max: Infinity },
  ];

  // Calculate books in each quantity range
  const booksByRange = quantityRanges.map((range) => {
    return books.filter(
      (book) =>
        (book.Quantity ?? 0) >= range.min && (book.Quantity ?? 0) <= range.max
    );
  });

  const quantityRangeData = booksByRange.map((group) => group.length);

  const chartData = {
    labels: quantityRanges.map((range) => `${range.label} units`),
    datasets: [
      {
        label: "Number of Titles",
        data: quantityRangeData,
        backgroundColor: "#6366f1", // indigo-500
        borderColor: "#4f46e5", // indigo-600
        borderWidth: 1,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            label += ": ";
            if (context.datasetIndex === 1) {
              label += `$${context.raw.toLocaleString()}`;
            } else {
              label += context.raw.toLocaleString();
            }
            return label;
          },
          afterLabel: function (context) {
            const rangeIndex = context.dataIndex;
            const bookTitles = booksByRange[rangeIndex]
              .map((book) => book.title)
              .join(", ");
            return bookTitles
              ? `Titles: ${bookTitles}`
              : "No books in this range";
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Number of Titles",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-medium mb-4">
        Inventory Quantity Distribution
      </h3>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p>• Shows how titles are distributed across stock quantity ranges</p>
      </div>
    </div>
  );
};

export default InventoryChart;
