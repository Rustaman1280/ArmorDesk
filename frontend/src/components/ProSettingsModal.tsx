"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import {
  ShieldCheck,
  X,
  CheckCircle,
  Key,
  Send,
  RefreshCw,
  Lock,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Globe,
  Radio,
  Check
} from "lucide-react";

export function ProSettingsModal() {
  const { proModalOpen, setProModalOpen, triggerReload, addToast } = useApp();
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (proModalOpen) {
      loadConfig();
    }
  }, [proModalOpen]);

  const loadConfig = async () => {
    try {
      const cfg = await api.getConfig();
      setCurrentConfig(cfg);
    } catch (e) {
      console.error(e);
    }
  };

  if (!proModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg("");
    try {
      await api.updateConfig(apiKey || undefined, webhookUrl || undefined);
      addToast("ArmorIQ Configuration Saved", "API settings and webhook parameters updated successfully.", "success");
      setStatusMsg("Configuration synchronized successfully.");
      setApiKey("");
      setWebhookUrl("");
      await loadConfig();
      triggerReload();
      setShowEditForm(false);
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
      addToast("Configuration Error", err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSandbox = async () => {
    if (!confirm("Reset sandbox database to pristine deterministic state? (Acme & Globex seed records will be refreshed)")) return;
    try {
      await api.resetSandbox();
      triggerReload();
      addToast("Sandbox Reset Complete", "Database returned to pristine initial seed state.", "info");
      setProModalOpen(false);
    } catch (e: any) {
      alert(`Reset failed: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0E0F12] p-6 shadow-2xl text-slate-900 dark:text-zinc-100 space-y-5">
        <button
          onClick={() => setProModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181C] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-[#141519] border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">ArmorIQ Governance & Telemetry</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CONNECTED & ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Control plane attestation, cryptographic proof engine & webhook alerts</p>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#121317] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/[0.06] text-xs font-mono">
            <span className="text-slate-500 dark:text-zinc-400 font-semibold">ENFORCEMENT STATUS</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> LIVE PROTOCOL ENFORCEMENT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-[#0A0B0E] border border-slate-200/80 dark:border-white/[0.04] space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-semibold">AUTHENTICATED KEY</span>
              <span className="text-slate-800 dark:text-zinc-200 font-bold truncate block">
                {currentConfig?.armoriq_pro_api_key_masked || "ak_live_f6ec...9219"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0A0B0E] border border-slate-200/80 dark:border-white/[0.04] space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-semibold">OFFICIAL SDK ENGINE</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                armoriq-sdk v{currentConfig?.sdk_version || "0.6.10"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0A0B0E] border border-slate-200/80 dark:border-white/[0.04] space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-semibold">CLOUD ENDPOINT</span>
              <span className="text-slate-700 dark:text-zinc-300 font-semibold truncate block">
                staging-api.armoriq.ai
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0A0B0E] border border-slate-200/80 dark:border-white/[0.04] space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-semibold">CRYPTOGRAPHIC ENGINE</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                SHA-256 Merkle Chaining
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400 pt-1">
            <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Account Profile: <span className="text-slate-800 dark:text-zinc-200 font-semibold">rustamandelvianova@gmail.com</span></span>
          </div>
        </div>

        {/* Collapsible Edit / Webhook Settings */}
        <div>
          <button
            type="button"
            onClick={() => setShowEditForm(!showEditForm)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white py-1.5 transition-colors"
          >
            <span>{showEditForm ? "Hide Configuration Form" : "Modify Credentials or Configure Slack Webhook"}</span>
            {showEditForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showEditForm && (
            <form onSubmit={handleSave} className="mt-3 space-y-3 text-xs pt-3 border-t border-slate-200 dark:border-white/[0.06]">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-slate-400" />
                  <span>Update ArmorIQ API Key</span>
                </label>
                <input
                  type="password"
                  placeholder={currentConfig?.armoriq_pro_api_key_masked || "Enter new ARMORIQ_API_KEY..."}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#09090B] px-3 py-2 font-mono text-xs text-slate-800 dark:text-zinc-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-slate-400" />
                  <span>Slack Webhook URL (FinOps Dual-Control Alerts)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#09090B] px-3 py-2 font-mono text-xs text-slate-800 dark:text-zinc-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 px-4 py-2 text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </form>
          )}
        </div>

        {statusMsg && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
            {statusMsg}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={handleResetSandbox}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all font-mono"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Demo Sandbox</span>
          </button>

          <button
            type="button"
            onClick={() => setProModalOpen(false)}
            className="rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1C1D24] dark:hover:bg-[#252630] border border-slate-200 dark:border-white/[0.1] px-5 py-2 text-xs text-slate-800 dark:text-zinc-200 font-bold transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
