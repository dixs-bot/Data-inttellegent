import { 
  AgentData, CandleData, TaskEventData, BacktestMetricsData,
  PaperTradeData, RiskEventData, HypothesisData, ResearchReportData,
  AgentMemoryData, DataQualityData, AuditLogData
} from '@/types';

export const INITIAL_AGENTS: AgentData[] = [
  { id: 1, name: "Agen Koordinator Utama", role: "Koordinator Eksekutif", description: "Mengatur prioritas riset dan merangkum hasil kerja seluruh agen.", status: "idle", last_active: "Baru saja", memory_count: 142 },
  { id: 2, name: "Agen Riset Pasar", role: "Makro & Fundamental", description: "Memantau kondisi pasar dari berbagai sumber serta likuiditas makro.", status: "idle", last_active: "Baru saja", memory_count: 98 },
  { id: 3, name: "Agen Aksi Harga", role: "Analisis Teknikal", description: "Memantau aliran transaksi, pola candlestick, serta level EMA dan VWAP.", status: "idle", last_active: "Baru saja", memory_count: 312 },
  { id: 4, name: "Agen Penemuan Strategi", role: "Perumusan Kuantitatif", description: "Menyusun hipotesis keunggulan strategi yang dapat diuji beserta variasinya.", status: "idle", last_active: "Baru saja", memory_count: 85 },
  { id: 5, name: "Agen Kualitas Data", role: "Penjaga Integritas", description: "Memeriksa waktu data, celah data, anomali volume, dan kewajaran data.", status: "idle", last_active: "Baru saja", memory_count: 64 },
  { id: 6, name: "Agen Validasi Kritis", role: "Peninjau Kritis", description: "Menguji asumsi serta mencari indikasi overfitting dan bias survivorship.", status: "idle", last_active: "Baru saja", memory_count: 119 },
  { id: 7, name: "Agen Backtest", role: "Insinyur Simulasi", description: "Menjalankan simulasi walk-forward pada data latih, validasi, dan uji.", status: "idle", last_active: "Baru saja", memory_count: 240 },
  { id: 8, name: "Agen Risiko", role: "Gerbang Pengaman Otomatis", description: "Menegakkan batas risiko, batas penurunan modal, dan pemutus otomatis.", status: "idle", last_active: "Baru saja", memory_count: 175 },
  { id: 9, name: "Agen Eksekusi Simulasi", role: "Pialang Virtual", description: "Menjalankan transaksi simulasi dengan memperhitungkan selisih eksekusi dan komisi.", status: "idle", last_active: "Baru saja", memory_count: 420 },
  { id: 10, name: "Agen Audit Kinerja", role: "Pemeriksa Pasca-Transaksi", description: "Mengevaluasi penurunan kinerja di luar sampel, perubahan ekspektasi, dan kesehatan sistem.", status: "idle", last_active: "Baru saja", memory_count: 153 }
];

export const INITIAL_CANDLES: CandleData[] = Array.from({ length: 40 }).map((_, i) => {
  const base = 68400 + Math.sin(i / 3) * 350 + (i * 12);
  const offsetMin = 40 - i;
  const h = String(12 - Math.floor(offsetMin / 60)).padStart(2, '0');
  const m = String(Math.abs(60 - (offsetMin % 60)) % 60).padStart(2, '0');
  return {
    timestamp: 1730000000000 + i * 60000,
    datetime: `${h}:${m}`,
    open: Math.round(base),
    high: Math.round(base + 45 + ((i % 5) * 4)),
    low: Math.round(base - 35 - ((i % 4) * 3)),
    close: Math.round(base + ((i % 7) * 5 - 15)),
    volume: +(15 + (i % 6) * 3.5).toFixed(2),
  };
});

