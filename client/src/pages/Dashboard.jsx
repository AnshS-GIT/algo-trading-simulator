import { useState } from 'react';
import { motion } from 'framer-motion';
import LivePrice from '../components/LivePrice';
import CandleChart from '../components/CandleChart';
import BacktestForm from '../components/BacktestForm';
import ResultsPanel from '../components/ResultsPanel';
import EquityCurveChart from '../components/EquityCurveChart';
import BacktestHistory from '../components/BacktestHistory';
import Card from '../components/Card';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
    const [backtestResult, setBacktestResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    const handleBacktestResult = (result) => {
        setBacktestResult(result);
        setLastUpdated(Date.now()); // Trigger history refresh
    };

    return (
        <motion.div
            className="flex h-[calc(100vh-48px)] bg-[#131722] overflow-hidden"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* LEFT SIDEBAR: Controls & Results */}
            <div className="w-[300px] bg-[#1e222d] border-r border-[#2a2e39] flex flex-col z-20 overflow-y-auto">
                <div className="p-4 border-b border-[#2a2e39]">
                    <LivePrice />
                </div>

                <div className="p-4 flex-1 space-y-6">
                    <div>
                        <h3 className="text-[#d1d4dc] text-xs font-bold uppercase mb-3">Strategy</h3>
                        <BacktestForm
                            onResult={handleBacktestResult}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </div>

                    <div className="border-t border-[#2a2e39] pt-4">
                        <ResultsPanel
                            results={backtestResult}
                            isLoading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT: Charts */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#131722]">
                {/* Chart Toolbar / Header */}
                <div className="h-10 border-b border-[#2a2e39] flex items-center px-4 bg-[#131722]">
                    <span className="text-xs text-[#787b86]">AAPL • 1D • SMA Crossover</span>
                </div>

                {/* Charts Area */}
                <div className="flex-1 overflow-y-auto p-1 relative">
                    <div className="h-[60%] min-h-[400px] w-full relative group">
                        <CandleChart />
                        {/* Hover Overlay Title */}
                        <div className="absolute top-2 left-2 text-[#787b86] text-xs font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            Main Chart
                        </div>
                    </div>

                    {backtestResult && (
                        <div className="h-[40%] min-h-[250px] w-full border-t border-[#2a2e39] relative p-1 mt-1">
                            <EquityCurveChart data={backtestResult.backtest.equity_curve} />
                            <div className="absolute top-2 left-2 text-[#787b86] text-xs font-bold pointer-events-none">
                                Equity Curve
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Panel (History) */}
                <div className="h-[200px] border-t border-[#2a2e39] bg-[#1e222d]">
                    <div className="h-8 border-b border-[#2a2e39] flex items-center px-4 bg-[#1e222d]">
                        <span className="text-xs font-semibold text-[#d1d4dc]">Backtest History</span>
                    </div>
                    <div className="h-[calc(100%-32px)] overflow-auto p-0">
                        <div className="scale-90 origin-top-left w-[110%]">
                            {/* Scaling down history to fit compact view */}
                            <BacktestHistory lastUpdated={lastUpdated} />
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}

