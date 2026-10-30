@echo off
REM ==============================================================
REM Autonomous AI Trading Intelligence System - Service Launcher
REM ==============================================================
echo [AATIS] Launching Autonomous AI Trading Intelligence System...

if not exist "venv" (
    echo [ERROR] Virtual environment not found. Please run install.bat first!
    pause
    exit /b 1
)

echo [1/2] Launching Backend FastAPI Service on http://127.0.0.1:8000 ...
start "AATIS-Backend" cmd /k "call venv\Scripts\activate.bat && python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Next.js Dashboard on http://localhost:3000 ...
start "AATIS-Frontend" cmd /k "cd app && npm run dev"

echo.
echo ==============================================================
echo Services started!
echo Frontend Dashboard : http://localhost:3000
echo Backend API Docs   : http://127.0.0.1:8000/docs
echo ==============================================================
