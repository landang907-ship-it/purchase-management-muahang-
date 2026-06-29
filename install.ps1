# install.ps1 - run npm install in script's own directory
# Use $PSScriptRoot to avoid hardcoding Unicode path
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$dir = $PSScriptRoot
Set-Location -LiteralPath $dir
Write-Host "CWD: $PWD"
Write-Host "Node:  $((node --version) 2>$null)"
Write-Host "NPM:   $((npm.cmd --version) 2>$null)"
Write-Host "Registry: $((npm.cmd config get registry) 2>$null)"
Write-Host "---"

# Clean old logs
Remove-Item -Path 'npm-install.log', 'npm-install.err.log', 'npm-install.pid' -ErrorAction SilentlyContinue

Write-Host "Starting npm install in background..."
$proc = Start-Process -FilePath 'npm.cmd' `
    -ArgumentList @('install', '--no-audit', '--no-fund') `
    -WorkingDirectory $dir `
    -RedirectStandardOutput (Join-Path $dir 'npm-install.log') `
    -RedirectStandardError  (Join-Path $dir 'npm-install.err.log') `
    -PassThru -NoNewWindow
Write-Host "PID: $($proc.Id)"
$proc.Id | Out-File -FilePath (Join-Path $dir 'npm-install.pid') -Encoding ascii -NoNewline
Write-Host "Install started as PID $($proc.Id). It runs in the background."
