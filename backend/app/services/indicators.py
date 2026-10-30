import pandas as pd
import numpy as np
from typing import Dict, Any, List

def calculate_ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()

def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / (loss + 1e-9)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)

def calculate_macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, pd.Series]:
    ema_fast = calculate_ema(series, fast)
    ema_slow = calculate_ema(series, slow)
    macd_line = ema_fast - ema_slow
    signal_line = calculate_ema(macd_line, signal)
    histogram = macd_line - signal_line
    return {
        "macd": macd_line,
        "signal": signal_line,
        "histogram": histogram
    }

def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    high = df['high']
    low = df['low']
    close = df['close']
    prev_close = close.shift(1)
    
    tr1 = high - low
    tr2 = (high - prev_close).abs()
    tr3 = (low - prev_close).abs()
    
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean().fillna(tr.bfill())
    return atr

def calculate_vwap(df: pd.DataFrame) -> pd.Series:
    typical_price = (df['high'] + df['low'] + df['close']) / 3.0
    cum_vol_price = (typical_price * df['volume']).cumsum()
    cum_vol = df['volume'].cumsum()
    vwap = cum_vol_price / (cum_vol + 1e-9)
    return vwap.fillna(typical_price)

def detect_candle_patterns(df: pd.DataFrame) -> pd.Series:
    """Detects simple patterns: Bullish Engulfing, Bearish Engulfing, Hammer, Doji"""
    patterns = []
    for i in range(len(df)):
        if i == 0:
            patterns.append("None")
            continue
        curr_open = df['open'].iloc[i]
        curr_close = df['close'].iloc[i]
        curr_high = df['high'].iloc[i]
        curr_low = df['low'].iloc[i]
        prev_open = df['open'].iloc[i-1]
        prev_close = df['close'].iloc[i-1]
        
        body = abs(curr_close - curr_open)
        range_hl = curr_high - curr_low + 1e-9
        
        # Doji
        if body / range_hl < 0.1:
            patterns.append("Doji")
        # Bullish Engulfing
        elif prev_close < prev_open and curr_close > curr_open and curr_close > prev_open and curr_open < prev_close:
            patterns.append("Bullish Engulfing")
        # Bearish Engulfing
        elif prev_close > prev_open and curr_close < curr_open and curr_close < prev_open and curr_open > prev_close:
            patterns.append("Bearish Engulfing")
        # Hammer
        elif (curr_close > curr_open) and ((curr_open - curr_low) > 2 * body) and ((curr_high - curr_close) < 0.2 * body):
            patterns.append("Hammer")
        else:
            patterns.append("Normal")
    return pd.Series(patterns, index=df.index)

def compute_all_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df['ema_9'] = calculate_ema(df['close'], 9)
    df['ema_21'] = calculate_ema(df['close'], 21)
    df['ema_50'] = calculate_ema(df['close'], 50)
    df['rsi'] = calculate_rsi(df['close'], 14)
    
    macd_res = calculate_macd(df['close'])
    df['macd'] = macd_res['macd']
    df['macd_signal'] = macd_res['signal']
    df['macd_hist'] = macd_res['histogram']
    
    df['atr'] = calculate_atr(df, 14)
    df['vwap'] = calculate_vwap(df)
    df['candle_pattern'] = detect_candle_patterns(df)
    return df
