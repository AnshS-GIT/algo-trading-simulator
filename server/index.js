import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { startWebSocketServer } from './websocket/liveFeed.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import backtestRoutes from './routes/backtestRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

// Connect to Database
connectDB();

app.use('/auth', authRoutes);
app.use('/backtest', backtestRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Algo Trading Simulator API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
