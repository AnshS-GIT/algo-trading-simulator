
import React, { useState, useEffect } from 'react';
import { getBacktestHistory } from '../utils/api';

const BacktestHistory = ({ lastUpdated }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getBacktestHistory();
                setHistory(data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [lastUpdated]);

    if (loading) return <div>Loading history...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Backtests</h3>
            {history.length === 0 ? (
                <p className="text-gray-400">No history yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-2">Symbol</th>
                                <th className="p-2">Strategy</th>
                                <th className="p-2">ROI</th>
                                <th className="p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((record) => (
                                <tr key={record._id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                    <td className="p-2 text-white">{record.symbol}</td>
                                    <td className="p-2 text-white">{record.strategy}</td>
                                    <td className={`p-2 font-bold ${record.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {record.roi.toFixed(2)}%
                                    </td>
                                    <td className="p-2 text-gray-400">
                                        {new Date(record.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BacktestHistory;
