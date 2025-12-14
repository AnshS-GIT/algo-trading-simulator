import pandas as pd

def required_parameters():
    return {
        "lookback": "int"
    }

def generate_signals(df, params):
    """
    Generate BUY/SELL signals based on Breakout Strategy.
    - BUY when close > max(high) of previous lookback periods
    - SELL when close < min(low) of previous lookback periods
    """
    lookback = int(params.get("lookback", 20))
    
    if len(df) <= lookback:
        return []

    # Calculate Rolling Max High and Min Low of the *previous* periods
    # Shift by 1 to exclude current candle from the range
    df['Rolling_Max'] = df['high'].shift(1).rolling(window=lookback).max()
    df['Rolling_Min'] = df['low'].shift(1).rolling(window=lookback).min()
    
    signals = []
    
    # Iterate
    # Start from lookback index
    for i in range(lookback, len(df)):
        # Check for NaN (due to shift and rolling)
        if pd.isna(df['Rolling_Max'].iloc[i]) or pd.isna(df['Rolling_Min'].iloc[i]):
            continue
            
        close_price = df['close'].iloc[i]
        upper_bound = df['Rolling_Max'].iloc[i]
        lower_bound = df['Rolling_Min'].iloc[i]
        
        # Breakout High (BUY)
        if close_price > upper_bound:
            signals.append({
                "index": i,
                "signal": "BUY",
                "price": close_price,
                "reason": "Breakout High"
            })
            
        # Breakout Low (SELL)
        elif close_price < lower_bound:
            signals.append({
                "index": i,
                "signal": "SELL",
                "price": close_price,
                "reason": "Breakout Low"
            })
            
    return signals
