@echo off
REM ==============================================================
REM Autonomous AI Trading Intelligence System - Windows Installer
REM ==============================================================
echo [AATIS] Initializing Installation Environment...

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python 3 is not installed or not in PATH! Please install Python 3.10+
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH! Please install Node.js 18+
    pause
    exit /b 1
)

echo [1/3] Setting up Python Virtual Environment...
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat

echo [2/3] Installing Backend Dependencies...
pip install --upgrade pip
pip install -r backend\requirements.txt

echo [3/3] Installing Frontend Dependencies...
cd app
call npm install
cd ..

if not exist ".env" (
    echo [SETUP] Copying .env.example to .env...
    copy .env.example .env
)

echo.
echo ==============================================================
echo [SUCCESS] Installation Completed Successfully!
echo Run 'start.bat' to launch Backend and Frontend services.
echo ==============================================================
pause
