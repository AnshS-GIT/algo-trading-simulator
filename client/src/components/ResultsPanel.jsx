export default function ResultsPanel({ results, isLoading }) {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-[#2a2e39] h-12 rounded flex flex-col justify-center items-center">
                            <div className="h-2 w-10 bg-[#363a45] rounded mb-1"></div>
                            <div className="h-3 w-14 bg-[#363a45] rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-24 text-[#363a45] border border-dashed border-[#2a2e39] rounded">
                <span className="text-xs">No Results</span>
            </div>
        );
    }

    const { final_balance, initial_capital, roi, total_trades, win_rate } = results.backtest;
    const net_profit = results.backtest.net_profit || (final_balance - initial_capital);

    const Metric = ({ label, value, colorClass = "text-[#d1d4dc]" }) => (
        <div className="bg-[#2a2e39] p-2 rounded flex flex-col items-center justify-center hover:bg-[#363a45] transition-colors cursor-default group">
            <span className="text-[9px] text-[#787b86] uppercase font-bold tracking-wider mb-0.5 group-hover:text-[#9ea1aa]">{label}</span>
            <span className={`text-sm font-bold font-mono ${colorClass}`}>{value}</span>
        </div>
    );

    return (
        <div className="space-y-3">
            <h3 className="text-[#d1d4dc] text-xs font-bold uppercase">Performance</h3>
            <div className="grid grid-cols-2 gap-2">
                <Metric
                    label="Net Profit"
                    value={`$${net_profit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                    colorClass={net_profit >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}
                />
                <Metric
                    label="ROI"
                    value={`${roi.toFixed(2)}%`}
                    colorClass={roi >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}
                />
                <Metric
                    label="Win Rate"
                    value={`${win_rate.toFixed(1)}%`}
                    colorClass="text-[#d1d4dc]"
                />
                <Metric
                    label="Trades"
                    value={total_trades}
                    colorClass="text-[#d1d4dc]"
                />
                <div className="col-span-2 bg-[#2a2e39] p-2 rounded flex justify-between items-center px-3 border border-[#2a2e39]">
                    <span className="text-[10px] text-[#787b86] uppercase font-bold">Balance</span>
                    <span className="text-sm font-bold font-mono text-[#d1d4dc]">${final_balance.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
