#!/usr/bin/env bash
set -e

# ==============================================================================
# 🛡️ ARMORDESK — Enterprise AI Agent Control Plane & Trust Center
# Built for ArmorIQ & Model Context Protocol (MCP) Hackathon
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# Colors for terminal output
BOLD="\033[1m"
GREEN="\033[38;2;16;185;129m"
CYAN="\033[38;2;6;182;212m"
AMBER="\033[38;2;245;158;11m"
DIM="\033[2m"
RESET="\033[0m"

echo -e "${GREEN}${BOLD}"
cat << "EOF"
    ___                               ____             __  
   /   |  _________ ___  ____  _____ / __ \___  _____ / /__
  / /| | / ___/ __ `__ \/ __ \/ ___// / / / _ \/ ___// //_/
 / ___ |/ /  / / / / / / /_/ / /   / /_/ /  __(__  )/ ,<   
/_/  |_/_/  /_/ /_/ /_/\____/_/   /_____/\___/____//_/|_|  
  Autonomous AI Agent Control Plane & Trust Center
EOF
echo -e "${RESET}"

# Cleanup handler on exit (Ctrl+C)
cleanup() {
    echo ""
    echo -e "${AMBER}Shutting down ArmorDesk services...${RESET}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}✓ All services stopped cleanly.${RESET}"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Free existing ports if already in use by stale sessions
free_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo -e "${DIM}Freeing port :$port (terminating PID: $pids)...${RESET}"
        kill -9 $pids 2>/dev/null || true
        sleep 0.5
    fi
}

echo -e "${BOLD}[1/4] Checking System & Dependencies...${RESET}"

# 1. Check Python virtual environment
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo -e "Creating Python virtualenv in ${CYAN}backend/.venv${RESET}..."
    python3 -m venv "$BACKEND_DIR/.venv"
    "$BACKEND_DIR/.venv/bin/pip" install --upgrade pip -q
    echo -e "Installing Python dependencies from requirements.txt..."
    "$BACKEND_DIR/.venv/bin/pip" install -r "$BACKEND_DIR/requirements.txt" -q
fi

# 2. Check Node modules
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "Installing frontend packages in ${CYAN}frontend/node_modules${RESET}..."
    cd "$FRONTEND_DIR" && npm install --silent
    cd "$ROOT_DIR"
fi

# 3. Free ports 8000 and 3000 if occupied
free_port 8000
free_port 3000

# 4. Run Self-Check Test Suite
echo -e "${BOLD}[2/4] Running Cryptographic & Scenario Verification...${RESET}"
cd "$BACKEND_DIR"
PYTHONPATH=. "$BACKEND_DIR/.venv/bin/python" self_check.py
cd "$ROOT_DIR"

# 5. Start Backend
echo ""
echo -e "${BOLD}[3/4] Starting FastAPI Backend on :8000...${RESET}"
cd "$BACKEND_DIR"
PYTHONPATH=. "$BACKEND_DIR/.venv/bin/python" -m uvicorn main:app --host 0.0.0.0 --port 8000 --log-level warning &
BACKEND_PID=$!
cd "$ROOT_DIR"

# Wait for backend health check
until curl -s http://127.0.0.1:8000/api/status >/dev/null; do
    sleep 0.4
done
echo -e "${GREEN}✓ Backend is live with ArmorIQ Staging Enforcement.${RESET}"

# 6. Start Frontend
echo -e "${BOLD}[4/4] Starting Next.js Frontend on :3000...${RESET}"
cd "$FRONTEND_DIR"
./node_modules/.bin/next dev -p 3000 >/dev/null 2>&1 &
FRONTEND_PID=$!
cd "$ROOT_DIR"

# Wait for frontend to answer
until curl -s http://127.0.0.1:3000 >/dev/null; do
    sleep 0.5
done
echo -e "${GREEN}✓ Frontend is live.${RESET}"

echo ""
echo -e "${GREEN}======================================================================${RESET}"
echo -e "${BOLD}🎯 ARMORDESK READY FOR LIVE EVALUATION${RESET}"
echo -e "${GREEN}======================================================================${RESET}"
echo -e "  ${BOLD}Landing Page & Live Gauntlet :${RESET} ${CYAN}http://localhost:3000${RESET}"
echo -e "  ${BOLD}Enterprise Control Plane    :${RESET} ${CYAN}http://localhost:3000/overview${RESET}"
echo -e "  ${BOLD}Prompt Gauntlet & CTF Arena :${RESET} ${CYAN}http://localhost:3000/gauntlet${RESET}"
echo -e "  ${BOLD}Human Approval Inbox (Holds):${RESET} ${CYAN}http://localhost:3000/inbox${RESET}"
echo -e "  ${BOLD}Cryptographic Agent Receipts :${RESET} ${CYAN}http://localhost:3000/receipts${RESET}"
echo -e "  ${BOLD}SOC 2 / ISO Audit Evidence   :${RESET} ${CYAN}http://localhost:3000/compliance${RESET}"
echo -e "  ${BOLD}Executive Vision & FinOps   :${RESET} ${CYAN}http://localhost:3000/takeaways${RESET}"
echo -e "  ${BOLD}FastAPI Backend Swagger Docs:${RESET} ${CYAN}http://localhost:8000/docs${RESET}"
echo -e "${GREEN}======================================================================${RESET}"
echo -e "${DIM}Tip: Run ${BOLD}./demo.sh${RESET}${DIM} in another terminal to execute all 5 scenarios via CLI.${RESET}"
echo -e "Press ${BOLD}Ctrl+C${RESET} to gracefully stop all services."
echo ""

wait
