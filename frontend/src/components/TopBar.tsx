"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useApp, AVAILABLE_USERS, UserProfile } from "@/context/AppContext";
import {
  Building2,
  UserCheck,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Shield,
  Sparkles,
  Check,
  Sun,
  Moon,
  ChevronDown,
  Lock
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
    theme,
    toggleTheme,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    switch (pathname) {
      case "/":
      case "/overview":
        return "Control Plane & Overview";
      case "/gauntlet":
        return "Prompt-Injection Gauntlet & CTF";
      case "/inbox":
        return "Human-in-the-Loop Approval Inbox";
      case "/receipts":
        return "Verifiable Receipts & Merkle Trees";
      case "/compliance":
        return "SOC 2 & ISO Evidence Center";
      case "/takeaways":
        return "Executive Takeaways & Vision";
      default:
        return "Control Plane";
    }
  };

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-slate-200 dark:border-white/[0.07] bg-white/90 dark:bg-[#09090B]/85 backdrop-blur-md flex items-center justify-between px-6 transition-colors duration-200">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-zinc-500 font-mono">core</span>
          <ChevronRight className="h-3 w-3 text-slate-300 dark:text-zinc-600" />
          <span className="font-semibold text-slate-800 dark:text-zinc-200">{getBreadcrumb()}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Policy: DETERMINISTIC</span>
        </div>
      </div>

      {/* Right: Controls & Context Switchers */}
      <div className="flex items-center gap-2.5">
        {/* Tenant Switcher */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111114] text-xs shadow-sm">
          <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="bg-transparent font-medium text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-white dark:bg-[#111114] text-slate-800 dark:text-zinc-200">
                {t.name.split(" ")[0]} (${(t.balance / 1000).toFixed(0)}k)
              </option>
            ))}
          </select>
        </div>

        {/* Elegant Role Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111114] hover:bg-slate-100 dark:hover:bg-[#18181C] text-xs transition-colors shadow-sm"
          >
            <div
              className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                currentUser.role === "manager"
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
              }`}
            >
              {currentUser.avatar}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-slate-800 dark:text-zinc-200">{currentUser.name.split(" ")[0]}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                ({currentUser.role === "manager" ? "CFO" : "Intern"})
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 dark:text-zinc-500 ml-0.5" />
          </button>

          {/* Dropdown Menu */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#141519] shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-white/[0.06] mb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase block">
                  Simulate User Role
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Test how for_user scoping restricts agent tool execution
                </span>
              </div>

              {AVAILABLE_USERS.map((user) => {
                const isSelected = currentUser.name === user.name;
                return (
                  <button
                    key={user.name}
                    onClick={() => {
                      switchUser(user);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-md flex items-start gap-2.5 transition-colors ${
                      isSelected
                        ? "bg-slate-100 dark:bg-zinc-800/70 text-slate-900 dark:text-white"
                        : "hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-600 dark:text-zinc-300"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 ${
                        user.role === "manager"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{user.name}</span>
                        <span className={`text-[9px] font-mono font-bold px-1 rounded ${
                          user.role === "manager"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {user.role === "manager" ? "CFO" : "Intern"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-tight">
                        {user.scopeSummary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-1.5 rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111114] hover:bg-slate-100 dark:hover:bg-[#18181C] text-slate-600 dark:text-zinc-300 transition-colors shadow-sm"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </button>

        {/* ArmorIQ Live Status Button */}
        <button
          onClick={() => setProModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-medium transition-all shadow-sm"
          title="Click to inspect ArmorIQ credential & attestation telemetry"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline font-mono text-[11px] font-semibold">ArmorIQ Live</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
