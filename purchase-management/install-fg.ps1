# install-fg.ps1 - foreground install in script's own dir
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
Set-Location -LiteralPath $PSScriptRoot
Write-Host "CWD: $PWD"
Write-Host "Node:    $((node --version) 2>$null)"
Write-Host "NPM:     $((npm.cmd --version) 2>$null)"
Write-Host "Registry:$((npm.cmd config get registry) 2>$null)"
Write-Host "--- start npm install ---"
npm.cmd install --no-audit --no-fund --prefer-offline --loglevel=error 2>&1
$ec = $LASTEXITCODE
Write-Host "--- npm install exit=$ec ---"
exit $ec
