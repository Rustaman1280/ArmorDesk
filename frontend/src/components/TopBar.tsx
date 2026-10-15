"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useApp, AVAILABLE_USERS } from "@/context/AppContext";
import {
  Building2,
  UserCheck,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Shield,
  Sparkles,
  Check
} from "lucide-react";

export function TopBar() {
  const pathname = usePathname();
  const {
    tenantId,
    setTenantId,
    currentUser,
    switchUser,
    tenants,
    setProModalOpen,
    proActive
  } = useApp();

  // Determine current page name for breadcrumbs
  const getBreadcrumb = () => {
    switch (pathname) {
      case "/":
        return "Overview & Multi-Agent Delegation Graph";
      case "/gauntlet":
        return "Prompt-Injection Gauntlet & Live CTF Arena";
      case "/inbox":
        return "Human-in-the-Loop Approval Inbox";
      case "/receipts":
        return "Verifiable Agent Receipts & Merkle Trees";
      case "/compliance":
        return "SOC 2 Type II & ISO 27001 Evidence Center";
      case "/takeaways":
        return "Executive Takeaways & Commercial Vision";
      default:
        return "Control Plane";
    }
  };

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-white/[0.07] bg-[#09090B]/85 backdrop-blur-md flex items-center justify-between px-6">
      {/* Left: Breadcrumbs & Deterministic Plan Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-500 font-mono">core</span>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="font-medium text-zinc-200">{getBreadcrumb()}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Plan Enforcement: DETERMINISTIC</span>
        </div>
      </div>

      {/* Right: Controls & Context Switchers */}
      <div className="flex items-center gap-2.5">
        {/* Tenant Switcher */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.08] bg-[#111114] text-xs shadow-hairline">
          <Building2 className="h-3.5 w-3.5 text-zinc-400" />
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="bg-transparent text-xs text-zinc-200 font-medium focus:outline-none cursor-pointer pr-1"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#111114] text-zinc-200">
                {t.name}
              </option>
            ))}
            {tenants.length === 0 && (
              <>
                <option value="acme-corp" className="bg-[#111114] text-zinc-200">
                  Acme Corp (Production)
                </option>
                <option value="globex-inc" className="bg-[#111114] text-zinc-200">
                  Globex Inc (Staging)
                </option>
              </>
            )}
          </select>
        </div>

        {/* User Identity Switcher (`for_user` Scope) */}
        <div className="flex items-center gap-1 p-0.5 rounded-md border border-white/[0.08] bg-[#111114] shadow-hairline">
          {AVAILABLE_USERS.map((user) => {
            const isSelected = currentUser.role === user.role;
            return (
              <button
                key={user.role}
                onClick={() => switchUser(user)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                  isSelected
                    ? user.role === "manager"
                      ? "bg-[#18181C] text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "bg-[#18181C] text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#151518]"
                }`}
                title={user.scopeSummary}
              >
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                    isSelected
                      ? user.role === "manager"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {user.avatar}
                </div>
                <span className="font-medium text-[11px]">{user.name.split(" ")[0]}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  ({user.role === "manager" ? "CFO" : "Intern"})
                </span>
              </button>
            );
          })}
        </div>

        {/* ArmorTools Pro Status Button */}
        <button
          onClick={() => setProModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 text-xs font-medium transition-all shadow-hairline"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">ArmorTools Pro</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
