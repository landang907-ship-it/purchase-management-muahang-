@echo off
cd /d "c:\Users\landa\OneDrive\Desktop\d? n mua hng\purchase-management"
echo Working dir: %CD%
echo Starting Vite 6 dev server in background...
start "ViteDevServer" /B cmd /c "node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173"
echo Vite started, PID:
timeout /t 2 /nobreak >nul
tasklist /FI "IMAGENAME eq node.exe" 2>&1
