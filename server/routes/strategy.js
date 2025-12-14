import express from 'express';
const router = express.Router();
import Strategy from '../models/Strategy.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all strategies for a user
router.get('/:userId', async (req, res) => {
    try {
        const strategies = await Strategy.find({ userId: req.params.userId });
        res.json(strategies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save a new strategy and Run Backtest
router.post('/', async (req, res) => {
    try {
        const { userId, name, type, parameters } = req.body;
        
        // 1. Save Strategy
        const strategy = await Strategy.create({ userId, name, type, parameters });

        // 2. Run Python Backtest
        const enginePath = path.join(__dirname, '../../engine/main.py');
        const pythonProcess = spawn('python3', [
            enginePath, 
            JSON.stringify({ type, parameters })
        ]);

        let resultData = '';
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Backtest failed' });
            }
            try {
                const backtestResult = JSON.parse(resultData);
                res.status(201).json({ strategy, backtestResult });
            } catch (e) {
                console.error("Failed to parse Python output:", resultData);
                res.status(500).json({ error: 'Invalid output from engine' });
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
