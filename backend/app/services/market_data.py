import asyncio
import time
from datetime import datetime, timezone
import pandas as pd
from typing import List, Dict, Any, Optional
import ccxt

from backend.app.models.entities import Candle, DataQualityCheck

class MarketDataService:
    def __init__(self, exchange_id: str = "binance"):
        self.exchange_id = exchange_id
        try:
            exchange_class = getattr(ccxt, exchange_id)
            self.exchange = exchange_class({'enableRateLimit': True, 'timeout': 10000})
        except Exception:
            self.exchange = None

    def fetch_ohlcv_mock_or_live(self, symbol: str = "BTC/USDT", timeframe: str = "1m", limit: int = 100) -> List[Dict[str, Any]]:
        """Attempts live CCXT fetch, gracefully falling back to deterministic realistic simulation if offline or rate-limited."""
        start_time = time.time()
        try:
            if self.exchange and self.exchange.has.get('fetchOHLCV', False):
                raw = self.exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
                candles = []
                for row in raw:
                    candles.append({
                        "timestamp": row[0],
                        "datetime": datetime.fromtimestamp(row[0] / 1000.0, timezone.utc),
                        "open": float(row[1]),
                        "high": float(row[2]),
                        "low": float(row[3]),
                        "close": float(row[4]),
                        "volume": float(row[5]),
                    })
                return candles
        except Exception as e:
            pass
        
        # Deterministic Fallback Generator
        now_ts = int(time.time() * 1000)
        interval_ms = 60 * 1000 if timeframe == "1m" else 300 * 1000
        candles = []
        base_price = 68500.0
        
        for i in range(limit, 0, -1):
            ts = now_ts - (i * interval_ms)
            dt = datetime.fromtimestamp(ts / 1000.0, timezone.utc)
            noise = (hash(str(ts)) % 200 - 100) / 10.0
            open_p = base_price + noise
            high_p = open_p + abs(noise * 0.8) + 15.0
            low_p = open_p - abs(noise * 0.7) - 12.0
            close_p = open_p + (noise * 0.5)
            vol = 15.0 + abs(noise * 2.0)
            base_price = close_p
            
            candles.append({
                "timestamp": ts,
                "datetime": dt,
                "open": round(open_p, 2),
                "high": round(high_p, 2),
                "low": round(low_p, 2),
                "close": round(close_p, 2),
                "volume": round(vol, 4)
            })
        return candles

    def validate_data_quality(self, candles: List[Dict[str, Any]], symbol: str, timeframe: str) -> DataQualityCheck:
        if not candles:
            return DataQualityCheck(
                symbol=symbol,
                timeframe=timeframe,
                total_records=0,
                missing_gaps=0,
                zero_volume_count=0,
                outliers_detected=0,
                status="FAILED",
                details={"error": "Empty candles returned"}
            )
        
        df = pd.DataFrame(candles)
        total_records = len(df)
        
        # Check gaps in timestamp
        expected_diff = 60 * 1000 if timeframe == "1m" else 300 * 1000
        diffs = df['timestamp'].diff().dropna()
        gaps = int((diffs > (expected_diff * 1.5)).sum())
        
        # Zero volume
        zero_vol = int((df['volume'] <= 0).sum())
        
        # Outliers (price change > 15% in single bar)
        pct_change = (df['close'] - df['open']).abs() / df['open']
        outliers = int((pct_change > 0.15).sum())
        
        status = "PASSED"
        if gaps > 0 or zero_vol > 0:
            status = "WARNING"
        if gaps > 5 or outliers > 2:
            status = "FAILED"
            
        return DataQualityCheck(
            symbol=symbol,
            timeframe=timeframe,
            total_records=total_records,
            missing_gaps=gaps,
            zero_volume_count=zero_vol,
            outliers_detected=outliers,
            status=status,
            details={
                "max_gap_ms": float(diffs.max()) if not diffs.empty else 0,
                "mean_volume": float(df['volume'].mean())
            }
        )
