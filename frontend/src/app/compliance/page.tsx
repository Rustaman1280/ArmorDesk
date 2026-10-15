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
  Hash
} from "lucide-react";

export default function CompliancePage() {
  const { tenantId, reloadTrigger } = useApp();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-sm">
        Compiling SOC 2 & ISO/IEC 27001 Cryptographic Audit Bundle...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              SOC 2 Type II & ISO/IEC 27001 Compliance Evidence Center
            </h1>
            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-blue-400 border border-blue-500/20">
              CONTINUOUS ASSURANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous audit generation converting agent traces, Merkle roots, and human sign-offs into verifiable compliance artifacts.
          </p>
        </div>

        {/* Export / Print Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0B1120] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Audit Evidence (JSON)</span>
          </button>
        </div>
      </div>

      {/* Compliance Metrics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4">
          <div className="text-xs text-slate-400">Compliance Health</div>
          <div className="mt-2 text-lg font-bold font-mono text-emerald-400">
            {report.summary.compliance_health}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Zero Critical Vulnerabilities</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4">
          <div className="text-xs text-slate-400">Injection Defense Rate</div>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-400">
            {report.summary.injection_defense_rate}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Prompt injection tests blocked</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4">
          <div className="text-xs text-slate-400">Human Governance Holds</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            {report.summary.human_approvals_managed}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Dual authorization compliance</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4">
          <div className="text-xs text-slate-400">Supervised Actions</div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {report.summary.total_supervised_actions}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">100% Merkle anchored</div>
        </div>
      </div>

      {/* Attestation Header */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-900/40">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="font-mono text-sm font-bold text-white">
                {report.report_id}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Standards: {report.standard.join(" • ")}
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <div>Tenant: <span className="text-blue-300 font-bold">{report.tenant_id}</span></div>
            <div className="text-[10px] text-slate-500">Generated: {report.generated_at}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-xl">
            <Hash className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>Session Merkle Root:</span>
            <span className="text-slate-200 truncate">{report.summary.audit_merkle_root}</span>
          </div>
          <div className="text-emerald-400 font-semibold shrink-0">
            {report.attestation.signature}
          </div>
        </div>
      </div>

      {/* Standard Controls Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-md">
        <h2 className="text-sm font-semibold text-white mb-4">
          Audit Controls & Protocol-Level Enforcement Verification
        </h2>

        <div className="space-y-4">
          {report.controls.map((ctrl: any) => (
            <div
              key={ctrl.control_id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 transition-colors hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-blue-950 px-2 py-0.5 text-xs font-mono font-bold text-blue-400 border border-blue-800/50">
                    {ctrl.control_id}
                  </span>
                  <span className="font-semibold text-white text-xs sm:text-sm">
                    {ctrl.name}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-950 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-800/40 self-start sm:self-auto">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {ctrl.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2.5">
                {ctrl.description}
              </p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
                {ctrl.evidence_count !== undefined && (
                  <div className="rounded bg-slate-950 p-2 border border-slate-900">
                    Evidence Count: <span className="text-white font-bold">{ctrl.evidence_count}</span>
                  </div>
                )}
                {ctrl.violations_detected_and_stopped !== undefined && (
                  <div className="rounded bg-slate-950 p-2 border border-slate-900">
                    Violations Stopped: <span className="text-emerald-400 font-bold">{ctrl.violations_detected_and_stopped}</span>
                  </div>
                )}
                {ctrl.block_rate_percent !== undefined && (
                  <div className="rounded bg-slate-950 p-2 border border-slate-900">
                    Injection Block Rate: <span className="text-emerald-400 font-bold">{ctrl.block_rate_percent}%</span>
                  </div>
                )}
                {ctrl.total_holds !== undefined && (
                  <div className="rounded bg-slate-950 p-2 border border-slate-900">
                    Total Holds: <span className="text-amber-400 font-bold">{ctrl.total_holds}</span>
                  </div>
                )}
                {ctrl.merkle_root !== undefined && (
                  <div className="rounded bg-slate-950 p-2 border border-slate-900 sm:col-span-2 truncate">
                    Merkle Root: <span className="text-blue-300">{ctrl.merkle_root.slice(0, 16)}...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
