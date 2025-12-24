import { useGameStore } from "../store/Gamestore.js";
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineGraph = () => {
  const { WPM_History } = useGameStore();
  console.log(WPM_History);

  const labels = (WPM_History || []).map((_, index) => index + 1);

  const data = {
    labels,
    datasets: [
      {
        label: 'WPM',
        data: WPM_History,
        borderColor: '#e2b714',

        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

        
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0, 'rgba(226, 183, 20, 0.4)');
          gradient.addColorStop(1, 'rgba(226, 183, 20, 0.05)');

          return gradient;
        },

        pointBackgroundColor: '#e2b714',
        pointBorderColor: '#1d1f23',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#e2b714',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2c2e31',
        titleColor: '#e2b714',
        bodyColor: '#fff',
        padding: 10,
        displayColors: false,
        titleFont: { family: 'monospace' },
        bodyFont: { family: 'monospace' },
        callbacks: {
          label: (context) => ` ${Number(context.raw).toFixed(0)}WPM`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#646669',
          font: { family: 'monospace', size: 12 },
          maxTicksLimit: 20,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#646669',
          font: { family: 'monospace', size: 12 },
          padding: 10,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
   
    <div className="w-full h-full min-h-[250px] p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
