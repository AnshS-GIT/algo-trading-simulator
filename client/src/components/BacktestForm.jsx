import { useState } from 'react';
import { runBacktest } from '../utils/api';
import Card from './Card';

export default function BacktestForm({ onResult, loading, setLoading }) {
    const [strategy, setStrategy] = useState('sma');
    const [params, setParams] = useState({
        short_window: 20,
        long_window: 50,
        rsi_period: 14,
        rsi_oversold: 30,
        rsi_overbought: 70,
        breakout_lookback: 20
    });
    // const [loading, setLoading] = useState(false); // Validated: Lifted to parent
    const [symbol, setSymbol] = useState('AAPL');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Construct payload based on selected strategy
            let strategyParams = {};
            if (strategy === 'sma') {
                strategyParams = {
                    short_window: parseInt(params.short_window),
                    long_window: parseInt(params.long_window)
                };
            } else if (strategy === 'rsi') {
                strategyParams = {
                    period: parseInt(params.rsi_period),
                    oversold: parseInt(params.rsi_oversold),
                    overbought: parseInt(params.rsi_overbought)
                };
            } else if (strategy === 'breakout') {
                strategyParams = {
                    lookback: parseInt(params.breakout_lookback)
                };
            }

            const payload = {
                symbol: symbol,
                strategy: strategy,
                params: strategyParams
            };

            const result = await runBacktest(payload);
            if (onResult) {
                onResult(result);
            }
        } catch (error) {
            console.error("Backtest failed:", error);
            alert("Backtest failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleParamChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Symbol Selection */}
                <div>
                    <label className="block text-[#787b86] text-[10px] uppercase font-bold mb-1">Symbol</label>
                    <div className="relative">
                        <select
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="w-full bg-[#2a2e39] text-[#d1d4dc] text-sm p-2 rounded border border-[#2a2e39] focus:outline-none focus:border-blue-500 hover:bg-[#363a45] transition-colors"
                        >
                            <option value="AAPL">AAPL</option>
                            <option value="TSLA">TSLA</option>
                            <option value="MSFT">MSFT</option>
                        </select>
                    </div>
                </div>

                {/* Strategy Selection */}
                <div>
                    <label className="block text-[#787b86] text-[10px] uppercase font-bold mb-1">Strategy</label>
                    <div className="relative">
                        <select
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value)}
                            className="w-full bg-[#2a2e39] text-[#d1d4dc] text-sm p-2 rounded border border-[#2a2e39] focus:outline-none focus:border-blue-500 hover:bg-[#363a45] transition-colors"
                        >
                            <option value="sma">SMA Crossover</option>
                            <option value="rsi">RSI Mean Reversion</option>
                            <option value="breakout">Breakout Strategy</option>
                        </select>
                    </div>
                </div>

                {/* Dynamic Parameters */}
                <div className="bg-[#1e222d] rounded border border-[#2a2e39] p-3">
                    <h3 className="text-[10px] uppercase font-bold text-[#787b86] mb-2 border-b border-[#2a2e39] pb-1">Parameters</h3>
                    {strategy === 'sma' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[#787b86] text-[10px] mb-1">Short</label>
                                <input
                                    type="number"
                                    name="short_window"
                                    value={params.short_window}
                                    onChange={handleParamChange}
                                    className="w-full bg-[#2a2e39] text-white text-sm p-1.5 rounded border border-[#363a45] focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[#787b86] text-[10px] mb-1">Long</label>
                                <input
                                    type="number"
                                    name="long_window"
                                    value={params.long_window}
                                    onChange={handleParamChange}
                                    className="w-full bg-[#2a2e39] text-white text-sm p-1.5 rounded border border-[#363a45] focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {strategy === 'rsi' && (
                        <div className="space-y-2">
                            <div>
                                <label className="block text-[#787b86] text-[10px] mb-1">Period</label>
                                <input
                                    type="number"
                                    name="rsi_period"
                                    value={params.rsi_period}
                                    onChange={handleParamChange}
                                    className="w-full bg-[#2a2e39] text-white text-sm p-1.5 rounded border border-[#363a45] focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[#787b86] text-[10px] mb-1">Oversold</label>
                                    <input
                                        type="number"
                                        name="rsi_oversold"
                                        value={params.rsi_oversold}
                                        onChange={handleParamChange}
                                        className="w-full bg-[#2a2e39] text-white text-sm p-1.5 rounded border border-[#363a45] focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#787b86] text-[10px] mb-1">Overbought</label>
                                    <input
                                        type="number"
                                        name="rsi_overbought"
                                        value={params.rsi_overbought}
                                        onChange={handleParamChange}
                                        className="w-full bg-[#2a2e39] text-white text-sm p-1.5 rounded border border-[#363a45] focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {strategy === 'breakout' && (
                        <div>
                            <label className="block text-[#787b86] text-[10px] mb-1">Lookback</label>
                            <input
                                type="number"
                                name="breakout_lookback"
                                value={params.breakout_lookback}
                                onChange={handleParamChange}
                                className="w-full bg-[#2a2e39] text-white text-sm p-1.5 rounded border border-[#363a45] focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-3 rounded text-sm font-semibold text-white transition-all ${loading ? 'bg-[#2a2e39] cursor-not-allowed' : 'bg-[#2962ff] hover:bg-[#1e53e5]'
                        }`}
                >
                    {loading ? 'Processing...' : 'Run Backtest'}
                </button>
            </form>
        </div>
    );
}
