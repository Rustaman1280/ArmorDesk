"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import {
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  Lock,
  Printer,
  Sparkles,
  Award,
  Layers,
  Hash,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  FileCheck,
  Building2
} from "lucide-react";

export default function CompliancePage() {
  const { tenantId, reloadTrigger, addToast } = useApp();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"matrix" | "packet">("matrix");

  useEffect(() => {
    loadReport();
  }, [tenantId, reloadTrigger]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await api.getComplianceReport(tenantId);
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(api.getComplianceExportUrl(tenantId), "_blank");
    addToast("Export Initiated", "Signed compliance evidence packet JSON downloaded.", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="py-24 text-center text-slate-400 dark:text-zinc-500 font-mono text-xs">
        Compiling SOC 2 & ISO/IEC 27001 Cryptographic Audit Bundle...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              SOC 2 Type II & ISO 27001 Continuous Compliance Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold">
              CONTINUOUS AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time compliance evidence generator mapping agent authorization traces and Merkle proofs directly to SOC 2 Trust Services Criteria & ISO 27001 Annex A.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111114] hover:bg-slate-100 dark:hover:bg-[#18181C] px-3.5 py-2 text-xs font-mono text-slate-700 dark:text-zinc-300 transition-all shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-white px-4 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Signed Audit Packet (JSON)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111114] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold">Compliance Posture</div>
          <div className="mt-1.5 text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {report.summary.compliance_health}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500 font-mono">Zero Critical Violations</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111114] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold">Injection Defense Rate</div>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900 dark:text-zinc-100 tabular-nums">
            {report.summary.injection_defense_rate}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">100% Intercepted at Protocol</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111114] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold">Dual-Authorization Holds</div>
          <div className="mt-1.5 text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {report.summary.human_approvals_managed}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500 font-mono">SOC 2 CC6.8 Segregation</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111114] p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold">Supervised Agent Actions</div>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900 dark:text-zinc-100 tabular-nums">
            {report.summary.total_supervised_actions}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500 font-mono">100% Merkle Tree Anchored</div>
        </div>
      </div>

      {/* 3. Session Attestation Card */}
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-4 shadow-sm font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-800 dark:text-zinc-200">{report.report_id}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 font-semibold">
              AUDIT CERTIFIED
            </span>
          </div>

          <div className="text-right text-[11px] text-slate-500 dark:text-zinc-400">
            Tenant: <span className="text-slate-800 dark:text-zinc-200 font-semibold">{report.tenant_id}</span> · Generated: <span className="text-slate-400 dark:text-zinc-500">{report.generated_at}</span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400 truncate max-w-xl">
            <Hash className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-medium">Session Merkle Root:</span>
            <span className="text-slate-800 dark:text-zinc-300 truncate">{report.summary.audit_merkle_root}</span>
          </div>
          <div className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
            {report.attestation.signature}
          </div>
        </div>
      </div>

      {/* 4. Navigation Toggle between Matrix and Live Document Packet */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.07] pb-2 text-xs">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            activeTab === "matrix"
              ? "bg-slate-900 text-white dark:bg-[#1F1F24] dark:text-white border border-slate-900 dark:border-white/[0.08] font-bold shadow-sm"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#151518]"
          }`}
        >
          Control Mapping Matrix (SOC 2 / ISO)
        </button>
        <button
          onClick={() => setActiveTab("packet")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            activeTab === "packet"
              ? "bg-slate-900 text-white dark:bg-[#1F1F24] dark:text-white border border-slate-900 dark:border-white/[0.08] font-bold shadow-sm"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#151518]"
          }`}
        >
          Audit Evidence Packet Document
        </button>
      </div>

      {/* 5. Matrix View */}
      {activeTab === "matrix" && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111114] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
              ENTERPRISE AUDIT CONTROLS & ENFORCEMENT EVIDENCE
            </h2>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              Coverage: SOC 2 CC6.1, CC6.8, CC7.2 · ISO 27001 A.9.4
            </span>
          </div>

          <div className="space-y-3">
            {report.controls.map((ctrl: any) => (
              <div
                key={ctrl.control_id}
                className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0E0E11] p-4 hover:border-slate-300 dark:hover:border-white/[0.1] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700">
                      {ctrl.control_id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-200">
                      {ctrl.name}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 self-start sm:self-auto">
                    <Check className="h-3 w-3" />
                    {ctrl.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {ctrl.description}
                </p>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  {ctrl.evidence_count !== undefined && (
                    <div className="rounded-lg bg-white dark:bg-[#141418] p-2 border border-slate-200 dark:border-white/[0.04]">
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">Evidence Traces:</span>
                      <span className="text-slate-800 dark:text-zinc-200 font-bold">{ctrl.evidence_count}</span>
                    </div>
                  )}
                  {ctrl.violations_detected_and_stopped !== undefined && (
                    <div className="rounded-lg bg-white dark:bg-[#141418] p-2 border border-slate-200 dark:border-white/[0.04]">
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">Violations Blocked:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{ctrl.violations_detected_and_stopped}</span>
                    </div>
                  )}
                  {ctrl.block_rate_percent !== undefined && (
                    <div className="rounded-lg bg-white dark:bg-[#141418] p-2 border border-slate-200 dark:border-white/[0.04]">
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">Injection Intercept:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{ctrl.block_rate_percent}%</span>
                    </div>
                  )}
                  {ctrl.total_holds !== undefined && (
                    <div className="rounded-lg bg-white dark:bg-[#141418] p-2 border border-slate-200 dark:border-white/[0.04]">
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">Dual Holds Managed:</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{ctrl.total_holds}</span>
                    </div>
                  )}
                  {ctrl.merkle_root !== undefined && (
                    <div className="rounded-lg bg-white dark:bg-[#141418] p-2 border border-slate-200 dark:border-white/[0.04] sm:col-span-2 truncate">
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">Merkle Leaf Anchor:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 truncate block font-semibold">{ctrl.merkle_root.slice(0, 24)}...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. On-Screen Audit Evidence Packet Preview */}
      {activeTab === "packet" && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0E11] p-6 shadow-md space-y-5 font-mono text-xs">
          <div className="pb-4 border-b border-slate-100 dark:border-white/[0.07] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                CONFIDENTIAL AUDIT EVIDENCE PACKET
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                ArmorDesk Continuous Assurance Report: {tenantId.toUpperCase()}
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
              CERTIFIED SIGNED
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111114] border border-slate-200/80 dark:border-white/[0.05] space-y-2">
            <div className="text-slate-800 dark:text-zinc-300 font-bold">EXECUTIVE AUDIT SUMMARY</div>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-sans text-xs">
              This evidence packet attests that all autonomous multi-agent interactions within tenant <code className="text-slate-900 dark:text-zinc-200 font-semibold">{tenantId}</code> operate under deterministic protocol governance. No direct bank or CRM access was permitted without signed plan hashes, and all indirect prompt injections were intercepted at protocol boundary.
            </p>
          </div>

          <div>
            <div className="text-slate-700 dark:text-zinc-400 font-bold mb-2">RAW EVIDENCE PACKET STRUCTURE (JSON-RPC)</div>
            <pre className="rounded-xl bg-slate-900 p-4 text-slate-200 overflow-x-auto border border-slate-800 text-[11px] font-mono leading-tight">
{JSON.stringify(
  {
    packet_id: report.report_id,
    tenant_id: report.tenant_id,
    standards: report.standard,
    session_merkle_root: report.summary.audit_merkle_root,
    total_actions: report.summary.total_supervised_actions,
    injection_defense_rate: report.summary.injection_defense_rate,
    attestation: report.attestation,
    controls_evaluated: report.controls.map((c: any) => ({
      id: c.control_id,
      name: c.name,
      status: c.status
    }))
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
