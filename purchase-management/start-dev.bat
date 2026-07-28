@echo off
cd /d "%~dp0purchase-management"
echo Starting Vite dev server...
echo Working dir: %CD%
echo.
node_modules\.bin\vite.cmd --host 0.0.0.0 --port 5173 --strictPort
