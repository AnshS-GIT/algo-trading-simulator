import mongoose from 'mongoose';

const backtestHistorySchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    strategy: {
        type: String,
        required: true
    },
    params: {
        type: Object,
        required: true
    },
    initialCapital: {
        type: Number,
        required: true
    },
    finalBalance: {
        type: Number,
        required: true
    },
    roi: {
        type: Number,
        required: true
    },
    totalTrades: {
        type: Number,
        required: true
    },
    winRate: {
        type: Number,
        required: true
    },
    equityCurve: {
        type: [Number], // Storing just the equity values for simplicity/size, or could be objects
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BacktestHistory = mongoose.model('BacktestHistory', backtestHistorySchema);

export default BacktestHistory;
