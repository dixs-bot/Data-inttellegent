from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import datetime as dt_module
from sqlmodel import SQLModel, Field, Column, JSON

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Agent(SQLModel, table=True):
    __tablename__ = "agents"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    role: str
    description: str
    status: str = Field(default="idle") # idle, running, paused, error
    last_active: Optional[datetime] = Field(default_factory=utc_now)
    memory_count: int = Field(default=0)
    config: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    agent_id: Optional[int] = Field(default=None, foreign_key="agents.id")
    status: str = Field(default="pending", index=True) # pending, in_progress, completed, failed, paused
    priority: int = Field(default=1) # 1 normal, 2 high, 3 critical
    input_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    result: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

class TaskEvent(SQLModel, table=True):
    __tablename__ = "task_events"
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="tasks.id", index=True)
    agent_name: str
    event_type: str # started, step_completed, failed, vetoed, finished
    message: str
    payload: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=utc_now)

class MarketSource(SQLModel, table=True):
    __tablename__ = "market_sources"
    id: Optional[int] = Field(default=None, primary_key=True)
    exchange: str = Field(default="binance")
    symbol: str = Field(default="BTC/USDT")
    timeframe: str = Field(default="1m")
    is_active: bool = Field(default=True)
    last_fetched_at: Optional[datetime] = None
    total_candles: int = Field(default=0)
    fetch_latency_ms: float = Field(default=0.0)

class Candle(SQLModel, table=True):
    __tablename__ = "candles"
    id: Optional[int] = Field(default=None, primary_key=True)
    symbol: str = Field(index=True)
    timeframe: str = Field(default="1m", index=True)
    timestamp: int = Field(index=True) # unix ms
    candle_time: dt_module.datetime = Field(default_factory=utc_now, index=True)
    open: float
    high: float
    low: float
    close: float
    volume: float

class DataQualityCheck(SQLModel, table=True):
    __tablename__ = "data_quality_checks"
    id: Optional[int] = Field(default=None, primary_key=True)
    symbol: str
    timeframe: str
    checked_at: datetime = Field(default_factory=utc_now)
    total_records: int
    missing_gaps: int
    zero_volume_count: int
    outliers_detected: int
    status: str = Field(default="PASSED") # PASSED, WARNING, FAILED
    details: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

class Observation(SQLModel, table=True):
    __tablename__ = "observations"
    id: Optional[int] = Field(default=None, primary_key=True)
    symbol: str
    timeframe: str
    trend: str
    volatility: float
    rsi: float
    macd_signal: str
    key_levels: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=utc_now)

class MarketRegime(SQLModel, table=True):
    __tablename__ = "market_regimes"
    id: Optional[int] = Field(default=None, primary_key=True)
    symbol: str
    regime_type: str # Bullish Trend, Bearish Trend, Sideways/Chop, High Volatility Breakout
    confidence: float
    adx_level: float
    atr_ratio: float
    detected_at: datetime = Field(default_factory=utc_now)

class Hypothesis(SQLModel, table=True):
    __tablename__ = "hypotheses"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    premise: str
    assumptions: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    falsification_criteria: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    status: str = Field(default="active") # active, validated, invalidated, rejected
    created_by: str = Field(default="Strategy Discovery Agent")
    created_at: datetime = Field(default_factory=utc_now)

class Strategy(SQLModel, table=True):
    __tablename__ = "strategies"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    type: str # TrendFollowing, MeanReversion, MomentumBreakout
    description: str
    status: str = Field(default="active") # draft, active, retired
    active_version: str = Field(default="v1.0")
    created_at: datetime = Field(default_factory=utc_now)

class StrategyVersion(SQLModel, table=True):
    __tablename__ = "strategy_versions"
    id: Optional[int] = Field(default=None, primary_key=True)
    strategy_id: int = Field(foreign_key="strategies.id", index=True)
    version: str
    parameters: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    rules: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=utc_now)

class Experiment(SQLModel, table=True):
    __tablename__ = "experiments"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    strategy_id: int = Field(foreign_key="strategies.id")
    hypothesis_id: Optional[int] = Field(default=None, foreign_key="hypotheses.id")
    parameters_tested: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    status: str = Field(default="completed")
    created_at: datetime = Field(default_factory=utc_now)

class BacktestRun(SQLModel, table=True):
    __tablename__ = "backtest_runs"
    id: Optional[int] = Field(default=None, primary_key=True)
    strategy_id: int = Field(foreign_key="strategies.id", index=True)
    symbol: str = Field(default="BTC/USDT")
    timeframe: str = Field(default="1m")
    start_date: datetime
    end_date: datetime
    train_ratio: float = Field(default=0.6)
    val_ratio: float = Field(default=0.2)
    test_ratio: float = Field(default=0.2)
    status: str = Field(default="completed") # running, completed, failed
    execution_time_ms: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=utc_now)

class BacktestMetrics(SQLModel, table=True):
    __tablename__ = "backtest_metrics"
    id: Optional[int] = Field(default=None, primary_key=True)
    backtest_run_id: int = Field(foreign_key="backtest_runs.id", index=True)
    phase: str = Field(default="out_of_sample") # in_sample, validation, out_of_sample
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    sharpe_ratio: float
    max_drawdown: float
    profit_factor: float
    expectancy: float
    cagr: float
    metrics_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

class PaperTrade(SQLModel, table=True):
    __tablename__ = "paper_trades"
    id: Optional[int] = Field(default=None, primary_key=True)
    strategy_id: int = Field(foreign_key="strategies.id", index=True)
    symbol: str = Field(default="BTC/USDT")
    side: str # BUY, SELL
    order_type: str = Field(default="MARKET")
    entry_price: float
    exit_price: Optional[float] = None
    quantity: float
    stop_loss: float
    take_profit: float
    slippage_bps: float = Field(default=2.5)
    commission_bps: float = Field(default=5.0)
    pnl: Optional[float] = None
    pnl_percent: Optional[float] = None
    status: str = Field(default="OPEN") # OPEN, CLOSED, CANCELLED, VETOED
    entry_time: datetime = Field(default_factory=utc_now)
    exit_time: Optional[datetime] = None

class RiskEvent(SQLModel, table=True):
    __tablename__ = "risk_events"
    id: Optional[int] = Field(default=None, primary_key=True)
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    gate_name: str # DrawdownLimit, VolatilityCircuitBreaker, ExposureGate, VetoGate
    message: str
    action_taken: str # VETO_TRADE, LIQUIDATE_PAPER, PAUSE_SYSTEM, ALERT
    metadata_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=utc_now)

class ResearchReport(SQLModel, table=True):
    __tablename__ = "research_reports"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    author_agent: str
    summary: str
    key_findings: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    recommendations: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=utc_now)

class AgentMemory(SQLModel, table=True):
    __tablename__ = "agent_memory"
    id: Optional[int] = Field(default=None, primary_key=True)
    agent_name: str = Field(index=True)
    memory_type: str # episodic, semantic, reflection, veto_rule
    content: str
    metadata_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    importance: float = Field(default=0.8)
    created_at: datetime = Field(default_factory=utc_now)

class SystemSettings(SQLModel, table=True):
    __tablename__ = "system_settings"
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(unique=True, index=True)
    value: str
    description: str
    updated_at: datetime = Field(default_factory=utc_now)

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    id: Optional[int] = Field(default=None, primary_key=True)
    actor: str # Agent or User or System
    action: str
    target: str
    details: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    status: str = Field(default="SUCCESS")
    timestamp: datetime = Field(default_factory=utc_now)
