export interface AgentData {
  id: number;
  name: string;
  role: string;
  description: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  last_active: string;
  memory_count: number;
}

export interface CandleData {
  timestamp: number;
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TaskEventData {
  id: number;
  task_id: number;
  agent_name: string;
  event_type: string;
  message: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface BacktestRunData {
  id: number;
  strategy_id: number;
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  status: string;
  execution_time_ms: number;
  created_at: string;
}

export interface BacktestMetricsData {
  id: number;
  backtest_run_id: number;
  phase: string;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  sharpe_ratio: number;
  max_drawdown: number;
  profit_factor: number;
  expectancy: number;
  cagr: number;
  metrics_json?: {
    equity_curve?: number[];
    [key: string]: any;
  };
}

export interface PaperTradeData {
  id: number;
  strategy_id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  order_type: string;
  entry_price: number;
  exit_price?: number;
  quantity: number;
  stop_loss: number;
  take_profit: number;
  status: string;
  entry_time: string;
}

export interface RiskEventData {
  id: number;
  severity: string;
  gate_name: string;
  message: string;
  action_taken: string;
  timestamp: string;
}

export interface HypothesisData {
  id: number;
  title: string;
  premise: string;
  assumptions: string[];
  falsification_criteria: string[];
  status: string;
  created_at: string;
}

export interface ResearchReportData {
  id: number;
  title: string;
  author_agent: string;
  summary: string;
  key_findings: string[];
  recommendations: string[];
  created_at: string;
}

export interface AgentMemoryData {
  id: number;
  agent_name: string;
  memory_type: string;
  content: string;
  importance: number;
  created_at: string;
}

export interface DataQualityData {
  id: number;
  symbol: string;
  timeframe: string;
  checked_at: string;
  total_records: number;
  missing_gaps: number;
  zero_volume_count: number;
  outliers_detected: number;
  status: string;
}

export interface AuditLogData {
  id: number;
  actor: string;
  action: string;
  target: string;
  status: string;
  timestamp: string;
}
