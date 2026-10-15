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
  FileText,
  Workflow
} from "lucide-react";

export default function DashboardPage() {
  const { tenantId, currentUser, currentTenant, triggerReload, reloadTrigger } = useApp();
  const [balance, setBalance] = useState<number>(250000.0);
  const [traces, setTraces] = useState<TraceItem[]>([]);
  const [loadingScenario, setLoadingScenario] = useState<number | null>(null);
  const [lastScenarioResult, setLastScenarioResult] = useState<ScenarioRunResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"architecture" | "scenarios">("architecture");

  useEffect(() => {
    loadDashboardData();
  }, [tenantId, reloadTrigger]);

  const loadDashboardData = async () => {
    try {
      const [balRes, traceRes] = await Promise.all([
        api.getBankBalance(tenantId),
        api.getTraces(tenantId)
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
    } catch (e: any) {
      alert(`Scenario failed: ${e.message}`);
    } finally {
      setLoadingScenario(null);
    }
  };

  const quickScenarios = [
    {
      id: 1,
      title: "Scenario 1: Micro Refund ($20)",
      desc: "Autonomous micro-refund within policy limit. Instant receipt generated.",
      expected: "ALLOWED",
      color: "emerald"
    },
    {
      id: 2,
      title: "Scenario 2: High-Value Invoice ($8,000)",
      desc: "Legitimate AWS invoice exceeding spend cap. Pauses in Approval Inbox.",
      expected: "HELD FOR APPROVAL",
      color: "amber"
    },
    {
      id: 3,
      title: "Scenario 3: Poisoned Invoice ($9k Injection)",
      desc: "Hidden indirect prompt injection attempting unauthorized offshore transfer.",
      expected: "BLOCKED BY DELEGATION",
      color: "rose"
    },
    {
      id: 4,
      title: "Scenario 4: Unknown Account Refund",
      desc: "Refund attempt to unverified recipient rejected by Verifier policy.",
      expected: "BLOCKED BY POLICY",
      color: "rose"
    },
    {
      id: 5,
      title: `Scenario 5: Role Policy (${currentUser.role.toUpperCase()})`,
      desc: `Sensitive wire evaluation for ${currentUser.name} (${currentUser.role}).`,
      expected: currentUser.role === "manager" ? "ALLOWED" : "BLOCKED (INTERN)",
      color: currentUser.role === "manager" ? "emerald" : "rose"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & FinOps Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Corporate Sandbox Treasury</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Deterministic SQLite Vault</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Supervised Agent Actions</span>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {traces.length}
          </div>
          <div className="mt-1 text-[11px] text-blue-400 font-mono">
            100% Cryptographically Hashed
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Violations Intercepted</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            {traces.filter((t) => t.status === "BLOCKED").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Scoped Delegation Protocol Gates
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Tenant Policy Limit</span>
            <Lock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            ${(currentTenant?.spend_limit || 1000).toLocaleString("en-US")}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Auto-refund: ${((currentTenant?.policy_rules?.auto_refund_limit) || 100).toLocaleString("en-US")}
          </div>
        </div>
      </div>

      {/* Main Section: Multi-Agent Scoped Architecture Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-5 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Multi-Agent Scoped Delegation Plane</h2>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-400">
                delegate() protocol
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Orchestrator delegates restricted MCP token scopes to isolated sub-agents. Violations are blocked deterministically.
            </p>
          </div>

          <div className="flex rounded-xl border border-slate-800 bg-slate-900/80 p-0.5 text-xs">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === "architecture" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Architecture Diagram
            </button>
            <button
              onClick={() => setActiveTab("scenarios")}
              className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === "scenarios" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              5 Demo Scenarios
            </button>
          </div>
        </div>

        {activeTab === "architecture" ? (
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Orchestrator Card */}
              <div className="md:col-span-1 rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">Master Control</span>
                  <Cpu className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">FinOps Orchestrator</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Signs canonical SHA-256 plan hash and issues scoped delegations.
                </p>
                <div className="mt-3 rounded-lg bg-slate-950/70 p-2 font-mono text-[10px] text-blue-300 border border-blue-900/30">
                  await_approval() <br />
                  for_user({currentUser.role})
                </div>
              </div>

              {/* Sub-Agents Grid */}
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* ReaderAgent */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200">1. ReaderAgent</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">ISOLATED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Ingests emails & parses invoice attachments.</p>
                  <div className="rounded bg-slate-950 p-2 text-[10px] font-mono space-y-1">
                    <div className="text-emerald-400">✓ mcp.email.read</div>
                    <div className="text-emerald-400">✓ mcp.files.parse</div>
                    <div className="text-rose-400">✗ mcp.bank.* (BLOCKED)</div>
                    <div className="text-rose-400">✗ mcp.crm.* (BLOCKED)</div>
                  </div>
                </div>

                {/* VerifierAgent */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200">2. VerifierAgent</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Validates vendors against official registry.</p>
                  <div className="rounded bg-slate-950 p-2 text-[10px] font-mono space-y-1">
                    <div className="text-emerald-400">✓ mcp.crm.verify_vendor</div>
                    <div className="text-emerald-400">✓ mcp.accounting.log</div>
                    <div className="text-rose-400">✗ mcp.crm.export_all</div>
                    <div className="text-rose-400">✗ mcp.bank.*</div>
                  </div>
                </div>

                {/* ExecutorAgent */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200">3. ExecutorAgent</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">GATE BOUND</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Executes bank payments within spend caps.</p>
                  <div className="rounded bg-slate-950 p-2 text-[10px] font-mono space-y-1">
                    <div className="text-emerald-400">✓ mcp.bank.refund (≤$100)</div>
                    <div className="text-amber-400">⚠ wire_transfer (&gt;$1k hold)</div>
                    <div className="text-rose-400">✗ unverified vendors</div>
                    <div className="text-rose-400">✗ intern role execution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Scenarios Tab */
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickScenarios.map((sc) => (
              <div
                key={sc.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{sc.title}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        sc.expected.includes("ALLOWED")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                          : sc.expected.includes("HELD")
                          ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                          : "bg-rose-950 text-rose-400 border border-rose-800/40"
                      }`}
                    >
                      {sc.expected}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{sc.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleRunScenario(sc.id)}
                    disabled={loadingScenario !== null}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                  >
                    {loadingScenario === sc.id ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <Play className="h-3 w-3 fill-current" />
                    )}
                    <span>Trigger Scenario</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Scenario Execution Feedback Banner */}
      {lastScenarioResult && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-900/40">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-blue-400">
                [LATEST RUN] {lastScenarioResult.scenario_name}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  lastScenarioResult.overall_status === "ALLOWED"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                    : lastScenarioResult.overall_status === "HELD_FOR_APPROVAL"
                    ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                    : "bg-rose-950 text-rose-400 border border-rose-800/40"
                }`}
              >
                {lastScenarioResult.overall_status}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{lastScenarioResult.summary}</span>
          </div>

          <div className="space-y-1.5">
            {lastScenarioResult.steps.map((s, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="font-mono text-slate-500 mt-0.5">#{s.step}</span>
                <span className="font-semibold text-slate-300 w-28 shrink-0">{s.agent}</span>
                <span className="font-mono text-blue-300/80 w-36 shrink-0">{s.tool}</span>
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
                <span className="text-slate-400 truncate">{s.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Audit Trace Feed */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-5 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Live Cryptographic Audit Trail</h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
              {traces.length} records
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Merkle Leaf Verification: READY</span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/50 text-[10px] font-mono uppercase text-slate-400">
              <tr>
                <th className="py-2 px-3">Trace ID</th>
                <th className="py-2 px-3">Sub-Agent</th>
                <th className="py-2 px-3">Requested Tool</th>
                <th className="py-2 px-3">User (for_user)</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Plan Hash (SHA-256)</th>
                <th className="py-2 px-3">Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {traces.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-blue-400">{t.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{t.agent_name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{t.action}</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {t.user_name} <span className="text-[10px] font-mono text-slate-500">({t.user_role})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        t.status === "ALLOWED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                          : t.status === "HELD_FOR_APPROVAL"
                          ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                          : "bg-rose-950 text-rose-400 border border-rose-800/40"
                      }`}
                    >
                      {t.status === "ALLOWED" && <CheckCircle2 className="h-3 w-3" />}
                      {t.status === "HELD_FOR_APPROVAL" && <AlertTriangle className="h-3 w-3" />}
                      {t.status === "BLOCKED" && <XCircle className="h-3 w-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                    {t.plan_hash ? `${t.plan_hash.slice(0, 8)}...${t.plan_hash.slice(-6)}` : "N/A"}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{t.reason}</td>
                </tr>
              ))}
              {traces.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
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
