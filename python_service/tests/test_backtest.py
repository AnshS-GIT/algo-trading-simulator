import pandas as pd
import numpy as np
import sys
import os

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from engine.strategy_runner import run_strategy

def generate_trend_data(n=200, start_price=100):
    """
    Generate data with a clear trend to ensure some trades happen for SMA.
    """
    prices = [start_price]
    for i in range(n-1):
        # Add some sine wave trend + noise
        trend = np.sin(i / 20) * 2 
        noise = np.random.uniform(-1, 1)
        change = trend + noise
        prices.append(max(1, prices[-1] + change))
        
    data = []
    base_time = pd.Timestamp.now()
    
    for i, p in enumerate(prices):
        high = p + np.random.uniform(0, 2)
        low = p - np.random.uniform(0, 2)
        open_p = p + np.random.uniform(-1, 1)
        
        # Sanitize
        high = max(high, open_p, p)
        low = min(low, open_p, p)
        
        data.append({
            "timestamp": (base_time + pd.Timedelta(minutes=i)).timestamp(),
            "open": round(open_p, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(p, 2),
            "volume": np.random.randint(100, 1000)
        })
    
    return pd.DataFrame(data)

def test_backtest_flow():
    print("Generating synthetic trend data...")
    df = generate_trend_data(n=300)
    print(f"Data generated: {len(df)} rows")
    print(f"Start Price: {df['close'].iloc[0]}, End Price: {df['close'].iloc[-1]}\n")
    
    # Run SMA Strategy (short=10, long=30)
    print("--- Running Backtest (SMA Strategy) ---")
    
    try:
        # run_strategy now returns the full backtest result inside 'backtest' key
        result = run_strategy(df, "sma", {"short_window": 10, "long_window": 30})
        
        bt = result['backtest']
        signals = result['signals']
        
        print(f"Signals Generated: {len(signals)}")
        print(f"Total Trades: {bt['total_trades']}")
        print(f"Initial Capital: ${bt['initial_capital']:,.2f}")
        print(f"Final Balance:   ${bt['final_balance']:,.2f}")
        print(f"Net Profit:      ${bt['net_profit']:,.2f}")
        print(f"ROI:             {bt['roi']:.2f}%")
        print(f"Win Rate:        {bt['win_rate']:.2f}%")
        
        if bt['equity_curve']:
            print(f"Equity Curve Points: {len(bt['equity_curve'])}")
            print(f"Final Equity: ${bt['equity_curve'][-1]['equity']:,.2f}")
        
    except Exception as e:
        print(f"Backtest Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_backtest_flow()
