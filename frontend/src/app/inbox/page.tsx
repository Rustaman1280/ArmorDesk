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
  FileCheck2
} from "lucide-react";
import Link from "next/link";

export default function ApprovalInboxPage() {
  const { tenantId, currentUser, triggerReload, reloadTrigger } = useApp();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadApprovals();
  }, [tenantId, reloadTrigger]);

  const loadApprovals = async () => {
    try {
      const data = await api.getApprovals(tenantId);
      setApprovals(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (delegationId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(delegationId);
    setActionSuccess(null);
    try {
      const res = await api.takeApprovalAction(
        delegationId,
        action,
        currentUser.role,
        currentUser.name,
        `Processed via ArmorDesk Web Inbox by ${currentUser.name}`
      );
      setActionSuccess(`Transaction ${delegationId} ${action === "APPROVE" ? "APPROVED" : "REJECTED"} successfully!`);
      await loadApprovals();
      triggerReload();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (e: any) {
      alert(`Action failed: ${e.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleTriggerQuickScenario = async (scenarioId: number) => {
    try {
      await api.runScenario(scenarioId, tenantId, currentUser.role, currentUser.name);
      await loadApprovals();
      triggerReload();
    } catch (e: any) {
      alert(`Failed to trigger: ${e.message}`);
    }
  };

  const filtered = approvals.filter((a) => {
    if (filterStatus === "ALL") return true;
    return a.status === filterStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === "HELD_FOR_APPROVAL").length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="h-6 w-6 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Human-in-the-Loop Approval Inbox
            </h1>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-amber-400 border border-amber-500/20">
              {pendingCount} PENDING ACTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Financial operations exceeding automated thresholds pause safely with <code className="text-blue-400">await_approval()</code> awaiting human sign-off.
          </p>
        </div>

        {/* Quick Simulation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">Simulate Incoming:</span>
          <button
            onClick={() => handleTriggerQuickScenario(1)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800"
          >
            + $20 Refund (Auto)
          </button>
          <button
            onClick={() => handleTriggerQuickScenario(2)}
            className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-2.5 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-amber-950/60"
          >
            + $8,000 AWS Invoice (Held)
          </button>
        </div>
      </div>

      {/* Role Alert Banner if Intern */}
      {currentUser.role === "intern" && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-950/30 p-3.5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-200">
              Signed in as {currentUser.name} (Junior Intern Role)
            </span>
            <p className="text-amber-300/80 mt-0.5">
              The <code className="font-mono">for_user</code> policy restricts interns from approving financial holds. Click Approve to see ArmorIQ policy enforcement in action, or switch to Sarah Chen (CFO) in the top header.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {actionSuccess && (
        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/40 p-3.5 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <Link href="/receipts" className="underline font-semibold hover:text-emerald-200 flex items-center gap-1">
            <FileCheck2 className="h-3.5 w-3.5" /> View Receipt
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {["ALL", "HELD_FOR_APPROVAL", "APPROVED", "REJECTED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              filterStatus === st
                ? "bg-slate-800 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {st === "HELD_FOR_APPROVAL" ? "PENDING HOLDS" : st}
          </button>
        ))}
      </div>

      {/* Approval List Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isPending = item.status === "HELD_FOR_APPROVAL";
          return (
            <div
              key={item.delegation_id}
              className={`rounded-2xl border p-5 transition-all shadow-md ${
                isPending
                  ? "border-amber-500/30 bg-[#0B1120] hover:border-amber-500/50"
                  : "border-slate-800/80 bg-slate-900/30 opacity-80"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/60">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {item.delegation_id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.status === "HELD_FOR_APPROVAL"
                          ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                          : item.status === "APPROVED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                          : "bg-rose-950 text-rose-400 border border-rose-800/40"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      Requested by <span className="text-slate-300 font-medium">{item.requested_by}</span> ({item.role})
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mt-1">
                    {item.description}
                  </h3>
                </div>

                {/* Amount Pill */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Transaction Value</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Actions if Pending */}
                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(item.delegation_id, "REJECT")}
                        disabled={processingId !== null}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-800/50 bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/60 transition-colors disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleAction(item.delegation_id, "APPROVE")}
                        disabled={processingId !== null}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md transition-all disabled:opacity-50"
                      >
                        {processingId === item.delegation_id ? "Settling..." : <Check className="h-3.5 w-3.5" />}
                        <span>Approve & Settle</span>
                      </button>
                    </div>
                  )}

                  {!isPending && (
                    <div className="text-xs text-slate-500 text-right">
                      <div>Resolved by: {item.resolved_by || "System"}</div>
                      <div className="text-[10px] font-mono">{item.resolved_at?.slice(0, 19)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details & Payload Preview */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-900">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Target Recipient</span>
                  <span className="font-semibold text-slate-200">{item.recipient}</span>
                </div>
                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-900">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Policy Hold Reason</span>
                  <span className="text-amber-300 font-medium">
                    Spend exceeds automated threshold; CFO approval required.
                  </span>
                </div>
                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-900">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Signed Plan Hash</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate block">
                    {item.plan_hash}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-12 text-center text-slate-500">
            <Inbox className="h-10 w-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium">No transactions matching current filter.</p>
            <p className="text-xs mt-1">Use the quick simulation buttons above to trigger high-value approvals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
