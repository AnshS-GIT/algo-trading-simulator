import React, { useEffect, useState, useRef } from 'react';
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
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RealTimeChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Simulated Stock Price (AAPL)',
                data: [],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    });

    const wss = useRef(null);

    useEffect(() => {
        wss.current = new WebSocket('ws://localhost:5001');

        wss.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const time = new Date(data.timestamp).toLocaleTimeString();
            const price = parseFloat(data.price);

            setChartData(prev => {
                const newLabels = [...prev.labels, time].slice(-30); // Keep last 30 points
                const newData = [...prev.datasets[0].data, price].slice(-30);

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: newData
                        }
                    ]
                };
            });
        };

        return () => {
            if (wss.current) wss.current.close();
        };
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: '#333' },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="card h-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Live Market Data</h2>
            <div className="h-[300px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default RealTimeChart;
