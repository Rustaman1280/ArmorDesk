#!/usr/bin/env bash
# ArmorDesk Installer for Linux & macOS
# Enterprise AI Agent Control Plane & Governed MCP Gateway
# https://armordesk.crusts.dev

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "    ___                              ____            __  "
echo "   /   |  _________ ___  ____  _____/ __ \___  _____/ /__"
echo "  / /| | / ___/ __ \`__ \/ __ \/ ___/ / / / _ \/ ___/ //_/"
echo " / ___ |/ /  / / / / / / /_/ / /  / /_/ /  __(__  ) ,<   "
echo "/_/  |_/_/  /_/ /_/ /_/\____/_/  /_____/\___/____/_/|_|  "
echo -e "${NC}"
echo -e "${BOLD}Enterprise AI Agent Control Plane & Governed MCP Gateway${NC}"
echo "------------------------------------------------------------"
echo ""

# 1. Check Node.js and NPM
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  NODE_VER=$(node -v)
  NPM_VER=$(npm -v)
  echo -e " [✓] Detected Node.js ${GREEN}${NODE_VER}${NC} and npm ${GREEN}${NPM_VER}${NC}"
else
  echo -e "${YELLOW} [!] Node.js or npm is not installed.${NC}"
  echo "     Please install Node.js (v18+) to use the official ArmorDesk CLI."
  echo "     Visit: https://nodejs.org/"
fi

# 2. Check MCP Gateway Connectivity
echo -e " [*] Probing live MCP Gateway at ${CYAN}https://armordesk.crusts.dev${NC}..."
if command -v curl >/dev/null 2>&1; then
  PING_RES=$(curl -s -X POST https://armordesk.crusts.dev/api/mcp/ping || true)
  if echo "$PING_RES" | grep -q "CONNECTED"; then
    echo -e " [✓] MCP Gateway status: ${GREEN}ONLINE & CONNECTED${NC}"
  else
    echo -e " [!] Gateway response received. Continuing setup..."
  fi
fi

# 3. Install or update @crustdev/armordesk CLI
echo -e " [*] Installing official CLI package ${CYAN}@crustdev/armordesk${NC}..."
if command -v npm >/dev/null 2>&1; then
  if npm install -g @crustdev/armordesk >/dev/null 2>&1; then
    echo -e " [✓] Installed globally: ${GREEN}armordesk${NC}"
  else
    echo -e " [✓] Global install requires sudo. Using instant npx runner."
  fi
fi

echo ""
echo "------------------------------------------------------------"
echo -e "${GREEN}${BOLD}Setup Complete! Next Steps:${NC}"
echo "------------------------------------------------------------"
echo ""
echo -e " 1. Log in to your ArmorDesk account:"
echo -e "    ${CYAN}npx @crustdev/armordesk login --email <your-email>${NC}"
echo ""
echo -e " 2. Verify Governed MCP Gateway status & tools:"
echo -e "    ${CYAN}npx @crustdev/armordesk mcp check${NC}"
echo ""
echo -e " 3. Export configuration for Claude Desktop:"
echo -e "    ${CYAN}npx @crustdev/armordesk mcp claude${NC}"
echo ""
echo -e " 4. View all commands & options:"
echo -e "    ${CYAN}npx @crustdev/armordesk --help${NC}"
echo ""
echo "Dashboard: https://armordesk.crusts.dev"
echo "------------------------------------------------------------"
