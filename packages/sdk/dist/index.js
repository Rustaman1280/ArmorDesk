"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ArmorDeskClient: () => ArmorDeskClient,
  buildMerkleTree: () => buildMerkleTree,
  canonicalJson: () => canonicalJson,
  clearStoredConfig: () => clearStoredConfig,
  generateClaudeDesktopConfig: () => generateClaudeDesktopConfig,
  generateCursorConfig: () => generateCursorConfig,
  generatePlanHash: () => generatePlanHash,
  getConfigDir: () => getConfigDir,
  getConfigPath: () => getConfigPath,
  hashSha256: () => hashSha256,
  loadStoredConfig: () => loadStoredConfig,
  saveStoredConfig: () => saveStoredConfig,
  verifyMerkleRoot: () => verifyMerkleRoot,
  verifyProof: () => verifyProof
});
module.exports = __toCommonJS(index_exports);

// src/crypto.ts
var import_node_crypto = require("crypto");
function canonicalJson(data) {
  if (data === null || data === void 0) {
    return "null";
  }
  if (typeof data === "number" || typeof data === "boolean") {
    return JSON.stringify(data);
  }
  if (typeof data === "string") {
    return JSON.stringify(data);
  }
  if (Array.isArray(data)) {
    return "[" + data.map((item) => canonicalJson(item)).join(",") + "]";
  }
  if (typeof data === "object") {
    const keys = Object.keys(data).sort();
    const entries = keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(data[k]));
    return "{" + entries.join(",") + "}";
  }
  return JSON.stringify(data);
}
function hashSha256(data) {
  return (0, import_node_crypto.createHash)("sha256").update(data, "utf8").digest("hex");
}
function generatePlanHash(planDict) {
  const canonical = canonicalJson(planDict);
  return hashSha256(canonical);
}
function buildMerkleTree(leafItems) {
  const leafHashes = leafItems.length === 0 ? [hashSha256("empty_tree_node")] : leafItems.map((item) => hashSha256(item));
  let currentLevel = [...leafHashes];
  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      const combined = hashSha256(left + right);
      nextLevel.push(combined);
    }
    currentLevel = nextLevel;
  }
  return {
    root: currentLevel[0],
    leafHashes
  };
}
function verifyMerkleRoot(leafItems, expectedRoot) {
  const { root } = buildMerkleTree(leafItems);
  return root.toLowerCase() === expectedRoot.toLowerCase();
}
function verifyProof(request) {
  const computedPlanHash = generatePlanHash(request.allowed_spec);
  const matchesHash = computedPlanHash.toLowerCase() === request.plan_hash.toLowerCase();
  const executionItems = Object.entries(request.actual_execution).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${canonicalJson(v)}`);
  const { root: computedMerkleRoot } = buildMerkleTree(executionItems);
  const matchesMerkle = computedMerkleRoot.toLowerCase() === request.merkle_root.toLowerCase();
  const valid = matchesHash && matchesMerkle;
  return {
    valid,
    computed_plan_hash: computedPlanHash,
    computed_merkle_root: computedMerkleRoot,
    matches_hash: matchesHash,
    matches_merkle: matchesMerkle,
    status: valid ? "CRYPTOGRAPHICALLY_VERIFIED" : "VERIFICATION_FAILED",
    details: valid ? "Plan hash matches allowed specification and Merkle root confirms un-tampered execution proof." : `Discrepancy detected: hashMatch=${matchesHash}, merkleMatch=${matchesMerkle}`
  };
}

// src/config.ts
var import_node_fs = require("fs");
var import_node_os = require("os");
var import_node_path = require("path");
function getConfigDir() {
  return (0, import_node_path.join)((0, import_node_os.homedir)(), ".armordesk");
}
function getConfigPath() {
  return (0, import_node_path.join)(getConfigDir(), "config.json");
}
function loadStoredConfig() {
  try {
    const configPath = getConfigPath();
    if ((0, import_node_fs.existsSync)(configPath)) {
      const raw = (0, import_node_fs.readFileSync)(configPath, "utf8");
      return JSON.parse(raw);
    }
  } catch {
  }
  return {};
}
function saveStoredConfig(config) {
  try {
    const dir = getConfigDir();
    if (!(0, import_node_fs.existsSync)(dir)) {
      (0, import_node_fs.mkdirSync)(dir, { recursive: true, mode: 448 });
    }
    const configPath = getConfigPath();
    (0, import_node_fs.writeFileSync)(configPath, JSON.stringify(config, null, 2), {
      encoding: "utf8",
      mode: 384
    });
  } catch (err) {
    console.warn(`[ArmorDesk] Could not write config to ${getConfigPath()}: ${err.message}`);
  }
}
function clearStoredConfig() {
  try {
    const configPath = getConfigPath();
    if ((0, import_node_fs.existsSync)(configPath)) {
      (0, import_node_fs.unlinkSync)(configPath);
      return true;
    }
  } catch {
  }
  return false;
}

// src/client.ts
var ArmorDeskClient = class {
  baseUrl;
  apiKey;
  tenantId;
  userName;
  userRole;
  token;
  _fetch;
  crypto = {
    canonicalJson,
    generatePlanHash,
    buildMerkleTree,
    verifyMerkleRoot,
    verifyProof
  };
  constructor(options = {}) {
    const stored = typeof process !== "undefined" ? loadStoredConfig() : {};
    this.baseUrl = (options.baseUrl || typeof process !== "undefined" && process.env?.ARMORDESK_URL || stored.baseUrl || "https://armordesk.crusts.dev").replace(/\/$/, "");
    this.apiKey = options.apiKey || (typeof process !== "undefined" ? process.env?.ARMORIQ_API_KEY || process.env?.ARMORIQ_PRO_API_KEY : void 0) || stored.apiKey;
    this.token = stored.token;
    this.tenantId = options.tenantId || stored.tenant?.id || "acme-corp";
    this.userName = options.userName || stored.user?.name || "Sarah Chen";
    this.userRole = options.userRole || stored.user?.role || "manager";
    this._fetch = options.fetch || globalThis.fetch.bind(globalThis);
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-ArmorIQ-Tenant": this.tenantId,
      ...options.headers
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    } else if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
      headers["X-ArmorIQ-API-Key"] = this.apiKey;
    }
    const res = await this._fetch(url, {
      ...options,
      headers
    });
    if (!res.ok) {
      let errorBody = "";
      try {
        errorBody = await res.text();
      } catch {
      }
      throw new Error(
        `ArmorDesk API error [${res.status} ${res.statusText}] at ${endpoint}: ${errorBody || "Unknown error"}`
      );
    }
    return res.json();
  }
  /**
   * Authenticate with an ArmorDesk account and persist credentials
   */
  async login(email, password = "admin", tenantId) {
    const res = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        tenant_id: tenantId || this.tenantId
      })
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
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    return res;
  }
  /**
   * Check live status and ping telemetry of Governed MCP Gateway
   */
  async getMCPStatus() {
    return this.request("/api/mcp/ping", {
      method: "POST"
    });
  }
  /**
   * Comprehensive MCP diagnostic: measures latency, pings gateway, and tests tool readiness
   */
  async checkMCP(tenantId) {
    const start = Date.now();
    const ping = await this.getMCPStatus();
    const latencyMs = Date.now() - start;
    const config = await this.getMCPConfig(tenantId || this.tenantId);
    const connected = ping.status === "CONNECTED" && config.governed_tools.length > 0;
    return {
      connected,
      latencyMs,
      ping,
      config
    };
  }
  /**
   * Health and runtime operational telemetry
   */
  async status() {
    return this.request("/api/status");
  }
  /**
   * List managed corporate tenants
   */
  async getTenants() {
    return this.request("/api/tenants");
  }
  /**
   * Fetch immutable security and policy enforcement traces
   */
  async getTraces(tenantId) {
    const tid = tenantId || this.tenantId;
    return this.request(`/api/traces?tenant_id=${encodeURIComponent(tid)}`);
  }
  /**
   * Fetch approval queue items held by human-in-the-loop policies
   */
  async getApprovals(tenantId) {
    const tid = tenantId || this.tenantId;
    return this.request(`/api/approvals?tenant_id=${encodeURIComponent(tid)}`);
  }
  /**
   * Authorize or reject a held action in escrow
   */
  async resolveApproval(delegationId, action, notes) {
    const payload = {
      action,
      user_role: this.userRole,
      user_name: this.userName,
      notes
    };
    return this.request(`/api/approvals/${encodeURIComponent(delegationId)}/action`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
  /**
   * List digital verification receipts with cryptographic proofs
   */
  async getReceipts(tenantId) {
    const tid = tenantId || this.tenantId;
    return this.request(`/api/receipts?tenant_id=${encodeURIComponent(tid)}`);
  }
  /**
   * Retrieve a specific receipt by ID
   */
  async getReceipt(receiptId) {
    return this.request(`/api/receipts/${encodeURIComponent(receiptId)}`);
  }
  /**
   * Cryptographically verify a digital proof
   */
  async verifyProof(proof) {
    return this.request("/api/receipts/verify", {
      method: "POST",
      body: JSON.stringify(proof)
    });
  }
  /**
   * Get MCP Gateway configuration and sample connection specs
   */
  async getMCPConfig(tenantId) {
    const tid = tenantId || this.tenantId;
    return this.request(`/api/mcp/config?tenant_id=${encodeURIComponent(tid)}`);
  }
  /**
   * Invoke a tool through the Governed MCP Gateway
   */
  async callMCPTool(toolName, args, options = {}) {
    const rpcPayload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
        context: {
          user_role: options.userRole || this.userRole,
          user_name: options.userName || this.userName,
          delegation_id: options.delegationId
        }
      }
    };
    return this.request("/api/mcp/gateway", {
      method: "POST",
      body: JSON.stringify(rpcPayload)
    });
  }
  /**
   * Execute an adversarial FinOps scenario simulation (1 to 5)
   */
  async runScenario(scenarioId, tenantId) {
    return this.request("/api/scenarios/run", {
      method: "POST",
      body: JSON.stringify({
        scenario_id: scenarioId,
        tenant_id: tenantId || this.tenantId
      })
    });
  }
  /**
   * Test prompt injection attacks against ArmorDesk CTF Gauntlet
   */
  async submitCTF(prompt, attackerName, tenantId) {
    return this.request("/api/ctf/submit", {
      method: "POST",
      body: JSON.stringify({
        prompt,
        attacker_name: attackerName || "PenTester",
        tenant_id: tenantId || this.tenantId
      })
    });
  }
  /**
   * Generate an executive voice briefing via ElevenLabs
   */
  async getVoiceBriefing(briefingType = "executive", tenantId) {
    return this.request("/api/voice/briefing", {
      method: "POST",
      body: JSON.stringify({
        briefing_type: briefingType,
        tenant_id: tenantId || this.tenantId
      })
    });
  }
};

// src/mcp.ts
function generateClaudeDesktopConfig(options = {}) {
  const url = options.gatewayUrl || "https://armordesk.crusts.dev/api/mcp/gateway";
  const tenant = options.tenantId || "acme-corp";
  const apiKey = options.apiKey || "ak_live_acme_corp";
  return {
    mcpServers: {
      armordesk_gateway: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-fetch", url],
        env: {
          ARMORIQ_TENANT: tenant,
          ARMORIQ_API_KEY: apiKey
        }
      }
    }
  };
}
function generateCursorConfig(options = {}) {
  const url = options.gatewayUrl || "https://armordesk.crusts.dev/api/mcp/gateway";
  const tenant = options.tenantId || "acme-corp";
  const apiKey = options.apiKey || "ak_live_acme_corp";
  return {
    mcpServers: {
      armordesk: {
        url,
        headers: {
          "X-ArmorIQ-Tenant": tenant,
          Authorization: `Bearer ${apiKey}`
        }
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArmorDeskClient,
  buildMerkleTree,
  canonicalJson,
  clearStoredConfig,
  generateClaudeDesktopConfig,
  generateCursorConfig,
  generatePlanHash,
  getConfigDir,
  getConfigPath,
  hashSha256,
  loadStoredConfig,
  saveStoredConfig,
  verifyMerkleRoot,
  verifyProof
});
