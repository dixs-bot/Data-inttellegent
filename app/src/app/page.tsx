"use client";

import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, Cpu, FlaskConical, BookOpen, 
  BarChart3, RefreshCw, AlertTriangle, FileText, Database, 
  ListOrdered, Layers, Settings, History, Play, Pause, 
  Square, CheckCircle2, TrendingUp, DollarSign, Clock, ArrowUpRight
} from 'lucide-react';

import {
  INITIAL_AGENTS, INITIAL_CANDLES, INITIAL_EVENTS, INITIAL_METRICS,
  INITIAL_TRADES, INITIAL_HYPOTHESES, INITIAL_RISK_EVENTS, INITIAL_REPORTS,
  INITIAL_MEMORY, INITIAL_DATA_QUALITY, INITIAL_AUDIT_LOGS
} from '@/mockData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [workerRunning, setWorkerRunning] = useState<boolean>(true);
  const [workerPaused, setWorkerPaused] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(42);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [candles] = useState(INITIAL_CANDLES);
  const [trades] = useState(INITIAL_TRADES);
  const [metrics] = useState(INITIAL_METRICS);

  const triggerCycle = () => {
    setCycleCount(prev => prev + 1);
    const newEvent = {
      id: Date.now(),
      task_id: 100 + cycleCount + 1,
      agent_name: "Agen Koordinator Utama",
      event_type: "started",
      message: `Manual trigger: Executing full multi-agent scan cycle #${cycleCount + 1}`,
      payload: {},
      timestamp: new Date().toLocaleTimeString()
    };
    setEvents([newEvent, ...events]);
  };

  const navItems = [
    { id: "overview", label: "Ringkasan", icon: Activity },
    { id: "market", label: "Pantauan Pasar Langsung", icon: TrendingUp },
    { id: "agents", label: "Pusat Kendali Multi-Agen", icon: Cpu },
    { id: "research", label: "Laboratorium Riset", icon: FlaskConical },
    { id: "strategies", label: "Pustaka Strategi", icon: BookOpen },
    { id: "backtests", label: "Laboratorium Backtest", icon: BarChart3 },
    { id: "papertrade", label: "Trading Simulasi", icon: DollarSign },
    { id: "risk", label: "Pusat Risiko", icon: AlertTriangle },
    { id: "reports", label: "Laporan", icon: FileText },
    { id: "memory", label: "Memori Agen", icon: Database },
    { id: "tasks", label: "Antrean Tugas", icon: ListOrdered },
    { id: "sources", label: "Sumber Data", icon: Layers },
    { id: "settings", label: "Pengaturan", icon: Settings },
    { id: "audit", label: "Log Audit", icon: History },
  ];

  const currentPrice = candles[candles.length - 1]?.close || 68750;

  return (
    <div className="flex h-screen bg-[#f5f7fb] text-slate-800 overflow-hidden font-sans">
      {/* Navigasi Samping */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Research Badge */}
          <div className="p-4 border-b border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-500 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-cyan-500/20">
                AI
              </div>
              <div>
                <span className="font-bold tracking-tight text-slate-900 block text-sm">AATIS TRADING</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">SISTEM OTONOM</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>KHUSUS RISET</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? "bg-cyan-500/15 text-cyan-700 border border-cyan-500/30 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-700" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Worker Controls in Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${workerRunning ? (workerPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping') : 'bg-rose-500'}`} />
              {workerRunning ? (workerPaused ? 'DIJEDA' : 'PROSES BERJALAN') : 'DIHENTIKAN'}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
              #{cycleCount}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <button 
              onClick={() => { setWorkerRunning(true); setWorkerPaused(false); }}
              title="Mulai / Lanjutkan Proses"
              className="flex items-center justify-center p-1.5 rounded bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30 text-xs border border-emerald-500/30"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setWorkerPaused(!workerPaused)}
              title="Jeda Proses"
              className="flex items-center justify-center p-1.5 rounded bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 text-xs border border-amber-500/30"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setWorkerRunning(false); setWorkerPaused(false); }}
              title="Hentikan Proses"
              className="flex items-center justify-center p-1.5 rounded bg-rose-500/20 text-rose-700 hover:bg-rose-500/30 text-xs border border-rose-500/30"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f5f7fb] overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-semibold text-slate-900 tracking-wide">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
              <span className="text-slate-500">ASET:</span>
              <span className="text-amber-700 font-bold">BTC/USDT</span>
              <span className="text-slate-500 ml-2">HARGA:</span>
              <span className="text-emerald-700 font-bold">${currentPrice.toLocaleString()}</span>
              <span className="text-xs text-emerald-700 flex items-center"><ArrowUpRight className="w-3 h-3" /> +1.42%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={triggerCycle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Jalankan Siklus Analisis</span>
            </button>
            <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              KETERLAMBATAN: 12ms
            </div>
          </div>
        </header>

        {/* Tab View Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top Key Metrics Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Sharpe di Luar Sampel</div>
                  <div className="text-2xl font-bold text-cyan-700 mt-1">{metrics.sharpe_ratio}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span className="text-emerald-700">Tervalidasi Walk-Forward</span> (v1.1)
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Tingkat Kemenangan (OOS)</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.win_rate}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {metrics.winning_trades} wins / {metrics.total_trades} total trades
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Penurunan Maksimum (Puncak ke Dasar)</div>
                  <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.max_drawdown}%</div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    Bounded by Risk Veto Gate (limit: 15.0%)
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Modal Simulasi</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">$10,840.00</div>
                  <div className="text-[11px] text-emerald-700 mt-1 font-mono">
                    +$840.00 (+8.40% net ROI)
                  </div>
                </div>
              </div>

              {/* Main Grid: Live Market + Agent Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mini Candlestick / Price Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">Pergerakan Harga BTC/USDT 1 Menit</h2>
                      <p className="text-xs text-slate-500">Indikator: EMA(9, 21), VWAP, RSI(14)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                      Kondisi Pasar: Momentum Naik
                    </span>
                  </div>

                  {/* SVG Candlestick Bars */}
                  <div className="h-64 w-full flex items-end gap-1.5 pt-4 pb-2 border-b border-slate-200 overflow-x-hidden">
                    {candles.slice(-30).map((c, i) => {
                      const isGreen = c.close >= c.open;
                      const minP = 68000;
                      const maxP = 69200;
                      const hPct = Math.max(10, Math.min(95, ((c.high - minP) / (maxP - minP)) * 100));
                      const lPct = Math.max(5, Math.min(90, ((c.low - minP) / (maxP - minP)) * 100));
                      const bodyBottom = Math.min(c.open, c.close);
                      const bodyTop = Math.max(c.open, c.close);
                      const bBotPct = Math.max(5, Math.min(90, ((bodyBottom - minP) / (maxP - minP)) * 100));
                      const bTopPct = Math.max(10, Math.min(95, ((bodyTop - minP) / (maxP - minP)) * 100));
                      const bodyHeight = Math.max(4, bTopPct - bBotPct);

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                          {/* Candle Wick */}
                          <div 
                            className={`w-0.5 absolute ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ bottom: `${lPct}%`, height: `${hPct - lPct}%` }}
                          />
                          {/* Candle Body */}
                          <div 
                            className={`w-full rounded-sm z-10 ${isGreen ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}
                            style={{ height: `${bodyHeight}%`, marginBottom: `${bBotPct}%` }}
                          />
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-white border border-slate-700 text-[10px] text-slate-900 px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                            ${c.close} | Volume: {c.volume}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-3 text-[11px] text-slate-500 font-mono">
                    <span>Terendah: $68,140</span>
                    <span>VWAP: $68,620</span>
                    <span>Tertinggi: $69,180</span>
                  </div>
                </div>

                {/* Live Multi-Agent Event Feed */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-700" />
                      Aktivitas Agen Langsung
                    </h2>
                    <span className="text-[10px] text-slate-500 font-mono">10 AGEN AKTIF</span>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72 pr-1">
                    {events.map((ev) => (
                      <div key={ev.id} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-cyan-700">{ev.agent_name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ev.timestamp}</span>
                        </div>
                        <p className="text-slate-700 text-[11px] leading-relaxed">{ev.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategy & Risk Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Strategy Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-slate-900">Strategi Aktif (Simulasi)</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-700 border border-cyan-500/30">
                      VERSI 1.1
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Nama Strategi:</span>
                      <span className="font-semibold text-slate-900">Momentum EMA & Keselarasan VWAP</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Jenis:</span>
                      <span className="text-slate-700">Mengikuti Tren Terukur</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Parameter Biaya Transaksi:</span>
                      <span className="font-mono text-slate-700">Komisi 5 bps | Selisih Eksekusi 2.5 bps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ekspektasi Hasil:</span>
                      <span className="text-emerald-700 font-bold font-mono">+{metrics.expectancy} bps per trade</span>
                    </div>
                  </div>
                </div>

                {/* Risk Gate Status Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-slate-900">Gerbang Pengaman Risiko Otomatis</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                      SEMUA PENGAMAN AKTIF
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">Pemutus Risiko Penurunan Maksimum (&lt; 15%)</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 4,82% LOLOS
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">Batas Posisi per Transaksi (&lt; 2% NAV)</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1,5% LOLOS
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">Pemeriksa Integritas Data (Celah/Anomali)</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 0 Celah, LOLOS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AGENTS CONTROL ROOM */}
          {activeTab === "agents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">10 Agen Kecerdasan Buatan</h2>
                  <p className="text-xs text-slate-500">Kolaborasi multi-agen dengan tugas khusus dan pengaman risiko wajib</p>
                </div>
                <div className="text-xs font-mono text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                  STATUS SISTEM: SEMUA AGEN AKTIF
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((ag) => (
                  <div key={ag.id} className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{ag.name}</h3>
                          <span className="text-xs text-cyan-700 font-mono">{ag.role}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${ag.status === 'running' ? 'bg-cyan-500/20 text-cyan-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                          {({ idle: "SIAGA", running: "BERJALAN", paused: "DIJEDA", error: "GALAT" } as Record<string, string>)[ag.status] || ag.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">{ag.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Jumlah Memori: {ag.memory_count}</span>
                      <span>Terakhir Aktif: {ag.last_active}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LIVE PASAR MONITOR */}
          {activeTab === "market" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">Data BTC/USDT dari CCXT Publik (Interval 1 Menit)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-500 font-mono bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Waktu</th>
                        <th className="p-2.5">Buka</th>
                        <th className="p-2.5">Tertinggi</th>
                        <th className="p-2.5">Terendah</th>
                        <th className="p-2.5">Penutupan</th>
                        <th className="p-2.5">Volume (BTC)</th>
                        <th className="p-2.5">Perubahan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {candles.slice(-15).reverse().map((c, i) => {
                        const chg = ((c.close - c.open) / c.open) * 100;
                        return (
                          <tr key={i} className="hover:bg-slate-100">
                            <td className="p-2.5 text-slate-700">{c.datetime}</td>
                            <td className="p-2.5 text-slate-700">${c.open.toLocaleString()}</td>
                            <td className="p-2.5 text-emerald-700">${c.high.toLocaleString()}</td>
                            <td className="p-2.5 text-rose-700">${c.low.toLocaleString()}</td>
                            <td className="p-2.5 font-bold text-slate-900">${c.close.toLocaleString()}</td>
                            <td className="p-2.5 text-slate-700">{c.volume}</td>
                            <td className={`p-2.5 ${chg >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {chg >= 0 ? '+' : ''}{chg.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESEARCH LAB (HYPOTHESES) */}
          {activeTab === "research" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Hipotesis Kuantitatif & Kriteria Pengujian</h2>
              <div className="space-y-4">
                {INITIAL_HYPOTHESES.map((h) => (
                  <div key={h.id} className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-cyan-700">#{h.id} - {h.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                        {({ validated: "TERVALIDASI", active: "AKTIF", rejected: "DITOLAK", under_research: "DALAM RISET" } as Record<string, string>)[h.status] || h.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{h.premise}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                          Asumsi yang Digunakan
                        </span>
                        <ul className="list-disc list-inside text-slate-700 space-y-1">
                          {h.assumptions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block mb-1">
                          Kriteria Pembatalan Hipotesis (Kill Switches)
                        </span>
                        <ul className="list-disc list-inside text-slate-700 space-y-1">
                          {h.falsification_criteria.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: STRATEGIES */}
          {activeTab === "strategies" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Daftar Model Strategi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-900">EMA_CROSS (v1.1)</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded font-mono">AKTIF (SIMULASI)</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-3">
                    Strategi ini mencari persilangan EMA 9 dan EMA 21, lalu menggunakan VWAP sebagai penyaring untuk mengurangi sinyal palsu saat pasar bergerak mendatar.
                  </p>
                  <div className="text-xs space-y-1.5 font-mono text-slate-500 border-t border-slate-200 pt-3">
                    <div>Jenis: Strategi Mengikuti Tren Berbasis Perhitungan</div>
                    <div>Batas Kerugian: trailing 1,5 × ATR</div>
                    <div>Target Keuntungan: target limit 2,5 × ATR</div>
                    <div>Status: Dalam Alokasi Simulasi</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-900">RSI_MEAN_REVERSION (v0.9)</h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded font-mono">PENGUJIAN LAB</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-3">
                    Strategi pembalikan rata-rata yang memanfaatkan kondisi RSI ekstrem (&lt;25 atau &gt;75), dan hanya digunakan saat pasar bergerak mendatar.
                  </p>
                  <div className="text-xs space-y-1.5 font-mono text-slate-500 border-t border-slate-200 pt-3">
                    <div>Jenis: Pembalikan Rata-rata Melawan Tren</div>
                    <div>Penyaring: ADX &lt; 20 (Hanya saat pasar bergerak mendatar)</div>
                    <div>Skor Validasi Kritis: 0.82 (Lolos uji overfitting)</div>
                    <div>Status: Validasi Walk-Forward</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BACKTESTING LAB */}
          {activeTab === "backtests" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Laboratorium Backtest Walk-Forward</h2>
              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs text-cyan-700 font-mono">STRATEGI: EMA_CROSS_v1.1</span>
                    <h3 className="text-sm font-bold text-slate-900">Laporan Kinerja di Luar Sampel</h3>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Pembagian data: 60% Latih / 20% Validasi / 20% Uji
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">RASIO SHARPE</div>
                    <div className="text-xl font-bold text-cyan-700 mt-1">{metrics.sharpe_ratio}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">TINGKAT KEMENANGAN</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">{metrics.win_rate}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">PENURUNAN MAKSIMUM</div>
                    <div className="text-xl font-bold text-amber-700 mt-1">{metrics.max_drawdown}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">FAKTOR PROFIT</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{metrics.profit_factor}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAPER TRADING */}
          {activeTab === "papertrade" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Riwayat Eksekusi Trading Simulasi</h2>
              <div className="bg-white p-5 rounded-xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-500 font-mono bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">ID Transaksi</th>
                      <th className="p-2.5">Aset</th>
                      <th className="p-2.5">Arah</th>
                      <th className="p-2.5">Ukuran</th>
                      <th className="p-2.5">Harga Masuk</th>
                      <th className="p-2.5">Batas Kerugian</th>
                      <th className="p-2.5">Target Keuntungan</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {trades.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-100">
                        <td className="p-2.5 text-cyan-700">#{t.id}</td>
                        <td className="p-2.5 text-slate-700">{t.symbol}</td>
                        <td className="p-2.5 text-emerald-700 font-bold">{t.side}</td>
                        <td className="p-2.5 text-slate-700">{t.quantity}</td>
                        <td className="p-2.5 text-slate-900">${t.entry_price.toLocaleString()}</td>
                        <td className="p-2.5 text-rose-700">${t.stop_loss.toLocaleString()}</td>
                        <td className="p-2.5 text-emerald-700">${t.take_profit.toLocaleString()}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === 'TERBUKA' ? 'bg-cyan-500/20 text-cyan-700' : 'bg-slate-100 text-slate-500'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: RISK CENTER */}
          {activeTab === "risk" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Pusat Risiko & Catatan Pengaman</h2>
              <div className="space-y-3">
                {INITIAL_RISK_EVENTS.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-700 border border-amber-500/30">
                          {r.severity}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{r.gate_name}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">{r.message}</p>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="text-cyan-700">{r.action_taken}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{r.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Laporan Riset</h2>
              {INITIAL_REPORTS.map((rep) => (
                <div key={rep.id} className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{rep.title}</h3>
                      <div className="text-xs text-slate-500 font-mono">Oleh {rep.author_agent} • {rep.created_at}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{rep.summary}</p>
                  
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-cyan-700 block mb-1">Temuan Utama Berdasarkan Data:</span>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                      {rep.key_findings.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: AGENT MEMORY */}
          {activeTab === "memory" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Penyimpanan Memori Agen</h2>
              <div className="space-y-3">
                {INITIAL_MEMORY.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-cyan-700">{m.agent_name}</span>
                      <span className="text-xs text-slate-500 font-mono">Tingkat Kepentingan: {m.importance}</span>
                    </div>
                    <div className="text-xs text-slate-700">{m.content}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-2">Jenis: {m.memory_type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TASK QUEUE */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Antrean Tugas & Siklus Terjadwal</h2>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-700 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Siklus Otomatis #42</div>
                      <div className="text-slate-500 text-[11px]">Pemindaian BTC/USDT pada grafik 1 menit</div>
                    </div>
                    <span className="text-emerald-700 font-mono text-xs">SELESAI</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Siklus Otomatis #43</div>
                      <div className="text-slate-500 text-[11px]">Menunggu interval berikutnya (15 detik)</div>
                    </div>
                    <span className="text-cyan-700 font-mono text-xs animate-pulse">DALAM ANTREAN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DATA SOURCES */}
          {activeTab === "sources" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Koneksi Bursa & Pemeriksaan Kualitas Data</h2>
              <div className="space-y-3">
                {INITIAL_DATA_QUALITY.map((dq) => (
                  <div key={dq.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{dq.symbol} ({dq.timeframe})</div>
                      <div className="text-xs text-slate-500 font-mono">
                        Jumlah Data: {dq.total_records} | Celah Data: {dq.missing_gaps} | Data Menyimpang: {dq.outliers_detected}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                      {dq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Pengaturan Sistem</h2>
              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Aset yang Dipantau</label>
                  <input type="text" readOnly value="BTC/USDT" className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 w-full max-w-sm" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Kerangka Waktu</label>
                  <input type="text" readOnly value="1 menit (setiap batang = 1 menit)" className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 w-full max-w-sm" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Interval Proses (detik)</label>
                  <input type="text" readOnly value="15" className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 w-full max-w-sm" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Mode Penyedia AI</label>
                  <input type="text" readOnly value="Mesin Heuristik (cepat dan deterministik)" className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 w-full max-w-sm" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Jejak Audit Sistem</h2>
              <div className="bg-white p-5 rounded-xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-500 font-mono bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Waktu</th>
                      <th className="p-2.5">Pelaku</th>
                      <th className="p-2.5">Tindakan</th>
                      <th className="p-2.5">Objek</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {INITIAL_AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-100">
                        <td className="p-2.5 text-slate-500">{log.timestamp}</td>
                        <td className="p-2.5 text-cyan-700 font-semibold">{log.actor}</td>
                        <td className="p-2.5 text-slate-900">{log.action}</td>
                        <td className="p-2.5 text-slate-700">{log.target}</td>
                        <td className="p-2.5 text-emerald-700 font-bold">{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
