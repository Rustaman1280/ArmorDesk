import type {
  ArmorDeskClientOptions,
  ArmorDeskStatus,
  TenantInfo,
  TraceItem,
  ApprovalItem,
  ApprovalActionRequest,
  ReceiptItem,
  VerifyProofRequest,
  VerifyProofResponse,
  MCPGatewayConfig,
  MCPCallRequest,
  MCPCallResponse,
  ScenarioRunResponse,
  CTFSubmitResponse,
  VoiceBriefingResponse,
  LoginResponse,
  MCPStatusResponse,
  DeviceCodeResponse,
  DevicePollResponse,
} from "./types.js";
import {
  canonicalJson,
  generatePlanHash,
  buildMerkleTree,
  verifyMerkleRoot,
  verifyProof,
} from "./crypto.js";
import { loadStoredConfig, saveStoredConfig } from "./config.js";

export class ArmorDeskClient {
  baseUrl: string;
  apiKey?: string;
  tenantId: string;
  userName: string;
  userRole: string;
  token?: string;
  private readonly _fetch: typeof fetch;

  public readonly crypto = {
    canonicalJson,
    generatePlanHash,
    buildMerkleTree,
    verifyMerkleRoot,
    verifyProof,
  };

  constructor(options: ArmorDeskClientOptions = {}) {
    const stored = typeof process !== "undefined" ? loadStoredConfig() : {};

    this.baseUrl = (
      options.baseUrl ||
      (typeof process !== "undefined" && process.env?.ARMORDESK_URL) ||
      stored.baseUrl ||
      "https://armordesk.crusts.dev"
    ).replace(/\/$/, "");

    this.apiKey =
      options.apiKey ||
      (typeof process !== "undefined"
        ? process.env?.ARMORIQ_API_KEY || process.env?.ARMORIQ_PRO_API_KEY
        : undefined) ||
      stored.apiKey;

    this.token = stored.token;
    this.tenantId = options.tenantId || stored.tenant?.id || "acme-corp";
    this.userName = options.userName || stored.user?.name || "Sarah Chen";
    this.userRole = options.userRole || stored.user?.role || "manager";
    this._fetch = options.fetch || globalThis.fetch.bind(globalThis);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-ArmorIQ-Tenant": this.tenantId,
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    } else if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
      headers["X-ArmorIQ-API-Key"] = this.apiKey;
    }

    const res = await this._fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorBody = "";
      try {
        errorBody = await res.text();
      } catch {
        // ignore
      }
      throw new Error(
        `ArmorDesk API error [${res.status} ${res.statusText}] at ${endpoint}: ${errorBody || "Unknown error"}`
      );
    }

    return res.json() as Promise<T>;
  }

  /**
   * Authenticate with an ArmorDesk account and persist credentials
   */
  async login(
    email: string,
    password: string = "admin",
    tenantId?: string
  ): Promise<LoginResponse> {
    const res = await this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        tenant_id: tenantId || this.tenantId,
      }),
    });

    if (res.user && res.token) {
      this.token = res.token;
      this.userName = res.user.name;
      this.userRole = res.user.role;
      if (res.tenant?.id) {
        this.tenantId = res.tenant.id;
      }

      if (typeof process !== "undefined") {
        saveStoredConfig({
          baseUrl: this.baseUrl,
          token: res.token,
          user: res.user,
          tenant: res.tenant,
          apiKey: this.apiKey,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return res;
  }

  /**
   * Request OAuth 2.0 Device Code for terminal/browser authentication (RFC 8628)
   */
  async requestDeviceCode(): Promise<DeviceCodeResponse> {
    return this.request<DeviceCodeResponse>("/api/auth/device/code", {
      method: "POST",
    });
  }

  /**
   * Poll OAuth 2.0 Device Code until authorized by user in browser
   */
  async pollDeviceCode(deviceCode: string): Promise<DevicePollResponse> {
    return this.request<DevicePollResponse>("/api/auth/device/poll", {
      method: "POST",
      body: JSON.stringify({ device_code: deviceCode }),
    });
  }

  /**
   * Check live status and ping telemetry of Governed MCP Gateway
   */
  async getMCPStatus(): Promise<MCPStatusResponse> {
    return this.request<MCPStatusResponse>("/api/mcp/ping", {
      method: "POST",
    });
  }

  /**
   * Comprehensive MCP diagnostic: measures latency, pings gateway, and tests tool readiness
   */
  async checkMCP(tenantId?: string): Promise<{
    connected: boolean;
    latencyMs: number;
    ping: MCPStatusResponse;
    config: MCPGatewayConfig;
  }> {
    const start = Date.now();
    const ping = await this.getMCPStatus();
    const latencyMs = Date.now() - start;
    const config = await this.getMCPConfig(tenantId || this.tenantId);

    const connected = ping.status === "CONNECTED" && config.governed_tools.length > 0;

    return {
      connected,
      latencyMs,
      ping,
      config,
    };
  }

  /**
   * Health and runtime operational telemetry
   */
  async status(): Promise<ArmorDeskStatus> {
    return this.request<ArmorDeskStatus>("/api/status");
  }

  /**
   * List managed corporate tenants
   */
  async getTenants(): Promise<TenantInfo[]> {
    return this.request<TenantInfo[]>("/api/tenants");
  }

  /**
   * Fetch immutable security and policy enforcement traces
   */
  async getTraces(tenantId?: string): Promise<TraceItem[]> {
    const tid = tenantId || this.tenantId;
    return this.request<TraceItem[]>(`/api/traces?tenant_id=${encodeURIComponent(tid)}`);
  }

  /**
   * Fetch approval queue items held by human-in-the-loop policies
   */
  async getApprovals(tenantId?: string): Promise<ApprovalItem[]> {
    const tid = tenantId || this.tenantId;
    return this.request<ApprovalItem[]>(`/api/approvals?tenant_id=${encodeURIComponent(tid)}`);
  }

  /**
   * Authorize or reject a held action in escrow
   */
  async resolveApproval(
    delegationId: string,
    action: "APPROVE" | "REJECT",
    notes?: string
  ): Promise<{ status: string; receipt_id?: string; delegation_id: string; message: string }> {
    const payload: ApprovalActionRequest = {
      action,
      user_role: this.userRole,
      user_name: this.userName,
      notes,
    };
    return this.request(`/api/approvals/${encodeURIComponent(delegationId)}/action`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * List digital verification receipts with cryptographic proofs
   */
  async getReceipts(tenantId?: string): Promise<ReceiptItem[]> {
    const tid = tenantId || this.tenantId;
    return this.request<ReceiptItem[]>(`/api/receipts?tenant_id=${encodeURIComponent(tid)}`);
  }

  /**
   * Retrieve a specific receipt by ID
   */
  async getReceipt(receiptId: string): Promise<ReceiptItem> {
    return this.request<ReceiptItem>(`/api/receipts/${encodeURIComponent(receiptId)}`);
  }

  /**
   * Cryptographically verify a digital proof
   */
  async verifyProof(proof: VerifyProofRequest): Promise<VerifyProofResponse> {
    return this.request<VerifyProofResponse>("/api/receipts/verify", {
      method: "POST",
      body: JSON.stringify(proof),
    });
  }

  /**
   * Get MCP Gateway configuration and sample connection specs
   */
  async getMCPConfig(tenantId?: string): Promise<MCPGatewayConfig> {
    const tid = tenantId || this.tenantId;
    return this.request<MCPGatewayConfig>(`/api/mcp/config?tenant_id=${encodeURIComponent(tid)}`);
  }

  /**
   * Invoke a tool through the Governed MCP Gateway
   */
  async callMCPTool(
    toolName: string,
    args: Record<string, any>,
    options: {
      userRole?: string;
      userName?: string;
      delegationId?: string;
    } = {}
  ): Promise<MCPCallResponse> {
    const rpcPayload: MCPCallRequest = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
        context: {
          user_role: options.userRole || this.userRole,
          user_name: options.userName || this.userName,
          delegation_id: options.delegationId,
        },
      },
    };

    return this.request<MCPCallResponse>("/api/mcp/gateway", {
      method: "POST",
      body: JSON.stringify(rpcPayload),
    });
  }

  /**
   * Execute an adversarial FinOps scenario simulation (1 to 5)
   */
  async runScenario(scenarioId: number, tenantId?: string): Promise<ScenarioRunResponse> {
    return this.request<ScenarioRunResponse>("/api/scenarios/run", {
      method: "POST",
      body: JSON.stringify({
        scenario_id: scenarioId,
        tenant_id: tenantId || this.tenantId,
      }),
    });
  }

  /**
   * Test prompt injection attacks against ArmorDesk CTF Gauntlet
   */
  async submitCTF(
    prompt: string,
    attackerName?: string,
    tenantId?: string
  ): Promise<CTFSubmitResponse> {
    return this.request<CTFSubmitResponse>("/api/ctf/submit", {
      method: "POST",
      body: JSON.stringify({
        prompt,
        attacker_name: attackerName || "PenTester",
        tenant_id: tenantId || this.tenantId,
      }),
    });
  }

  /**
   * Generate an executive voice briefing via ElevenLabs
   */
  async getVoiceBriefing(
    briefingType: "security" | "executive" = "executive",
    tenantId?: string
  ): Promise<VoiceBriefingResponse> {
    return this.request<VoiceBriefingResponse>("/api/voice/briefing", {
      method: "POST",
      body: JSON.stringify({
        briefing_type: briefingType,
        tenant_id: tenantId || this.tenantId,
      }),
    });
  }
}
