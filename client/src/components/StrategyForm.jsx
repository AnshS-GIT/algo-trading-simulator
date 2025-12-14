import React, { useState } from 'react';
import api from '../api/axios';
import { Play } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const StrategyForm = () => {
    const [name, setName] = useState('My Strategy');
    const [type, setType] = useState('SMA');
    const [symbol, setSymbol] = useState('AAPL');
    const [params, setParams] = useState({ shortWindow: 50, longWindow: 200, period: 14 });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            // Mocking userId for now since we haven't implemented full Auth Context yet
            const userId = localStorage.getItem('userId');

            const response = await api.post('/strategies', {
                userId,
                name,
                type,
                parameters: { symbol, ...params }
            });
            setResult(response.data.backtestResult);
        } catch (error) {
            console.error(error);
            alert('Backtest failed');
        } finally {
            setLoading(false);
        }
    };

    const renderResultChart = () => {
        if (!result) return null;

        const data = {
            labels: result.dates,
            datasets: [
                {
                    label: 'Close Price',
                    data: result.prices,
                    borderColor: '#6366F1',
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'Buy Signal',
                    data: result.trades.filter(t => t.type === 'BUY').map(t => ({ x: t.date, y: t.price })),
                    backgroundColor: '#22C55E',
                    pointRadius: 6,
                    type: 'scatter'
                },
                {
                    label: 'Sell Signal',
                    data: result.trades.filter(t => t.type === 'SELL').map(t => ({ x: t.date, y: t.price })),
                    backgroundColor: '#EF4444',
                    pointRadius: 6,
                    type: 'scatter'
                }
            ]
        };

        // Note: Scatter mixed with Line in React Chartjs 2 might need correct configuration logic, 
        // to simplify let's just show ROI and Metrics for now.
        return (
            <div className="mt-6 bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Results</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">ROI</p>
                        <p className={`text-xl font-bold ${result.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>{result.roi}%</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">Final Balance</p>
                        <p className="text-xl font-bold text-white">${result.final_balance}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">Trades</p>
                        <p className="text-xl font-bold text-white">{result.trades.length}</p>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">New Strategy</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Strategy Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Symbol</label>
                        <input value={symbol} onChange={e => setSymbol(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option value="SMA">SMA Crossover</option>
                            <option value="EMA">EMA Crossover</option>
                            <option value="RSI">RSI Reversal</option>
                        </select>
                    </div>
                </div>

                {type === 'SMA' || type === 'EMA' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Short Window</label>
                            <input type="number" value={params.shortWindow} onChange={e => setParams({ ...params, shortWindow: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Long Window</label>
                            <input type="number" value={params.longWindow} onChange={e => setParams({ ...params, longWindow: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">RSI Period</label>
                        <input type="number" value={params.period} onChange={e => setParams({ ...params, period: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center space-x-2">
                    {loading ? <span>Running...</span> : <><Play size={16} /> <span>Run Backtest</span></>}
                </button>
            </form>
            {renderResultChart()}
        </div>
    );
};

export default StrategyForm;
