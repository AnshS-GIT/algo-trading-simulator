from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
from engine.strategy_runner import run_strategy

app = FastAPI()

class StrategyRequest(BaseModel):
    symbol: str
    strategy: str # sma_crossover, rsi_mean_reversion, etc
    params: Dict[str, Any]
    data: List[Dict[str, Any]] # List of {timestamp, open, high, low, close, volume}

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Algo Trading Strategy Engine"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/run-strategy")
@app.post("/run-backtest")
def execute_strategy(request: StrategyRequest):
    try:
        # Convert input list of dicts to DataFrame
        df = pd.DataFrame(request.data)
        if df.empty:
            raise HTTPException(status_code=400, detail="Empty data provided")
        
        # Ensure correct types and index
        # Assuming input has 'timestamp' or index is just 0..N
        if 'timestamp' in df.columns:
            df['index'] = pd.to_datetime(df['timestamp'], unit='s') if df['timestamp'].dtype == 'int64' else pd.to_datetime(df['timestamp'])
            df.set_index('index', inplace=True)
            
        required_cols = ['open', 'high', 'low', 'close', 'volume']
        for col in required_cols:
            if col not in df.columns:
                # Try case insensitive mapping
                pass 
                
        # Run
        result = run_strategy(df, request.strategy, request.params)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
