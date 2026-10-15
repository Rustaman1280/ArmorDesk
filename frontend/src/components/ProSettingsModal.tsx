"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { ShieldCheck, X, CheckCircle, Key, Send, RefreshCw } from "lucide-react";

export function ProSettingsModal() {
  const { proModalOpen, setProModalOpen, triggerReload } = useApp();
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
      setStatusMsg("Configuration saved successfully!");
      setApiKey("");
      setWebhookUrl("");
      await loadConfig();
      triggerReload();
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSandbox = async () => {
    if (!confirm("Are you sure you want to reset the sandbox database to clean seed state?")) return;
    try {
      await api.resetSandbox();
      triggerReload();
      alert("Sandbox database reset to initial seed state!");
      setProModalOpen(false);
    } catch (e: any) {
      alert(`Reset failed: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl text-slate-100">
        <button
          onClick={() => setProModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">ArmorTools Pro Settings & Sandbox</h2>
            <p className="text-xs text-slate-400">Configure Live API credentials or use deterministic local emulation</p>
          </div>
        </div>

        {/* Current status pill */}
        <div className="mb-5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">Current Mode: </span>
            <span className="font-mono font-medium text-emerald-400">
              {currentConfig?.mode || "PRO_SIMULATION_SANDBOX"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Cryptographic Fallback Active</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-blue-400" /> ArmorIQ Pro API Key
            </label>
            <input
              type="password"
              placeholder={currentConfig?.armoriq_pro_api_key_masked || "Enter ARMORIQ_PRO_API_KEY..."}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Leave blank to keep fallback SHA-256 Merkle attestation & plan signing active.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5 text-emerald-400" /> Slack Alert Webhook URL
            </label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Incoming webhooks will receive real-time approval requests and prompt injection security alerts.
            </p>
          </div>

          {statusMsg && (
            <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/50 p-2.5 text-xs text-emerald-300">
              {statusMsg}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetSandbox}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40"
            >
              <RefreshCw className="h-3 w-3" /> Reset Demo State
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProModalOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
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
