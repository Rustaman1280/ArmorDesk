export type AgentId = "antigravity" | "opencode" | "codex" | "hermes" | "openclaw" | "claude" | "cursor" | "windsurf" | "cline" | "roocode" | "continue" | "zed";
export interface DetectedAgent {
    id: AgentId;
    name: string;
    configPath: string;
    isInstalled: boolean;
    isConfigured: boolean;
}
export declare function resolveAgentAlias(input: string): AgentId | null;
export declare function getAgentPaths(): Record<AgentId, string>;
export declare function detectInstalledAgents(): DetectedAgent[];
export declare function injectAgentMCP(agentNameOrAlias: string, options: {
    tenantId: string;
    token?: string;
    baseUrl?: string;
}): {
    success: boolean;
    configPath: string;
    message: string;
};
export declare function generateGovernedSystemPrompt(options: {
    tenantId: string;
    userName?: string;
    userRole?: string;
    baseUrl?: string;
}): string;
//# sourceMappingURL=agents.d.ts.map