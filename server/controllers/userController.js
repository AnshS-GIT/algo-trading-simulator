import User from '../models/User.js';
import BacktestHistory from '../models/BacktestHistory.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const backtests = await BacktestHistory.find({ user: req.user._id });
        
        const totalBacktests = backtests.length;
        
        // Calculate Avg ROI
        const avgROI = totalBacktests > 0 
            ? backtests.reduce((acc, curr) => acc + curr.roi, 0) / totalBacktests 
            : 0;

        // Find Best Strategy
        // Group by strategy first
        const strategyPerformance = {};
        backtests.forEach(test => {
            if (!strategyPerformance[test.strategy]) {
                strategyPerformance[test.strategy] = { totalRoi: 0, count: 0 };
            }
            strategyPerformance[test.strategy].totalRoi += test.roi;
            strategyPerformance[test.strategy].count += 1;
        });

        let bestStrategy = 'N/A';
        let maxAvgRoi = -Infinity;

        for (const [strategy, data] of Object.entries(strategyPerformance)) {
            const avg = data.totalRoi / data.count;
            if (avg > maxAvgRoi) {
                maxAvgRoi = avg;
                bestStrategy = strategy;
            }
        }
        
        if (totalBacktests === 0) {
            bestStrategy = 'None';
        }

        res.json({
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            totalBacktests,
            avgROI: parseFloat(avgROI.toFixed(2)),
            bestStrategy
        });

    } catch (error) {
        console.error('Profile Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
