from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List, Dict, Any

from backend.app.models.database import init_db, get_session
from backend.app.models.entities import (
    Agent, Task, TaskEvent, Candle, Observation, MarketRegime,
    Hypothesis, Strategy, BacktestRun, BacktestMetrics, PaperTrade,
    RiskEvent, ResearchReport, AgentMemory, SystemSettings, AuditLog,
    DataQualityCheck, MarketSource
)
from backend.app.services.worker import worker_singleton
from backend.app.agents.system import MultiAgentSystem

app = FastAPI(
    title="Autonomous AI Trading Intelligence System",
    description="Institutional-grade autonomous quantitative intelligence and multi-agent execution pipeline",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    # Populate initial agent metadata
    with next(get_session()) as session:
        MultiAgentSystem(session)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Autonomous AI Trading Intelligence System",
        "version": "1.0.0",
        "environment": "production"
    }

# Worker Endpoints
@app.post("/api/worker/start")
def start_worker():
    worker_singleton.start()
    return {"message": "Worker started", "status": worker_singleton.get_status()}

@app.post("/api/worker/pause")
def pause_worker():
    worker_singleton.pause()
    return {"message": "Worker paused", "status": worker_singleton.get_status()}

@app.post("/api/worker/resume")
def resume_worker():
    worker_singleton.resume()
    return {"message": "Worker resumed", "status": worker_singleton.get_status()}

@app.post("/api/worker/stop")
def stop_worker():
    worker_singleton.stop()
    return {"message": "Worker stopped", "status": worker_singleton.get_status()}

@app.get("/api/worker/status")
def get_worker_status():
    return worker_singleton.get_status()

@app.post("/api/worker/run-cycle")
def run_single_cycle(session: Session = Depends(get_session)):
    mas = MultiAgentSystem(session)
    result = mas.run_full_autonomous_cycle()
    return {"message": "Cycle executed successfully", "result": result}

# Data Endpoints
@app.get("/api/agents", response_model=List[Agent])
def list_agents(session: Session = Depends(get_session)):
    return session.exec(select(Agent)).all()

@app.get("/api/tasks", response_model=List[Task])
def list_tasks(limit: int = 50, session: Session = Depends(get_session)):
    return session.exec(select(Task).order_by(Task.created_at.desc()).limit(limit)).all()

@app.get("/api/task-events", response_model=List[TaskEvent])
def list_task_events(limit: int = 100, session: Session = Depends(get_session)):
    return session.exec(select(TaskEvent).order_by(TaskEvent.timestamp.desc()).limit(limit)).all()

@app.get("/api/candles")
def get_candles(limit: int = 100, session: Session = Depends(get_session)):
    candles = session.exec(select(Candle).order_by(Candle.timestamp.desc()).limit(limit)).all()
    return list(reversed(candles))

@app.get("/api/observations", response_model=List[Observation])
def get_observations(limit: int = 20, session: Session = Depends(get_session)):
    return session.exec(select(Observation).order_by(Observation.timestamp.desc()).limit(limit)).all()

@app.get("/api/regimes", response_model=List[MarketRegime])
def get_regimes(limit: int = 10, session: Session = Depends(get_session)):
    return session.exec(select(MarketRegime).order_by(MarketRegime.detected_at.desc()).limit(limit)).all()

@app.get("/api/hypotheses", response_model=List[Hypothesis])
def get_hypotheses(session: Session = Depends(get_session)):
    return session.exec(select(Hypothesis).order_by(Hypothesis.created_at.desc())).all()

@app.get("/api/strategies", response_model=List[Strategy])
def get_strategies(session: Session = Depends(get_session)):
    return session.exec(select(Strategy)).all()

@app.get("/api/backtests", response_model=List[BacktestRun])
def get_backtests(session: Session = Depends(get_session)):
    return session.exec(select(BacktestRun).order_by(BacktestRun.created_at.desc())).all()

@app.get("/api/backtest-metrics", response_model=List[BacktestMetrics])
def get_backtest_metrics(session: Session = Depends(get_session)):
    return session.exec(select(BacktestMetrics).order_by(BacktestMetrics.id.desc())).all()

@app.get("/api/paper-trades", response_model=List[PaperTrade])
def get_paper_trades(session: Session = Depends(get_session)):
    return session.exec(select(PaperTrade).order_by(PaperTrade.entry_time.desc())).all()

@app.get("/api/risk-events", response_model=List[RiskEvent])
def get_risk_events(session: Session = Depends(get_session)):
    return session.exec(select(RiskEvent).order_by(RiskEvent.timestamp.desc())).all()

@app.get("/api/reports", response_model=List[ResearchReport])
def get_reports(session: Session = Depends(get_session)):
    return session.exec(select(ResearchReport).order_by(ResearchReport.created_at.desc())).all()

@app.get("/api/agent-memory", response_model=List[AgentMemory])
def get_agent_memory(session: Session = Depends(get_session)):
    return session.exec(select(AgentMemory).order_by(AgentMemory.created_at.desc())).all()

@app.get("/api/data-quality", response_model=List[DataQualityCheck])
def get_data_quality(session: Session = Depends(get_session)):
    return session.exec(select(DataQualityCheck).order_by(DataQualityCheck.checked_at.desc())).all()

@app.get("/api/audit-logs", response_model=List[AuditLog])
def get_audit_logs(session: Session = Depends(get_session)):
    return session.exec(select(AuditLog).order_by(AuditLog.timestamp.desc())).all()