export const INITIAL_EVENTS: TaskEventData[] = [
  { id: 1, task_id: 101, agent_name: "Agen Koordinator Utama", event_type: "started", message: "Siklus pemindaian BTC/USDT 1 menit dimulai", payload: {}, timestamp: "12:04:10" },
  { id: 2, task_id: 101, agent_name: "Agen Kualitas Data", event_type: "step_completed", message: "Celah: 0, data menyimpang: 0. Pemeriksaan integritas LULUS.", payload: {}, timestamp: "12:04:12" },
  { id: 3, task_id: 101, agent_name: "Agen Aksi Harga", event_type: "step_completed", message: "Persilangan EMA 9/21 bullish terdeteksi di atas VWAP ($68.620)", payload: {}, timestamp: "12:04:13" },
  { id: 4, task_id: 101, agent_name: "Agen Backtest", event_type: "step_completed", message: "Nilai Sharpe walk-forward di luar sampel: 2.14, Penurunan maksimum: 4.8%", payload: {}, timestamp: "12:04:15" },
  { id: 5, task_id: 101, agent_name: "Agen Risiko", event_type: "step_completed", message: "Pengaman risiko lolos. Ukuran posisi disetujui sebesar 1,5% NAV.", payload: {}, timestamp: "12:04:16" },
  { id: 6, task_id: 101, agent_name: "Agen Eksekusi Simulasi", event_type: "step_completed", message: "Pembelian pasar simulasi 0.15 BTC @ $68,642.50", payload: {}, timestamp: "12:04:17" }
];

export const INITIAL_METRICS: BacktestMetricsData = {
  id: 1,
  backtest_run_id: 52,
  phase: "di_luar_sampel",
  total_trades: 148,
  winning_trades: 92,
  losing_trades: 56,
  win_rate: 62.16,
  sharpe_ratio: 2.14,
  max_drawdown: 4.82,
  profit_factor: 1.84,
  expectancy: 18.5,
  cagr: 28.4,
  metrics_json: {
    equity_curve: [10000, 10080, 10150, 10110, 10290, 10340, 10280, 10450, 10580, 10720, 10690, 10840]
  }
};

export const INITIAL_TRADES: PaperTradeData[] = [
  { id: 101, strategy_id: 1, symbol: "BTC/USDT", side: "BELI", order_type: "PASAR", entry_price: 68642.5, exit_price: 69120.0, quantity: 0.15, stop_loss: 67950.0, take_profit: 69800.0, status: "DITUTUP", entry_time: "Hari ini 10:15" },
  { id: 102, strategy_id: 1, symbol: "BTC/USDT", side: "BELI", order_type: "PASAR", entry_price: 68780.0, exit_price: undefined, quantity: 0.15, stop_loss: 68150.0, take_profit: 69950.0, status: "TERBUKA", entry_time: "Hari ini 11:40" }
];

export const INITIAL_HYPOTHESES: HypothesisData[] = [
  {
    id: 1,
    title: "Penolakan VWAP dengan Akselerasi Momentum EMA-9",
    premise: "Ketika harga terkoreksi ke VWAP saat tren naik pada grafik 1 menit dan memantul dalam 3 candlestick, peluang mencapai target +1 ATR diperkirakan minimal 63%.",
    assumptions: ["Buku pesanan pasar spot menunjukkan penyerapan delta positif", "Tingkat pendanaan tetap netral (-0.005% to +0.01%)"],
    falsification_criteria: ["Candlestick ditutup lebih dari 0,4% di bawah VWAP", "Histogram MACD gagal membentuk nilai yang lebih tinggi dalam 4 candlestick"],
    status: "validated",
    created_at: "2026-10-30"
  },
  {
    id: 2,
    title: "Pembalikan RSI Jenuh Jual pada Pasar Mendatar",
    premise: "Dalam konsolidasi mendatar (ADX < 20), RSI(14) di bawah 28 diuji untuk peluang rasio risiko-imbalan 1:2,4 menuju EMA 50 periode.",
    assumptions: ["Tidak terjadi rilis data CPI berdampak tinggi atau likuidasi besar akibat kebijakan bank sentral"],
    falsification_criteria: ["Tiga candlestick berturut-turut membentuk titik terendah di bawah pita -2 ATR"],
    status: "active",
    created_at: "2026-10-30"
  }
];

