# Restart Vite dev server
# Chạy script này sau khi sửa code để restart nhanh

# Kill existing vite process
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force

# Start dev server
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -Command Set-Location 'c:\Users\landa\OneDrive\Desktop\dự án mua hàng\purchase-management'; npm run dev" -WindowStyle Normal

Write-Host "Dev server restarting..."
Start-Sleep -Seconds 3
