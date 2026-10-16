"""
ArmorIQ Core Governance Engine
Implements:
1. delegate() scoped tool delegation
2. await_approval() & delegation_id human-in-the-loop state
3. for_user role-based policy enforcement
4. Cryptographic SHA-256 Plan Hash & Merkle Tree Root verification
"""
import hashlib
import json
import uuid
from typing import Dict, Any, List, Tuple, Optional
from datetime import datetime, timezone

# Sub-agent scoped authority map
SUB_AGENT_SCOPES = {
    "ReaderAgent": {
        "allowed_tools": ["mcp.email.read", "mcp.files.parse"],
        "description": "Reads emails, attachments, and parses document contents"
    },
    "VerifierAgent": {
        "allowed_tools": ["mcp.crm.verify_vendor", "mcp.accounting.log"],
        "description": "Cross-references vendor registry and logs accounting events"
    },
    "ExecutorAgent": {
        "allowed_tools": ["mcp.bank.refund", "mcp.bank.wire_transfer"],
        "description": "Executes authorized financial transactions via bank sandbox"
    }
}

try:
    from armoriq_sdk.crypto_verify import canonical_json as sdk_canonical_json
except ImportError:
    sdk_canonical_json = None

def canonical_json(data: Any) -> str:
    """Deterministic JSON serialization for cryptographic hashing (RFC 8785)."""
    if sdk_canonical_json:
        try:
            return sdk_canonical_json(data).decode('utf-8')
        except Exception:
            pass
    return json.dumps(data, sort_keys=True, separators=(',', ':'))

def hash_sha256(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def generate_plan_hash(plan_dict: Dict[str, Any]) -> str:
    """
    Computes a deterministic SHA-256 signature of the orchestrator's approved plan.
    Covers allowed tools, spend limits, target vendors, and tenant identity.
    """
    serialized = canonical_json(plan_dict)
    return hash_sha256(serialized)

def build_merkle_tree(leaf_items: List[str]) -> Tuple[str, List[str]]:
    """
    Builds a simple deterministic Merkle Tree over executed step hashes.
    # ponytail: uses pairwise sha256 folding; upgrade to sparse Merkle tree if dynamic proofs are needed.
    """
    if not leaf_items:
        leaf_hashes = [hash_sha256("empty_tree_node")]
    else:
        leaf_hashes = [hash_sha256(item) for item in leaf_items]

    current_level = leaf_hashes[:]
    while len(current_level) > 1:
        next_level = []
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            right = current_level[i + 1] if i + 1 < len(current_level) else left
            combined = hash_sha256(left + right)
            next_level.append(combined)
        current_level = next_level

    root = current_level[0]
    return root, leaf_hashes

def verify_merkle_root(leaf_items: List[str], expected_root: str) -> bool:
    root, _ = build_merkle_tree(leaf_items)
    return root.lower() == expected_root.lower()

def delegate(
    agent_name: str,
    tool_name: str,
    tenant_policy: Dict[str, Any],
    tool_args: Optional[Dict[str, Any]] = None
) -> Tuple[bool, str]:
    """
    Scoped Delegation check:
    Ensures that a sub-agent only executes tools within its delegated capability grant.
    Prevents hijacked ReaderAgent from executing bank transfers or CRM dumps.
    """
    agent_spec = SUB_AGENT_SCOPES.get(agent_name)
    if not agent_spec:
        return False, f"BLOCKED_BY_DELEGATION_SCOPE: Unknown agent '{agent_name}'"

    allowed_tools = agent_spec["allowed_tools"]
    if tool_name not in allowed_tools:
        return False, (
            f"BLOCKED_BY_DELEGATION_SCOPE: Sub-agent '{agent_name}' lacks authority for tool '{tool_name}'. "
            f"Allowed scope: {allowed_tools}"
        )

    # Additional execution constraint checks for ExecutorAgent
    if agent_name == "ExecutorAgent" and tool_args:
        amount = float(tool_args.get("amount", 0.0))
        vendor = tool_args.get("vendor") or tool_args.get("recipient")

        vendor_allowlist = tenant_policy.get("vendor_allowlist", [])
        if vendor and vendor_allowlist and vendor not in vendor_allowlist:
            # Check if this is an unknown vendor wire transfer
            if tool_name == "mcp.bank.wire_transfer":
                return False, f"BLOCKED_BY_POLICY: Target vendor '{vendor}' is not in tenant allowlist {vendor_allowlist}"

    return True, f"ALLOWED_BY_DELEGATION: Sub-agent '{agent_name}' authorized for '{tool_name}'"

def for_user(
    user_role: str,
    action_type: str,
    amount: float = 0.0
) -> Tuple[bool, str]:
    """
    Role-based policy enforcement (Sarah Chen - CFO/Manager vs Alex Rivera - Intern).
    """
    role_norm = user_role.lower().strip()

    if role_norm == "intern":
        # Interns have read-only or micro observation privileges; no financial execution or CRM exports
        sensitive_actions = ["wire_transfer", "mcp.bank.wire_transfer", "mcp.bank.refund", "crm_export", "crm.dump"]
        if action_type in sensitive_actions or amount > 0:
            return False, (
                f"BLOCKED_BY_USER_POLICY: Junior Intern role unauthorized for sensitive action '{action_type}' "
                f"or non-zero spend (${amount:,.2f}). Requires CFO / Manager role."
            )
        return True, "ALLOWED_BY_USER_POLICY: Intern view operation permitted."

    # CFO / Manager role
    return True, f"ALLOWED_BY_USER_POLICY: Manager/CFO role approved for '{action_type}'"

def await_approval(
    conn,
    tenant_id: str,
    requested_by: str,
    role: str,
    amount: float,
    recipient: str,
    description: str,
    action_type: str,
    payload: Dict[str, Any],
    plan_hash: str
) -> str:
    """
    Halts execution and creates a delegation hold for human-in-the-loop sign-off.
    Returns delegation_id.
    """
    delegation_id = f"delg_{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).isoformat()

    cur = conn.cursor()
    cur.execute("""
        INSERT INTO approvals (
            delegation_id, tenant_id, requested_by, role, amount,
            recipient, description, action_type, status, plan_hash,
            payload_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        delegation_id, tenant_id, requested_by, role, amount,
        recipient, description, action_type, "HELD_FOR_APPROVAL", plan_hash,
        json.dumps(payload), now
    ))
    conn.commit()
    return delegation_id
