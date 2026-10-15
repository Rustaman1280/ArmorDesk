#!/usr/bin/env bash
set -e

# ArmorDesk — Enterprise AI Agent Control Plane & Trust Center
# Runs FastAPI Backend (port 8000) and Next.js Frontend (port 3000)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "================================================================="
echo "🛡️  ARMORDESK — Autonomous Agent Control Plane & Trust Center"
echo "================================================================="

# Trap cleanup on exit
cleanup() {
    echo ""
    echo "Stopping ArmorDesk services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "Done."
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend
echo "Starting FastAPI backend on http://127.0.0.1:8000 ..."
cd "$BACKEND_DIR"
PYTHONPATH=. "$BACKEND_DIR/.venv/bin/python" -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend health check..."
until curl -s http://127.0.0.1:8000/api/status >/dev/null; do
    sleep 0.5
done
echo "Backend is live!"

# 2. Start Frontend
echo "Starting Next.js frontend on http://127.0.0.1:3000 ..."
cd "$FRONTEND_DIR"
./node_modules/.bin/next dev -p 3000 &
FRONTEND_PID=$!

echo ""
echo "================================================================="
echo "🚀 ArmorDesk is now running and ready for evaluation!"
echo "   - Control Plane Dashboard : http://localhost:3000"
echo "   - Split-Screen Gauntlet   : http://localhost:3000/gauntlet"
echo "   - Approval Inbox          : http://localhost:3000/inbox"
echo "   - Verifiable Receipts     : http://localhost:3000/receipts"
echo "   - Compliance Evidence     : http://localhost:3000/compliance"
echo "   - Executive Takeaways     : http://localhost:3000/takeaways"
echo "   - Backend API Docs        : http://localhost:8000/docs"
echo "================================================================="
echo "Press Ctrl+C to stop all services."

wait
