"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api, MCPGatewayConfig } from "@/lib/api";
import {
  Plug,
  Server,
  Key,
  Copy,
  Check,
  Terminal,
  Cpu,
  Shield,
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Code2,
  Send,
  Radio,
  FileCode,
  Sparkles,
  Layers,
  Lock
} from "lucide-react";

export default function ConnectGatewayPage() {
  const { tenantId, currentUser, currentTenant, triggerReload, addToast } = useApp();

  const [mcpConfig, setMcpConfig] = useState<MCPGatewayConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"bash" | "powershell" | "cli" | "claude" | "cursor" | "python" | "curl">("bash");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<boolean>(false);

  // Ping test state
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<any>(null);

  // Test tool probe state
  const [selectedTool, setSelectedTool] = useState<string>("bank.wire_transfer");
  const [testAmount, setTestAmount] = useState<number>(8000);
  const [testRecipient, setTestRecipient] = useState<string>("AWS Cloud");
  const [isExecutingProbe, setIsExecutingProbe] = useState<boolean>(false);
  const [probeResult, setProbeResult] = useState<any>(null);

  useEffect(() => {
    loadGatewayConfig();
  }, [tenantId]);

  const loadGatewayConfig = async () => {
    try {
      const data = await api.getMCPConfig(tenantId);
      setMcpConfig(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    addToast("Copied to Clipboard", `${label} copied to clipboard.`, "info");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await api.pingMCPGateway();
      setPingResult(res);
      addToast(
        "MCP Gateway Operational",
        `Handshake successful (${res.latency_ms}ms roundtrip). Governance proxy is active.`,
        "success"
      );
    } catch (e: any) {
      addToast("Gateway Ping Failed", e.message, "error");
    } finally {
      setIsPinging(false);
    }
  };

  const handleExecuteProbe = async () => {
    setIsExecutingProbe(true);
    setProbeResult(null);
    try {
      let args: any = {};
      if (selectedTool === "bank.wire_transfer") {
        args = { recipient: testRecipient, amount: Number(testAmount) };
      } else if (selectedTool === "bank.refund") {
        args = { recipient: testRecipient, amount: Number(testAmount) };
      } else if (selectedTool === "crm.verify_vendor") {
        args = { vendor_name: testRecipient };
      }

      const res = await api.callMCPTool(
        selectedTool,
        args,
        currentUser.role,
        currentUser.name,
        tenantId
      );
      setProbeResult(res);
      triggerReload();

      if (res.result?.isError) {
        addToast(
          "Tool Execution Policed",
          res.result.content?.[0]?.text || "Execution governed by policy.",
          "warning"
        );
      } else {
        addToast("Tool Call Allowed", "Tool settled safely under ArmorDesk proxy.", "success");
      }
    } catch (e: any) {
      addToast("Probe Error", e.message, "error");
    } finally {
      setIsExecutingProbe(false);
    }
  };

  const gatewayUrl = mcpConfig?.gateway_url || "http://localhost:8000/api/mcp/gateway";
  const apiKey = "ak_live_acme_corpx892348a";

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              AGENT INTEGRATION HUB
            </span>
            {(mcpConfig?.connected_agents?.length || 0) > 0 ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>MCP FLEET ACTIVE ({mcpConfig?.connected_agents?.length} AGENTS)</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>MCP GATEWAY LISTENING (0 AGENTS)</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Connect Your AI Agents via MCP
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            ArmorDesk operates as a cryptographic Model Context Protocol (MCP) proxy. Connect your agents (Claude Desktop, Cursor, CrewAI, LangChain) so all external tool calls are authenticated, scope-checked, and frozen in dual-control escrow before funds or data leave your perimeter.
          </p>
        </div>

        {/* Quick Ping Button */}
        <button
          onClick={handlePing}
          disabled={isPinging}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-mono font-medium transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50 shadow-sm"
        >
          <Activity className={`h-3.5 w-3.5 text-emerald-500 ${isPinging ? "animate-spin" : ""}`} />
          <span>{isPinging ? "Testing Handshake..." : "Test Gateway Handshake"}</span>
        </button>
      </div>

      {/* Ping Result Banner (if tested) */}
      {pingResult && (
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Gateway Connection Verified: </span>
              <span>{pingResult.protocol} · Roundtrip latency {pingResult.latency_ms}ms · Sandboxes: {pingResult.active_sandboxes?.join(", ")}</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">100% HEALTHY</span>
        </div>
      )}

      {/* 2. Tenant Credentials & Connection Endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gateway URL Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm space-y-2">
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wide block font-semibold">
            MCP HTTP GATEWAY ENDPOINT
          </span>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#141519] border border-slate-200 dark:border-white/[0.04] text-xs font-mono text-slate-800 dark:text-zinc-200">
            <span className="truncate pr-2">{gatewayUrl}</span>
            <button
              onClick={() => handleCopy(gatewayUrl, "Gateway URL")}
              className="text-slate-400 hover:text-slate-800 dark:hover:text-white shrink-0 p-1"
              title="Copy URL"
            >
              {copiedKey === "Gateway URL" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Standard JSON-RPC 2.0 compatible endpoint for all MCP tools.
          </p>
        </div>

        {/* API Key Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wide font-semibold">
              TENANT SECRET API KEY
            </span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-[10px] font-mono text-slate-500 hover:underline"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#141519] border border-slate-200 dark:border-white/[0.04] text-xs font-mono text-slate-800 dark:text-zinc-200">
            <span className="truncate pr-2">
              {showKey ? apiKey : "ak_live_acme_••••••••••••••••"}
            </span>
            <button
              onClick={() => handleCopy(apiKey, "API Key")}
              className="text-slate-400 hover:text-slate-800 dark:hover:text-white shrink-0 p-1"
              title="Copy API Key"
            >
              {copiedKey === "API Key" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Tenant: <strong>{tenantId}</strong> ({currentTenant?.name || "Acme Corp"})
          </p>
        </div>

        {/* Policy Boundary Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm space-y-2">
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wide block font-semibold">
            ACTIVE POLICY SCOPE
          </span>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#141519] border border-slate-200 dark:border-white/[0.04] text-xs font-mono text-slate-800 dark:text-zinc-200 flex items-center justify-between">
            <span>Dual-Control Limit:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">$50.00 USD</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Transactions &gt; $50 require human approval in Inbox.
          </p>
        </div>
      </div>

      {/* 3. Client Connection Quickstart (Tabbed Code Configs) */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step-by-Step Client Setup</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Copy-paste the configuration snippet below into your client environment to govern its tool executions immediately.
            </p>
          </div>

          {/* Config Tabs */}
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-[#141519] border border-slate-200 dark:border-white/[0.06] text-xs font-mono overflow-x-auto max-w-full">
            {[
              { id: "bash", label: "Bash (sh)" },
              { id: "powershell", label: "PowerShell (ps1)" },
              { id: "cli", label: "NPM / CLI" },
              { id: "claude", label: "Claude Desktop" },
              { id: "cursor", label: "Cursor IDE" },
              { id: "python", label: "Python SDK" },
              { id: "curl", label: "cURL JSON-RPC" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded font-semibold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm dark:bg-[#1F2028] dark:text-white"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Snippet Display */}
        <div className="relative rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
            <span>
              {activeTab === "bash" && "curl -fsSL https://armordesk.crusts.dev/install.sh | bash"}
              {activeTab === "powershell" && "iwr -useb https://armordesk.crusts.dev/install.ps1 | iex"}
              {activeTab === "cli" && "npx @crustdev/armordesk"}
              {activeTab === "claude" && "claude_desktop_config.json"}
              {activeTab === "cursor" && ".cursor/mcp.json"}
              {activeTab === "python" && "finops_agent.py (LangChain / CrewAI / Custom)"}
              {activeTab === "curl" && "terminal command"}
            </span>

            <button
              onClick={() => {
                let text = "";
                if (activeTab === "bash") text = "curl -fsSL https://armordesk.crusts.dev/install.sh | bash";
                else if (activeTab === "powershell") text = "iwr -useb https://armordesk.crusts.dev/install.ps1 | iex";
                else if (activeTab === "cli") text = `npx @crustdev/armordesk login --email ${currentUser?.email || "rustaman@crusts.dev"}\nnpx @crustdev/armordesk mcp check`;
                else if (activeTab === "claude") text = mcpConfig?.sample_configs.claude_desktop || "";
                else if (activeTab === "cursor") text = mcpConfig?.sample_configs.cursor || "";
                else if (activeTab === "python") text = mcpConfig?.sample_configs.python_sdk || "";
                else if (activeTab === "curl") text = mcpConfig?.sample_configs.curl || "";
                handleCopy(text, `${activeTab.toUpperCase()} Config`);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Copy className="h-3 w-3" />
              <span>Copy Snippet</span>
            </button>
          </div>

          <pre className="p-4 overflow-x-auto text-emerald-400 leading-relaxed text-[11px]">
            {activeTab === "bash" && (
`# 1. Run the official automated installer for Linux & macOS:
curl -fsSL https://armordesk.crusts.dev/install.sh | bash

# 2. Or authenticate with your corporate tenant:
npx @crustdev/armordesk login --email ${currentUser?.email || "rustaman@crusts.dev"}

# 3. Probe and verify your Governed MCP Gateway:
npx @crustdev/armordesk mcp check`
            )}
            {activeTab === "powershell" && (
`# 1. Run the official automated installer for Windows PowerShell:
iwr -useb https://armordesk.crusts.dev/install.ps1 | iex

# 2. Authenticate CLI with your account:
npx @crustdev/armordesk login --email ${currentUser?.email || "rustaman@crusts.dev"}

# 3. Check live MCP connection:
npx @crustdev/armordesk mcp check`
            )}
            {activeTab === "cli" && (
`# Install SDK in your agent project:
npm install @crustdev/armordesk

# Or run commands instantly with npx:
npx @crustdev/armordesk login --email ${currentUser?.email || "rustaman@crusts.dev"}
npx @crustdev/armordesk mcp check
npx @crustdev/armordesk whoami
npx @crustdev/armordesk traces
npx @crustdev/armordesk scenario 1`
            )}
            {activeTab === "claude" && (mcpConfig?.sample_configs.claude_desktop || "Loading config...")}
            {activeTab === "cursor" && (mcpConfig?.sample_configs.cursor || "Loading config...")}
            {activeTab === "python" && (mcpConfig?.sample_configs.python_sdk || "Loading config...")}
            {activeTab === "curl" && (mcpConfig?.sample_configs.curl || "Loading config...")}
          </pre>
        </div>
      </div>

      {/* 4. Live Gateway Tool Invocation Probe */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400 fill-current" />
              <span>Simulate External Agent Tool Call (Live Verification)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Send a test JSON-RPC 2.0 tool invocation directly into the ArmorDesk Gateway to observe live policy interception and escrow behavior.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            Simulated Caller: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-semibold block">
              TARGET GOVERNED MCP TOOL
            </label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] px-3 py-2 text-xs font-mono text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="bank.wire_transfer">bank.wire_transfer (Disbursement)</option>
              <option value="bank.refund">bank.refund (Customer SLA Credit)</option>
              <option value="crm.verify_vendor">crm.verify_vendor (Registry Check)</option>
            </select>
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-semibold block">
              RECIPIENT / VENDOR NAME
            </label>
            <input
              type="text"
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] px-3 py-2 text-xs font-mono text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {selectedTool !== "crm.verify_vendor" && (
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-semibold block">
                AMOUNT (USD)
              </label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] px-3 py-2 text-xs font-mono text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className={selectedTool === "crm.verify_vendor" ? "md:col-span-4" : "md:col-span-2"}>
            <button
              onClick={handleExecuteProbe}
              disabled={isExecutingProbe}
              className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isExecutingProbe ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Invoke Tool</span>
            </button>
          </div>
        </div>

        {/* Probe Output Box */}
        {probeResult && (
          <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-700 dark:text-zinc-300">GATEWAY RESPONSE (JSON-RPC 2.0)</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] ${
                  probeResult.result?.isError
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {probeResult.result?.isError ? "POLICED / HELD IN ESCROW" : "SETTLED SUCCESSFULLY"}
              </span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
              {JSON.stringify(probeResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 5. Connected Agent Fleet Status Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Registered Agent Fleet & Policy Scope</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Live status of autonomous agents currently connected to this tenant's MCP gateway.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
            {mcpConfig?.connected_agents?.length ?? 0} Connected Agents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-zinc-300">
            <thead className="bg-slate-100 dark:bg-[#141519] text-[10px] uppercase text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/[0.08]">
              <tr>
                <th className="py-3 px-5">AGENT IDENTITY</th>
                <th className="py-3 px-5">TRANSPORT PROTOCOL</th>
                <th className="py-3 px-5">ALLOWED CAPABILITIES</th>
                <th className="py-3 px-5">ENFORCED POLICY</th>
                <th className="py-3 px-5">STATUS & HEARTBEAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {(!mcpConfig?.connected_agents || mcpConfig.connected_agents.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-slate-400">
                        <Plug className="h-4 w-4" />
                      </div>
                      <div className="font-bold text-slate-800 dark:text-zinc-200">
                        Zero Agents Connected to this Workspace
                      </div>
                      <p className="text-slate-500 dark:text-zinc-400 text-xs font-sans">
                        Run <code className="text-emerald-600 dark:text-emerald-400 font-mono">npx @crustdev/armordesk mcp check</code> in your terminal or configure Claude Desktop above to register your first governed agent.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                mcpConfig.connected_agents.map((ag) => (
                  <tr key={ag.agent_id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{ag.name}</span>
                        {(ag as any).is_simulated && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/25">
                            SIMULATED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500">{ag.agent_id}</div>
                    </td>
                    <td className="py-3 px-5 text-slate-600 dark:text-zinc-400">{ag.transport}</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-1 flex-wrap">
                        {ag.capabilities.map((c: string) => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        {ag.enforced_policy}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{ag.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans">
                        {ag.last_heartbeat}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
