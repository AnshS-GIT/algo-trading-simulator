import pandas as pd
import importlib
from engine.backtest_engine import BacktestEngine

STRATEGY_MAP = {
    "sma": "strategies.sma_crossover",
    "rsi": "strategies.rsi_mean_reversion",
    "breakout": "strategies.breakout"
}

def run_strategy(df: pd.DataFrame, strategy_name: str, params: dict):
    """
    Dynamically load and run a strategy, then execute backtest.
    
    Args:
        df (pd.DataFrame): OHLCV data
        strategy_name (str): 'sma', 'rsi', or 'breakout'
        params (dict): Strategy parameters
        
    Returns:
        dict: {
            "strategy": str,
            "signals": list,
            "data": list,
            "backtest": dict
        }
    """
    
    # 1. Resolve module name
    module_name = STRATEGY_MAP.get(strategy_name.lower())
    if not module_name:
        raise ValueError(f"Unknown strategy: {strategy_name}")
    
    try:
        # 2. Dynamic Import
        module = importlib.import_module(module_name)
        
        # 3. Validations
        if not hasattr(module, 'generate_signals'):
            raise ImportError(f"Module {module_name} missing generate_signals()")
            
        # 4. Run Strategy
        # Note: df is modified in-place by strategy to add indicators
        signals = module.generate_signals(df, params)
        
        # 5. Run Backtest
        engine = BacktestEngine(initial_capital=100000)
        engine.run(df, signals)
        backtest_results = engine.get_results()
        
        # 6. Prepare Return Data
        # Returns data with indicators included 
        # Note: NaN values will be handled by convert_to_python_type function below
        data_with_indicators = df.reset_index()
        
        # Convert index to string for JSON serialization
        if 'index' in data_with_indicators.columns:
             data_with_indicators['index'] = data_with_indicators['index'].astype(str)
        
        # Convert to dict and ensure all types are JSON-serializable
        # This removes numpy/pandas types that cause serialization issues
        import json
        import numpy as np
        
        def convert_to_python_type(val):
            if pd.isna(val):
                return None
            if isinstance(val, (np.integer, np.floating)):
                return float(val) if isinstance(val, np.floating) else int(val)
            return val
        
        data_records = data_with_indicators.to_dict(orient='records')
        # Clean the data
        cleaned_data = []
        for record in data_records:
            cleaned_data.append({k: convert_to_python_type(v) for k, v in record.items()})
        
        # Clean signals
        cleaned_signals = []
        for sig in signals:
            cleaned_signals.append({k: convert_to_python_type(v) for k, v in sig.items()})
        
        # Clean backtest results
        def clean_dict(d):
            if isinstance(d, dict):
                return {k: clean_dict(v) for k, v in d.items()}
            elif isinstance(d, list):
                return [clean_dict(item) for item in d]
            else:
                return convert_to_python_type(d)
        
        cleaned_backtest = clean_dict(backtest_results)
        
        return {
            "strategy": strategy_name,
            "signals": cleaned_signals,
            "data": cleaned_data,
            "backtest": cleaned_backtest
        }
        
    except ImportError as e:
        raise ImportError(f"Failed to import strategy {strategy_name}: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Error running strategy {strategy_name}: {str(e)}")
