import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const TemperatureLineChart = ( {language} ) => {

    const monthNames = {
        EN: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
        FR: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
             'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      };
      
      const labels = {
        title: { EN: 'Temperature History in 2024', FR: 'Historique des températures en 2024' },
        view: { EN: 'View', FR: 'Vue' },
        monthly: { EN: 'Monthly', FR: 'Mensuel' },
        daily: { EN: 'Daily', FR: 'Quotidien' },
        month: { EN: 'Month', FR: 'Mois' },
        loading: { EN: 'Loading...', FR: 'Chargement...' }
      };      

    const [viewMode, setViewMode] = useState('monthly');
    const [monthFilter, setMonthFilter] = useState(1);
    const [data, setData] = useState(null);
    const [dailyRaw, setDailyRaw] = useState([]);

    useEffect(() => {
        const updateChartData = (rows, mode, filterMonth) => {
          if (mode === 'monthly') {
            const monthlyMax = Array(12).fill(-Infinity);
            const monthlyMin = Array(12).fill(Infinity);
      
            rows.forEach(row => {
              const monthIndex = row.Month - 1;
              monthlyMax[monthIndex] = Math.max(monthlyMax[monthIndex], row.max_temp);
              monthlyMin[monthIndex] = Math.min(monthlyMin[monthIndex], row.min_temp);
            });
      
            setData({
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: 'Max Temp (°C)',
                  data: monthlyMax,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  tension: 0.4
                },
                {
                  label: 'Min Temp (°C)',
                  data: monthlyMin,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  tension: 0.4
                }
              ]
            });
          } else if (mode === 'daily') {
            const filtered = rows.filter(r => r.Month === filterMonth);
            const labels = filtered.map(r => `${r.Month}/${r.Day}`);
            const max = filtered.map(r => r.max_temp);
            const min = filtered.map(r => r.min_temp);
      
            setData({
              labels,
              datasets: [
                {
                  label: 'Max Temp (°C)',
                  data: max,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  tension: 0.3
                },
                {
                  label: 'Min Temp (°C)',
                  data: min,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  tension: 0.3
                }
              ]
            });
          }
        };
      
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
      
            setDailyRaw(rows);
            updateChartData(rows, viewMode, monthFilter);
          }
        });
      }, [monthFilter, viewMode]);      

    const updateChartData = (rows, mode, filterMonth) => {
    if (mode === 'monthly') {
        const monthlyMax = Array(12).fill(-Infinity);
        const monthlyMin = Array(12).fill(Infinity);

        rows.forEach(row => {
        const monthIndex = row.Month - 1;
        monthlyMax[monthIndex] = Math.max(monthlyMax[monthIndex], row.max_temp);
        monthlyMin[monthIndex] = Math.min(monthlyMin[monthIndex], row.min_temp);
        });

        setData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
            label: 'Max Temp (°C)',
            data: monthlyMax,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4
            },
            {
            label: 'Min Temp (°C)',
            data: monthlyMin,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4
            }
        ]
        });
    } else if (mode === 'daily') {
        const filtered = rows.filter(r => r.Month === filterMonth);
        const labels = filtered.map(r => `${r.Month}/${r.Day}`);
        const max = filtered.map(r => r.max_temp);
        const min = filtered.map(r => r.min_temp);

        setData({
        labels,
        datasets: [
            {
            label: 'Max Temp (°C)',
            data: max,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.3
            },
            {
            label: 'Min Temp (°C)',
            data: min,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3
            }
        ]
        });
    }
    };

    const handleViewChange = (e) => {
    const selected = e.target.value;
    setViewMode(selected);
    updateChartData(dailyRaw, selected, monthFilter);
    };

    const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value);
    setMonthFilter(selectedMonth);
    if (viewMode === 'daily') {
        updateChartData(dailyRaw, viewMode, selectedMonth);
    }
    };

    const options = {
    responsive: true,
    plugins: {
        legend: {
        labels: { color: '#fff' }
        }
    },
    scales: {
        x: {
        ticks: { color: '#fff' }
        },
        y: {
        ticks: { color: '#fff' }
        }
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
    <h3 style={{ color: 'white' }}>{labels.title[language]}</h3>

    <div style={{
        marginBottom: '25px',
        backgroundColor: '#2a2a2a',
        padding: '15px',
        borderRadius: '8px',
        display: 'flex',
        gap: '40px',
        justifyContent: 'flex-start',
        alignItems: 'center'
        }}>
        <div>
            <label htmlFor="viewMode" style={{ color: '#ddd', fontWeight: 'bold', fontSize: '14px' }}>
                {language === 'EN' ? 'Select how you want to view the temperature data:' : 'Choisissez comment afficher les données de température :'}
            </label>
            <br/>
            <select
                id="viewMode"
                value={viewMode}
                onChange={handleViewChange}
                style={{
                    padding: '6px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: '#424242',
                    color: '#fff',
                    marginTop: '5px'
                }}
            >
                <option value="monthly">{labels.monthly[language]}</option>
                <option value="daily">{labels.daily[language]}</option>
            </select>
        </div>

    {viewMode === 'daily' && (
        <div>
        <label htmlFor="monthFilter" style={{ color: '#ddd', fontWeight: 'bold', fontSize: '14px' }}>
            {language === 'EN' ? 'Select a month to focus on:' : 'Sélectionnez un mois à afficher :'}
        </label>
        <br />
        <select
            id="monthFilter"
            value={monthFilter}
            onChange={handleMonthChange}
            style={{
            padding: '6px 10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#424242',
            color: '#fff',
            marginTop: '5px'
            }}
        >
            {monthNames[language].map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
            ))}
        </select>
        </div>
    )}
</div>


        {data ? <Line data={data} options={options} /> : <p style={{ color: 'white' }}>Loading...</p>}
    </div>
    );
};

export default TemperatureLineChart;
