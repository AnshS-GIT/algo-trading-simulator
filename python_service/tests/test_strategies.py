import pandas as pd
import numpy as np
import sys
import os

# Add parent directory to path to allow importing from engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from engine.strategy_runner import run_strategy

def generate_random_ohlc(n=100, start_price=100):
    prices = [start_price]
    for _ in range(n-1):
        change = np.random.uniform(-2, 2)
        prices.append(max(1, prices[-1] + change))
        
    data = []
    base_time = pd.Timestamp.now()
    
    for i, p in enumerate(prices):
        # Create realistic-ish OHLC
        high = p + np.random.uniform(0, 1)
        low = p - np.random.uniform(0, 1)
        open_p = p + np.random.uniform(-0.5, 0.5)
        # Ensure Logic: Low <= Open/Close <= High
        high = max(high, open_p, p)
        low = min(low, open_p, p)
        
        data.append({
            "timestamp": (base_time + pd.Timedelta(minutes=i)).timestamp(),
            "open": open_p,
            "high": high,
            "low": low,
            "close": p,
            "volume": np.random.randint(100, 1000)
        })
    
    return pd.DataFrame(data)

def test_strategies():
    print("Generating random OHLC data...")
    df = generate_random_ohlc(n=200) # Enough data for lookbacks like 50
    print(f"Data generated: {len(df)} rows\n")
    
    strategies = [
        ("sma", {"short_window": 10, "long_window": 30}),
        ("rsi", {"period": 14, "oversold": 30, "overbought": 70}),
        ("breakout", {"lookback": 20})
    ]
    
    for name, params in strategies:
        print(f"--- Running Strategy: {name.upper()} ---")
        try:
            result = run_strategy(df.copy(), name, params)
            signals = result['signals']
            print(f"Signals found: {len(signals)}")
            for s in signals[:5]: # Print first 5
                print(f"  {s['signal']} at index {s['index']} (Price: {s['price']:.2f}): {s.get('reason', '')}")
            if len(signals) > 5:
                print("  ...")
        except Exception as e:
            print(f"FAILED: {e}")
        print("\n")

if __name__ == "__main__":
    test_strategies()
