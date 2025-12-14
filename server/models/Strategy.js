import mongoose from 'mongoose';

const strategySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['SMA', 'EMA', 'RSI'], required: true },
    parameters: { type: Object, required: true }, // e.g., { period: 14, shortWindow: 50, longWindow: 200 }
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Strategy', strategySchema);
