"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api, ApprovalItem } from "@/lib/api";
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Building,
  UserCheck,
  Send,
  Zap,
  Check,
  X,
  FileCheck2,
  Lock,
  ChevronRight,
  MessageSquare,
  Code2,
  Shield,
  FileCode,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ApprovalInboxPage() {
  const { tenantId, currentUser, triggerReload, reloadTrigger, addToast } = useApp();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isSimulatingQuick, setIsSimulatingQuick] = useState<number | null>(null);

  useEffect(() => {
    loadApprovals();
  }, [tenantId, reloadTrigger]);

  const loadApprovals = async () => {
    try {
      const data = await api.getApprovals(tenantId);
      setApprovals(data);
      if (data.length > 0 && !selectedId) {
        // Default to first pending item or first item
        const firstPending = data.find((a) => a.status === "HELD_FOR_APPROVAL") || data[0];
        setSelectedId(firstPending.delegation_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (delegationId: string, action: "APPROVE" | "REJECT") => {
    if (action === "APPROVE" && currentUser.role === "intern") {
      addToast(
        "Action Blocked by for_user Policy",
        "Intern role (Alex Rivera) cannot authorize financial disbursements. Switch to Sarah Chen (CFO).",
        "error"
      );
      return;
    }

    setProcessingId(delegationId);
    try {
      await api.takeApprovalAction(
        delegationId,
        action,
        currentUser.role,
        currentUser.name,
        `Processed via ArmorDesk Linear-Triage Inbox by ${currentUser.name}`
      );
      addToast(
        `Transaction ${action === "APPROVE" ? "Approved" : "Rejected"}`,
        `Delegation ${delegationId} settled. Merkle leaf written to cryptographic ledger.`,
        action === "APPROVE" ? "success" : "warning"
      );
      await loadApprovals();
      triggerReload();
    } catch (e: any) {
      addToast("Settlement Failed", e.message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleTriggerQuickScenario = async (scenarioId: number) => {
    setIsSimulatingQuick(scenarioId);
    try {
      const res = await api.runScenario(scenarioId, tenantId, currentUser.role, currentUser.name);
      await loadApprovals();
      triggerReload();
      addToast(
        "Simulation Dispatched",
        `${res.scenario_name}: Status ${res.overall_status}`,
        res.overall_status === "HELD_FOR_APPROVAL" ? "warning" : "info"
      );
    } catch (e: any) {
      addToast("Simulation Failed", e.message, "error");
    } finally {
      setIsSimulatingQuick(null);
    }
  };

  const filtered = approvals.filter((a) => {
    if (filterStatus === "ALL") return true;
    return a.status === filterStatus;
  });

  const selectedItem = approvals.find((a) => a.delegation_id === selectedId) || filtered[0] || null;
  const pendingCount = approvals.filter((a) => a.status === "HELD_FOR_APPROVAL").length;

  return (
    <div className="space-y-4">
      {/* 1. Header & Instant Simulation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-white/[0.07]">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Inbox className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              Human-in-the-Loop Approval Inbox
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 font-semibold">
              {pendingCount} HELD TRANSACTIONS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Linear-style triage for actions gated by <code className="font-mono text-indigo-400">await_approval()</code>. Multi-channel Slack Block Kit sync and cryptographic non-repudiation release.
          </p>
        </div>

        {/* Quick Simulation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-500">Instant Triggers:</span>
          <button
            onClick={() => handleTriggerQuickScenario(1)}
            disabled={isSimulatingQuick !== null}
            className="rounded-md border border-white/[0.08] bg-[#111114] hover:bg-[#18181C] px-2.5 py-1 text-xs font-mono text-zinc-300 transition-all shadow-hairline disabled:opacity-50"
          >
            + $20 Refund [Auto-Allow]
          </button>
          <button
            onClick={() => handleTriggerQuickScenario(2)}
            disabled={isSimulatingQuick !== null}
            className="rounded-md border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 text-xs font-mono text-amber-300 transition-all shadow-hairline disabled:opacity-50"
          >
            + $8,000 Invoice [Hold for CFO]
          </button>
          <button
            onClick={() => handleTriggerQuickScenario(4)}
            disabled={isSimulatingQuick !== null}
            className="rounded-md border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 text-xs font-mono text-rose-300 transition-all shadow-hairline disabled:opacity-50"
          >
            + Unknown Refund [Auto-Block]
          </button>
        </div>
      </div>

      {/* 2. Intern Policy Warning Banner if Intern is Active */}
      {currentUser.role === "intern" && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-200">
              Role Restricted: Signed in as {currentUser.name} (Junior Intern)
            </div>
            <p className="text-zinc-400 mt-0.5 leading-relaxed">
              The active <code className="font-mono text-amber-300">for_user(intern)</code> policy blocks approval permissions. The <strong>Approve & Settle</strong> button is disabled. Switch to <strong>Sarah Chen (CFO)</strong> in the top context bar to release holds.
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs">
        {["ALL", "HELD_FOR_APPROVAL", "APPROVED", "REJECTED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              filterStatus === st
                ? "bg-[#1F1F24] text-white border border-white/[0.08] font-semibold shadow-hairline"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-[#151518]"
            }`}
          >
            {st === "HELD_FOR_APPROVAL" ? "PENDING HOLDS" : st}
          </button>
        ))}
      </div>

      {/* 3. Master-Detail Split Screen (Linear Triage / Stripe Disputes Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[520px]">
        {/* Left Column: Ticket Queue (Span 5) */}
        <div className="lg:col-span-5 rounded-lg border border-white/[0.07] bg-[#111114] flex flex-col h-[560px] overflow-hidden shadow-hairline">
          <div className="px-3.5 py-2.5 border-b border-white/[0.06] bg-[#0E0E11] flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">TRANSACTION QUEUE</span>
            <span className="text-zinc-500">{filtered.length} tickets</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {filtered.map((item) => {
              const isSelected = selectedItem?.delegation_id === item.delegation_id;
              const isPending = item.status === "HELD_FOR_APPROVAL";

              return (
                <div
                  key={item.delegation_id}
                  onClick={() => setSelectedId(item.delegation_id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#18181C] border-l-2 border-l-amber-400"
                      : "hover:bg-[#141418] opacity-90"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-zinc-300">
                      {item.delegation_id}
                    </span>
                    <span className="font-mono text-sm font-semibold text-zinc-100 tabular-nums">
                      ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-zinc-300 font-medium truncate">
                    {item.description}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                        item.status === "HELD_FOR_APPROVAL"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                          : item.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span>{item.recipient}</span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-zinc-500 font-mono text-xs">
                No transactions found matching "{filterStatus}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inspector & Action Panel (Span 7) */}
        <div className="lg:col-span-7 rounded-lg border border-white/[0.07] bg-[#111114] flex flex-col h-[560px] overflow-hidden shadow-hairline">
          {selectedItem ? (
            <div className="flex flex-col h-full justify-between">
              {/* Header Details */}
              <div className="p-4 border-b border-white/[0.06] bg-[#0E0E11]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-indigo-400">
                      {selectedItem.delegation_id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        selectedItem.status === "HELD_FOR_APPROVAL"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                          : selectedItem.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {selectedItem.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Amount</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                      ${selectedItem.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-white mt-1">
                  {selectedItem.description}
                </h2>
              </div>

              {/* Inspector Body (Scrollable) */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
                {/* Hold Reason Banner */}
                <div className="p-3 rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-300">
                  <div className="font-semibold text-xs flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Policy Trigger: await_approval() Execution Gate</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                    Transaction amount ${selectedItem.amount.toLocaleString("en-US")} exceeds autonomous auto-refund cap ($100.00) & tenant spend cap. Awaiting dual-authorization sign-off.
                  </p>
                </div>

                {/* Slack Block Kit Message Preview */}
                <div className="rounded-md border border-white/[0.07] bg-[#09090B] p-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2 pb-1.5 border-b border-white/[0.05]">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      Slack Synchronized Notification (#finops-approvals)
                    </span>
                    <span className="text-emerald-400">DISPATCHED</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-300 space-y-1">
                    <div className="text-amber-400 font-semibold">
                      :warning: *FinOps Approval Required* | Delegation: {selectedItem.delegation_id}
                    </div>
                    <div>*Recipient:* `{selectedItem.recipient}` | *Amount:* `${selectedItem.amount.toFixed(2)}`</div>
                    <div className="text-zinc-500 text-[10px]">
                      Slack Block Kit Actions: [Approve via Webhook] [Reject & Revoke Token]
                    </div>
                  </div>
                </div>

                {/* MCP Tool Call Payload Preview */}
                <div className="rounded-md border border-white/[0.07] bg-[#09090B] p-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2 pb-1.5 border-b border-white/[0.05]">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                      Pending MCP Tool Call Payload
                    </span>
                    <span className="text-indigo-400">JSON-RPC 2.0</span>
                  </div>
                  <pre className="font-mono text-[11px] text-zinc-300 overflow-x-auto p-2 rounded bg-[#111114] border border-white/[0.04]">
{JSON.stringify(
  {
    tool: "mcp.bank.wire_transfer",
    parameters: {
      recipient: selectedItem.recipient,
      amount: selectedItem.amount,
      delegation_id: selectedItem.delegation_id,
      plan_hash: selectedItem.plan_hash?.slice(0, 16) + "...",
      for_user: currentUser.role
    }
  },
  null,
  2
)}
                  </pre>
                </div>

                {/* Authority & Plan Hash Footprint */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-[#09090B] border border-white/[0.05]">
                    <span className="text-zinc-500 block text-[10px]">REQUESTED BY</span>
                    <span className="text-zinc-200">{selectedItem.requested_by} ({selectedItem.role})</span>
                  </div>
                  <div className="p-2 rounded bg-[#09090B] border border-white/[0.05]">
                    <span className="text-zinc-500 block text-[10px]">PLAN HASH (SHA-256)</span>
                    <span className="text-zinc-400 truncate block">{selectedItem.plan_hash}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-3.5 bg-[#0E0E11] border-t border-white/[0.06] flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-500">
                  {selectedItem.status === "HELD_FOR_APPROVAL" ? (
                    currentUser.role === "intern" ? (
                      <span className="text-rose-400">Policy lock: Intern cannot approve</span>
                    ) : (
                      <span>Dual sign-off authorized</span>
                    )
                  ) : (
                    <span>Resolved: {selectedItem.resolved_by || "System"}</span>
                  )}
                </div>

                {selectedItem.status === "HELD_FOR_APPROVAL" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(selectedItem.delegation_id, "REJECT")}
                      disabled={processingId !== null}
                      className="px-3 py-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Reject & Revoke Token
                    </button>
                    <button
                      onClick={() => handleAction(selectedItem.delegation_id, "APPROVE")}
                      disabled={processingId !== null || currentUser.role === "intern"}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-hairline transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      title={currentUser.role === "intern" ? "Locked for Interns" : "Approve and execute disbursement"}
                    >
                      {processingId === selectedItem.delegation_id ? (
                        <span className="animate-spin text-white">⟳</span>
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      <span>Approve & Release Execution</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/receipts"
                    className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline"
                  >
                    <span>View Cryptographic Receipt</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center h-full">
              <Inbox className="h-8 w-8 text-zinc-600 mb-2" />
              <span>Select a transaction from the queue to inspect details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
