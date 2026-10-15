# ArmorDesk — Enterprise AI Agent Control Plane, Approval Inbox & Trust Center

> **B2B SaaS Multi-Agent Governance Platform for FinOps & DevOps**  
> Built for the ArmorIQ & Model Context Protocol (MCP) Ecosystem Hackathon.

ArmorDesk replaces brittle LLM prompt filters with **deterministic protocol-level scoped delegation (`delegate()`)**, **human-in-the-loop authorization holds (`await_approval()`)**, **role-based user policies (`for_user`)**, and **mathematical non-repudiation via SHA-256 Plan Hashes and Merkle tree roots**.

---

## 🎯 2-Minute Hackathon Demo Script for Judges

Follow this quick sequence during live evaluation:

### 1. Split-Screen Prompt-Injection Gauntlet (Visual Demo — 40 Pts)
- Navigate to **`http://localhost:3000/gauntlet`**.
- Click **"Run Simultaneous Attack"** on the Poisoned $9,000 Invoice scenario.
- **Left Panel (Unprotected Agent):** Observe how the agent blindly obeys the indirect injection text, leaking 3 customer CRM emails to `attacker@evil.tld` and wiring $9,000 to offshore account `998877-ATK` (**DATA EXFILTRATED & $9,000 STOLEN**).
- **Right Panel (ArmorDesk Governed Crew):** Observe the identical attack intercepted immediately by `delegate()`. ReaderAgent is denied financial authority and CRM export tools. **$0.00 lost, 0 data leaked, Merkle proof generated**.
- **CTF Mini Arena:** Scroll down to the Break-the-Agent CTF Arena, enter an adversarial prompt payload, and fire it to verify real-time defense scoring and live leaderboard logging.

### 2. Human-in-the-Loop Approval Inbox & Role Policy (Live Usability — 40 Pts)
- Navigate to **`http://localhost:3000/inbox`**.
- Notice the pending hold for AWS Cloud ($8,000). Click **"Approve & Settle"**.
- Watch the transaction instantly settle: SQLite bank treasury deducts the funds, an immutable audit trace is recorded, Slack notification is dispatched, and a receipt is issued.
- **Role Enforcement Test (`for_user`):** In the top global header, switch the role from **Sarah Chen (CFO)** to **Alex Rivera (Junior Intern)**. Try to approve a financial hold or execute a high-value transfer. ArmorIQ blocks it instantly with `BLOCKED_BY_USER_POLICY`.

### 3. Customer-Facing Agent Receipts & Cryptographic Verification (ArmorTools Pro — 5 Pts)
- Navigate to **`http://localhost:3000/receipts`**.
- View the side-by-side comparison:
  - *What the Agent Was Allowed to Do (Signed Plan)* vs.
  - *What the Agent Actually Did (Verified Execution)*.
- Click **"Verify Cryptographic Proof"**. Watch the system recompute canonical SHA-256 hashes and Merkle tree leaves on the fly, confirming mathematical non-repudiation.
- Click **"ArmorTools Pro"** in the top header to inspect the active API status badge or enter live credentials.

### 4. Continuous Compliance & Product Takeaways (Vision — 15 Pts)
- Navigate to **`http://localhost:3000/compliance`** to view live **SOC 2 Type II** and **ISO/IEC 27001** audit controls, and download the full signed JSON evidence packet.
- Navigate to **`http://localhost:3000/takeaways`** to review our core architectural insight, SaaS FinOps commercial pricing model, and MCP federation roadmap.

---

## 🏗️ Architecture & Technical Core

### 1. Scoped Delegation (`delegate()`)
Multi-agent crew members receive restricted authority tokens:
- **`ReaderAgent`**: Authorized only for `["mcp.email.read", "mcp.files.parse"]`.
- **`VerifierAgent`**: Authorized only for `["mcp.crm.verify_vendor", "mcp.accounting.log"]`.
- **`ExecutorAgent`**: Authorized only for `["mcp.bank.refund", "mcp.bank.wire_transfer"]`, restricted by tenant spend limits and vendor allowlists (`["AWS Cloud", "Stripe Inc", "Acme Supplies", "Datadog", "GitHub Enterprise"]`).

