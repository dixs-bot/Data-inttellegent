@echo off
REM ==============================================================
REM Database Backup Script
REM ==============================================================
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

if exist "trading_system.db" (
    copy "trading_system.db" "%BACKUP_DIR%\trading_system_%TIMESTAMP%.db" >nul
    echo [SUCCESS] SQLite database backed up to %BACKUP_DIR%\trading_system_%TIMESTAMP%.db
) else (
    echo [WARNING] No trading_system.db file found to backup.
)
pause
