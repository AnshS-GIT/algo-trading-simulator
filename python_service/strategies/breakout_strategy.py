import pandas as pd

def required_parameters():
    return {
        "lookback": 20
    }

def generate_signals(df, params):
    lookback = int(params.get("lookback", 20))
    
    # Calculate rolling High Max and Low Min excluding current row (strictly speaking, breakout of PREVIOUS high)
    # Typically breakout is: Close > Max(High of last N days)
    
    df['Rolling_Max'] = df['high'].shift(1).rolling(window=lookback).max()
    df['Rolling_Min'] = df['low'].shift(1).rolling(window=lookback).min()
    
    signals = []
    
    for i, row in df.iterrows():
        if pd.isna(row['Rolling_Max']):
            continue
            
        if row['close'] > row['Rolling_Max']:
            signals.append({
                "index": str(i), 
                "signal": "BUY", 
                "price": row['close'],
                "reason": "Breakout High"
            })
        elif row['close'] < row['Rolling_Min']:
            signals.append({
                "index": str(i), 
                "signal": "SELL", 
                "price": row['close'],
                "reason": "Breakout Low"
            })
            
    return signals
