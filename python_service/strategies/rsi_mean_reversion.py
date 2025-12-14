import pandas as pd
import pandas_ta as ta

def required_parameters():
    return {
        "period": "int",
        "oversold": "int",
        "overbought": "int"
    }

def generate_signals(df, params):
    """
    Generate BUY/SELL signals based on RSI Mean Reversion.
    """
    period = int(params.get("period", 14))
    oversold = int(params.get("oversold", 30))
    overbought = int(params.get("overbought", 70))
    
    if len(df) < period:
        return []

    # Calculate RSI using pandas_ta
    # We copy the series to avoid SettingWithCopy warnings on the original df if it's a view
    # But since we are inside a function and df is usually passed by reference, we can just assign to a new col
    # or use ta.rsi() which returns a Series
    
    try:
        rsi_series = ta.rsi(df['close'], length=period)
    except Exception as e:
        # Fallback if pandas_ta has issues or df is weird
        return []

    if rsi_series is None:
        return []

    signals = []
    
    # Iterate
    for i in range(period, len(df)):
        rsi_val = rsi_series.iloc[i]
        
        # Check if NaN
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
