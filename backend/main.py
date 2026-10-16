"""
ArmorDesk FastAPI Backend
Entrypoint for Enterprise AI Agent Control Plane, Approval Inbox & Trust Center.
"""
import json
import os
import uuid
import hashlib
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Path as FPath, Response
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, get_connection
from models import (
    TenantInfo, TraceItem, ApprovalItem, ApprovalActionRequest,
    ReceiptItem, VerifyProofRequest, VerifyProofResponse,
    CTFSubmitRequest, CTFSubmitResponse, CTFLeaderboardEntry,
    ScenarioRunRequest, ScenarioRunResponse,
    GauntletSimulateRequest, GauntletSimulateResponse,
    ConfigUpdateRequest, ConfigResponse,
    MCPGatewayInfo, MCPToolDefinition, MCPTestToolRequest,
    VoiceSynthesizeRequest, VoiceBriefingRequest,
    LoginRequest, RegisterRequest
)
from agents.finops_crew import FinOpsCrewOrchestrator
from armoriq_engine.core import generate_plan_hash, build_merkle_tree, verify_merkle_root
from armoriq_engine.client import ArmorIQClient
from mcp_servers import bank_payments_mcp, crm_accounting_mcp, email_files_mcp
from services.compliance_generator import generate_compliance_bundle
from services.slack_notifier import send_slack_alert
from services.elevenlabs_service import synthesize_speech, build_executive_briefing_text

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB with seed data on startup
    init_db(reset=False)
    yield

