"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { ShieldCheck, X, CheckCircle, Key, Send, RefreshCw, Lock, Terminal } from "lucide-react";

export function ProSettingsModal() {
  const { proModalOpen, setProModalOpen, triggerReload, addToast } = useApp();
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<any>(null);

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
      addToast("ArmorTools Pro Config Saved", "API settings and webhook parameters updated successfully.", "success");
      setStatusMsg("Configuration synchronized successfully.");
      setApiKey("");
      setWebhookUrl("");
      await loadConfig();
      triggerReload();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-lg border border-white/[0.08] bg-[#111114] p-6 shadow-2xl text-zinc-100">
        <button
          onClick={() => setProModalOpen(false)}
          className="absolute right-4 top-4 rounded p-1 text-zinc-400 hover:text-white hover:bg-[#18181C] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-md bg-[#18181C] border border-white/[0.08] flex items-center justify-center text-emerald-400 shadow-hairline">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-tight">ArmorTools Pro Configuration</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Control plane attestation & live multi-channel webhook telemetry</p>
          </div>
        </div>

        {/* Current status banner */}
        <div className="mb-5 rounded-md border border-white/[0.07] bg-[#0E0E11] p-3 text-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-400">Attestation Mode:</div>
            <div className="font-mono text-xs font-semibold text-emerald-400 mt-0.5">
              {currentConfig?.mode || "PRO_SIMULATION_SANDBOX"}
            </div>
            {currentConfig?.sdk_version && (
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                Official SDK: <span className="text-emerald-400 font-medium">v{currentConfig.sdk_version}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] px-2 py-1 rounded bg-[#18181C] border border-white/[0.06]">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>SHA-256 Merkle Fallback Ready</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-zinc-400" />
              <span>ArmorIQ Pro Production API Key</span>
            </label>
            <input
              type="password"
              placeholder={currentConfig?.armoriq_pro_api_key_masked || "Enter ARMORIQ_PRO_API_KEY..."}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-md border border-white/[0.08] bg-[#09090B] px-3 py-2 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              When empty, ArmorDesk uses client-side SHA-256 canonical JSON plan hashing & Merkle leaf proofs.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5 text-zinc-400" />
              <span>Slack Webhook URL (FinOps Multi-Channel Alerts)</span>
            </label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded-md border border-white/[0.08] bg-[#09090B] px-3 py-2 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Sends instant Block Kit approval cards to `#finops-approvals` upon `await_approval()` triggers.
            </p>
          </div>

          {statusMsg && (
            <div className="rounded-md bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-emerald-300 font-mono">
              {statusMsg}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={handleResetSandbox}
              className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Sandbox</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProModalOpen(false)}
                className="rounded-md border border-white/[0.08] bg-[#18181C] px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-[#202026] transition-all"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-1.5 text-xs font-semibold shadow-hairline transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
