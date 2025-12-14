import pandas as pd

class BacktestEngine:
    def __init__(self, initial_capital=100000):
        self.initial_capital = initial_capital
        self.cash = initial_capital
        self.position = 0
        self.trades = []
        self.equity_curve = []

    def run(self, df, signals):
        """
        Execute signals on the dataframe and track equity curve.
        """
        # Reset state
        self.cash = self.initial_capital
        self.position = 0
        self.trades = []
        self.equity_curve = []
        
        # Create a dict for faster signal lookup: index -> signal_obj
        # Assuming index is integer 0..N
        signal_map = {s['index']: s for s in signals}
        
        entry_price = 0
        entry_index = 0
        
        # Iterate through every candle in the dataframe
        # Assuming df has integer index or we iterate length
        for i in range(len(df)):
            price = df.iloc[i]['close']
            
            # 1. Process Signal if exists at this index
            if i in signal_map:
                sig = signal_map[i]
                
                # Use signal price if available, else close
                exec_price = sig.get('price', price)
                
                # BUY Logic
                if sig['signal'] == "BUY" and self.position == 0:
                    quantity = self.cash // exec_price
                    if quantity > 0:
                        self.position = quantity
                        self.cash -= quantity * exec_price
                        entry_price = exec_price
                        entry_index = i
                
                # SELL Logic
                elif sig['signal'] == "SELL" and self.position > 0:
                    exit_price = exec_price
                    revenue = self.position * exit_price
                    cost = self.position * entry_price
                    pnl = revenue - cost
                    pnl_pct = (pnl / cost) * 100 if cost > 0 else 0
                    
                    self.cash += revenue
                    
                    self.trades.append({
                        "entry_index": entry_index,
                        "exit_index": i,
                        "entry_price": entry_price,
                        "exit_price": exit_price,
                        "quantity": self.position,
                        "pnl": pnl,
                        "pnl_pct": pnl_pct
                    })
                    
                    self.position = 0
                    entry_price = 0

            # 2. Track Equity for this candle
            # Equity = Cash + (Position * Current Close)
            current_equity = self.cash + (self.position * price)
            
            # Store timestamp if available, else index
            timestamp = str(df.index[i]) if str(df.index[i]) != str(i) else i
                
            self.equity_curve.append({
                "index": i,
                "timestamp": timestamp,
                "equity": current_equity,
                "price": price
            })

    def get_results(self):
        """
        Return portfolio metrics including win/loss stats.
        """
        # Final Equity
        final_value = self.equity_curve[-1]['equity'] if self.equity_curve else self.initial_capital
        
        total_return = final_value - self.initial_capital
        return_pct = (total_return / self.initial_capital) * 100 if self.initial_capital > 0 else 0
        
        # Win/Loss Stats
        winning_trades = [t for t in self.trades if t['pnl'] > 0]
        losing_trades = [t for t in self.trades if t['pnl'] <= 0]
        
        win_rate = (len(winning_trades) / len(self.trades) * 100) if self.trades else 0
        
        return {
            "initial_capital": self.initial_capital,
            "final_balance": final_value,
            "net_profit": total_return,
            "roi": return_pct,
            "total_trades": len(self.trades),
            "winning_trades": len(winning_trades),
            "losing_trades": len(losing_trades),
            "win_rate": win_rate,
            "trades": self.trades,
            "equity_curve": self.equity_curve
        }
