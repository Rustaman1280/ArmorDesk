import type { MCPGatewayConfig } from "./types.js";

/**
 * Generates ready-to-paste Claude Desktop configuration object
 */
export function generateClaudeDesktopConfig(options: {
  gatewayUrl?: string;
  tenantId?: string;
  apiKey?: string;
} = {}): { mcpServers: Record<string, any> } {
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
          ARMORIQ_API_KEY: apiKey,
        },
      },
    },
  };
}

/**
 * Generates ready-to-paste Cursor IDE MCP configuration object
 */
export function generateCursorConfig(options: {
  gatewayUrl?: string;
  tenantId?: string;
  apiKey?: string;
} = {}): { mcpServers: Record<string, any> } {
  const url = options.gatewayUrl || "https://armordesk.crusts.dev/api/mcp/gateway";
  const tenant = options.tenantId || "acme-corp";
  const apiKey = options.apiKey || "ak_live_acme_corp";

  return {
    mcpServers: {
      armordesk: {
        url,
        headers: {
          "X-ArmorIQ-Tenant": tenant,
          Authorization: `Bearer ${apiKey}`,
        },
      },
    },
  };
}
