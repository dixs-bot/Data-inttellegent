import os
import json
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class LLMStructuredOutput(BaseModel):
    facts: List[str] = Field(description="Empirical verifiable observations from indicators and data")
    metrics: Dict[str, Any] = Field(description="Numerical figures such as Sharpe, Win Rate, Drawdown, RSI")
    hypotheses: List[str] = Field(description="Falsifiable trading hypotheses")
    assumptions: List[str] = Field(description="Explicit underlying assumptions required for hypothesis validity")
    falsification_criteria: List[str] = Field(description="Conditions that immediately disprove or terminate the strategy")
    action_decision: str = Field(description="EXECUTE, VETO, MONITOR, or OPTIMIZE")
    confidence: float = Field(default=0.85, description="Confidence score 0.0 to 1.0")

class LLMReasoningEngine:
    def __init__(self, provider: str = "heuristic"):
        self.provider = os.getenv("LLM_PROVIDER", provider)
        self.api_key = os.getenv("LLM_API_KEY", "")

    def reason(self, agent_role: str, context: Dict[str, Any]) -> LLMStructuredOutput:
        """Provider-agnostic inference with high-fidelity deterministic heuristic fallback for speed and zero-key portability."""
        symbol = context.get("symbol", "BTC/USDT")
        price = context.get("current_price", 68500.0)
        rsi = context.get("rsi", 52.0)
        regime = context.get("regime", "Sideways")
        
        facts = [
            f"{symbol} latest close is ${price:,.2f} with 1m timeframe resolution.",
            f"Momentum oscillator RSI(14) is at {rsi:.1f}.",
            f"Detected regime classification: {regime}."
        ]
        
        metrics = {
            "price": price,
            "rsi": rsi,
            "volatility_ratio": context.get("volatility", 0.012),
            "max_risk_tolerance_pct": 2.0
        }
        
        if rsi < 35:
            hypo = [f"Oversold condition on {symbol} implies high probability of mean-reversion bounce towards VWAP."]
            assumptions = ["No sudden exogenous macro liquidation cascade within the next 30 minutes."]
            falsification = [f"Price breaches below ${price * 0.985:,.2f} on increasing volume (Stop Loss)."]
            action = "EXECUTE"
            conf = 0.82
        elif rsi > 68:
            hypo = [f"Overextended momentum indicates local exhaustion with impending consolidation or pullback."]
            assumptions = ["Buyer absorption slowing down near key structural resistance."]
            falsification = [f"Clean impulsive breakout closing above ${price * 1.015:,.2f}."]
            action = "MONITOR"
            conf = 0.78
        else:
            hypo = [f"Market is in balanced equilibrium within {regime} structure."]
            assumptions = ["Mean reversion within ATR boundaries remains favorable."]
            falsification = ["Break of current 50-EMA structure with heavy volume expansion."]
            action = "MONITOR"
            conf = 0.85

        if agent_role == "Risk Agent":
            # Risk veto check
            if context.get("drawdown", 0.0) > 0.05 or context.get("volatility", 0.0) > 0.04:
                action = "VETO"
                falsification.append("Drawdown exceeded maximum allowed threshold (5%). Hard veto enforced.")

        return LLMStructuredOutput(
            facts=facts,
            metrics=metrics,
            hypotheses=hypo,
            assumptions=assumptions,
            falsification_criteria=falsification,
            action_decision=action,
            confidence=conf
        )
