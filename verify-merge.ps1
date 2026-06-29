# Verify merged project: install + build
$ErrorActionPreference = 'Stop'
chcp 65001 | Out-Null
Set-Location "$PSScriptRoot"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PWD: $(Get-Location)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] npm install (npmmirror registry)..." -ForegroundColor Yellow
npm.cmd install --registry=https://registry.npmmirror.com/ --no-audit --no-fund 2>&1 | Select-Object -Last 30
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install FAILED (exit $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}
Write-Host "[1/3] npm install OK" -ForegroundColor Green
Write-Host ""

Write-Host "[2/3] npm run build (typecheck + vite build)..." -ForegroundColor Yellow
npm.cmd run build 2>&1 | Tee-Object -FilePath "$PSScriptRoot\build.log" | Select-Object -Last 80
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED (exit $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}
Write-Host "[2/3] build OK" -ForegroundColor Green
Write-Host ""

Write-Host "[3/3] verify dist/ exists..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\dist\index.html") {
    $size = (Get-Item "$PSScriptRoot\dist\index.html").Length
    Write-Host "[3/3] dist/index.html OK ($size bytes)" -ForegroundColor Green
}
else {
    Write-Host "[3/3] dist/index.html MISSING" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ALL CHECKS PASSED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
