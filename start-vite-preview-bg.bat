@echo off
chcp 65001 >nul
cd /d "%~dp0"
cd purchase-management
echo Working dir: %CD%
echo Starting Vite preview server in background (bound to 0.0.0.0:4173)...
start "VitePreviewServer" /B cmd /c "node node_modules\vite\bin\vite.js preview"
echo Launched. Waiting 3s for server to bind...
timeout /t 3 /nobreak >nul
netstat -ano | findstr :4173
