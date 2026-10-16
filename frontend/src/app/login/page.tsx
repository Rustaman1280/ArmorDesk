"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Building,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoSeeded, loginAsDemoClean, addToast } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);

  const getDestination = () => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const redir = sp.get("redirect");
      if (redir && redir.startsWith("/")) return redir;
    }
    return "/overview";
  };

  const handleLaunchSeeded = () => {
    loginAsDemoSeeded();
    window.location.href = getDestination();
  };

  const handleLaunchClean = () => {
    loginAsDemoClean();
    window.location.href = getDestination();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        window.location.href = getDestination();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-[#F8FAFC] dark:bg-[#08090B] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-zinc-800 border border-slate-700 dark:border-white/[0.15] flex items-center justify-center text-white shadow-md">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="font-bold text-xl tracking-tight font-sans">
            Armor<span className="text-slate-500 dark:text-zinc-400">Desk</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign In to Agent Control Plane
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
          Authenticate your enterprise identity to inspect MCP agent telemetry, audit ledger, and dual-control escrow.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* SECTION 1: 1-CLICK INSTANT DEMO ACCOUNTS */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
              1-CLICK EVALUATION SHORTCUTS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/25">
              PRE-AUTHENTICATED
            </span>
          </div>

          {/* Account A: Seeded Data */}
          <button
            type="button"
            onClick={handleLaunchSeeded}
            className="w-full p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/[0.06] dark:hover:bg-emerald-500/[0.12] transition-all text-left group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Zap className="h-3 w-3 fill-current" />
                <span>SEEDED PRODUCTION DATA</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Launch <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              Acme Corp (Sarah Chen · CFO)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-sans leading-tight">
              Pre-loaded with active $8,000 AWS invoice hold, audit traces, dual-control inbox, and receipts.
            </div>
          </button>

          {/* Account B: Clean Slate */}
          <button
            type="button"
            onClick={handleLaunchClean}
            className="w-full p-3.5 rounded-xl border border-blue-500/25 bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-500/[0.06] dark:hover:bg-blue-500/[0.12] transition-all text-left group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>CLEAN SLATE BUFFER</span>
              </span>
              <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Launch <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              Globex Inc (Marcus Vance · VP Risk)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-sans leading-tight">
              Pristine workspace with zero pending holds and an empty audit buffer ready for fresh agent testing.
            </div>
          </button>
        </div>

        {/* SECTION 2: STANDARD CREDENTIALS FORM */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] p-6 shadow-sm space-y-4">
          <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase pb-1 border-b border-slate-100 dark:border-white/[0.06]">
            OR SIGN IN WITH WORK EMAIL
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
                WORK EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.chen@acme.com"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 font-semibold">
                  PASSWORD
                </label>
                <span className="text-[10px] font-mono text-slate-400">Default: demo123</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
              <span>Sign In to Dashboard</span>
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2 text-xs">
          <p className="text-slate-500 dark:text-zinc-400">
            Need an isolated sandbox for your team?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Register Custom Tenant</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>

          <div>
            <Link
              href="/"
              className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 font-mono"
            >
              ← Back to Product Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