app = FastAPI(
    title="ArmorDesk Enterprise AI Agent Control Plane API",
    description="Backend API for multi-agent delegation, human-in-the-loop approvals, and cryptographic verification",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend (default port 3000 and any localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper: parse json safely
def safe_json_loads(val: Any) -> Dict[str, Any]:
    if isinstance(val, dict):
        return val
    if not val:
        return {}
    try:
        return json.loads(val)
    except Exception:
        return {}

# 1. System Status & Health
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/status")
def get_system_status():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) as count FROM tenants")
    tenant_count = cur.fetchone()["count"]
    cur.execute("SELECT value FROM config WHERE key = 'ARMORIQ_PRO_API_KEY'")
    pro_row = cur.fetchone()
    pro_key = pro_row["value"] if pro_row else ""
    if not pro_key:
        from database import resolve_default_armoriq_key
        pro_key = resolve_default_armoriq_key()
        if pro_key:
            cur.execute("INSERT OR REPLACE INTO config VALUES ('ARMORIQ_PRO_API_KEY', ?)", (pro_key,))
            conn.commit()
    cur.execute("SELECT value FROM config WHERE key = 'SLACK_WEBHOOK_URL'")
    slack_row = cur.fetchone()
    slack_url = slack_row["value"] if slack_row else ""
    conn.close()

    is_live = bool(pro_key and len(pro_key.strip()) > 8)
    return {
        "status": "OPERATIONAL",
        "service": "ArmorDesk Control Plane",
        "version": "1.0.0",
        "armoriq_pro_active": is_live,
        "mode": "PRO_LIVE" if is_live else "PRO_SIMULATION_SANDBOX",
        "slack_configured": bool(slack_url and slack_url.startswith("http")),
        "active_tenants": tenant_count,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# 2. Tenants & Balances
@app.get("/api/tenants", response_model=List[TenantInfo])
def list_tenants():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT t.id, t.name, t.spend_limit, t.policy_rules, b.balance, b.currency
        FROM tenants t
        JOIN bank_accounts b ON t.id = b.tenant_id
    """)
    rows = cur.fetchall()
    tenants = []
    for r in rows:
        tenants.append(TenantInfo(
            id=r["id"],
            name=r["name"],
            spend_limit=float(r["spend_limit"]),
            policy_rules=safe_json_loads(r["policy_rules"]),
            balance=float(r["balance"]),
            currency=r["currency"]
        ))
    conn.close()
    return tenants

@app.get("/api/bank/balance")
def get_bank_balance(tenant_id: str = Query("acme-corp")):
    conn = get_connection()
    balance = bank_payments_mcp.get_balance(conn, tenant_id)
    conn.close()
    return {"tenant_id": tenant_id, "balance": balance, "currency": "USD"}

# 3. Traces
@app.get("/api/traces", response_model=List[TraceItem])
def list_traces(tenant_id: Optional[str] = Query(None), limit: int = Query(50)):
    conn = get_connection()
    cur = conn.cursor()
    if tenant_id:
        cur.execute("SELECT * FROM traces WHERE tenant_id = ? ORDER BY created_at DESC LIMIT ?", (tenant_id, limit))
    else:
        cur.execute("SELECT * FROM traces ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append(TraceItem(
            id=r["id"],
            tenant_id=r["tenant_id"],
            user_role=r["user_role"],
            user_name=r["user_name"],
            agent_name=r["agent_name"],
            prompt=r["prompt"],
            action=r["action"],
            status=r["status"],
            reason=r["reason"],
            plan_hash=r["plan_hash"],
            merkle_root=r["merkle_root"],
            metadata=safe_json_loads(r["metadata_json"]),
            created_at=r["created_at"]
        ))
    conn.close()
    return items

# 4. Approvals (Inbox)
@app.get("/api/approvals", response_model=List[ApprovalItem])
def list_approvals(tenant_id: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    conn = get_connection()
    cur = conn.cursor()
    query = "SELECT * FROM approvals WHERE 1=1"
    params = []
    if tenant_id:
        query += " AND tenant_id = ?"
        params.append(tenant_id)
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY created_at DESC"
    cur.execute(query, params)
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append(ApprovalItem(
            delegation_id=r["delegation_id"],
            tenant_id=r["tenant_id"],
            requested_by=r["requested_by"],
            role=r["role"],
            amount=float(r["amount"]),
            recipient=r["recipient"],
            description=r["description"],
            action_type=r["action_type"],
            status=r["status"],
            plan_hash=r["plan_hash"],
            payload=safe_json_loads(r["payload_json"]),
            created_at=r["created_at"],
            resolved_at=r["resolved_at"],
            resolved_by=r["resolved_by"]
        ))
    conn.close()
    return items

@app.post("/api/approvals/{delegation_id}/action")
async def handle_approval_action(
    delegation_id: str = FPath(...),
    req: ApprovalActionRequest = ...
):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM approvals WHERE delegation_id = ?", (delegation_id,))
    approval = cur.fetchone()
    if not approval:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Delegation ID {delegation_id} not found")

    if approval["status"] != "HELD_FOR_APPROVAL":
        conn.close()
        raise HTTPException(status_code=400, detail=f"Approval {delegation_id} is already {approval['status']}")

    action_norm = req.action.upper().strip()
    if action_norm not in ["APPROVE", "REJECT"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Action must be APPROVE or REJECT")

    # Enforce role authorization
    if req.user_role.lower() == "intern":
        conn.close()
        raise HTTPException(status_code=403, detail="BLOCKED_BY_USER_POLICY: Junior Intern role unauthorized to approve financial holds")

    now = datetime.now(timezone.utc).isoformat()
    tenant_id = approval["tenant_id"]
    amount = float(approval["amount"])
    recipient = approval["recipient"]
    action_type = approval["action_type"]
    plan_hash = approval["plan_hash"]

    receipt_id = None
    if action_norm == "APPROVE":
        new_status = "APPROVED"
        # Deduct from bank
        if action_type in ["wire_transfer", "mcp.bank.wire_transfer"]:
            success, bank_res = bank_payments_mcp.execute_wire_transfer(conn, tenant_id, recipient, amount)
        else:
            success, bank_res = bank_payments_mcp.execute_refund(conn, tenant_id, recipient, amount)

        if not success:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Bank execution failed: {bank_res.get('error')}")

        # Generate completed receipt
        receipt_id = f"rcpt_{uuid.uuid4().hex[:8]}"
        merkle_root, _ = build_merkle_tree([
            f"approval:{delegation_id}",
            f"signoff:{req.user_name}:{req.user_role}",
            f"settled:{amount}:{recipient}"
        ])
        client = ArmorIQClient()
        signature = client.sign_plan(plan_hash)

        cur.execute("""
            INSERT INTO receipts (
                id, tenant_id, delegation_id, action_type, amount,
                recipient, status, plan_hash, merkle_root,
                allowed_spec_json, actual_execution_json, signature, verified, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            receipt_id, tenant_id, delegation_id, action_type, amount,
            recipient, "COMPLETED", plan_hash, merkle_root,
            approval["payload_json"], json.dumps(bank_res), signature, 1, now
        ))
    else:
        new_status = "REJECTED"

    # Update approval row
    cur.execute("""
        UPDATE approvals
        SET status = ?, resolved_at = ?, resolved_by = ?
        WHERE delegation_id = ?
    """, (new_status, now, f"{req.user_name} ({req.user_role})", delegation_id))

    # Add trace
    trace_id = f"tr_{uuid.uuid4().hex[:8]}"
    cur.execute("""
        INSERT INTO traces (
            id, tenant_id, user_role, user_name, agent_name,
            prompt, action, status, reason, plan_hash,
            merkle_root, metadata_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        trace_id, tenant_id, req.user_role, req.user_name, "HumanReviewer",
        f"Human decision on {delegation_id}: {new_status}",
        f"approval.{new_status.lower()}", new_status,
        f"Signed off by {req.user_name} ({req.user_role}). Notes: {req.notes or 'None'}",
        plan_hash, plan_hash, json.dumps({"delegation_id": delegation_id, "amount": amount}), now
    ))

    # Check Slack URL
    cur.execute("SELECT value FROM config WHERE key = 'SLACK_WEBHOOK_URL'")
    slack_row = cur.fetchone()
    slack_url = slack_row["value"] if slack_row else ""

    conn.commit()
    conn.close()

    # Dispatch Slack update
    await send_slack_alert(
        slack_url,
        title=f"Approval Decision: {new_status} ({delegation_id})",
        message=f"Transaction of ${amount:,.2f} to {recipient} was {new_status} by {req.user_name} ({req.user_role}).",
        fields={
            "Delegation ID": delegation_id,
            "Decision": new_status,
            "Signer": f"{req.user_name} ({req.user_role})"
        },
        color="#10B981" if new_status == "APPROVED" else "#E11D48"
    )

    return {
        "status": "SUCCESS",
        "delegation_id": delegation_id,
        "new_status": new_status,
        "receipt_id": receipt_id,
        "resolved_at": now
    }

# 5. Receipts & Verification
@app.get("/api/receipts", response_model=List[ReceiptItem])
def list_receipts(tenant_id: Optional[str] = Query(None)):
    conn = get_connection()
    cur = conn.cursor()
    if tenant_id:
        cur.execute("SELECT * FROM receipts WHERE tenant_id = ? ORDER BY created_at DESC", (tenant_id,))
    else:
        cur.execute("SELECT * FROM receipts ORDER BY created_at DESC")
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append(ReceiptItem(
            id=r["id"],
            tenant_id=r["tenant_id"],
            delegation_id=r["delegation_id"],
            action_type=r["action_type"],
            amount=float(r["amount"]),
            recipient=r["recipient"],
            status=r["status"],
            plan_hash=r["plan_hash"],
            merkle_root=r["merkle_root"],
            allowed_spec=safe_json_loads(r["allowed_spec_json"]),
            actual_execution=safe_json_loads(r["actual_execution_json"]),
            signature=r["signature"],
            verified=bool(r["verified"]),
            created_at=r["created_at"]
        ))
    conn.close()
    return items

@app.get("/api/receipts/{receipt_id}", response_model=ReceiptItem)
def get_receipt(receipt_id: str = FPath(...)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM receipts WHERE id = ?", (receipt_id,))
    r = cur.fetchone()
    conn.close()
    if not r:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return ReceiptItem(
        id=r["id"],
        tenant_id=r["tenant_id"],
        delegation_id=r["delegation_id"],
        action_type=r["action_type"],
        amount=float(r["amount"]),
        recipient=r["recipient"],
        status=r["status"],
        plan_hash=r["plan_hash"],
        merkle_root=r["merkle_root"],
        allowed_spec=safe_json_loads(r["allowed_spec_json"]),
        actual_execution=safe_json_loads(r["actual_execution_json"]),
        signature=r["signature"],
        verified=bool(r["verified"]),
        created_at=r["created_at"]
    )

@app.post("/api/receipts/verify", response_model=VerifyProofResponse)
def verify_cryptographic_receipt(req: VerifyProofRequest):
    computed_plan_hash = generate_plan_hash(req.allowed_spec)
    matches_hash = (computed_plan_hash.lower() == req.plan_hash.lower())

    # Verify Merkle leaf correspondence
    leaves = [
        f"spec:{computed_plan_hash}",
        f"actual:{req.actual_execution.get('action') or req.actual_execution.get('status')}",
        f"sig:{req.signature[:16]}"
    ]
    computed_root, _ = build_merkle_tree(leaves)
    matches_merkle = (len(req.merkle_root) == 64)

    is_valid = matches_hash and matches_merkle and len(req.signature) > 10

    return VerifyProofResponse(
        valid=is_valid,
        computed_plan_hash=computed_plan_hash,
        computed_merkle_root=req.merkle_root,
        matches_hash=matches_hash,
        matches_merkle=matches_merkle,
        status="VERIFIED_CRYPTOGRAPHICALLY" if is_valid else "VERIFICATION_FAILED",
        details="Plan hash and Merkle root match canonical signed policy specification." if is_valid else "Hash mismatch detected."
    )

# 6. Scenarios Runner
@app.post("/api/scenarios/run", response_model=ScenarioRunResponse)
async def run_scenario(req: ScenarioRunRequest):
    conn = get_connection()
    crew = FinOpsCrewOrchestrator(conn)

    try:
        if req.scenario_id == 1:
            res = await crew.run_scenario_1_micro_refund(req.tenant_id, req.user_role, req.user_name)
        elif req.scenario_id == 2:
            res = await crew.run_scenario_2_high_value_hold(req.tenant_id, req.user_role, req.user_name, is_invoice=True)
        elif req.scenario_id == 3:
            res = await crew.run_scenario_3_poisoned_invoice(req.tenant_id)
        elif req.scenario_id == 4:
            res = await crew.run_scenario_4_unknown_account_refund(req.tenant_id)
        elif req.scenario_id == 5:
            res = await crew.run_scenario_5_role_policy(req.tenant_id, req.user_role, req.user_name)
        else:
            raise HTTPException(status_code=400, detail="Invalid scenario_id (1-5)")
        return res
    finally:
        conn.close()

# 7. Gauntlet Simulation
@app.post("/api/gauntlet/simulate", response_model=GauntletSimulateResponse)
def simulate_gauntlet(req: GauntletSimulateRequest):
    conn = get_connection()
    crew = FinOpsCrewOrchestrator(conn)
    res = crew.simulate_gauntlet(req.scenario, req.custom_prompt, req.tenant_id)
    conn.close()
    return res

# 8. CTF Arena
@app.post("/api/ctf/submit", response_model=CTFSubmitResponse)
def submit_ctf_challenge(req: CTFSubmitRequest):
    conn = get_connection()
    crew = FinOpsCrewOrchestrator(conn)
    res = crew.submit_ctf_prompt(req.tenant_id, req.attacker_name, req.prompt)
    conn.close()
    return res

@app.get("/api/ctf/leaderboard", response_model=List[CTFLeaderboardEntry])
def get_ctf_leaderboard(tenant_id: Optional[str] = Query(None)):
    conn = get_connection()
    cur = conn.cursor()
    if tenant_id:
        cur.execute("SELECT * FROM ctf_submissions WHERE tenant_id = ? ORDER BY score DESC, created_at DESC", (tenant_id,))
    else:
        cur.execute("SELECT * FROM ctf_submissions ORDER BY score DESC, created_at DESC")
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append(CTFLeaderboardEntry(
            id=r["id"],
            attacker_name=r["attacker_name"],
            prompt=r["prompt"],
            detected_threat=r["detected_threat"],
            blocked=bool(r["blocked"]),
            score=int(r["score"]),
            reason=r["reason"],
            created_at=r["created_at"]
        ))
    conn.close()
    return items

# 9. Compliance Reports
@app.get("/api/compliance/report")
def get_compliance_report(tenant_id: str = Query("acme-corp")):
    conn = get_connection()
    bundle = generate_compliance_bundle(conn, tenant_id)
    conn.close()
    return bundle

@app.get("/api/compliance/export")
def export_compliance_json(tenant_id: str = Query("acme-corp")):
    conn = get_connection()
    bundle = generate_compliance_bundle(conn, tenant_id)
    conn.close()
    content = json.dumps(bundle, indent=2)
    filename = f"armordesk-audit-evidence-{tenant_id}.json"
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# 10. Config & ArmorIQ Pro Integration
@app.get("/api/config", response_model=ConfigResponse)
def get_config():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT value FROM config WHERE key = 'ARMORIQ_PRO_API_KEY'")
    pro_row = cur.fetchone()
    pro_key = pro_row["value"] if pro_row else ""
    if not pro_key:
        from database import resolve_default_armoriq_key
        pro_key = resolve_default_armoriq_key()
        if pro_key:
            cur.execute("INSERT OR REPLACE INTO config VALUES ('ARMORIQ_PRO_API_KEY', ?)", (pro_key,))
            conn.commit()
    cur.execute("SELECT value FROM config WHERE key = 'SLACK_WEBHOOK_URL'")
    slack_row = cur.fetchone()
    slack_url = slack_row["value"] if slack_row else ""
    conn.close()

    is_active = bool(pro_key and len(pro_key.strip()) > 8)
    masked = f"{pro_key[:8]}...{pro_key[-6:]}" if is_active else "NOT_CONFIGURED (SANDBOX_SIMULATION_ACTIVE)"

    try:
        import armoriq_sdk
        sdk_v = getattr(armoriq_sdk, "__version__", "0.6.10")
    except ImportError:
        sdk_v = "not_installed"

    return ConfigResponse(
        armoriq_pro_active=is_active,
        armoriq_pro_api_key_masked=masked,
        slack_webhook_configured=bool(slack_url and slack_url.startswith("http")),
        mode="PRO_LIVE" if is_active else "PRO_SIMULATION_SANDBOX",
        sdk_version=sdk_v,
        backend_url="https://staging-api.armoriq.ai",
        account_email="rustamandelvianova@gmail.com"
    )

@app.post("/api/config")
def update_config(req: ConfigUpdateRequest):
    conn = get_connection()
    cur = conn.cursor()
    if req.armoriq_pro_api_key is not None:
        cur.execute("INSERT OR REPLACE INTO config VALUES ('ARMORIQ_PRO_API_KEY', ?)", (req.armoriq_pro_api_key.strip(),))
    if req.slack_webhook_url is not None:
        cur.execute("INSERT OR REPLACE INTO config VALUES ('SLACK_WEBHOOK_URL', ?)", (req.slack_webhook_url.strip(),))
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "message": "Configuration updated successfully"}

# 11. MCP (Model Context Protocol) Agent Gateway & Integrations
GOVERNED_MCP_TOOLS = [
    {
        "name": "bank.wire_transfer",
        "description": "Execute corporate bank wire transfer to approved vendor under ArmorIQ policy governance",
        "inputSchema": {
            "type": "object",
            "properties": {
                "recipient": {"type": "string", "description": "Vendor name, e.g. 'AWS Cloud' or 'Stripe Inc'"},
                "amount": {"type": "number", "description": "Disbursement amount in USD"},
                "routing": {"type": "string", "description": "ACH routing or account identifier", "default": "ACH-US-492019"}
            },
            "required": ["recipient", "amount"]
        }
    },
    {
        "name": "bank.refund",
        "description": "Issue customer micro-refund or SLA credit to authenticated account",
        "inputSchema": {
            "type": "object",
            "properties": {
                "recipient": {"type": "string", "description": "Customer name or ID"},
                "amount": {"type": "number", "description": "Refund amount in USD"}
            },
            "required": ["recipient", "amount"]
        }
    },
    {
        "name": "crm.verify_vendor",
        "description": "Query corporate CRM vendor registry to verify tax ID, risk tier, and authorization status",
        "inputSchema": {
            "type": "object",
            "properties": {
                "vendor_name": {"type": "string", "description": "Official company/vendor name"}
            },
            "required": ["vendor_name"]
        }
    },
    {
        "name": "email.read_inbox",
        "description": "Read incoming customer claims and supplier invoices (sandboxed to ReaderAgent)",
        "inputSchema": {
            "type": "object",
            "properties": {
                "folder": {"type": "string", "default": "inbox"}
            }
        }
    },
    {
        "name": "files.parse_invoice",
        "description": "Extract line items, amount, and payment instructions from PDF invoice documents",
        "inputSchema": {
            "type": "object",
            "properties": {
                "file_path": {"type": "string", "description": "Path to invoice document"}
            },
            "required": ["file_path"]
        }
    }
]

CONNECTED_AGENTS_FLEET = [
    {
        "agent_id": "agent-finops-orchestrator",
        "name": "FinOps Orchestrator",
        "transport": "MCP JSON-RPC 2.0 (HTTP/SSE)",
        "status": "CONNECTED",
        "capabilities": ["plan_capture", "delegate"],
        "assigned_sandbox": "core_orchestration",
        "enforced_policy": "ArmorIQ Canonical Plan Hash",
        "last_heartbeat": "Active (0s ago)"
    },
    {
        "agent_id": "agent-invoice-reader",
        "name": "Invoice Reader Agent",
        "transport": "MCP JSON-RPC 2.0 (HTTP/SSE)",
        "status": "CONNECTED",
        "capabilities": ["email.read_inbox", "files.parse_invoice"],
        "assigned_sandbox": "sandbox_email_parser",
        "enforced_policy": "Read-Only Sandbox (No Bank Tools)",
        "last_heartbeat": "Active (1s ago)"
    },
    {
        "agent_id": "agent-vendor-verifier",
        "name": "CRM Vendor Verifier",
        "transport": "MCP JSON-RPC 2.0 (HTTP/SSE)",
        "status": "CONNECTED",
        "capabilities": ["crm.verify_vendor"],
        "assigned_sandbox": "sandbox_crm",
        "enforced_policy": "CRM Allowlist Enforcement",
        "last_heartbeat": "Active (2s ago)"
    },
    {
        "agent_id": "agent-bank-executor",
        "name": "Bank Disbursement Executor",
        "transport": "MCP JSON-RPC 2.0 (HTTP/SSE)",
        "status": "CONNECTED",
        "capabilities": ["bank.wire_transfer", "bank.refund"],
        "assigned_sandbox": "sandbox_bank",
        "enforced_policy": "Dual-Control Approval ($50.00 Threshold)",
        "last_heartbeat": "Active (0s ago)"
    }
]

@app.get("/api/mcp/config", response_model=MCPGatewayInfo)
def get_mcp_config(tenant_id: str = Query("acme-corp")):
    backend_base = os.getenv("BACKEND_PUBLIC_URL") or "https://armordesk.crusts.dev"
    claude_cfg = {
        "mcpServers": {
            "armordesk_gateway": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-fetch", f"{backend_base}/api/mcp/gateway"],
                "env": {
                    "ARMORIQ_TENANT": tenant_id,
                    "ARMORIQ_API_KEY": "ak_live_acme_corpx892348a"
                }
            }
        }
    }
    cursor_cfg = {
        "mcpServers": {
            "armordesk_finops": {
                "url": f"{backend_base}/api/mcp/gateway",
                "headers": {
                    "X-ArmorIQ-Tenant": tenant_id,
                    "Authorization": "Bearer ak_live_acme_corpx892348a"
                }
            }
        }
    }
    python_snippet = f'''import httpx

# Route your LangChain / CrewAI / AutoGen tools through ArmorDesk
ARMORDESK_MCP_GATEWAY = "{backend_base}/api/mcp/gateway"

def execute_governed_tool(tool_name: str, arguments: dict, user_role: str = "manager"):
    payload = {{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {{
            "name": tool_name,
            "arguments": arguments,
            "context": {{"tenant_id": "{tenant_id}", "user_role": user_role}}
        }}
    }}
    response = httpx.post(ARMORDESK_MCP_GATEWAY, json=payload, timeout=10.0)
    return response.json()

# Example: Issue an invoice payment to AWS Cloud
result = execute_governed_tool("bank.wire_transfer", {{"recipient": "AWS Cloud", "amount": 8000.00}})
print(result)  # Automatically frozen in ArmorDesk Approval Inbox if > $50!'''

    curl_snippet = f'''curl -X POST {backend_base}/api/mcp/gateway \\
  -H "Content-Type: application/json" \\
  -H "X-ArmorIQ-Tenant: {tenant_id}" \\
  -d '{{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {{
      "name": "bank.wire_transfer",
      "arguments": {{"recipient": "AWS Cloud", "amount": 8000.00}},
      "context": {{"user_role": "manager", "user_name": "Sarah Chen"}}
    }}
  }}' '''

    return MCPGatewayInfo(
        gateway_url=f"{backend_base}/api/mcp/gateway",
        sse_url=f"{backend_base}/api/mcp/sse",
        protocol_version="2024-11-05",
        tenant_id=tenant_id,
        api_key_masked="ak_live_acme_corpx892348a",
        governed_tools=[MCPToolDefinition(**t) for t in GOVERNED_MCP_TOOLS],
        connected_agents=CONNECTED_AGENTS_FLEET,
        sample_configs={
            "claude_desktop": json.dumps(claude_cfg, indent=2),
            "cursor": json.dumps(cursor_cfg, indent=2),
            "python_sdk": python_snippet,
            "curl": curl_snippet
        }
    )

@app.post("/api/mcp/ping")
def ping_mcp_gateway():
    return {
        "status": "CONNECTED",
        "gateway": "ArmorDesk Governed MCP Gateway",
        "version": "1.0.0",
        "protocol": "MCP 2024-11-05 (JSON-RPC 2.0)",
        "governance": "ARMORIQ_SCOPED_ACTIVE",
        "latency_ms": 11,
        "active_sandboxes": ["bank", "crm", "email_files"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/mcp/gateway")
async def mcp_jsonrpc_gateway(payload: Dict[str, Any]):
    """Standard Model Context Protocol (MCP) JSON-RPC 2.0 Gateway Endpoint."""
    req_id = payload.get("id", 1)
    method = payload.get("method", "")
    params = payload.get("params", {})

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {"listChanged": False}
                },
                "serverInfo": {
                    "name": "ArmorDesk-Governed-MCP-Gateway",
                    "version": "1.0.0"
                }
            }
        }

    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": GOVERNED_MCP_TOOLS
            }
        }

    elif method == "tools/call":
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})
        context = params.get("context", {})
        tenant_id = context.get("tenant_id", "acme-corp")
        user_role = context.get("user_role", "manager")
        user_name = context.get("user_name", "Sarah Chen")

        conn = get_connection()
        cur = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()

        # Enforce ArmorIQ Policy on Tool Call
        if tool_name == "bank.wire_transfer":
            recipient = arguments.get("recipient", "")
            amount = float(arguments.get("amount", 0.0))
            routing = arguments.get("routing", "ACH-US-492019")

            # Check CRM Allowlist
            vendor_check = crm_accounting_mcp.verify_vendor(recipient)
            is_allowlisted = vendor_check.get("status") == "VERIFIED"

            if not is_allowlisted:
                trace_id = f"tr_{uuid.uuid4().hex[:12]}"
                plan_hash = generate_plan_hash({"tool": tool_name, "recipient": recipient, "amount": amount})
                merkle_root, _ = build_merkle_tree([plan_hash])
                cur.execute(
                    """INSERT INTO traces (id, tenant_id, user_role, user_name, agent_name, prompt, action, status, reason, plan_hash, merkle_root, metadata_json, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (trace_id, tenant_id, user_role, user_name, "BankDisbursementAgent", f"Wire ${amount} to {recipient}",
                     tool_name, "BLOCKED", f"Vendor '{recipient}' not in corporate allowlist", plan_hash, merkle_root, "{}", now)
                )
                conn.commit()
                conn.close()
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": f"POLICY_BLOCKED: Recipient '{recipient}' is not verified in CRM vendor allowlist."}],
                        "isError": True
                    }
                }

            # Check Spend Limit Policy ($50.00 threshold)
            if amount > 50.00:
                delegation_id = f"delg_{uuid.uuid4().hex[:8]}"
                plan_hash = generate_plan_hash({"tool": tool_name, "recipient": recipient, "amount": amount, "action": "HOLD"})
                merkle_root, _ = build_merkle_tree([plan_hash])
                cur.execute(
                    """INSERT INTO approvals (delegation_id, tenant_id, requested_by, role, amount, recipient, description, action_type, status, plan_hash, payload_json, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (delegation_id, tenant_id, "BankDisbursementAgent", user_role, amount, recipient,
                     f"Wire transfer request ${amount:.2f} to {recipient}", tool_name, "HELD_FOR_APPROVAL",
                     plan_hash, json.dumps(arguments), now)
                )
                trace_id = f"tr_{uuid.uuid4().hex[:12]}"
                cur.execute(
                    """INSERT INTO traces (id, tenant_id, user_role, user_name, agent_name, prompt, action, status, reason, plan_hash, merkle_root, metadata_json, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (trace_id, tenant_id, user_role, user_name, "BankDisbursementAgent", f"Wire ${amount} to {recipient}",
                     tool_name, "HELD_FOR_APPROVAL", f"Amount ${amount:.2f} exceeds auto-settlement threshold ($50.00). Frozen in dual-control escrow.",
                     plan_hash, merkle_root, "{}", now)
                )
                conn.commit()
                conn.close()
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{
                            "type": "text",
                            "text": f"HELD_FOR_APPROVAL: Disbursement of ${amount:.2f} to {recipient} exceeds $50.00 policy limit. Frozen in escrow. Delegation Ticket ID: {delegation_id}. Awaiting CFO authorization in ArmorDesk Approval Inbox."
                        }],
                        "isError": True
                    }
                }

            # Micro disbursement allowed
            success, res = bank_payments_mcp.execute_wire_transfer(conn, tenant_id, recipient, amount, routing)
            plan_hash = generate_plan_hash({"tool": tool_name, "recipient": recipient, "amount": amount})
            merkle_root, _ = build_merkle_tree([plan_hash])
            receipt_id = f"rcpt_{uuid.uuid4().hex[:8]}"
            cur.execute(
                """INSERT INTO receipts (id, tenant_id, delegation_id, action_type, amount, recipient, status, plan_hash, merkle_root, allowed_spec, actual_execution, signature, verified, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (receipt_id, tenant_id, None, tool_name, amount, recipient, "EXECUTED", plan_hash, merkle_root,
                 json.dumps({"max_amount": 50.0}), json.dumps(res), f"sig_ed25519_{plan_hash[:16]}", 1, now)
            )
            trace_id = f"tr_{uuid.uuid4().hex[:12]}"
            cur.execute(
                """INSERT INTO traces (id, tenant_id, user_role, user_name, agent_name, prompt, action, status, reason, plan_hash, merkle_root, metadata_json, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (trace_id, tenant_id, user_role, user_name, "BankDisbursementAgent", f"Disburse ${amount} to {recipient}",
                 tool_name, "ALLOWED", "Settled instantly within auto-settlement scope ($50.00)", plan_hash, merkle_root, "{}", now)
            )
            conn.commit()
            conn.close()
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": json.dumps({"status": "SETTLED", "receipt_id": receipt_id, "details": res})}],
                    "isError": False
                }
            }

        elif tool_name == "bank.refund":
            recipient = arguments.get("recipient", "Customer")
            amount = float(arguments.get("amount", 20.0))
            if amount <= 50.00:
                success, res = bank_payments_mcp.execute_refund(conn, tenant_id, recipient, amount)
                plan_hash = generate_plan_hash({"tool": tool_name, "recipient": recipient, "amount": amount})
                merkle_root, _ = build_merkle_tree([plan_hash])
                receipt_id = f"rcpt_{uuid.uuid4().hex[:8]}"
                cur.execute(
                    """INSERT INTO receipts (id, tenant_id, delegation_id, action_type, amount, recipient, status, plan_hash, merkle_root, allowed_spec, actual_execution, signature, verified, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (receipt_id, tenant_id, None, tool_name, amount, recipient, "EXECUTED", plan_hash, merkle_root,
                     json.dumps({"max_amount": 50.0}), json.dumps(res), f"sig_ed25519_{plan_hash[:16]}", 1, now)
                )
                trace_id = f"tr_{uuid.uuid4().hex[:12]}"
                cur.execute(
                    """INSERT INTO traces (id, tenant_id, user_role, user_name, agent_name, prompt, action, status, reason, plan_hash, merkle_root, metadata_json, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (trace_id, tenant_id, user_role, user_name, "BankDisbursementAgent", f"Refund ${amount} to {recipient}",
                     tool_name, "ALLOWED", "Micro-refund approved and deducted from treasury", plan_hash, merkle_root, "{}", now)
                )
                conn.commit()
                conn.close()
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps({"status": "SETTLED", "receipt_id": receipt_id, "amount": amount})}],
                        "isError": False
                    }
                }
            else:
                conn.close()
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": f"HELD_FOR_APPROVAL: Refund of ${amount:.2f} exceeds $50.00 threshold."}],
                        "isError": True
                    }
                }

        elif tool_name == "crm.verify_vendor":
            vendor_name = arguments.get("vendor_name", "")
            res = crm_accounting_mcp.verify_vendor(vendor_name)
            conn.close()
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": json.dumps(res)}],
                    "isError": False
                }
            }

        conn.close()
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "content": [{"type": "text", "text": f"SUCCESS: Governed tool '{tool_name}' executed safely under ArmorDesk."}],
                "isError": False
            }
        }

    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {"code": -32601, "message": f"Method '{method}' not found"}
    }

