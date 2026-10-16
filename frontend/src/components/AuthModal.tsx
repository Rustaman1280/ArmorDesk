"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  Shield,
  Zap,
  Sparkles,
  Building,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  RefreshCw
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { tenantId, setTenantId, switchUser, addToast, refreshTenants, triggerReload } = useApp();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("100000");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // 1-Click Shortcut: Seeded Demo (Acme Corp)
  const handleLaunchSeededDemo = () => {
    setTenantId("acme-corp");
    switchUser({
      name: "Sarah Chen",
      role: "manager",
      title: "CFO · FinOps Lead",
      avatar: "SC",
      scopeSummary: "Full Treasury & Wire Transfer Approval Authority"
    });
    addToast(
      "Switched to Seeded Demo (Acme Corp)",
      "Loaded active escrow holds ($8k AWS invoice), receipts, and multi-agent audit traces.",
      "success"
    );
    triggerReload();
    onClose();
  };

  // 1-Click Shortcut: Clean Slate Demo (Globex Inc)
  const handleLaunchCleanDemo = () => {
    setTenantId("globex-inc");
    switchUser({
      name: "Marcus Vance",
      role: "manager",
      title: "VP Treasury & Risk",
      avatar: "MV",
      scopeSummary: "Clean Slate Treasury · Full Policy Signing Authority"
    });
    addToast(
      "Switched to Clean Slate (Globex Inc)",
      "Loaded pristine tenant with 0 pending approvals and a clean audit buffer.",
      "info"
    );
    triggerReload();
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenant_id: tenantId })
      });
      const data = await res.json();
      if (data.user) {
        switchUser(data.user);
        if (data.tenant?.id) {
          setTenantId(data.tenant.id);
        }
        addToast("Logged In Successfully", `Welcome, ${data.user.name} (${data.tenant?.name || "Corporate"}).`, "success");
        triggerReload();
        onClose();
      }
    } catch (e: any) {
      addToast("Login Error", e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          company_name: companyName,
          password,
          initial_deposit: parseFloat(initialDeposit) || 100000.0
        })
      });
      const data = await res.json();
      if (data.user && data.tenant) {
        await refreshTenants();
        setTenantId(data.tenant.id);
        switchUser(data.user);
        addToast(
          "Tenant Registered Successfully",
          `Created new isolated tenant '${data.tenant.name}' with $${parseFloat(initialDeposit).toLocaleString()} treasury buffer.`,
          "success"
        );
        triggerReload();
        onClose();
      }
    } catch (e: any) {
      addToast("Registration Error", e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#111216] shadow-2xl overflow-hidden text-slate-900 dark:text-zinc-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#14151a]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">ArmorDesk Tenant Authentication</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Switch demo profiles or authenticate custom corporate workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. TWO BIG QUICK SHORTCUT CARDS */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase block">
              1-CLICK INSTANT DEMO PROFILES
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Profile A: Seeded Demo */}
              <button
                type="button"
                onClick={handleLaunchSeededDemo}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  tenantId === "acme-corp"
                    ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                    : "bg-slate-50 dark:bg-[#16171d] border-slate-200 dark:border-white/[0.06] hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Zap className="h-3 w-3 fill-current" />
                    <span>SEEDED DATA</span>
                  </span>
                  {tenantId === "acme-corp" && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Acme Corp</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
                  Sarah Chen (CFO) · Has $8k pending AWS escrow, traces, and receipts.
                </div>
                <div className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Launch Seeded Demo</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>

              {/* Profile B: Clean Slate */}
              <button
                type="button"
                onClick={handleLaunchCleanDemo}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  tenantId === "globex-inc"
                    ? "bg-blue-500/10 border-blue-500/40 shadow-sm"
                    : "bg-slate-50 dark:bg-[#16171d] border-slate-200 dark:border-white/[0.06] hover:border-blue-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>CLEAN SLATE</span>
                  </span>
                  {tenantId === "globex-inc" && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Globex Inc</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
                  Marcus Vance (VP) · Fresh zero-log buffer, 0 held tickets, ready to connect.
                </div>
                <div className="mt-2 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <span>Launch Clean Slate</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            </div>
          </div>

          {/* 2. FORM TABS: Login vs Register */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`pb-1 border-b-2 font-bold transition-all ${
                  authMode === "login"
                    ? "border-emerald-500 text-slate-900 dark:text-white"
                    : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300"
                }`}
              >
                Standard Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`pb-1 border-b-2 font-bold transition-all ${
                  authMode === "register"
                    ? "border-emerald-500 text-slate-900 dark:text-white"
                    : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300"
                }`}
              >
                Register Custom Tenant
              </button>
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                    WORK EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.chen@acme.com"
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  <span>Sign In</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Foster"
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                      COMPANY / TENANT NAME
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Stark Labs"
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                    WORK EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@starklabs.com"
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                      INITIAL VAULT (USD)
                    </label>
                    <input
                      type="number"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Building className="h-3.5 w-3.5" />}
                  <span>Register & Initialize Tenant</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
