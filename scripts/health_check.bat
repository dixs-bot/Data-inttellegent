@echo off
if exist "venv\Scripts\python.exe" (
    venv\Scripts\python.exe scripts\health_check.py
) else (
    python scripts\health_check.py
)
pause
