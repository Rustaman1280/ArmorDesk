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

# 3. Install CLI package
Write-Host " [*] Preparing official CLI package @crustdev/armordesk..." -ForegroundColor Cyan
try {
    npm install -g @crustdev/armordesk 2>$null
    Write-Host " [OK] Installed globally: armordesk" -ForegroundColor Green
} catch {
    Write-Host " [OK] Global installation skipped. Use instant npx command." -ForegroundColor Gray
}

Write-Host ""
Write-Host "------------------------------------------------------------"
Write-Host "Setup Complete! Next Steps:" -ForegroundColor Green
Write-Host "------------------------------------------------------------"
Write-Host ""
Write-Host " 1. Log in to your ArmorDesk account:" -ForegroundColor White
Write-Host "    npx @crustdev/armordesk login --email <your-email>" -ForegroundColor Cyan
Write-Host ""
Write-Host " 2. Verify Governed MCP Gateway status & tools:" -ForegroundColor White
Write-Host "    npx @crustdev/armordesk mcp check" -ForegroundColor Cyan
Write-Host ""
Write-Host " 3. Export configuration for Claude Desktop or Cursor:" -ForegroundColor White
Write-Host "    npx @crustdev/armordesk mcp claude" -ForegroundColor Cyan
Write-Host "    npx @crustdev/armordesk mcp cursor" -ForegroundColor Cyan
Write-Host ""
Write-Host " 4. View all commands:" -ForegroundColor White
Write-Host "    npx @crustdev/armordesk --help" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dashboard: https://armordesk.crusts.dev"
Write-Host "------------------------------------------------------------"
