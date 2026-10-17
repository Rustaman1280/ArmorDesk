"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { api, TraceItem } from "@/lib/api";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  GitCommit,
  Check,
  X,
  Radio,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Inbox,
  Terminal,
  RefreshCw,
  Plug,
  Server,
  ArrowUpRight,
  Filter
} from "lucide-react";

export default function DashboardPage() {
  const {
    tenantId,
    currentUser,
    currentTenant,
    triggerReload,
    reloadTrigger,
    addToast,
    pendingApprovalsCount,
  } = useApp();

  const [traces, setTraces] = useState<TraceItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [traceFilter, setTraceFilter] = useState<string>("ALL");
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [tenantId, reloadTrigger]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tData, bData] = await Promise.all([
        api.getTraces(tenantId),
        api.getBankBalance(tenantId),
      ]);
      setTraces(tData);
      setBalance(bData.balance || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTraces = traces.filter((tr) => {
    if (traceFilter === "ALL") return true;
    return tr.status === traceFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Live Gateway Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              PRODUCTION CONTROL PLANE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>GATEWAY ONLINE (PORT 8000)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Enterprise AI Agent Control Plane & Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Continuous intent verification, MCP tool authorization, and cryptographic non-repudiation across all autonomous corporate agents.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/connect"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plug className="h-3.5 w-3.5" />
            <span>Connect Agents (MCP)</span>
          </Link>
          <button
            onClick={() => {
              loadData();
              addToast("Telemetry Refreshed", "Loaded latest live event stream.", "info");
            }}
            className="p-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121317] hover:bg-slate-100 dark:hover:bg-[#181920] text-slate-600 dark:text-zinc-300 transition-colors shadow-sm"
            title="Refresh Telemetry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Connect & Gateway Callout Banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-[#0E0F12] dark:via-[#121317] dark:to-[#0E0F12] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>ArmorDesk Model Context Protocol (MCP) Gateway Active</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                JSON-RPC 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>Endpoint:</span>
              <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">https://armordesk.crusts.dev/api/mcp/gateway</code>
              <span>· Quick installer:</span>
              <code className="font-mono text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded">curl -fsSL https://armordesk.crusts.dev/install.sh | bash</code>
            </p>
          </div>
        </div>

        <Link
          href="/connect"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono shrink-0"
        >
          <span>View Gateway Keys & Configs</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 3. Three Clean Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Treasury Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wide font-semibold">
              PROTECTED TREASURY VAULT
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.04]">
            <span>Tenant: {currentTenant?.name || "Acme Corp"}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">0.00% Loss</span>
          </div>
        </div>

        {/* Escrow Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wide font-semibold">
              DUAL-CONTROL ESCROW QUEUE
            </span>
            <Link
              href="/inbox"
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>Inbox</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {pendingApprovalsCount} Held Tickets
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.04]">
            <span>Spend &gt; $50.00 Frozen</span>
            <span className="text-slate-400 font-mono text-[11px]">Requires CFO Signature</span>
          </div>
        </div>

        {/* Cryptographic Proofs Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wide font-semibold">
              CRYPTOGRAPHIC NON-REPUDIATION
            </span>
            <Link
              href="/receipts"
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>Receipts</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            100% Governed
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.04]">
            <span>SHA-256 Plan Hashes</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">SOC 2 / ISO Ready</span>
          </div>
        </div>
      </div>

      {/* 4. Governed Multi-Agent Fleet Topology */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Governed Multi-Agent Fleet Topology</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Autonomous sub-agents execute inside cryptographically bounded capability perimeters. Reader agents cannot initiate transfers; disbursements freeze for human review.
            </p>
          </div>
          <Link
            href="/connect"
            className="text-xs font-mono font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 shrink-0"
          >
            <span>Manage Agent Capabilities</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Agent 1 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">1. Orchestrator</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Coordinates incoming intent goals, computes SHA-256 Plan Hashes, and delegates scoped tokens.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.04] text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              Scope: [plan_capture, delegate]
            </div>
          </div>

          {/* Agent 2 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">2. ReaderAgent</span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                SANDBOXED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Reads inbound emails & parses vendor PDFs. Strictly isolated from all payment & CRM mutation APIs.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.04] text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              Scope: [email.read, files.parse]
            </div>
          </div>

          {/* Agent 3 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">3. VerifierAgent</span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                ALLOWLIST
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Cross-references recipient accounts against official CRM registry. Rejects unregistered offshore accounts.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.04] text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              Scope: [crm.verify_vendor]
            </div>
          </div>

          {/* Agent 4 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">4. ExecutorAgent</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                SETTLEMENT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Executes permitted refunds (&le;$50) or routes high-value invoices to Approval Inbox escrow.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.04] text-[10px] font-mono text-slate-500 dark:text-zinc-400">
              Scope: [bank.wire, bank.refund]
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Governed Ingestion Stream (Real Audit Ledger) */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm overflow-hidden">
        {/* Table Header & Status Filter Tabs */}
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Real-Time Governed Tool Invocations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Live audit stream of all tool calls processed through the ArmorDesk MCP gateway.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {["ALL", "ALLOWED", "HELD_FOR_APPROVAL", "BLOCKED"].map((f) => (
              <button
                key={f}
                onClick={() => setTraceFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  traceFilter === f
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                    : "bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-zinc-300">
            <thead className="bg-slate-100 dark:bg-[#141519] text-[10px] uppercase text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/[0.08]">
              <tr>
                <th className="py-3 px-5">TIMESTAMP</th>
                <th className="py-3 px-5">ORIGIN AGENT & ACTOR</th>
                <th className="py-3 px-5">INVOKED TOOL</th>
                <th className="py-3 px-5">POLICY VERDICT</th>
                <th className="py-3 px-5">INTERCEPTION RATIONALE</th>
                <th className="py-3 px-5 text-right">PROOF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {filteredTraces.slice(0, 10).map((tr) => {
                const isExpanded = expandedTraceId === tr.id;

                return (
                  <React.Fragment key={tr.id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-5 text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                        {tr.created_at ? new Date(tr.created_at).toLocaleTimeString() : "Just now"}
                      </td>
                      <td className="py-3 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{tr.agent_name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans">
                          via {tr.user_name} ({tr.user_role})
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-[11px]">
                          {tr.action}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            tr.status === "ALLOWED"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                              : tr.status === "HELD_FOR_APPROVAL"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {tr.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-slate-500 dark:text-zinc-400 text-[11px] max-w-sm truncate">
                        {tr.reason}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <button
                          onClick={() => setExpandedTraceId(isExpanded ? null : tr.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-800 dark:hover:text-white underline font-mono"
                        >
                          {isExpanded ? "Close" : "Hash"}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Plan Hash Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50 dark:bg-[#141519]">
                        <td colSpan={6} className="p-4 space-y-2 border-t border-slate-200 dark:border-white/[0.04]">
                          <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>TRACE ID: <strong className="text-slate-800 dark:text-white">{tr.id}</strong></span>
                            <span>PROMPT: "{tr.prompt}"</span>
                          </div>
                          <div className="p-2.5 rounded bg-slate-900 text-emerald-400 text-[11px] font-mono overflow-x-auto space-y-1">
                            <div>PLAN HASH SHA-256: {tr.plan_hash}</div>
                            <div>MERKLE ROOT ATTESTATION: {tr.merkle_root}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredTraces.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      <div className="font-bold text-sm text-slate-800 dark:text-zinc-200">
                        Pristine Clean Slate Buffer ({currentTenant?.name || "Workspace"})
                      </div>
                      <p className="text-slate-500 dark:text-zinc-400 text-xs font-sans">
                        Zero prior telemetry recorded. Connect external agents via the MCP gateway or dispatch a test transaction from the Gauntlet.
                      </p>
                      <div className="pt-2 flex items-center justify-center gap-3">
                        <Link
                          href="/connect"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-mono text-[11px] inline-flex items-center gap-1 shadow-xs"
                        >
                          <Plug className="h-3 w-3" />
                          <span>Connect MCP Agent</span>
                        </Link>
                        <Link
                          href="/gauntlet"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#16171d] hover:bg-slate-100 text-slate-700 dark:text-zinc-300 font-semibold font-mono text-[11px] inline-flex items-center gap-1 shadow-xs"
                        >
                          <Play className="h-3 w-3" />
                          <span>Run Gauntlet Test</span>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
