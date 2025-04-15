"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale
);

interface Props {
  labels: string[];
  dataPoints: number[];
}

export default function MarketCapTrendChart({ labels, dataPoints }: Props) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Market Cap (USD)",
            data: dataPoints,
            borderColor: "#00b894",
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: "rgba(0, 184, 148, 0.1)",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            type: "time",
            time: { unit: "day" },
            ticks: { autoSkip: true, maxTicksLimit: 7 },
          },
          y: {
            ticks: {
              callback: (value) => `$${((value as number) / 1e9).toFixed(0)}B`,
            },
          },
        },
      }}
    />
  );
}