export const INITIAL_RISK_EVENTS: RiskEventData[] = [
  { id: 1, severity: "SEDANG", gate_name: "Pemutus Volatilitas", message: "Volatilitas terealisasi pada grafik 1 menit melonjak. Ukuran posisi simulasi dikurangi 50%.", action_taken: "KURANGI UKURAN POSISI", timestamp: "10:45 " },
  { id: 2, severity: "RENDAH", gate_name: "Gerbang Eksposur", message: "Total eksposur BTC secara bersamaan dibatasi pada 3,2% dari nilai akun.", action_taken: "LOLOS", timestamp: "11:30 " }
];

export const INITIAL_REPORTS: ResearchReportData[] = [
  {
    id: 1,
    title: "Analisis Kinerja BTC/USDT pada Berbagai Kondisi Pasar",
    author_agent: "Agen Koordinator Utama & Agen Audit Kinerja",
    summary: "Rangkuman 1.200 jendela transaksi simulasi 1 menit di luar sampel pada kondisi mengikuti tren dan pembalikan rata-rata.",
    key_findings: [
      "Rasio Sharpe menunjukkan kestabilan pada 2,14 di luar sampel ketika sinyal disaring berdasarkan kesesuaian VWAP.",
      "Penurunan modal maksimum pada simulasi dibatasi hingga 4,82% oleh pengaman risiko otomatis.",
      "Ekspektasi hasil simulasi tetap positif sebesar 18,5 bps setelah komisi dan selisih eksekusi diperhitungkan."
    ],
    recommendations: [
      "Lanjutkan pengujian simulasi EMA-Cross v1.1 pada BTC/USDT grafik 1 menit.",
      "Pertahankan ambang penolakan agen validasi kritis pada perubahan parameter sebesar 15%."
    ],
    created_at: "2026-10-30"
  }
];

export const INITIAL_MEMORY: AgentMemoryData[] = [
  { id: 1, agent_name: "Agen Risiko", memory_type: "veto_rule", content: "Pengaman otomatis menghentikan simulasi jika terjadi 3 stop-loss berturut-turut dalam periode 6 jam.", importance: 0.98, created_at: "2026-10-30" },
  { id: 2, agent_name: "Agen Validasi Kritis", memory_type: "reflection", content: "Pada periode likuiditas rendah (02.00–05.00 UTC), tingkat breakout palsu 18% lebih tinggi. Tambahkan jumlah candlestick konfirmasi.", importance: 0.91, created_at: "2026-10-30" },
  { id: 3, agent_name: "Agen Aksi Harga", memory_type: "semantic", content: "Pola candlestick hammer pada ekstensi -1,5 ATR memiliki tingkat pantulan historis 71% ketika RSI < 32.", importance: 0.86, created_at: "2026-10-30" }
];

export const INITIAL_DATA_QUALITY: DataQualityData[] = [
  { id: 1, symbol: "BTC/USDT", timeframe: "1m", checked_at: "Baru saja", total_records: 1440, missing_gaps: 0, zero_volume_count: 0, outliers_detected: 0, status: "LOLOS" },
  { id: 2, symbol: "ETH/USDT", timeframe: "1m", checked_at: "10 menit lalu", total_records: 1440, missing_gaps: 0, zero_volume_count: 0, outliers_detected: 0, status: "LOLOS" }
];

export const INITIAL_AUDIT_LOGS: AuditLogData[] = [
  { id: 1, actor: "Sistem Proses", action: "START_CYCLE", target: "BTC/USDT Engine", status: "BERHASIL", timestamp: "12:00:00" },
  { id: 2, actor: "Agen Risiko", action: "VERIFY_EXPOSURE", target: "Portofolio Simulasi", status: "BERHASIL", timestamp: "12:00:05" },
  { id: 3, actor: "Agen Backtest", action: "EXECUTE_WALK_FORWARD", target: "EMA_CROSS_V1.1", status: "BERHASIL", timestamp: "12:00:15" },
  { id: 4, actor: "Agen Eksekusi Simulasi", action: "ORDER_SUBMIT", target: "Pialang Virtual Simulasi", status: "BERHASIL", timestamp: "12:00:20" }
];
