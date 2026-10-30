#!/usr/bin/env python3
"""
Comprehensive Health Check for Autonomous AI Trading Intelligence System
"""
import sys
import time
import requests

def run_health_checks():
    print("==========================================================")
    print("   AATIS - System Health & Verification Diagnostics       ")
    print("==========================================================")
    
    services = [
        {"name": "Backend FastAPI Health", "url": "http://127.0.0.1:8000/api/health"},
        {"name": "Frontend Dashboard Health", "url": "http://localhost:3000/api/health"}
    ]
    
    all_ok = True
    for s in services:
        try:
            res = requests.get(s["url"], timeout=4)
            if res.status_code == 200:
                print(f"[PASS] {s['name']}: HTTP 200 OK -> {res.json()}")
            else:
                print(f"[FAIL] {s['name']}: HTTP {res.status_code}")
                all_ok = False
        except Exception as e:
            print(f"[WARN] {s['name']}: Could not connect ({str(e)})")
            all_ok = False

    print("----------------------------------------------------------")
    if all_ok:
        print("[SUCCESS] All endpoints are operational and responsive.")
    else:
        print("[NOTICE] Some services might be offline or still booting up.")
    print("==========================================================")

if __name__ == "__main__":
    run_health_checks()
