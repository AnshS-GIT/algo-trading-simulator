import express from 'express';
import { runBacktest, getBacktestHistory } from '../controllers/backtestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// POST /backtest/run
router.post('/run', runBacktest);

// GET /backtest/history
router.get('/history', getBacktestHistory);

export default router;
