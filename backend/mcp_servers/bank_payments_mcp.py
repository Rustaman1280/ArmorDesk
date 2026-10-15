"""
Sandbox MCP Server: Bank & Payments
Executes bank balance checks, wire transfers, and refunds against persistent SQLite store.
"""
import sqlite3
from datetime import datetime, timezone
from typing import Dict, Any, Tuple

def get_balance(conn: sqlite3.Connection, tenant_id: str) -> float:
    cur = conn.cursor()
    cur.execute("SELECT balance FROM bank_accounts WHERE tenant_id = ?", (tenant_id,))
    row = cur.fetchone()
    if row:
        return float(row["balance"])
    return 0.0

def execute_refund(
    conn: sqlite3.Connection,
    tenant_id: str,
    recipient: str,
    amount: float
) -> Tuple[bool, Dict[str, Any]]:
    """Deducts refund amount from tenant bank account."""
    cur = conn.cursor()
    cur.execute("SELECT balance FROM bank_accounts WHERE tenant_id = ?", (tenant_id,))
    row = cur.fetchone()
    if not row:
        return False, {"error": f"Tenant account '{tenant_id}' not found"}

    current_balance = float(row["balance"])
    if current_balance < amount:
        return False, {"error": "INSUFFICIENT_FUNDS", "balance": current_balance}

    new_balance = current_balance - amount
    now = datetime.now(timezone.utc).isoformat()
    cur.execute(
        "UPDATE bank_accounts SET balance = ?, updated_at = ? WHERE tenant_id = ?",
        (new_balance, now, tenant_id)
    )
    conn.commit()

    return True, {
        "status": "SETTLED",
        "action": "REFUND",
        "amount": amount,
        "recipient": recipient,
        "new_balance": new_balance,
        "transaction_ref": f"TX-REFUND-{int(amount * 100)}-{now[-6:]}"
    }

def execute_wire_transfer(
    conn: sqlite3.Connection,
    tenant_id: str,
    recipient: str,
    amount: float,
    routing: str = "ACH-DEFAULT"
) -> Tuple[bool, Dict[str, Any]]:
    """Executes bank wire transfer to approved vendor."""
    cur = conn.cursor()
    cur.execute("SELECT balance FROM bank_accounts WHERE tenant_id = ?", (tenant_id,))
    row = cur.fetchone()
    if not row:
        return False, {"error": f"Tenant account '{tenant_id}' not found"}

    current_balance = float(row["balance"])
    if current_balance < amount:
        return False, {"error": "INSUFFICIENT_FUNDS", "balance": current_balance}

    new_balance = current_balance - amount
    now = datetime.now(timezone.utc).isoformat()
    cur.execute(
        "UPDATE bank_accounts SET balance = ?, updated_at = ? WHERE tenant_id = ?",
        (new_balance, now, tenant_id)
    )
    conn.commit()

    return True, {
        "status": "SETTLED",
        "action": "WIRE_TRANSFER",
        "amount": amount,
        "recipient": recipient,
        "routing": routing,
        "new_balance": new_balance,
        "transaction_ref": f"WIRE-{int(amount)}-{now[-6:]}"
    }
