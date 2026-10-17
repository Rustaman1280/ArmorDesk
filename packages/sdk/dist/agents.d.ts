export interface DetectedAgent {
    id: "opencode" | "hermes" | "openclaw" | "claude" | "cursor" | "windsurf";
    name: string;
    configPath: string;
    isInstalled: boolean;
    isConfigured: boolean;
}
export declare function getAgentPaths(): Record<string, string>;
export declare function detectInstalledAgents(): DetectedAgent[];
export declare function injectAgentMCP(agentId: string, options: {
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