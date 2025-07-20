import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const monthNames = {
  EN: ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'],
  FR: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
};

const labelsText = {
  title: { EN: 'Monthly Temperature Summary (Bar Chart)', FR: 'Résumé mensuel des températures (graphique à barres)' },
  loading: { EN: 'Loading...', FR: 'Chargement...' }
};

const TemperatureBarChart = ({ language }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    Papa.parse('/temperature_data_2024.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const rows = result.data.filter(row =>
          !isNaN(row.max_temp) &&
          !isNaN(row.min_temp) &&
          row.Month >= 1 && row.Month <= 12
        );

        const monthlyMax = Array(12).fill(-Infinity);
        const monthlyMin = Array(12).fill(Infinity);

        rows.forEach(row => {
          const monthIndex = row.Month - 1;
          monthlyMax[monthIndex] = Math.max(monthlyMax[monthIndex], row.max_temp);
          monthlyMin[monthIndex] = Math.min(monthlyMin[monthIndex], row.min_temp);
        });

        setData({
          labels: monthNames[language],
          datasets: [
            {
              label: 'Max Temp (°C)',
              data: monthlyMax,
              backgroundColor: 'rgba(255, 99, 132, 0.7)'
            },
            {
              label: 'Min Temp (°C)',
              data: monthlyMin,
              backgroundColor: 'rgba(54, 162, 235, 0.7)'
            }
          ]
        });
      }
    });
  }, [language]); // reload if language changes

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } }
    }
  };

  return (
    <div style={{
        backgroundColor: '#3a3a3a',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '40px',
        maxWidth: '1000px',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
    }}>
        <h3 style={{ color: 'white' }}>{labelsText.title[language]}</h3>
        {data ? <Bar data={data} options={options} /> : <p style={{ color: 'white' }}>{labelsText.loading[language]}</p>}
    </div>
  );
};

export default TemperatureBarChart;
