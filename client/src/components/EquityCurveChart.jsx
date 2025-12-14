import ReactApexChart from "react-apexcharts";

export default function EquityCurveChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center text-gray-400 h-64">
                <p>Run a backtest to see the equity curve</p>
            </div>
        );
    }

    const series = [{
        name: 'Equity',
        data: data.map(point => ({
            x: new Date(point.timestamp || Date.now()).getTime(), // Use timestamp if available, else index isn't ideal for datetime axis but ok
            y: point.equity
        }))
    }];

    // If no timestamps in data (simulated), fall back to numeric axis or generate fake times.
    // Assuming 'data' has 'equity' and potentially 'timestamp'. If backtest doesn't return timestamps, we might need category axis.
    // For safety, let's use numeric/category if timestamps are missing. But tradingview style usually implies time.
    // Let's assume sequential for now if timestamps are missing.

    const options = {
        chart: {
            type: 'area',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        theme: { mode: 'dark' },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#4ade80'] // green-400
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            type: 'numeric', // or datetime
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: {
            labels: {
                style: { colors: '#9ca3af' },
                formatter: (value) => `$${value.toLocaleString()}`
            }
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (val) => `$${val.toLocaleString()}`
            }
        }
    };

    return (
        <div className="w-full h-full min-h-[300px]">
            <ReactApexChart options={options} series={series} type="area" height={300} />
        </div>
    );
}
