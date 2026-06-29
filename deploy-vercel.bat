@echo off
chcp 65001 >nul
echo ========================================
echo   Deploy Purchase Management len Vercel
echo ========================================
echo.

cd /d "%~dp0purchase-management"

REM Check if vercel is installed
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/4] Dang cai dat Vercel CLI...
    call npm install -g vercel
)

echo [2/4] Dang login Vercel...
call vercel login vcp_0IjMT0rlQN09raoRiE9p3wupsTI58ahuNXMux3glX2zlUbIl050LfkY4

echo [3/4] Dang import repository...
call vercel --token vcp_0IjMT0rlQN09raoRiE9p3wupsTI58ahuNXMux3glX2zlUbIl050LfkY4

echo.
echo ========================================
echo   Deploy thanh cong!
echo ========================================
echo.
echo Repository: https://github.com/landang907-ship-it/purchase-management-muahang-.git
echo.
pause
