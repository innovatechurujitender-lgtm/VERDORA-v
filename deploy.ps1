Write-Output "=== Step 1: Restarting Server ==="
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Start-Process -NoNewWindow -FilePath node -ArgumentList "C:\Users\admin\Desktop\verdora.opene\backend\server.cjs"
Start-Sleep -Seconds 4

$health = Invoke-RestMethod -Uri "http://localhost:5000/health" -ErrorAction Stop
Write-Output "Health: $($health | ConvertTo-Json)"

Write-Output "`n=== Step 2: Testing OTP ==="
$email = Read-Host "Enter email to send OTP"
$body = @{ email = $email } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/email/send-otp" -Method Post -Body $body -ContentType "application/json"
Write-Output "OTP Response: $($resp | ConvertTo-Json)"

Write-Output "`n=== Step 3: Frontend Build ==="
Set-Location "C:\Users\admin\Desktop\verdora.opene\frontend"
npm run build

Write-Output "`n=== DONE ==="
