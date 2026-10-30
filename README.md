# Autonomous AI Trading Intelligence System (AATIS)
*Sistem Intelijen Kuantitatif Multi-Agent Otonom & Eksekusi Paper Trading Tingkat Institusional*

[![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald)]()
[![Type](https://img.shields.io/badge/Mode-Research%20Only-amber)]()
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-black)]()

---

## 1. Ikhtisar Sistem & Filosofi Desain

AATIS (**Autonomous AI Trading Intelligence System**) dirancang untuk mensimulasikan alur kerja departemen kuantitatif institusional (*quantitative hedge fund*) secara otonom. Sistem ini menggabungkan:
1. **Analisis Data Pasar Waktu Nyata**: Menggunakan CCXT untuk ingest data publik BTC/USDT (timeframe 1 menit).
2. **Kalkulasi Indikator Kuantitatif**: EMA (9, 21, 50), RSI, MACD, ATR, VWAP institusional, dan deteksi pola candlestick.
3. **Mesin Backtesting Ter-vektor**: Split kronologis train/validation/test dengan pengujian *walk-forward* dan friksi pasar nyata (komisi & *slippage*).
4. **10 Agen Otonom Terspesialisasi**: Membagi tugas dari pengumpulan data, penalaran hipotesis ilmiah (*falsifiable hypothesis*), validasi skeptis, hingga hak veto risiko (*Risk Veto Gates*).
5. **Dashboard Institusional Tema Gelap**: Berbasis Next.js 14, Tailwind CSS, dan TypeScript dengan lencana wajib **Research Only**.

---

## 2. Arsitektur & Spesifikasi 10 Agen Otonom

Sistem beroperasi melalui koordinasi 10 peran agen yang independen dan saling mengawasi:

| No | Agen | Peran Utama | Tanggung Jawab & Output |
|---|---|---|---|
| 1 | **Chief Intelligence Agent** | Executive Coordinator | Mengatur orkestrasi siklus penelitian kuantitatif, inisiasi tugas, dan sintesis akhir. |
| 2 | **Market Research Agent** | Macro & Fundamentals | Mengklasifikasikan rezim pasar (*Bullish Momentum, Bearish Trend, Sideways Chop*). |
| 3 | **Price Action Agent** | Technical Analysis | Memantau order flow, indikator kuantitatif (EMA, VWAP, ATR, RSI), dan konfirmasi struktur harga. |
| 4 | **Strategy Discovery Agent** | Quantitative Ideation | Merumuskan hipotesis ilmiah dengan asumsi eksplisit dan kriteria falsifikasi (*kill switch*). |
| 5 | **Data Quality Agent** | Integrity Sentinel | Memverifikasi kelengkapan bar data 1m, mendeteksi *timestamp gaps*, volume anomali, dan *outliers*. |
| 6 | **Skeptical Validation Agent** | Adversarial Reviewer | Menguji *overfitting*, bias *survivorship*, dan menantang premis sebelum dialokasikan. |
| 7 | **Backtesting Agent** | Simulation Engineer | Menjalankan simulasi *walk-forward* out-of-sample (Sharpe, Drawdown, Win Rate, Expectancy). |
| 8 | **Risk Agent** | Autonomous Veto Gate | **Memegang hak veto absolut**; memblokir order jika *drawdown* > 15% atau volatilitas ekstrem. |
| 9 | **Paper Execution Agent** | Virtual Broker | Mengeksekusi order simulasi dengan estimasi komisi (5 bps) dan *slippage* (2.5 bps). |
| 10 | **Performance Auditor Agent** | Post-Trade Inspector | Mengaudit pembusukan alpha (*alpha decay*), deviasi ekspektansi, dan menulis laporan riset. |

---

## 3. Struktur Direktori Proyek

```
.
├── app/                        # Next.js 14 Dark Institutional Dashboard
│   ├── src/
│   │   ├── app/                # App router (page.tsx, layout.tsx, APIs)
│   │   ├── components/         # Modul UI & Navigasi
│   │   ├── mockData.ts         # Data awal & fallback state
│   │   └── types.ts            # Definisi TypeScript
│   ├── package.json
│   └── tailwind.config.js
├── backend/                    # Layanan Backend FastAPI & Layanan Kuantitatif
│   ├── app/
│   │   ├── agents/system.py    # Siklus 10 Agen & Orkestrasi
│   │   ├── models/entities.py  # 20+ Model Relasional SQLModel/SQLAlchemy
│   │   ├── services/
│   │   │   ├── backtester.py   # Vectorized Walk-Forward Backtester
│   │   │   ├── indicators.py   # EMA, RSI, MACD, ATR, VWAP, Candle Patterns
│   │   │   ├── llm_engine.py   # Provider-agnostic Structured Output
│   │   │   ├── market_data.py  # CCXT Data Ingest & Quality Sentinel
│   │   │   └── worker.py       # Autonomous Bounded Worker Loop
│   │   └── main.py             # Endpoint REST API
│   ├── tests/                  # Pytest Unit & Integration Tests
│   └── requirements.txt
├── scripts/                    # Script Otomasi Windows (.bat) & Health Check
│   ├── install.bat             # Otomatisasi instalasi dependensi
│   ├── start.bat               # Menjalankan backend & frontend paralel
│   ├── stop.bat                # Menghentikan background services
│   ├── backup.bat              # Backup snapshot database SQLite
│   ├── restore.bat             # Restore database dari snapshot
│   ├── health_check.py         # Skrip verifikasi status layanan
│   └── health_check.bat        # Skrip sekali-klik Windows
├── .env.example                # Dokumentasi variabel lingkungan
└── README.md                   # Dokumentasi Komprehensif (Bahasa Indonesia)
```

