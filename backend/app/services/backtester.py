import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple
from datetime import datetime
from backend.app.services.indicators import compute_all_indicators

class VectorizedBacktester:
    def __init__(self, initial_capital: float = 10000.0, commission_bps: float = 5.0, slippage_bps: float = 2.5):
        self.initial_capital = initial_capital
        self.commission_rate = commission_bps / 10000.0
        self.slippage_rate = slippage_bps / 10000.0

    def run_strategy_backtest(self, df: pd.DataFrame, strategy_type: str = "EMA_CROSS", params: Dict[str, Any] = None) -> Dict[str, Any]:
        params = params or {}
        df = compute_all_indicators(df)
        
        # Generate Signals
        # 1 = Long, -1 = Short / Exit, 0 = Flat
        signals = pd.Series(0, index=df.index)
        
        if strategy_type == "EMA_CROSS":
            fast = params.get("fast_ema", 9)
            slow = params.get("slow_ema", 21)
            ema_f = df['close'].ewm(span=fast, adjust=False).mean()
            ema_s = df['close'].ewm(span=slow, adjust=False).mean()
            signals = np.where(ema_f > ema_s, 1, 0)
            signals = pd.Series(signals, index=df.index)
            
        elif strategy_type == "RSI_MEAN_REVERSION":
            oversold = params.get("oversold", 30)
            overbought = params.get("overbought", 70)
            signals = np.where(df['rsi'] < oversold, 1, np.where(df['rsi'] > overbought, 0, np.nan))
            signals = pd.Series(signals, index=df.index).ffill().fillna(0)
            
        elif strategy_type == "BREAKOUT_VWAP":
            signals = np.where((df['close'] > df['vwap']) & (df['close'] > df['ema_9']), 1, 0)
            signals = pd.Series(signals, index=df.index)
            
        else:
            signals = np.where(df['close'] > df['ema_21'], 1, 0)
            signals = pd.Series(signals, index=df.index)

        # Positions and Returns
        positions = signals.shift(1).fillna(0) # enter next bar
        market_returns = df['close'].pct_change().fillna(0)
        
        # Incorporate friction when position changes
        trades = positions.diff().abs().fillna(0)
        friction = trades * (self.commission_rate + self.slippage_rate)
        
        strategy_returns = (positions * market_returns) - friction
        equity_curve = (1 + strategy_returns).cumprod() * self.initial_capital
        
        # Metrics calculation
        total_trades = int(trades.sum())
        trade_pnls = strategy_returns[positions != 0]
        wins = trade_pnls[trade_pnls > 0]
        losses = trade_pnls[trade_pnls < 0]
        
        win_count = len(wins)
        loss_count = len(losses)
        win_rate = float(win_count / (win_count + loss_count)) if (win_count + loss_count) > 0 else 0.0
        
        # Sharpe
        mean_ret = strategy_returns.mean()
        std_ret = strategy_returns.std()
        # annualized assuming 1m data (525600 mins/year)
        sharpe = float((mean_ret / (std_ret + 1e-9)) * np.sqrt(525600)) if std_ret > 0 else 0.0
        
        # Max Drawdown
        cum_max = equity_curve.cummax()
        drawdown = (equity_curve - cum_max) / cum_max
        max_drawdown = float(abs(drawdown.min()))
        
        # Profit Factor
        gross_profit = float(wins.sum()) if len(wins) > 0 else 0.0
        gross_loss = float(abs(losses.sum())) if len(losses) > 0 else 1e-9
        profit_factor = round(gross_profit / gross_loss, 2) if gross_loss > 0 else 1.0
        
        # Expectancy
        avg_win = float(wins.mean()) if len(wins) > 0 else 0.0
        avg_loss = float(abs(losses.mean())) if len(losses) > 0 else 0.0
        expectancy = float((win_rate * avg_win) - ((1 - win_rate) * avg_loss))
        
        final_equity = float(equity_curve.iloc[-1]) if not equity_curve.empty else self.initial_capital
        total_pnl = final_equity - self.initial_capital
        
        return {
            "strategy_type": strategy_type,
            "initial_capital": self.initial_capital,
            "final_equity": round(final_equity, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_percent": round((total_pnl / self.initial_capital) * 100.0, 2),
            "total_trades": total_trades,
            "win_rate": round(win_rate * 100.0, 2),
            "sharpe_ratio": round(sharpe, 2),
            "max_drawdown_percent": round(max_drawdown * 100.0, 2),
            "profit_factor": profit_factor,
            "expectancy": round(expectancy * 10000, 2), # in bps
            "equity_curve": equity_curve.tail(50).round(2).tolist()
        }

    def run_walk_forward_split(self, df: pd.DataFrame, strategy_type: str = "EMA_CROSS", 
                               train_ratio: float = 0.6, val_ratio: float = 0.2, test_ratio: float = 0.2) -> Dict[str, Any]:
        n = len(df)
        train_end = int(n * train_ratio)
        val_end = int(n * (train_ratio + val_ratio))
        
        df_train = df.iloc[:train_end]
        df_val = df.iloc[train_end:val_end]
        df_test = df.iloc[val_end:]
        
        in_sample = self.run_strategy_backtest(df_train, strategy_type)
        validation = self.run_strategy_backtest(df_val, strategy_type)
        out_of_sample = self.run_strategy_backtest(df_test, strategy_type)
        
        return {
            "in_sample": in_sample,
            "validation": validation,
            "out_of_sample": out_of_sample,
            "splits": {
                "train_bars": len(df_train),
                "val_bars": len(df_val),
                "test_bars": len(df_test)
            }
        }
