import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import useWebSocket from "../hooks/useWebSocket";

export default function CandleChart() {
    const { data } = useWebSocket();
    const [series, setSeries] = useState([{ data: [] }]);

    useEffect(() => {
        if (data) {
            // ApexCharts candlestick format: { x: timestamp, y: [open, high, low, close] }
            const newCandle = {
                x: new Date(data.timestamp || Date.now()).getTime(),
                y: [data.open, data.high, data.low, data.close]
            };

            setSeries((prevSeries) => {
                const currentData = prevSeries[0].data;
                // Keep last 50 candles to avoid memory issues and keep chart moving
                const newData = [...currentData, newCandle].slice(-50);
                return [{ data: newData }];
            });
        }
    }, [data]);

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            animations: { enabled: true }
        },
        theme: { mode: 'dark' },
        xaxis: {
            type: 'datetime',
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#9ca3af' } }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: { style: { colors: '#9ca3af' } }
        },
        grid: {
            borderColor: '#374151', // gray-700
            strokeDashArray: 4,
            xaxis: { lines: { show: false } }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#22c55e', // green-500
                    downward: '#ef4444' // red-500
                }
            }
        }
    };

    return (
        <div className="w-full h-full min-h-[350px]">
            {series[0].data.length > 0 ? (
                <div id="chart" className="w-full h-full">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="candlestick"
                        height="100%"
                    />
                </div>
            ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                    Waiting for market data...
                </div>
            )}
        </div>
    );
}
