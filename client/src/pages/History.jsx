import { useState, useEffect } from 'react';
import { getBacktestHistory } from '../utils/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStrategy, setFilterStrategy] = useState('');
    const [searchSymbol, setSearchSymbol] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getBacktestHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to load history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item => {
        const matchesStrategy = filterStrategy ? item.strategy === filterStrategy : true;
        const matchesSymbol = searchSymbol ? item.symbol.toLowerCase().includes(searchSymbol.toLowerCase()) : true;
        return matchesStrategy && matchesSymbol;
    });

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">

                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-4 md:mb-0">
                        Backtest History
                    </h1>

                    <div className="flex space-x-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search Symbol..."
                            value={searchSymbol}
                            onChange={(e) => setSearchSymbol(e.target.value)}
                            className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
                        />
                        <select
                            value={filterStrategy}
                            onChange={(e) => setFilterStrategy(e.target.value)}
                            className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Strategies</option>
                            <option value="sma">SMA</option>
                            <option value="rsi">RSI</option>
                            <option value="breakout">Breakout</option>
                        </select>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Symbol</th>
                                <th className="px-6 py-4">Strategy</th>
                                <th className="px-6 py-4 text-right">ROI</th>
                                <th className="px-6 py-4 text-right">Balance</th>
                                <th className="px-6 py-4 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item) => (
                                    <>
                                        <tr
                                            key={item._id}
                                            onClick={() => toggleRow(item._id)}
                                            className="hover:bg-gray-750 cursor-pointer transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-gray-300">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">{item.symbol}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                                                    {item.strategy}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${item.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {item.roi}%
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-300">
                                                ${item.finalBalance.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="text-gray-400 hover:text-white transition-transform duration-300 transform" style={{ transform: expandedRow === item._id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                    ▼
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRow === item._id && (
                                            <tr className="bg-gray-750 animate-expand">
                                                <td colSpan="6" className="px-6 py-4">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                                                        <div>
                                                            <span className="block text-xs uppercase text-gray-500">Initial Capital</span>
                                                            <span className="text-white">${item.initialCapital.toLocaleString()}</span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-xs uppercase text-gray-500">Total Trades</span>
                                                            <span className="text-white">{item.totalTrades}</span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-xs uppercase text-gray-500">Win Rate</span>
                                                            <span className="text-white">{item.winRate}%</span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-xs uppercase text-gray-500">Parameters</span>
                                                            <span className="text-white font-mono text-xs">{JSON.stringify(item.params)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No history found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.5s ease-out forwards;
                    }
                    @keyframes expand {
                        from { opacity: 0; transform: scaleY(0.9); transform-origin: top; }
                        to { opacity: 1; transform: scaleY(1); transform-origin: top; }
                    }
                    .animate-expand {
                        animation: expand 0.2s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default History;
