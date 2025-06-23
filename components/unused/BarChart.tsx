// components/BarChart.tsx
'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Registrasi komponen yang diperlukan
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC = () => {
  const data: ChartData<'bar'> = {
    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei'],
    datasets: [
      {
        label: 'Penjualan',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Diagram Batang Penjualan Bulanan',
      },
    },
    animation: {
      duration: 1000, // Durasi animasi dalam milidetik
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
