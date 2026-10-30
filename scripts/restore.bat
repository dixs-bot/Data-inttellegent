@echo off
REM ==============================================================
REM Database Restore Script
REM ==============================================================
if "%~1"=="" (
    echo Usage: restore.bat path\to\backup_file.db
    pause
    exit /b 1
)

if not exist "%~1" (
    echo [ERROR] Specified backup file does not exist: %~1
    pause
    exit /b 1
)

echo [RESTORE] Restoring database from %~1 ...
copy /Y "%~1" "trading_system.db" >nul
echo [SUCCESS] Database restored successfully to trading_system.db
pause