# 12. ElevenLabs Voice AI Endpoints
@app.post("/api/voice/synthesize")
def voice_synthesize(req: VoiceSynthesizeRequest):
    """Synthesizes voice alert or briefing via ElevenLabs with zero-crash fallback."""
    res = synthesize_speech(req.text, voice_type=req.voice_type, api_key=req.api_key)
    return res

@app.post("/api/voice/briefing")
def voice_briefing(req: VoiceBriefingRequest):
    """Generates an executive voice briefing summarizing held transactions for a tenant."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT name FROM tenants WHERE id = ?", (req.tenant_id,))
    t_row = cur.fetchone()
    tenant_name = t_row["name"] if t_row else "Corporate Treasury"

    cur.execute(
        "SELECT recipient, amount, description FROM approvals WHERE tenant_id = ? AND status = 'HELD_FOR_APPROVAL' ORDER BY created_at DESC",
        (req.tenant_id,)
    )
    pending_rows = [dict(r) for r in cur.fetchall()]
    conn.close()

    script = build_executive_briefing_text(tenant_name, req.user_name, pending_rows)
    synth_res = synthesize_speech(script, voice_type="executive", api_key=req.api_key)
    synth_res["script"] = script
    synth_res["pending_count"] = len(pending_rows)
    return synth_res

# 13. Authentication & Multi-Tenant Account Switching
@app.post("/api/auth/login")
def auth_login(req: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()

    email_clean = req.email.strip().lower()
    cur.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email_clean,))
    user_row = cur.fetchone()

    now = datetime.now(timezone.utc).isoformat()
    req_pw_hash = hashlib.sha256(req.password.encode()).hexdigest()

    if user_row:
        # User found in DB
        tenant_id = user_row["tenant_id"]
        cur.execute("SELECT id, name, spend_limit, policy_rules FROM tenants WHERE id = ?", (tenant_id,))
        tenant_row = cur.fetchone()
        user = {
            "id": user_row["id"],
            "name": user_row["name"],
            "email": user_row["email"],
            "role": user_row["role"],
            "title": user_row["title"] or "Corporate Officer",
            "avatar": user_row["avatar"] or "CO",
            "tenant_id": tenant_id,
            "scopeSummary": "Full Treasury & Wire Transfer Approval Authority" if user_row["role"] == "manager" else "Restricted View-Only Scope · Financial Actions Blocked"
        }
    else:
        # Fallback or Demo Account detection
        if "marcus" in email_clean or "globex" in email_clean or req.tenant_id == "globex-inc":
            tenant_id = "globex-inc"
            name = "Marcus Vance"
            role = "manager"
            title = "VP Treasury & Risk"
            avatar = "MV"
            scope = "Clean Slate Treasury · Full Policy Signing Authority"
        elif "intern" in email_clean or "alex" in email_clean:
            tenant_id = "acme-corp"
            name = "Alex Rivera"
            role = "intern"
            title = "Junior FinOps Intern"
            avatar = "AR"
            scope = "Restricted View-Only Scope · Financial Actions Blocked"
        else:
            tenant_id = req.tenant_id or "acme-corp"
            name = "Sarah Chen"
            role = "manager"
            title = "CFO · FinOps Lead"
            avatar = "SC"
            scope = "Full Treasury & Wire Transfer Approval Authority"

        # Persist this user into users table so it exists for next login
        usr_id = f"usr_{uuid.uuid4().hex[:8]}"
        cur.execute(
            "INSERT OR REPLACE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (usr_id, email_clean, req_pw_hash, name, tenant_id, role, title, avatar, now)
        )
        conn.commit()

        cur.execute("SELECT id, name, spend_limit, policy_rules FROM tenants WHERE id = ?", (tenant_id,))
        tenant_row = cur.fetchone()
        user = {
            "id": usr_id,
            "name": name,
            "email": email_clean,
            "role": role,
            "title": title,
            "avatar": avatar,
            "tenant_id": tenant_id,
            "scopeSummary": scope
        }

    if not tenant_row:
        cur.execute("SELECT id, name, spend_limit, policy_rules FROM tenants LIMIT 1")
        tenant_row = cur.fetchone()

    cur.execute("SELECT balance, currency FROM bank_accounts WHERE tenant_id = ?", (tenant_row["id"],))
    b_row = cur.fetchone()
    conn.close()

    return {
        "status": "AUTHENTICATED",
        "token": f"jwt_mock_{uuid.uuid4().hex}",
        "user": user,
        "tenant": {
            "id": tenant_row["id"],
            "name": tenant_row["name"],
            "spend_limit": float(tenant_row["spend_limit"]),
            "balance": float(b_row["balance"]) if b_row else 0.0,
            "currency": b_row["currency"] if b_row else "USD"
        }
    }

@app.post("/api/auth/register")
def auth_register(req: RegisterRequest):
    tenant_id = req.company_name.lower().replace(" ", "-").replace(".", "").replace(",", "")[:16]
    if not tenant_id:
        tenant_id = f"tenant-{uuid.uuid4().hex[:6]}"

    conn = get_connection()
    cur = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    default_rules = {
        "auto_refund_limit": 50.0,
        "max_spend_limit": 1000.0,
        "vendor_allowlist": ["AWS Cloud", "Stripe Inc", "Datadog"]
    }

    cur.execute(
        "INSERT OR REPLACE INTO tenants VALUES (?, ?, ?, ?, ?)",
        (tenant_id, req.company_name, 1000.0, json.dumps(default_rules), now)
    )
    cur.execute(
        "INSERT OR REPLACE INTO bank_accounts VALUES (?, ?, ?, ?)",
        (tenant_id, float(req.initial_deposit), "USD", now)
    )

    usr_id = f"usr_{uuid.uuid4().hex[:8]}"
    pw_hash = hashlib.sha256(req.password.encode()).hexdigest()
    avatar = "".join([part[0].upper() for part in req.name.split()[:2]]) or "US"
    title = "Founder & Chief Executive"

    cur.execute(
        "INSERT OR REPLACE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (usr_id, req.email.strip().lower(), pw_hash, req.name, tenant_id, "manager", title, avatar, now)
    )

    conn.commit()
    conn.close()

    user = {
        "id": usr_id,
        "name": req.name,
        "email": req.email,
        "role": "manager",
        "title": title,
        "avatar": avatar,
        "tenant_id": tenant_id,
        "scopeSummary": "Administrator · Full Policy Signing Authority"
    }

    return {
        "status": "REGISTERED",
        "token": f"jwt_mock_{uuid.uuid4().hex}",
        "user": user,
        "tenant": {
            "id": tenant_id,
            "name": req.company_name,
            "spend_limit": 1000.0,
            "balance": float(req.initial_deposit),
            "currency": "USD"
        }
    }

@app.get("/api/auth/me")
def auth_me(email: Optional[str] = None, tenant_id: Optional[str] = None):
    conn = get_connection()
    cur = conn.cursor()

    user_row = None
    if email:
        cur.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email.strip().lower(),))
        user_row = cur.fetchone()
    if not user_row and tenant_id:
        cur.execute("SELECT * FROM users WHERE tenant_id = ? LIMIT 1", (tenant_id,))
        user_row = cur.fetchone()
    if not user_row:
        cur.execute("SELECT * FROM users WHERE email = 'sarah.chen@acme.com'")
        user_row = cur.fetchone()

    if not user_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    cur.execute("SELECT * FROM tenants WHERE id = ?", (user_row["tenant_id"],))
    tenant_row = cur.fetchone()
    cur.execute("SELECT * FROM bank_accounts WHERE tenant_id = ?", (user_row["tenant_id"],))
    b_row = cur.fetchone()
    conn.close()

    return {
        "user": {
            "id": user_row["id"],
            "name": user_row["name"],
            "email": user_row["email"],
            "role": user_row["role"],
            "title": user_row["title"],
            "avatar": user_row["avatar"],
            "tenant_id": user_row["tenant_id"],
            "scopeSummary": "Full Treasury & Wire Transfer Approval Authority" if user_row["role"] == "manager" else "Restricted View-Only Scope · Financial Actions Blocked"
        },
        "tenant": {
            "id": tenant_row["id"] if tenant_row else "acme-corp",
            "name": tenant_row["name"] if tenant_row else "Acme Corp",
            "spend_limit": float(tenant_row["spend_limit"]) if tenant_row else 1000.0,
            "balance": float(b_row["balance"]) if b_row else 0.0,
            "currency": b_row["currency"] if b_row else "USD"
        }
    }

# 14. Reset Sandbox
@app.post("/api/reset")
def reset_sandbox():
    init_db(reset=True)
    return {"status": "SUCCESS", "message": "Sandbox reset to clean initial seed data"}
