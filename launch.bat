@echo off
title Quinfosys Quantum Brain
echo ========================================================
echo   Launching Quinfosys(TM) Quantum Brain...
echo ========================================================
start "Quinfosys Quantum Brain Vite" powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%~dp0'; npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173/"
exit
