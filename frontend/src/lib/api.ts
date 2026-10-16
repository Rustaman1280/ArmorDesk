/**
 * ArmorDesk Frontend API Client
 * Connects Next.js UI to FastAPI backend on http://127.0.0.1:8000
 */

const API_BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || "/api")
  : (process.env.INTERNAL_API_URL || "http://127.0.0.1:8000/api");

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

export interface CTFLeaderboardEntry {
  id: string;
  attacker_name: string;
  prompt: string;
  detected_threat: string;
  blocked: boolean;
  score: number;
  reason: string;
  created_at: string;
}

export interface ScenarioRunResponse {
  scenario_id: number;
  scenario_name: string;
  overall_status: string;
  summary: string;
  steps: Array<{
    step: number;
    agent: string;
    tool: string;
    status: string;
    detail: string;
    plan_hash?: string;
  }>;
  trace_id?: string;
  delegation_id?: string;
  receipt_id?: string;
}

export interface MCPToolDef {
  name: string;
  description: string;
  inputSchema: any;
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

export const api = {
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`, { cache: "no-store" });
    return res.json();
  },

  async getTenants(): Promise<TenantInfo[]> {
    const res = await fetch(`${API_BASE}/tenants`, { cache: "no-store" });
    return res.json();
  },

  async getBankBalance(tenantId: string) {
    const res = await fetch(`${API_BASE}/bank/balance?tenant_id=${tenantId}`, { cache: "no-store" });
    return res.json();
  },

  async getTraces(tenantId?: string): Promise<TraceItem[]> {
    const url = tenantId ? `${API_BASE}/traces?tenant_id=${tenantId}` : `${API_BASE}/traces`;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
  },

  async getApprovals(tenantId?: string, status?: string): Promise<ApprovalItem[]> {
    let url = `${API_BASE}/approvals?`;
    if (tenantId) url += `tenant_id=${tenantId}&`;
    if (status) url += `status=${status}&`;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
  },

  async takeApprovalAction(
    delegationId: string,
    action: "APPROVE" | "REJECT",
    userRole: string = "manager",
    userName: string = "Sarah Chen",
    notes?: string
  ) {
    const res = await fetch(`${API_BASE}/approvals/${delegationId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, user_role: userRole, user_name: userName, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Approval action failed");
    }
    return res.json();
  },

  async getReceipts(tenantId?: string): Promise<ReceiptItem[]> {
    const url = tenantId ? `${API_BASE}/receipts?tenant_id=${tenantId}` : `${API_BASE}/receipts`;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
  },

  async getReceipt(receiptId: string): Promise<ReceiptItem> {
    const res = await fetch(`${API_BASE}/receipts/${receiptId}`, { cache: "no-store" });
    return res.json();
  },

  async verifyReceiptProof(data: {
    plan_hash: string;
    merkle_root: string;
    signature: string;
    allowed_spec: Record<string, any>;
    actual_execution: Record<string, any>;
  }) {
    const res = await fetch(`${API_BASE}/receipts/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async runScenario(
    scenarioId: number,
    tenantId: string = "acme-corp",
    userRole: string = "manager",
    userName: string = "Sarah Chen"
  ): Promise<ScenarioRunResponse> {
    const res = await fetch(`${API_BASE}/scenarios/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario_id: scenarioId, tenant_id: tenantId, user_role: userRole, user_name: userName })
    });
    return res.json();
  },

  async simulateGauntlet(scenario: string, customPrompt?: string, tenantId: string = "acme-corp") {
    const res = await fetch(`${API_BASE}/gauntlet/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, custom_prompt: customPrompt, tenant_id: tenantId })
    });
    return res.json();
  },

  async submitCTF(tenantId: string, attackerName: string, prompt: string) {
    const res = await fetch(`${API_BASE}/ctf/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_id: tenantId, attacker_name: attackerName, prompt })
    });
    return res.json();
  },

  async getCTFLeaderboard(tenantId?: string): Promise<CTFLeaderboardEntry[]> {
    const url = tenantId ? `${API_BASE}/ctf/leaderboard?tenant_id=${tenantId}` : `${API_BASE}/ctf/leaderboard`;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
  },

  async getComplianceReport(tenantId: string = "acme-corp") {
    const res = await fetch(`${API_BASE}/compliance/report?tenant_id=${tenantId}`, { cache: "no-store" });
    return res.json();
  },

  getComplianceExportUrl(tenantId: string = "acme-corp") {
    return `${API_BASE}/compliance/export?tenant_id=${tenantId}`;
  },

  async getConfig() {
    const res = await fetch(`${API_BASE}/config`, { cache: "no-store" });
    return res.json();
  },

  async updateConfig(apiKey?: string, webhookUrl?: string) {
    const res = await fetch(`${API_BASE}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ armoriq_pro_api_key: apiKey, slack_webhook_url: webhookUrl })
    });
    return res.json();
  },

  async resetSandbox() {
    const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
    return res.json();
  },

  async getMCPConfig(tenantId: string = "acme-corp"): Promise<MCPGatewayConfig> {
    const res = await fetch(`${API_BASE}/mcp/config?tenant_id=${tenantId}`, { cache: "no-store" });
    return res.json();
  },

  async pingMCPGateway() {
    const res = await fetch(`${API_BASE}/mcp/ping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },

  async callMCPTool(
    toolName: string,
    argumentsObj: any,
    userRole: string = "manager",
    userName: string = "Sarah Chen",
    tenantId: string = "acme-corp"
  ) {
    const res = await fetch(`${API_BASE}/mcp/gateway`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: argumentsObj,
          context: { tenant_id: tenantId, user_role: userRole, user_name: userName }
        }
      })
    });
    return res.json();
  },

  async synthesizeVoice(text: string, voiceType: "security" | "executive" = "security", apiKey?: string) {
    const res = await fetch(`${API_BASE}/voice/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_type: voiceType, api_key: apiKey })
    });
    return res.json();
  },

  async getVoiceBriefing(tenantId: string = "acme-corp", userName: string = "Sarah Chen", apiKey?: string) {
    const res = await fetch(`${API_BASE}/voice/briefing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_id: tenantId, user_name: userName, api_key: apiKey })
    });
    return res.json();
  },

  async login(email: string, password: string = "demo123", tenantId?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, tenant_id: tenantId })
    });
    return res.json();
  },

  async register(email: string, name: string, companyName: string, password: string = "demo123", initialDeposit: number = 100000.0) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, company_name: companyName, password, initial_deposit: initialDeposit })
    });
    return res.json();
  }
};
