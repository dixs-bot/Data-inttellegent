import asyncio
import time
from datetime import datetime
from typing import Optional
from sqlmodel import Session

from backend.app.models.database import engine
from backend.app.agents.system import MultiAgentSystem

class AutonomousWorker:
    def __init__(self, interval_seconds: int = 15):
        self.interval_seconds = interval_seconds
        self.is_running = False
        self.is_paused = False
        self._task: Optional[asyncio.Task] = None
        self.cycle_count = 0
        self.last_run_time: Optional[datetime] = None
        self.last_error: Optional[str] = None

    async def _loop(self):
        while self.is_running:
            if not self.is_paused:
                try:
                    with Session(engine) as session:
                        mas = MultiAgentSystem(session)
                        mas.run_full_autonomous_cycle(symbol="BTC/USDT", timeframe="1m")
                    self.cycle_count += 1
                    self.last_run_time = datetime.utcnow()
                    self.last_error = None
                except Exception as e:
                    self.last_error = str(e)
            
            # bounded sleep
            await asyncio.sleep(self.interval_seconds)

    def start(self):
        if not self.is_running:
            self.is_running = True
            self.is_paused = False
            self._task = asyncio.create_task(self._loop())

    def pause(self):
        self.is_paused = True

    def resume(self):
        self.is_paused = False

    def stop(self):
        self.is_running = False
        if self._task and not self._task.done():
            self._task.cancel()

    def get_status(self):
        return {
            "is_running": self.is_running,
            "is_paused": self.is_paused,
            "cycle_count": self.cycle_count,
            "last_run_time": self.last_run_time.isoformat() if self.last_run_time else None,
            "last_error": self.last_error,
            "interval_seconds": self.interval_seconds
        }

worker_singleton = AutonomousWorker()
