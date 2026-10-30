import { NextResponse } from 'next/server';
import { 
  INITIAL_AGENTS, INITIAL_CANDLES, INITIAL_EVENTS, INITIAL_METRICS,
  INITIAL_TRADES, INITIAL_HYPOTHESES, INITIAL_RISK_EVENTS, INITIAL_REPORTS,
  INITIAL_MEMORY, INITIAL_DATA_QUALITY, INITIAL_AUDIT_LOGS
} from '@/mockData';

export async function GET() {
  return NextResponse.json({
    agents: INITIAL_AGENTS,
    candles: INITIAL_CANDLES,
    events: INITIAL_EVENTS,
    metrics: INITIAL_METRICS,
    trades: INITIAL_TRADES,
    hypotheses: INITIAL_HYPOTHESES,
    risk_events: INITIAL_RISK_EVENTS,
    reports: INITIAL_REPORTS,
    memory: INITIAL_MEMORY,
    data_quality: INITIAL_DATA_QUALITY,
    audit_logs: INITIAL_AUDIT_LOGS
  });
}
