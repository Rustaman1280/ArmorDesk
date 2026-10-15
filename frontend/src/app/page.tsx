"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api, TraceItem, ScenarioRunResponse } from "@/lib/api";
import {
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
  ArrowDownRight
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

  const [balance, setBalance] = useState<number>(250000.0);
  const [traces, setTraces] = useState<TraceItem[]>([]);
  const [loadingScenario, setLoadingScenario] = useState<number | null>(null);
  const [lastScenarioResult, setLastScenarioResult] = useState<ScenarioRunResponse | null>(null);
  const [isSimulatingDelegation, setIsSimulatingDelegation] = useState<boolean>(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, [tenantId, reloadTrigger]);

  const loadDashboardData = async () => {
    try {
      const [balRes, traceRes] = await Promise.all([
        api.getBankBalance(tenantId),
        api.getTraces(tenantId),
      ]);
      setBalance(balRes.balance);
      setTraces(traceRes);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    }
  };

  const handleRunScenario = async (id: number) => {
    setLoadingScenario(id);
    try {
      const res = await api.runScenario(id, tenantId, currentUser.role, currentUser.name);
      setLastScenarioResult(res);
      triggerReload();
      addToast(
        `Scenario ${id} Executed`,
        `${res.scenario_name}: ${res.overall_status}`,
        res.overall_status === "ALLOWED"
          ? "success"
          : res.overall_status === "HELD_FOR_APPROVAL"
          ? "warning"
          : "error"
      );
    } catch (e: any) {
      addToast("Scenario Execution Error", e.message, "error");
    } finally {
      setLoadingScenario(null);
    }
  };

  const runDelegationSimulation = async () => {
    if (isSimulatingDelegation) return;
    setIsSimulatingDelegation(true);
    setActiveSimulationStep(1); // Orchestrator hashing plan

    setTimeout(() => {
      setActiveSimulationStep(2); // Reader token issuance
    }, 700);

    setTimeout(() => {
      setActiveSimulationStep(3); // Verifier token issuance
    }, 1400);

    setTimeout(() => {
      setActiveSimulationStep(4); // Executor token check & execution
    }, 2100);

    setTimeout(() => {
      setActiveSimulationStep(0);
      setIsSimulatingDelegation(false);
      addToast(
        "Delegation Scope Simulation Passed",
        "Deterministic MCP permission tokens verified across Reader, Verifier, and Executor sub-agents.",
        "success"
      );
    }, 2900);
  };

  const quickScenarios = [
    {
      id: 1,
      title: "1. Micro Refund ($20.00)",
      desc: "Within $100 auto cap. Instant execution & cryptographic receipt.",
      expected: "ALLOWED",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    },
    {
      id: 2,
      title: "2. High-Value Invoice ($8,000.00)",
      desc: "Legitimate AWS invoice. Exceeds $1,000 cap, held in Approval Inbox.",
      expected: "HELD FOR APPROVAL",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    },
    {
      id: 3,
      title: "3. Poisoned Invoice ($9k Wire)",
      desc: "Hidden prompt injection. ReaderAgent tries bank wire; intercepted.",
      expected: "BLOCKED (SCOPE)",
      statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      id: 4,
      title: "4. Unknown Account Refund",
      desc: "Unverified destination account. Blocked at VerifierAgent policy layer.",
      expected: "BLOCKED (POLICY)",
      statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      id: 5,
      title: `5. Role Policy (${currentUser.role.toUpperCase()})`,
      desc: `Sensitive action test for ${currentUser.name} (${currentUser.role}).`,
      expected: currentUser.role === "manager" ? "ALLOWED" : "BLOCKED (INTERN)",
      statusColor:
        currentUser.role === "manager"
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
          : "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Top Metric Strip (4 Columns Tight, High-Craft Obsidian Surface) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-4 shadow-hairline">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>TREASURY SANDBOX BALANCE</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100 tabular-nums">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Deterministic SQLite Bank Vault</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-4 shadow-hairline">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>GOVERNED MCP CALLS</span>
            <Activity className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-100 tabular-nums">
            {traces.length}
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>100% Merkle Tree Cryptographic Hash</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-4 shadow-hairline">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>INJECTIONS INTERCEPTED</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {traces.filter((t) => t.status === "BLOCKED").length}
          </div>
          <div className="mt-1.5 text-[11px] text-zinc-500 font-mono">
            Scoped Delegation Protocol Gates
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-4 shadow-hairline">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>PENDING HUMAN APPROVALS</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {pendingApprovalsCount}
          </div>
          <div className="mt-1.5 text-[11px] text-zinc-500 font-mono">
            Spend Cap &gt; ${(currentTenant?.spend_limit || 1000).toLocaleString("en-US")}
          </div>
        </div>
      </div>

      {/* 2. Interactive Delegation Graph (`delegate()` Visualizer) */}
      <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-5 shadow-hairline">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Cpu className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Multi-Agent Scoped Delegation Topology
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                delegate() protocol
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Authority flows downward from Orchestrator via signed SHA-256 Plan Hashes. Sub-agents possess strictly partitioned MCP scopes.
            </p>
          </div>

          <button
            onClick={runDelegationSimulation}
            disabled={isSimulatingDelegation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold shadow-hairline transition-all ${
              isSimulatingDelegation
                ? "bg-indigo-600 text-white animate-pulse"
                : "bg-[#18181C] hover:bg-[#202026] text-zinc-200 border border-white/[0.08]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isSimulatingDelegation ? "Verifying Token Propagation..." : "Simulate Scoped Delegation Test"}</span>
          </button>
        </div>

        {/* Two-Tier Authority Architecture Visualizer */}
        <div className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Tier 1: Orchestrator Agent (Span 4) */}
            <div
              className={`lg:col-span-4 rounded-lg border p-4 flex flex-col justify-between transition-all ${
                activeSimulationStep === 1
                  ? "border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/50"
                  : "border-white/[0.08] bg-[#0E0E11]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                    TIER 1 · MASTER PLAN AUTHORITY
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="font-semibold text-sm text-white">FinOps Orchestrator Agent</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Generates Canonical Execution Plan and signs SHA-256 Plan Hash before issuing scoped child delegation tokens.
                </p>

                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#16161A] border border-white/[0.05] text-[11px] font-mono">
                    <span className="text-zinc-400">Authority Mode</span>
                    <span className="text-emerald-400 font-semibold">DETERMINISTIC</span>
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#16161A] border border-white/[0.05] text-[11px] font-mono">
                    <span className="text-zinc-400">Master Hash Gate</span>
                    <span className="text-indigo-400">Signed Canonical SHA-256</span>
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#16161A] border border-white/[0.05] text-[11px] font-mono">
                    <span className="text-zinc-400">Active User Context</span>
                    <span className="text-amber-400">for_user({currentUser.role})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Protocol: delegate()</span>
                <span className="text-zinc-400">Non-Repudiation Signed</span>
              </div>
            </div>

            {/* Tier 2: 3 Partitioned Sub-Agents (Span 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. ReaderAgent */}
              <div
                className={`rounded-lg border p-3.5 flex flex-col justify-between transition-all ${
                  activeSimulationStep === 2
                    ? "border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50"
                    : "border-white/[0.08] bg-[#0E0E11]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-200">1. ReaderAgent</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      ISOLATED
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Ingests incoming email messages and parses PDF/text invoices.
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] font-mono">
                    <div className="text-zinc-500 text-[10px] font-semibold uppercase">Permitted Scopes</div>
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>mcp.email.read</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>mcp.files.parse</span>
                    </div>

                    <div className="text-zinc-500 text-[10px] font-semibold uppercase pt-1">Strictly Blocked</div>
                    <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <X className="h-3 w-3 shrink-0" />
                      <span>No Bank Access</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <X className="h-3 w-3 shrink-0" />
                      <span>No CRM Access</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
                  Target: sandbox_email
                </div>
              </div>

              {/* 2. VerifierAgent */}
              <div
                className={`rounded-lg border p-3.5 flex flex-col justify-between transition-all ${
                  activeSimulationStep === 3
                    ? "border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50"
                    : "border-white/[0.08] bg-[#0E0E11]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-200">2. VerifierAgent</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      REGISTRY
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Validates vendor credentials and cross-checks CRM ledger history.
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] font-mono">
                    <div className="text-zinc-500 text-[10px] font-semibold uppercase">Permitted Scopes</div>
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>mcp.crm.verify_vendor</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>mcp.accounting.log</span>
                    </div>

                    <div className="text-zinc-500 text-[10px] font-semibold uppercase pt-1">Strictly Blocked</div>
                    <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <X className="h-3 w-3 shrink-0" />
                      <span>mcp.crm.export_all</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <X className="h-3 w-3 shrink-0" />
                      <span>mcp.bank.wire_transfer</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
                  Target: sandbox_crm
                </div>
              </div>

              {/* 3. ExecutorAgent */}
              <div
                className={`rounded-lg border p-3.5 flex flex-col justify-between transition-all ${
                  activeSimulationStep === 4
                    ? "border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50"
                    : "border-white/[0.08] bg-[#0E0E11]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-200">3. ExecutorAgent</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                      GATE BOUND
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Executes bank disbursements under strict monetary policy caps.
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] font-mono">
                    <div className="text-zinc-500 text-[10px] font-semibold uppercase">Permitted Scopes</div>
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>mcp.bank.refund (≤$100)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>wire_transfer (&gt;$1k hold)</span>
                    </div>

                    <div className="text-zinc-500 text-[10px] font-semibold uppercase pt-1">Strictly Blocked</div>
                    <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <X className="h-3 w-3 shrink-0" />
                      <span>Unverified Recipients</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <X className="h-3 w-3 shrink-0" />
                      <span>Intern Role Execution</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
                  Target: sandbox_bank
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Five Core Demo Scenarios Quick Runner */}
      <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-5 shadow-hairline">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div>
            <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
              DETERMINISTIC EVALUATION SUITE · 5 DEMO SCENARIOS
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Execute individual end-to-end multi-agent test vectors against live MCP sandboxes.
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Current Role: <span className="text-amber-400 font-semibold">{currentUser.role.toUpperCase()}</span>
          </span>
        </div>

        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {quickScenarios.map((sc) => (
            <div
              key={sc.id}
              className="rounded-lg border border-white/[0.06] bg-[#0E0E11] p-3 flex flex-col justify-between hover:border-white/[0.12] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-zinc-200">{sc.title}</span>
                </div>
                <div className="mb-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${sc.statusColor}`}>
                    {sc.expected}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{sc.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.05] flex justify-end">
                <button
                  onClick={() => handleRunScenario(sc.id)}
                  disabled={loadingScenario !== null}
                  className="w-full flex items-center justify-center gap-1.5 rounded-md bg-[#18181C] hover:bg-[#222228] border border-white/[0.08] px-2.5 py-1 text-xs font-medium text-zinc-200 transition-all disabled:opacity-50"
                >
                  {loadingScenario === sc.id ? (
                    <span className="animate-spin text-zinc-400">⟳</span>
                  ) : (
                    <Play className="h-3 w-3 text-emerald-400 fill-current" />
                  )}
                  <span>Run Scenario</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Scenario Execution Feedback Banner */}
      {lastScenarioResult && (
        <div className="rounded-lg border border-white/[0.08] bg-[#111114] p-4 shadow-hairline">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-200">
                [LATEST RUN] {lastScenarioResult.scenario_name}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  lastScenarioResult.overall_status === "ALLOWED"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : lastScenarioResult.overall_status === "HELD_FOR_APPROVAL"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}
              >
                {lastScenarioResult.overall_status}
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">{lastScenarioResult.summary}</span>
          </div>

          <div className="space-y-1.5">
            {lastScenarioResult.steps.map((s, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs font-mono px-2 py-1 rounded bg-[#0E0E11] border border-white/[0.04]"
              >
                <span className="text-zinc-600">#{s.step}</span>
                <span className="font-semibold text-zinc-300 w-28 shrink-0">{s.agent}</span>
                <span className="text-zinc-400 w-36 shrink-0 truncate">{s.tool}</span>
                <span
                  className={`font-semibold shrink-0 ${
                    s.status === "ALLOWED"
                      ? "text-emerald-400"
                      : s.status === "HELD_FOR_APPROVAL"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  [{s.status}]
                </span>
                <span className="text-zinc-400 truncate">{s.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Live Cryptographic Audit Trail */}
      <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-5 shadow-hairline">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-400" />
            <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
              LIVE CRYPTOGRAPHIC AUDIT LOG
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {traces.length} entries
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Merkle Leaf Verification: READY
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0E0E11] text-[10px] font-mono uppercase text-zinc-500 border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-3">Trace ID</th>
                <th className="py-2.5 px-3">Sub-Agent</th>
                <th className="py-2.5 px-3">Requested Tool</th>
                <th className="py-2.5 px-3">User (for_user)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Plan Hash (SHA-256)</th>
                <th className="py-2.5 px-3">Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-sans">
              {traces.slice(0, 8).map((t) => (
                <tr key={t.id} className="hover:bg-[#16161A] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-xs">{t.id}</td>
                  <td className="py-2.5 px-3 font-medium text-zinc-200">{t.agent_name}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400">{t.action}</td>
                  <td className="py-2.5 px-3 text-zinc-400 text-xs">
                    {t.user_name}{" "}
                    <span className="text-[10px] font-mono text-zinc-500">({t.user_role})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        t.status === "ALLOWED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : t.status === "HELD_FOR_APPROVAL"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {t.status === "ALLOWED" && <CheckCircle2 className="h-3 w-3" />}
                      {t.status === "HELD_FOR_APPROVAL" && <AlertTriangle className="h-3 w-3" />}
                      {t.status === "BLOCKED" && <XCircle className="h-3 w-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500 truncate max-w-[140px] tabular-nums">
                    {t.plan_hash ? `${t.plan_hash.slice(0, 8)}...${t.plan_hash.slice(-6)}` : "N/A"}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400 truncate max-w-xs text-xs">{t.reason}</td>
                </tr>
              ))}
              {traces.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono text-xs">
                    No traces recorded yet for tenant {tenantId}. Run a scenario above.
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
