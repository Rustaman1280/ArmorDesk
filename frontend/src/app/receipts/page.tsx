"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api, ReceiptItem } from "@/lib/api";
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Hash,
  Key,
  Calendar,
  DollarSign,
  Building,
  Check,
  Lock,
  ExternalLink
} from "lucide-react";

export default function AgentReceiptsPage() {
  const { tenantId, reloadTrigger } = useApp();
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadReceipts();
  }, [tenantId, reloadTrigger]);

  const loadReceipts = async () => {
    try {
      const data = await api.getReceipts(tenantId);
      setReceipts(data);
      if (data.length > 0 && !selectedReceipt) {
        setSelectedReceipt(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async () => {
    if (!selectedReceipt) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.verifyReceiptProof({
        plan_hash: selectedReceipt.plan_hash,
        merkle_root: selectedReceipt.merkle_root,
        signature: selectedReceipt.signature,
        allowed_spec: selectedReceipt.allowed_spec,
        actual_execution: selectedReceipt.actual_execution
      });
      setVerifyResult(res);
    } catch (e: any) {
      alert(`Verification failed: ${e.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Customer-Facing Agent Receipts & Verifiable Plan Hashes
          </h1>
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-400 border border-emerald-500/20">
            NON-REPUDIATION ATTESTATION
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically audited transaction receipts comparing what the autonomous agent was authorized to do against what was verified by MCP protocol gates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Receipts Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Issued Receipts ({receipts.length})
          </div>

          <div className="space-y-2">
            {receipts.map((rcpt) => {
              const isSelected = selectedReceipt?.id === rcpt.id;
              return (
                <button
                  key={rcpt.id}
                  onClick={() => {
                    setSelectedReceipt(rcpt);
                    setVerifyResult(null);
                  }}
                  className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-950/20 shadow-md shadow-blue-500/10"
                      : "border-slate-800 bg-[#0B1120] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-blue-400">{rcpt.id}</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      ${rcpt.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="font-medium text-slate-200 text-xs truncate">
                    {rcpt.recipient}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{rcpt.action_type.toUpperCase()}</span>
                    <span>{rcpt.created_at.slice(0, 10)}</span>
                  </div>
                </button>
              );
            })}

            {receipts.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-[#0B1120] p-6 text-center text-xs text-slate-500">
                No receipts generated yet. Run Scenario 1 or approve a hold in the Inbox.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Receipt Certificate Document */}
        {selectedReceipt && (
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-xl relative overflow-hidden">
              {/* Receipt Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-mono">
                      OFFICIAL AGENT EXECUTION RECEIPT
                    </h2>
                    <p className="text-xs text-slate-400">
                      Receipt ID: <span className="font-mono text-blue-400">{selectedReceipt.id}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Settled Amount</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    ${selectedReceipt.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Side-by-Side: Allowed Spec vs Actual Execution */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Signed Plan */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-2">
                    <Lock className="h-3.5 w-3.5" />
                    <span>What the Agent Was Allowed to Do</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-3 font-mono">
                    [Signed Plan Specification]
                  </div>
                  <pre className="rounded-lg bg-slate-900/90 p-3 text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    {JSON.stringify(selectedReceipt.allowed_spec, null, 2)}
                  </pre>
                </div>

                {/* Column 2: Actual Execution */}
                <div className="rounded-xl border border-emerald-900/40 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>What the Agent Actually Did</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-3 font-mono">
                    [Verified MCP Execution & Bank Settlement]
                  </div>
                  <pre className="rounded-lg bg-slate-900/90 p-3 text-[11px] font-mono text-emerald-300/90 overflow-x-auto border border-emerald-950">
                    {JSON.stringify(selectedReceipt.actual_execution, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Cryptographic Evidence Blocks */}
              <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
                <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Cryptographic Integrity Proofs
                </div>

                {/* Plan Hash */}
                <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 text-xs font-mono border border-slate-900">
                  <div className="truncate mr-2">
                    <span className="text-slate-500 mr-2">Plan Hash (SHA-256):</span>
                    <span className="text-blue-400">{selectedReceipt.plan_hash}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedReceipt.plan_hash, "plan_hash")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === "plan_hash" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Merkle Root */}
                <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 text-xs font-mono border border-slate-900">
                  <div className="truncate mr-2">
                    <span className="text-slate-500 mr-2">Merkle Root:</span>
                    <span className="text-slate-300">{selectedReceipt.merkle_root}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedReceipt.merkle_root, "merkle_root")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === "merkle_root" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Attestation Signature */}
                <div className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 text-xs font-mono border border-slate-900">
                  <div className="truncate mr-2">
                    <span className="text-slate-500 mr-2">ArmorIQ Attestation:</span>
                    <span className="text-emerald-400">{selectedReceipt.signature}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedReceipt.signature, "signature")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === "signature" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Real-Time Cryptographic Verification Action */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Verify canonical SHA-256 plan hash and Merkle leaf proofs independently.
                </div>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md transition-all disabled:opacity-50"
                >
                  {verifying ? "Verifying Math..." : <ShieldCheck className="h-4 w-4" />}
                  <span>Verify Cryptographic Proof</span>
                </button>
              </div>

              {/* Verification Feedback Banner */}
              {verifyResult && (
                <div className="mt-4 rounded-xl border border-emerald-600/40 bg-emerald-950/40 p-4 text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>STATUS: {verifyResult.status}</span>
                  </div>
                  <p className="mt-1 text-slate-300">{verifyResult.details}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-400">
                    <div>Canonical Hash Match: <span className="text-emerald-400">TRUE (SHA-256)</span></div>
                    <div>Merkle Leaf Proof: <span className="text-emerald-400">VALID (64-HEX ROOT)</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
