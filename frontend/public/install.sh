#!/usr/bin/env bash
# ArmorDesk Installer & Interactive Browser OAuth for Linux & macOS
# https://armordesk.crusts.dev

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
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

# 1. Check Node.js and NPM
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo -e " [✓] Detected Node.js $(node -v) and npm $(npm -v)"
fi

# 2. Check MCP Gateway Connectivity
echo -e " [*] Probing live MCP Gateway at ${CYAN}https://armordesk.crusts.dev${NC}..."
PING_RES=$(curl -s -X POST https://armordesk.crusts.dev/api/mcp/ping || true)
if echo "$PING_RES" | grep -q "CONNECTED"; then
  echo -e " [✓] MCP Gateway status: ${GREEN}ONLINE & CONNECTED${NC}"
fi

# 3. Request OAuth 2.0 Device Code
echo ""
echo -e "${BOLD}Browser Authentication (OAuth 2.0 Device Grant):${NC}"
echo "------------------------------------------------------------"

CODE_RES=$(curl -s -X POST https://armordesk.crusts.dev/api/auth/device/code \
  -H "Content-Type: application/json")

DEV_CODE=$(echo "$CODE_RES" | grep -o '"device_code":"[^"]*' | cut -d'"' -f4)
USER_CODE=$(echo "$CODE_RES" | grep -o '"user_code":"[^"]*' | cut -d'"' -f4)
AUTH_URL=$(echo "$CODE_RES" | grep -o '"verification_uri_complete":"[^"]*' | cut -d'"' -f4)

if [ -n "$DEV_CODE" ] && [ -n "$USER_CODE" ]; then
  echo -e "  1. Please open the link below in your browser to authorize:"
  echo -e "     👉  ${CYAN}${BOLD}${AUTH_URL}${NC}"
  echo ""
  echo -e "  2. Confirm your one-time device code:"
  echo -e "     🔑  ${GREEN}${BOLD}${USER_CODE}${NC}"
  echo "------------------------------------------------------------"

  # Attempt to open browser automatically
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$AUTH_URL" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$AUTH_URL" >/dev/null 2>&1 || true
  fi

  echo -n "Waiting for browser authorization..."
  MAX_POLLS=150
  COUNT=0
  AUTH_SUCCESS=0

  while [ $COUNT -lt $MAX_POLLS ]; do
    sleep 2
    COUNT=$((COUNT + 1))
    POLL_RES=$(curl -s -X POST https://armordesk.crusts.dev/api/auth/device/poll \
      -H "Content-Type: application/json" \
      -d "{\"device_code\": \"$DEV_CODE\"}" || true)

    if echo "$POLL_RES" | grep -q '"status":"APPROVED"'; then
      AUTH_SUCCESS=1
      TOKEN=$(echo "$POLL_RES" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
      USER_NAME=$(echo "$POLL_RES" | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
      USER_EMAIL=$(echo "$POLL_RES" | grep -o '"email":"[^"]*' | head -1 | cut -d'"' -f4)
      USER_ROLE=$(echo "$POLL_RES" | grep -o '"role":"[^"]*' | head -1 | cut -d'"' -f4)
      TENANT_ID=$(echo "$POLL_RES" | grep -o '"tenant_id":"[^"]*' | head -1 | cut -d'"' -f4)

      mkdir -p "$HOME/.armordesk"
      cat << EOF > "$HOME/.armordesk/config.json"
{
  "baseUrl": "https://armordesk.crusts.dev",
  "token": "$TOKEN",
  "user": {
    "name": "$USER_NAME",
    "email": "$USER_EMAIL",
    "role": "$USER_ROLE",
    "tenant_id": "$TENANT_ID"
  },
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
      chmod 600 "$HOME/.armordesk/config.json" 2>/dev/null || true
      break
    elif echo "$POLL_RES" | grep -q '"status":"DENIED"'; then
      echo ""
      echo -e "${YELLOW}Authorization was declined in browser.${NC}"
      break
    elif echo "$POLL_RES" | grep -q '"status":"EXPIRED"'; then
      echo ""
      echo -e "${YELLOW}Code expired.${NC}"
      break
    else
      echo -n "."
    fi
  done

  echo ""
  if [ $AUTH_SUCCESS -eq 1 ]; then
    echo -e "${GREEN}${BOLD}✓ Successfully Authenticated as ${USER_NAME} (${USER_EMAIL})!${NC}"
    echo -e "  Tenant: ${CYAN}${TENANT_ID}${NC} (Role: ${USER_ROLE})"
    echo -e "  Credentials saved to ${CYAN}~/.armordesk/config.json${NC}"
  else
    echo -e "${YELLOW}Browser authorization was skipped or timed out.${NC}"
    echo -e "You can log in anytime by running: ${CYAN}npx @crustdev/armordesk login${NC}"
  fi
fi

# 4. Optional global CLI install
if command -v npm >/dev/null 2>&1; then
  npm install -g @crustdev/armordesk >/dev/null 2>&1 || true
fi

echo ""
echo "------------------------------------------------------------"
echo -e "${GREEN}${BOLD}Setup Ready! Next Commands:${NC}"
echo "------------------------------------------------------------"
echo -e " • Check identity:      ${CYAN}npx @crustdev/armordesk whoami${NC}"
echo -e " • Verify MCP Gateway:  ${CYAN}npx @crustdev/armordesk mcp check${NC}"
echo -e " • Claude Desktop JSON: ${CYAN}npx @crustdev/armordesk mcp claude${NC}"
echo ""
echo "Dashboard: https://armordesk.crusts.dev"
echo "------------------------------------------------------------"