---

## 4. Panduan Instalasi & Pengoperasian Windows

### Prasyarat
- **Windows 10 / 11** atau Windows Server.
- **Python 3.10+** (Pastikan opsi *"Add Python to PATH"* dicentang saat instalasi).
- **Node.js 18+** & npm.

### Langkah 1: Instalasi Otomatis
Jalankan file batch:
```cmd
scripts\install.bat
```
Skrip ini akan:
1. Membuat Python Virtual Environment (`venv`).
2. Menginstal seluruh paket Python kuantitatif (`FastAPI`, `SQLModel`, `CCXT`, `pandas`, `numpy`, `pytest`).
3. Menginstal seluruh paket dependensi Next.js & Tailwind CSS di dalam folder `app/`.
4. Menginisialisasi file `.env` dari `.env.example`.

### Langkah 2: Menjalankan Sistem
Jalankan file batch:
```cmd
scripts\start.bat
```
Dua jendela konsol akan otomatis terbuka:
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend API & OpenAPI Docs**: `http://127.0.0.1:8000/docs`

### Langkah 3: Pemeriksaan Kesehatan (*Health Check*)
Jalankan file batch:
```cmd
scripts\health_check.bat
```
Atau melalui terminal:
```cmd
python scripts\health_check.py
```

### Langkah 4: Menghentikan Sistem
Jalankan file batch:
```cmd
scripts\stop.bat
```

---

## 5. Alur Kerja Penelitian & Gerbang Risiko (*Safety Gates*)

1. **Pemindaian Berkala**: Worker otonom memindai candle 1m BTC/USDT setiap interval yang ditentukan (default: 15 detik).
2. **Validasi Data**: Data Quality Agent memverifikasi tidak ada gap waktu lebih dari 1.5x interval dan tidak ada outlier harga > 15% per bar.
3. **Kalkulasi & Rezim**: Indikator teknikal dihitung secara ter-vektor. Market Research Agent menentukan rezim pasar.
4. **Pembentukan Hipotesis**: Strategy Discovery Agent membuat hipotesis kuantitatif baru yang wajib memuat *explicit assumptions* dan *falsification criteria*.
5. **Simulasi Walk-Forward**: Backtesting Agent mengevaluasi metrik *out-of-sample*.
6. **Veto Gate (Risk Agent)**:
   - Jika *drawdown* out-of-sample > 15%, order **DIVETO SECARA OTOMATIS**.
   - Jika rasio volatilitas > 5%, order **DIVETO SECARA OTOMATIS**.
   - Posisi simulasi dibatasi maksimal 2.0% dari nilai portofolio.
7. **Paper Trading Execution**: Jika semua gerbang risiko lolos, Paper Execution Agent mencatat simulasi order dengan memperhitungkan biaya riil pasar.

---

## 6. Prosedur Backup & Pemulihan Database

Untuk mencadangkan data SQLite yang berisi riwayat candle, task, trade, dan audit log:
```cmd
scripts\backup.bat
```
File snapshot bertanggal akan disimpan di folder `backups/`.

Untuk memulihkan database dari snapshot:
```cmd
scripts\restore.bat backups\trading_system_YYYYMMDD_HHMMSS.db
```

---

## 7. Catatan Keamanan & Batasan Penggunaan

- **Penetapan Penelitian Saja (*Research Only*)**: Sistem ini dirancang untuk pemodelan kuantitatif, analisis historis, dan pengujian simulasi paper trading. **Dilarang keras menyambungkan private key atau dana live tanpa pengujian ketat dan audit kepatuhan independen.**
- **Independensi Model**: Engine penalaran mendukung model LLM (OpenAI, Ollama) serta fallback heuristik deterministik tanpa dependensi kunci eksternal, menjamin keandalan sistem tetap 100% aktif dalam kondisi offline.
