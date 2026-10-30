import pytest
import pandas as pd
from sqlmodel import Session, create_engine, SQLModel
from backend.app.models.entities import Agent, Task, Hypothesis, Strategy, Candle
from backend.app.services.indicators import (
    calculate_ema, calculate_rsi, calculate_macd, calculate_atr, calculate_vwap, compute_all_indicators
)
from backend.app.services.market_data import MarketDataService
from backend.app.services.backtester import VectorizedBacktester
from backend.app.services.llm_engine import LLMReasoningEngine
from backend.app.agents.system import MultiAgentSystem

@pytest.fixture
def mock_df():
    data = []
    base = 68000.0
    for i in range(100):
        o = base + i * 5
        h = o + 20
        l = o - 15
        c = o + 10
        v = 25.0 + i
        data.append({"timestamp": 1700000000000 + i * 60000, "open": o, "high": h, "low": l, "close": c, "volume": v})
    return pd.DataFrame(data)

def test_indicators_calculation(mock_df):
    df_res = compute_all_indicators(mock_df)
    assert "ema_9" in df_res.columns
    assert "ema_21" in df_res.columns
    assert "rsi" in df_res.columns
    assert "macd" in df_res.columns
    assert "atr" in df_res.columns
    assert "vwap" in df_res.columns
    assert len(df_res) == 100
    assert not df_res['rsi'].isnull().all()

def test_market_data_fallback():
    service = MarketDataService()
    candles = service.fetch_ohlcv_mock_or_live(symbol="BTC/USDT", timeframe="1m", limit=50)
    assert len(candles) == 50
    assert "open" in candles[0]
    assert "close" in candles[0]
    
    dq = service.validate_data_quality(candles, "BTC/USDT", "1m")
    assert dq.status in ["PASSED", "WARNING"]
    assert dq.total_records == 50

def test_backtester_vectorized(mock_df):
    tester = VectorizedBacktester(initial_capital=10000.0)
    res = tester.run_strategy_backtest(mock_df, strategy_type="EMA_CROSS")
    assert "sharpe_ratio" in res
    assert "win_rate" in res
    assert "max_drawdown_percent" in res
    assert res["initial_capital"] == 10000.0

def test_llm_reasoning_engine():
    engine = LLMReasoningEngine()
    out = engine.reason("Strategy Discovery Agent", {"symbol": "BTC/USDT", "current_price": 68500.0, "rsi": 30.0, "regime": "Ranging"})
    assert len(out.facts) > 0
    assert len(out.hypotheses) > 0
    assert len(out.falsification_criteria) > 0
    assert out.confidence > 0.5

def test_multi_agent_system_cycle():
    test_engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(test_engine)
    with Session(test_engine) as session:
        system = MultiAgentSystem(session)
        result = system.run_full_autonomous_cycle(symbol="BTC/USDT", timeframe="1m")
        assert "symbol" in result
        assert result["symbol"] == "BTC/USDT"
        assert "backtest" in result
