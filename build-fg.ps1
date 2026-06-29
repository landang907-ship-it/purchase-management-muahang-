# build-fg.ps1 - foreground build in script's own dir
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
Set-Location -LiteralPath $PSScriptRoot
Write-Host "CWD: $PWD"
Write-Host "--- start npm run build ---"
npm.cmd run build 2>&1
$ec = $LASTEXITCODE
Write-Host "--- npm run build exit=$ec ---"
exit $ec
