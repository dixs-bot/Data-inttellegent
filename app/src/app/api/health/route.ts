import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Autonomous AI Trading Intelligence System",
    version: "1.0.0",
    environment: "production",
    active_pair: "BTC/USDT",
    timeframe: "1m",
    research_only: true
  });
}
