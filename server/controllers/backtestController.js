import axios from 'axios';
import BacktestHistory from '../models/BacktestHistory.js';

// Helper to generate dummy data
function generateDummyData(count) {
    const data = [];
    let price = 100;
    const now = Math.floor(Date.now() / 1000);
    for (let i = 0; i < count; i++) {
        const move = (Math.random() - 0.5) * 2;
        price = price + move;
        data.push({
            timestamp: now - (count - i) * 60,
            open: price,
            high: price + Math.random(),
            low: price - Math.random(),
            close: price + (Math.random() - 0.5),
            volume: Math.floor(Math.random() * 1000)
        });
    }
    return data;
}

export const runBacktest = async (req, res) => {
    try {
        const { symbol, strategy, params } = req.body;
        
        let ohlcvData = req.body.data;
        if (!ohlcvData || ohlcvData.length === 0) {
             ohlcvData = generateDummyData(100);
        }

        const pythonPayload = {
            symbol: symbol || 'AAPL',
            strategy: strategy,
            params: params,
            data: ohlcvData
        };

        // Call Python Service
        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
        const response = await axios.post(`${pythonServiceUrl}/run-backtest`, pythonPayload);
        const result = response.data;
        
        if (result && result.backtest) {
            // Save to Database
            const history = new BacktestHistory({
                symbol: symbol || 'AAPL',
                user: req.user._id,
                strategy: strategy,
                params: params,
                initialCapital: result.backtest.initial_capital,
                finalBalance: result.backtest.final_balance,
                roi: result.backtest.roi,
                totalTrades: result.backtest.total_trades,
                winRate: result.backtest.win_rate,
                equityCurve: result.backtest.equity_curve.map(p => p.equity) // Store just equity values
            });
            
            await history.save();
            
            // Return BOTH the full result (for UI) AND the saved history
            res.json({
                ...result,
                savedRecord: history
            });
        } else {
            res.json(result);
        }

    } catch (error) {
        console.error('Backtest Error:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const getBacktestHistory = async (req, res) => {
    try {
        // Fetch last 10 records, newest first
        const history = await BacktestHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        console.error('Fetch History Error:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
