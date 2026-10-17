import type { ArmorDeskClientOptions, ArmorDeskStatus, TenantInfo, TraceItem, ApprovalItem, ReceiptItem, VerifyProofRequest, VerifyProofResponse, MCPGatewayConfig, MCPCallResponse, ScenarioRunResponse, CTFSubmitResponse, VoiceBriefingResponse, LoginResponse, MCPStatusResponse, DeviceCodeResponse, DevicePollResponse } from "./types.js";
import { canonicalJson, generatePlanHash, buildMerkleTree, verifyMerkleRoot, verifyProof } from "./crypto.js";
export declare class ArmorDeskClient {
    baseUrl: string;
    apiKey?: string;
    tenantId: string;
    userName: string;
    userRole: string;
    token?: string;
    private readonly _fetch;
    readonly crypto: {
        canonicalJson: typeof canonicalJson;
        generatePlanHash: typeof generatePlanHash;
        buildMerkleTree: typeof buildMerkleTree;
        verifyMerkleRoot: typeof verifyMerkleRoot;
        verifyProof: typeof verifyProof;
    };
    constructor(options?: ArmorDeskClientOptions);
    private request;
    /**
     * Authenticate with an ArmorDesk account and persist credentials
     */
    login(email: string, password?: string, tenantId?: string): Promise<LoginResponse>;
    /**
     * Request OAuth 2.0 Device Code for terminal/browser authentication (RFC 8628)
     */
    requestDeviceCode(): Promise<DeviceCodeResponse>;
    /**
     * Poll OAuth 2.0 Device Code until authorized by user in browser
     */
    pollDeviceCode(deviceCode: string): Promise<DevicePollResponse>;
    /**
     * Check live status and ping telemetry of Governed MCP Gateway
     */
    getMCPStatus(): Promise<MCPStatusResponse>;
    /**
     * Comprehensive MCP diagnostic: measures latency, pings gateway, and tests tool readiness
     */
    checkMCP(tenantId?: string): Promise<{
        connected: boolean;
        latencyMs: number;
        ping: MCPStatusResponse;
        config: MCPGatewayConfig;
    }>;
    /**
     * Health and runtime operational telemetry
     */
    status(): Promise<ArmorDeskStatus>;
    /**
     * List managed corporate tenants
     */
    getTenants(): Promise<TenantInfo[]>;
    /**
     * Fetch immutable security and policy enforcement traces
     */
    getTraces(tenantId?: string): Promise<TraceItem[]>;
    /**
     * Fetch approval queue items held by human-in-the-loop policies
     */
    getApprovals(tenantId?: string): Promise<ApprovalItem[]>;
    /**
     * Authorize or reject a held action in escrow
     */
    resolveApproval(delegationId: string, action: "APPROVE" | "REJECT", notes?: string): Promise<{
        status: string;
        receipt_id?: string;
        delegation_id: string;
        message: string;
    }>;
    /**
     * List digital verification receipts with cryptographic proofs
     */
    getReceipts(tenantId?: string): Promise<ReceiptItem[]>;
    /**
     * Retrieve a specific receipt by ID
     */
    getReceipt(receiptId: string): Promise<ReceiptItem>;
    /**
     * Cryptographically verify a digital proof
     */
    verifyProof(proof: VerifyProofRequest): Promise<VerifyProofResponse>;
    /**
     * Get MCP Gateway configuration and sample connection specs
     */
    getMCPConfig(tenantId?: string): Promise<MCPGatewayConfig>;
    /**
     * Invoke a tool through the Governed MCP Gateway
     */
    callMCPTool(toolName: string, args: Record<string, any>, options?: {
        userRole?: string;
        userName?: string;
        delegationId?: string;
    }): Promise<MCPCallResponse>;
    /**
     * Execute an adversarial FinOps scenario simulation (1 to 5)
     */
    runScenario(scenarioId: number, tenantId?: string): Promise<ScenarioRunResponse>;
    /**
     * Test prompt injection attacks against ArmorDesk CTF Gauntlet
     */
    submitCTF(prompt: string, attackerName?: string, tenantId?: string): Promise<CTFSubmitResponse>;
    /**
     * Generate an executive voice briefing via ElevenLabs
     */
    getVoiceBriefing(briefingType?: "security" | "executive", tenantId?: string): Promise<VoiceBriefingResponse>;
}
//# sourceMappingURL=client.d.ts.map