@echo off
REM ==============================================================
REM Autonomous AI Trading Intelligence System - Service Stopper
REM ==============================================================
echo [AATIS] Terminating running services...

taskkill /FI "WINDOWTITLE eq AATIS-Backend*" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq AATIS-Frontend*" /T /F >nul 2>nul

echo [AATIS] All background processes terminated cleanly.
pause
