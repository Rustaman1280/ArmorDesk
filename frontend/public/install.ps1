# ArmorDesk Installer for Windows PowerShell
# Enterprise AI Agent Control Plane & Governed MCP Gateway
# https://armordesk.crusts.dev

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "    ___                              ____            __  " -ForegroundColor Cyan
Write-Host "   /   |  _________ ___  ____  _____/ __ \___  _____/ /__" -ForegroundColor Cyan
Write-Host "  / /| | / ___/ __ \`__ \/ __ \/ ___/ / / / _ \/ ___/ //_/" -ForegroundColor Cyan
Write-Host " / ___ |/ /  / / / / / / /_/ / /  / /_/ /  __(__  ) ,<   " -ForegroundColor Cyan
Write-Host "/_/  |_/_/  /_/ /_/ /_/\____/_/  /_____/\___/____/_/|_|  " -ForegroundColor Cyan
Write-Host ""
Write-Host "Enterprise AI Agent Control Plane & Governed MCP Gateway" -ForegroundColor White
Write-Host "------------------------------------------------------------"

# 1. Check Node.js and NPM
try {
    $nodeVer = (node -v 2>$null)
    $npmVer = (npm -v 2>$null)
    if ($nodeVer -and $npmVer) {
        Write-Host " [OK] Detected Node.js $nodeVer and npm $npmVer" -ForegroundColor Green
    } else {
        Write-Host " [!] Node.js or npm not detected in PATH. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [!] Node.js check skipped. Ensure Node.js v18+ is installed." -ForegroundColor Yellow
}

# 2. Check MCP Gateway Connectivity
Write-Host " [*] Probing live MCP Gateway at https://armordesk.crusts.dev..." -ForegroundColor Cyan
try {
    $ping = Invoke-RestMethod -Uri "https://armordesk.crusts.dev/api/mcp/ping" -Method Post -TimeoutSec 5
    if ($ping.status -eq "CONNECTED") {
        Write-Host " [OK] MCP Gateway status: ONLINE & CONNECTED (Protocol: $($ping.protocol))" -ForegroundColor Green
    }
} catch {
    Write-Host " [!] Gateway response received. Continuing setup..." -ForegroundColor Yellow
}

# 3. Browser Authentication (OAuth 2.0 Device Grant)
Write-Host ""
Write-Host "Browser Authentication (OAuth 2.0 Device Grant):" -ForegroundColor White
Write-Host "------------------------------------------------------------"

try {
    $codeRes = Invoke-RestMethod -Uri "https://armordesk.crusts.dev/api/auth/device/code" -Method Post -TimeoutSec 10
    $devCode = $codeRes.device_code
    $userCode = $codeRes.user_code
    $authUrl = $codeRes.verification_uri_complete

    Write-Host "  1. Please open the link below in your browser to authorize:" -ForegroundColor Gray
    Write-Host "     👉  $authUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  2. Confirm your one-time device code:" -ForegroundColor Gray
    Write-Host "     🔑  $userCode" -ForegroundColor Green
    Write-Host "------------------------------------------------------------"

    try { Start-Process $authUrl } catch {}

    Write-Host -NoNewline "Waiting for browser authorization..."
    $maxPolls = 150
    $count = 0
    $authSuccess = $false
    $finalPoll = $null

    while ($count -lt $maxPolls) {
        Start-Sleep -Seconds 2
        $count++
        try {
            $body = @{ device_code = $devCode } | ConvertTo-Json
            $pollRes = Invoke-RestMethod -Uri "https://armordesk.crusts.dev/api/auth/device/poll" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
            if ($pollRes.status -eq "APPROVED") {
                $authSuccess = $true
                $finalPoll = $pollRes
                $cfgDir = Join-Path $HOME ".armordesk"
                if (!(Test-Path $cfgDir)) { New-Item -ItemType Directory -Path $cfgDir | Out-Null }
                $cfgPath = Join-Path $cfgDir "config.json"
                $cfgObj = @{
                    baseUrl = "https://armordesk.crusts.dev"
                    token = $pollRes.token
                    user = $pollRes.user
                    tenant = $pollRes.tenant
                    updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
                }
                $cfgObj | ConvertTo-Json -Depth 5 | Set-Content -Path $cfgPath -Encoding UTF8
                break
            } elseif ($pollRes.status -eq "DENIED" -or $pollRes.status -eq "EXPIRED") {
                Write-Host ""
                Write-Host "Authorization was $($pollRes.status.ToLower())." -ForegroundColor Yellow
                break
            } else {
                Write-Host -NoNewline "."
            }
        } catch {}
    }

    Write-Host ""
    if ($authSuccess -and $finalPoll) {
        Write-Host "[OK] Successfully Authenticated as $($finalPoll.user.name) ($($finalPoll.user.email))!" -ForegroundColor Green
        Write-Host "     Tenant: $($finalPoll.tenant.name) (Role: $($finalPoll.user.role))" -ForegroundColor Cyan
        Write-Host "     Session saved to ~/.armordesk/config.json" -ForegroundColor Gray
    }
} catch {
    Write-Host "[!] Interactive browser login skipped. Run 'npx @crustdev/armordesk login' later." -ForegroundColor Gray
}

# 4. Optional global CLI install
try {
    npm install -g @crustdev/armordesk 2>$null
} catch {}

Write-Host ""
Write-Host "------------------------------------------------------------"
Write-Host "Setup Ready! Next Commands:" -ForegroundColor Green
Write-Host "------------------------------------------------------------"
Write-Host " • Check identity:      npx @crustdev/armordesk whoami" -ForegroundColor Cyan
Write-Host " • Verify MCP Gateway:  npx @crustdev/armordesk mcp check" -ForegroundColor Cyan
Write-Host " • Claude Desktop JSON: npx @crustdev/armordesk mcp claude" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dashboard: https://armordesk.crusts.dev"
Write-Host "------------------------------------------------------------"
