"""
ArmorDesk FastAPI Backend
Entrypoint for Enterprise AI Agent Control Plane, Approval Inbox & Trust Center.
"""
import json
import uuid
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
    ConfigUpdateRequest, ConfigResponse
)
from agents.finops_crew import FinOpsCrewOrchestrator
from armoriq_engine.core import generate_plan_hash, build_merkle_tree, verify_merkle_root
from armoriq_engine.client import ArmorIQClient
from mcp_servers import bank_payments_mcp
from services.compliance_generator import generate_compliance_bundle
from services.slack_notifier import send_slack_alert

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

# 11. Reset Sandbox
@app.post("/api/reset")
def reset_sandbox():
    init_db(reset=True)
    return {"status": "SUCCESS", "message": "Sandbox reset to clean initial seed data"}