### 2. Cryptographic Plan Hashes & Merkle Trees
Before execution, plans are canonically serialized and signed:
```text
plan_hash = SHA256(canonical_json(plan_spec))
merkle_root = fold_pairwise([hash(step1), hash(step2), ...])
```

### 3. Human-in-the-Loop (`await_approval()`)
Transactions above policy thresholds ($100 for refunds, $1,000 for invoices) automatically pause and generate a unique `delegation_id` (`delg_XXXXXXXX`) queued in the Approval Inbox.

---

## 📁 Monorepo Structure

```text
ArmorDesk/
├── AGENTS.md
├── start.sh                         # Launches FastAPI (8000) & Next.js (3000)
├── README.md
├── backend/
│   ├── requirements.txt
│   ├── main.py                      # FastAPI REST API + CORS + Endpoints
│   ├── database.py                  # SQLite store & seed data initialization
│   ├── models.py                    # Pydantic schemas & DTOs
│   ├── armoriq_engine/
│   │   ├── core.py                  # delegate(), await_approval(), for_user, SHA-256 Plan Hash & Merkle Tree
│   │   └── client.py                # ArmorIQ Pro Client (Live API + Fallback Cryptographic Sandbox)
│   ├── mcp_servers/
│   │   ├── email_files_mcp.py       # Email Inbox & Invoice parser sandbox
│   │   ├── crm_accounting_mcp.py    # CRM customer records & vendor allowlist
│   │   └── bank_payments_mcp.py     # Treasury balance, wire transfers & refunds
│   ├── agents/
│   │   └── finops_crew.py           # Multi-Agent Orchestrator & 3 Sub-Agents
│   ├── services/
│   │   ├── slack_notifier.py        # Slack webhook dispatcher
│   │   └── compliance_generator.py  # SOC 2 & ISO 27001 evidence packager
│   └── self_check.py                # Assert-based validation test suite
└── frontend/
    ├── package.json
    ├── src/
    │   ├── context/AppContext.tsx   # Global Tenant & for_user Role Switcher
    │   ├── components/
    │   │   ├── Navbar.tsx           # Enterprise Header & Navigation
    │   │   └── ProSettingsModal.tsx # ArmorTools Pro & Slack settings modal
    │   ├── app/
    │   │   ├── layout.tsx           # Global shell
    │   │   ├── page.tsx             # Overview & Multi-Agent Architecture visualizer
    │   │   ├── gauntlet/page.tsx    # Split-Screen Gauntlet & Break-the-Agent CTF Arena
    │   │   ├── inbox/page.tsx       # Approval Inbox with delegation_id
    │   │   ├── receipts/page.tsx    # Agent Receipts & Plan Hash Verifier
    │   │   ├── compliance/page.tsx  # SOC 2 / ISO Compliance Evidence Generator
    │   │   └── takeaways/page.tsx   # Executive Vision & Roadmap
    │   └── lib/api.ts               # Backend API integration client
```

---

## ⚡ Quick Start

### 1. One-Click Launch (Recommended)
```bash
./start.sh
```
Open **`http://localhost:3000`** in your browser.

### 2. Manual Startup

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Verification & Self-Check

Run the built-in assert verification suite:
```bash
backend/.venv/bin/python backend/self_check.py
```
Outputs:
```text
[1/6] Initializing database & seed data...
[2/6] Verifying Cryptographic Plan Hash & Merkle Tree...
[3/6] Verifying Scoped Delegation & Role Governance...
[4/6] Running Scenarios 1-5 via FinOps Crew...
[5/6] Verifying Split-Screen Gauntlet Simulation & CTF...
[6/6] Verifying Compliance Generator...
ALL CHECKS PASSED SUCCESSFULLY!
```
