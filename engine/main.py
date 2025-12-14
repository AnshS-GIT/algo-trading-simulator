import sys
import json
import yfinance as yf
import pandas as pd
import pandas_ta as ta

def fetch_data(symbol, period='1y', interval='1d'):
    try:
        data = yf.download(symbol, period=period, interval=interval, progress=False)
        if data.empty:
            raise ValueError("No data found for symbol")
        return data
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

def strategy_sma_ema(data, type='SMA', short_window=50, long_window=200):
    df = data.copy()
    if type == 'SMA':
        df['Short'] = ta.sma(df['Close'], length=short_window)
        df['Long'] = ta.sma(df['Close'], length=long_window)
    else:
        df['Short'] = ta.ema(df['Close'], length=short_window)
        df['Long'] = ta.ema(df['Close'], length=long_window)
    
    df['Signal'] = 0
    df.loc[df['Short'] > df['Long'], 'Signal'] = 1 # Buy
    df.loc[df['Short'] < df['Long'], 'Signal'] = -1 # Sell
    return df

def strategy_rsi(data, period=14, overbought=70, oversold=30):
    df = data.copy()
    df['RSI'] = ta.rsi(df['Close'], length=period)
    
    df['Signal'] = 0
    df.loc[df['RSI'] < oversold, 'Signal'] = 1 # Buy
    df.loc[df['RSI'] > overbought, 'Signal'] = -1 # Sell
    return df

def strategy_volatility_breakout(data, window=20, num_std_dev=2):
    df = data.copy()
    # Bollinger Bands
    bb = ta.bbands(df['Close'], length=window, std=num_std_dev)
    # Check if bb is None or missing columns. keep it simple.
    # col names: BBL, BBM, BBU
    # But pandas_ta naming might vary based on version/params. 
    # Usually: BBL_20_2.0, BBU_20_2.0
    
    # Let's dynamically find the Upper/Lower columns if needed or just use standard calculation for robustness
    mean = df['Close'].rolling(window).mean()
    std = df['Close'].rolling(window).std()
    df['Upper'] = mean + (std * num_std_dev)
    df['Lower'] = mean - (std * num_std_dev)

    df['Signal'] = 0
    df.loc[df['Close'] > df['Upper'], 'Signal'] = 1 # Buy Breakout
    df.loc[df['Close'] < df['Lower'], 'Signal'] = -1 # Sell Breakdown
    return df

def run_backtest(df):
    initial_balance = 10000
    balance = initial_balance
    position = 0 # 0: none, >0: shares held
    
    trades = []
    
    # Iterate through signals
    # Simple logic: Buy ALL in if signal 1 and no position. Sell ALL if signal -1 and have position.
    
    for index, row in df.iterrows():
        price = row['Close']
        signal = row['Signal']
        
        if signal == 1 and position == 0:
            position = balance / price
            balance = 0
            trades.append({'type': 'BUY', 'price': float(price), 'date': str(index)})
        elif signal == -1 and position > 0:
            balance = position * price
            position = 0
            trades.append({'type': 'SELL', 'price': float(price), 'date': str(index)})

    # Final value
    final_balance = balance + (position * df.iloc[-1]['Close'])
    roi = ((final_balance - initial_balance) / initial_balance) * 100
    
    return {
        'initial_balance': initial_balance,
        'final_balance': round(final_balance, 2),
        'roi': round(roi, 2),
        'trades': trades,
        # Convert index to string for JSON serialization
        'dates': [str(d) for d in df.index],
        'prices': df['Close'].tolist()
    }

def main():
    try:
        # Input: JSON string from stdin or arg
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No arguments provided"}))
            sys.exit(1)
            
        input_data = JSON.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
        # Wait, I used sys.argv in nodejs spawn. 
        # Correct usage: json.loads(sys.argv[1])
        input_data = json.loads(sys.argv[1])
        
        type = input_data.get('type', 'SMA')
        parameters = input_data.get('parameters', {})
        symbol = parameters.get('symbol', 'AAPL')
        
        # 1. Fetch Data
        data = fetch_data(symbol)
        
        # 2. Apply Strategy
        if type == 'SMA':
            processed_data = strategy_sma_ema(data, 'SMA', 
                                              int(parameters.get('shortWindow', 50)), 
                                              int(parameters.get('longWindow', 200)))
        elif type == 'EMA':
            processed_data = strategy_sma_ema(data, 'EMA',
                                              int(parameters.get('shortWindow', 50)), 
                                              int(parameters.get('longWindow', 200)))
        elif type == 'RSI':
            processed_data = strategy_rsi(data, 
                                          int(parameters.get('period', 14)),
                                          int(parameters.get('overbought', 70)),
                                          int(parameters.get('oversold', 30)))
        elif type == 'Volatility':
            processed_data = strategy_volatility_breakout(data,
                                                          int(parameters.get('window', 20)),
                                                          float(parameters.get('stdDev', 2)))
        else:
             print(json.dumps({"error": "Unknown strategy type"}))
             sys.exit(1)

        # 3. Run Backtest
        results = run_backtest(processed_data)
        
        # 4. Output JSON
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
