"""
ArmorDesk Pydantic Schemas & DTOs
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class TenantInfo(BaseModel):
    id: str
    name: str
    spend_limit: float
    policy_rules: Dict[str, Any]
    balance: float
    currency: str

class TraceItem(BaseModel):
    id: str
    tenant_id: str
    user_role: str
    user_name: str
    agent_name: str
    prompt: str
    action: str
    status: str
    reason: str
    plan_hash: str
    merkle_root: str
    metadata: Dict[str, Any] = {}
    created_at: str

class ApprovalItem(BaseModel):
    delegation_id: str
    tenant_id: str
    requested_by: str
    role: str
    amount: float
    recipient: str
    description: str
    action_type: str
    status: str
    plan_hash: str
    payload: Dict[str, Any]
    created_at: str
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None

class ApprovalActionRequest(BaseModel):
    action: str = Field(..., description="'APPROVE' or 'REJECT'")
    user_role: str = "manager"
    user_name: str = "Sarah Chen"
    notes: Optional[str] = None

class ReceiptItem(BaseModel):
    id: str
    tenant_id: str
    delegation_id: Optional[str]
    action_type: str
    amount: float
    recipient: str
    status: str
    plan_hash: str
    merkle_root: str
    allowed_spec: Dict[str, Any]
    actual_execution: Dict[str, Any]
    signature: str
    verified: bool
    created_at: str

class VerifyProofRequest(BaseModel):
    plan_hash: str
    merkle_root: str
    signature: str
    allowed_spec: Dict[str, Any]
    actual_execution: Dict[str, Any]

class VerifyProofResponse(BaseModel):
    valid: bool
    computed_plan_hash: str
    computed_merkle_root: str
    matches_hash: bool
    matches_merkle: bool
    status: str
    details: str

class CTFSubmitRequest(BaseModel):
    tenant_id: str = "acme-corp"
    attacker_name: str = "Anonymous PenTester"
    prompt: str

class CTFSubmitResponse(BaseModel):
    id: str
    attacker_name: str
    prompt: str
    detected_threat: str
    blocked: bool
    score: int
    reason: str
    sub_agent_action: str
    created_at: str

class CTFLeaderboardEntry(BaseModel):
    id: str
    attacker_name: str
    prompt: str
    detected_threat: str
    blocked: bool
    score: int
    reason: str
    created_at: str

class ScenarioRunRequest(BaseModel):
    scenario_id: int = Field(..., ge=1, le=5)
    tenant_id: str = "acme-corp"
    user_role: str = "manager"
    user_name: str = "Sarah Chen"

class ScenarioStep(BaseModel):
    step: int
    agent: str
    tool: str
    status: str
    detail: str
    plan_hash: Optional[str] = None

class ScenarioRunResponse(BaseModel):
    scenario_id: int
    scenario_name: str
    overall_status: str
    summary: str
    steps: List[ScenarioStep]
    trace_id: Optional[str] = None
    delegation_id: Optional[str] = None
    receipt_id: Optional[str] = None

class GauntletSimulateRequest(BaseModel):
    scenario: str = "poisoned_invoice"  # 'poisoned_invoice', 'crm_dump', 'unauthorized_delete'
    custom_prompt: Optional[str] = None
    tenant_id: str = "acme-corp"

class GauntletSimulateResponse(BaseModel):
    scenario: str
    unprotected: Dict[str, Any]
    governed: Dict[str, Any]

class ConfigUpdateRequest(BaseModel):
    armoriq_pro_api_key: Optional[str] = None
    slack_webhook_url: Optional[str] = None

class ConfigResponse(BaseModel):
    armoriq_pro_active: bool
    armoriq_pro_api_key_masked: str
    slack_webhook_configured: bool
    mode: str
    sdk_version: Optional[str] = "0.6.10"
    backend_url: Optional[str] = "https://staging-api.armoriq.ai"
    account_email: Optional[str] = "rustamandelvianova@gmail.com"

class MCPToolDefinition(BaseModel):
    name: str
    description: str
    inputSchema: Dict[str, Any]

class MCPGatewayInfo(BaseModel):
    gateway_url: str
    sse_url: str
    protocol_version: str
    tenant_id: str
    api_key_masked: str
    governed_tools: List[MCPToolDefinition]
    connected_agents: List[Dict[str, Any]]
    sample_configs: Dict[str, Any]

class MCPTestToolRequest(BaseModel):
    tool: str
    arguments: Dict[str, Any]
    user_role: str = "manager"
    user_name: str = "Sarah Chen"
    tenant_id: str = "acme-corp"

