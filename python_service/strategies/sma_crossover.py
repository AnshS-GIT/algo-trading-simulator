import pandas as pd

def required_parameters():
    return {
        "short_window": "int",
        "long_window": "int"
    }

def generate_signals(df, params):
    """
    Generate BUY/SELL signals based on SMA Crossover.
    """
    short_window = int(params.get("short_window", 20))
    long_window = int(params.get("long_window", 50))
    
    if len(df) < long_window:
        return []

    # Calculate SMAs
    df['SMA_Short'] = df['close'].rolling(window=short_window).mean()
    df['SMA_Long'] = df['close'].rolling(window=long_window).mean()
    
    signals = []
    
    # Iterate to find crossovers
    # Start from long_window index to ensure we have data
    for i in range(long_window, len(df)):
        # Current and Previous values
        curr_short = df['SMA_Short'].iloc[i]
        curr_long = df['SMA_Long'].iloc[i]
        prev_short = df['SMA_Short'].iloc[i-1]
        prev_long = df['SMA_Long'].iloc[i-1]
        
        # Check for Golden Cross (BUY)
        # Short crosses above Long
        if prev_short <= prev_long and curr_short > curr_long:
            signals.append({
                "index": i,
                "signal": "BUY",
                "price": df['close'].iloc[i],
                "reason": f"SMA {short_window} crossed above SMA {long_window}"
            })
            
        # Check for Death Cross (SELL)
        # Short crosses below Long
        elif prev_short >= prev_long and curr_short < curr_long:
            signals.append({
                "index": i,
                "signal": "SELL",
                "price": df['close'].iloc[i],
                "reason": f"SMA {short_window} crossed below SMA {long_window}"
            })
            
    return signals
