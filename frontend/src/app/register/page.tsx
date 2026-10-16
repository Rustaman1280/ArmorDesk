"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Shield,
  Building,
  User,
  Mail,
  Lock,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Zap,
  ChevronRight
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginAsDemoSeeded, loginAsDemoClean } = useApp();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [initialDeposit, setInitialDeposit] = useState("100000");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !name) return;
    setIsLoading(true);
    try {
      const ok = await register(
        email,
        name,
        companyName,
        password,
        parseFloat(initialDeposit) || 100000.0
      );
      if (ok) {
        router.push("/overview");
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
          Create New Enterprise Tenant
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
          Deploy an isolated, cryptographic control plane for your autonomous AI agents with custom treasury policy and Merkle attestation.
        </p>
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Registration Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] p-6 shadow-sm space-y-4">
          <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase pb-1 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <span>WORKSPACE REGISTRATION</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">SHA-256 SANDBOX</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
                  COMPANY / TENANT NAME
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Cyberdyne AI"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

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
                  placeholder="elena@cyberdyne.io"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
                  TREASURY BUFFER (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#141519] pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
                  PASSWORD
                </label>
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
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141519] border border-slate-200/80 dark:border-white/[0.05] text-[11px] text-slate-600 dark:text-zinc-400 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Default Zero-Trust Protections Applied:
              </div>
              <ul className="list-disc pl-5 space-y-0.5 font-mono text-[10px]">
                <li>Auto-refund threshold capped at $50.00</li>
                <li>Single transaction limit capped at $1,000.00</li>
                <li>Default vendor allowlist: AWS, Stripe, Datadog</li>
                <li>Deterministic MCP tool execution with SHA-256 Plan Hash</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Building className="h-3.5 w-3.5" />
              )}
              <span>Initialize Workspace & Launch Control Plane</span>
            </button>
          </form>
        </div>

        {/* Or jump to demo shortcuts */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] p-4 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-slate-600 dark:text-zinc-400">Just exploring? Try evaluation shortcuts:</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              onClick={() => {
                loginAsDemoSeeded();
                router.push("/overview");
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20"
            >
              Acme (Seeded)
            </button>
            <button
              onClick={() => {
                loginAsDemoClean();
                router.push("/overview");
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20"
            >
              Globex (Clean)
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2 text-xs">
          <p className="text-slate-500 dark:text-zinc-400">
            Already have an enterprise account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Sign In</span>
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
