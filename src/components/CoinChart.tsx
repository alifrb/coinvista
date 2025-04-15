"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

interface CoinChartProps {
  sparklineData: number[];
}

export default function CoinChart({ sparklineData }: CoinChartProps) {
  const data = {
    labels: sparklineData.map((_, index) => index), // Dummy labels
    datasets: [
      {
        data: sparklineData,
        borderColor: "#00b894",
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    elements: {
      line: { tension: 0.2 },
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return <Line data={data} options={options} height={40} className="pt-3" />;
}
