import pandas as pd
import numpy as np

def required_parameters():
    return {
        "period": "int",
        "oversold": "int",
        "overbought": "int"
    }

def calculate_rsi(series, period=14):
    """
    Calculate RSI using Wilder's Smoothing method (Standard).
    """
    delta = series.diff()
    
    # Get gains (positive delta) and losses (negative delta)
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    
    # Calculate initial average gain/loss
    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()
    
    # Calculate smoothed averages (Wilder's Method)
    # The first value is the simple average, subsequent are smoothed
    # We can use ewm (Exponential Weighted Moving Average) with alpha=1/period to approximate Wilder's
    # Wilder's Smoothing is equivalent to EMA with alpha = 1/period
    
    avg_gain = gain.ewm(alpha=1/period, min_periods=period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1/period, min_periods=period, adjust=False).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi

def generate_signals(df, params):
    """
    Generate BUY/SELL signals based on RSI Mean Reversion.
    """
    period = int(params.get("period", 14))
    oversold = int(params.get("oversold", 30))
    overbought = int(params.get("overbought", 70))
    
    if len(df) < period:
        return []

    # Calculate RSI using pure pandas
    try:
        rsi_series = calculate_rsi(df['close'], period)
    except Exception as e:
        print(f"Error calculating RSI: {e}")
        return []

    if rsi_series is None:
        return []

    signals = []
    
    # Iterate
    # Start from period index
    for i in range(period, len(df)):
        rsi_val = rsi_series.iloc[i]
        
        # Check for NaN
        if pd.isna(rsi_val):
            continue
            
        price = df['close'].iloc[i]
        
        # MEAN REVERSION LOGIC:
        # Buy when RSI dips below oversold (indicating it's cheap)
        if rsi_val < oversold:
            signals.append({
                "index": i,
                "signal": "BUY",
                "price": price,
                "reason": f"RSI {rsi_val:.2f} < {oversold}"
            })
            
        # Sell when RSI goes above overbought
        elif rsi_val > overbought:
            signals.append({
                "index": i,
                "signal": "SELL",
                "price": price,
                "reason": f"RSI {rsi_val:.2f} > {overbought}"
            })
            
    return signals
