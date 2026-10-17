/**
 * TypeScript Type Definitions for ArmorDesk SDK
 */
export interface StoredConfig {
    baseUrl?: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        title: string;
        avatar: string;
        tenant_id: string;
        scopeSummary: string;
    };
    tenant?: {
        id: string;
        name: string;
        spend_limit: number;
        balance: number;
        currency: string;
    };
    apiKey?: string;
    updatedAt?: string;
}
export interface LoginResponse {
    status: string;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        title: string;
        avatar: string;
        tenant_id: string;
        scopeSummary: string;
    };
    tenant: {
        id: string;
        name: string;
        spend_limit: number;
        balance: number;
        currency: string;
    };
}
export interface DeviceCodeResponse {
    device_code: string;
    user_code: string;
    verification_uri: string;
    verification_uri_complete: string;
    expires_in: number;
    interval: number;
}
export interface DevicePollResponse {
    status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED" | string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        tenant_id: string;
    };
    tenant?: {
        id: string;
        name: string;
        spend_limit: number;
        balance: number;
        currency: string;
    };
}
export interface MCPStatusResponse {
    status: string;
    gateway: string;
    version: string;
    protocol: string;
    governance: string;
    latency_ms: number;
    active_sandboxes: string[];
    timestamp: string;
}
export interface ArmorDeskClientOptions {
    /**
     * Base URL of ArmorDesk Control Plane instance
     * Default: "https://armordesk.crusts.dev"
     */
    baseUrl?: string;
    /**
     * ArmorIQ API Key or Pro Key (ak_live_..., ak_test_...)
     */
    apiKey?: string;
    /**
     * Tenant identifier for multi-tenant isolation
     * Default: "acme-corp"
     */
    tenantId?: string;
    /**
     * Default requesting user name
     */
    userName?: string;
    /**
     * Default requesting user role ('manager' | 'intern' | 'auditor')
     */
    userRole?: string;
    /**
     * Optional custom fetch implementation
     */
    fetch?: typeof fetch;
}
export interface ArmorDeskStatus {
    status: string;
    service: string;
    version: string;
    armoriq_pro_active: boolean;
    mode: string;
    slack_configured: boolean;
    active_tenants: number;
    timestamp: string;
}
export interface TenantInfo {
    id: string;
    name: string;
    spend_limit: number;
    policy_rules: Record<string, any>;
    balance: number;
    currency: string;
}
export interface TraceItem {
    id: string;
    tenant_id: string;
    user_role: string;
    user_name: string;
    agent_name: string;
    prompt: string;
    action: string;
    status: "ALLOWED" | "HELD_FOR_APPROVAL" | "BLOCKED" | string;
    reason: string;
    plan_hash: string;
    merkle_root: string;
    metadata: Record<string, any>;
    created_at: string;
}
export interface ApprovalItem {
    delegation_id: string;
    tenant_id: string;
    requested_by: string;
    role: string;
    amount: number;
    recipient: string;
    description: string;
    action_type: string;
    status: "HELD_FOR_APPROVAL" | "APPROVED" | "REJECTED";
    plan_hash: string;
    payload: Record<string, any>;
    created_at: string;
    resolved_at?: string;
    resolved_by?: string;
}
export interface ApprovalActionRequest {
    action: "APPROVE" | "REJECT";
    user_role?: string;
    user_name?: string;
    notes?: string;
}
export interface ReceiptItem {
    id: string;
    tenant_id: string;
    delegation_id?: string;
    action_type: string;
    amount: number;
    recipient: string;
    status: string;
    plan_hash: string;
    merkle_root: string;
    allowed_spec: Record<string, any>;
    actual_execution: Record<string, any>;
    signature: string;
    verified: boolean;
    created_at: string;
}
export interface VerifyProofRequest {
    plan_hash: string;
    merkle_root: string;
    signature: string;
    allowed_spec: Record<string, any>;
    actual_execution: Record<string, any>;
}
export interface VerifyProofResponse {
    valid: boolean;
    computed_plan_hash: string;
    computed_merkle_root: string;
    matches_hash: boolean;
    matches_merkle: boolean;
    status: string;
    details: string;
}
export interface MCPToolDef {
    name: string;
    description: string;
    input_schema: Record<string, any>;
    governing_agent: string;
    tier: "READ_ONLY" | "FINANCIAL" | "WRITE";
}
export interface ConnectedAgentItem {
    agent_id: string;
    name: string;
    transport: string;
    status: string;
    capabilities: string[];
    assigned_sandbox: string;
    enforced_policy: string;
    last_heartbeat: string;
}
export interface MCPGatewayConfig {
    gateway_url: string;
    sse_url: string;
    protocol_version: string;
    tenant_id: string;
    api_key_masked: string;
    governed_tools: MCPToolDef[];
    connected_agents: ConnectedAgentItem[];
    sample_configs: {
        claude_desktop: string;
        cursor: string;
        python_sdk: string;
        curl: string;
    };
}
export interface MCPCallRequest {
    jsonrpc: "2.0";
    id: string | number;
    method: "tools/call" | "tools/list";
    params: {
        name?: string;
        arguments?: Record<string, any>;
        context?: {
            user_role?: string;
            user_name?: string;
            delegation_id?: string;
        };
    };
}
export interface MCPCallResponse {
    jsonrpc: "2.0";
    id: string | number;
    result?: {
        content: Array<{
            type: "text";
            text: string;
        }>;
        isError?: boolean;
        governance?: {
            status: "ALLOWED" | "HELD_FOR_APPROVAL" | "BLOCKED";
            reason: string;
            plan_hash: string;
            merkle_root: string;
            delegation_id?: string;
        };
    };
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
export interface ScenarioRunRequest {
    scenario_id: number;
    tenant_id?: string;
}
export interface ScenarioStep {
    step: number;
    agent: string;
    tool: string;
    status: string;
    detail: string;
    plan_hash?: string;
}
export interface ScenarioRunResponse {
    scenario_id: number;
    scenario_name: string;
    overall_status: string;
    summary: string;
    steps: ScenarioStep[];
    trace_id?: string;
    delegation_id?: string;
    receipt_id?: string;
}
export interface CTFSubmitRequest {
    tenant_id?: string;
    attacker_name?: string;
    prompt: string;
}
export interface CTFSubmitResponse {
    id: string;
    attacker_name: string;
    prompt: string;
    detected_threat: string;
    blocked: boolean;
    score: number;
    reason: string;
    sub_agent_action: string;
    created_at: string;
}
export interface VoiceBriefingResponse {
    success: boolean;
    audio_base64: string;
    fallback_browser_tts: boolean;
    text: string;
    voice_type: string;
    voice_id: string;
    content_type: string;
    script: string;
    pending_count: number;
}
//# sourceMappingURL=types.d.ts.map