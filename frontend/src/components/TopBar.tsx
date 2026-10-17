"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp, AVAILABLE_USERS, UserProfile } from "@/context/AppContext";
import {
  Building2,
  UserCheck,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Shield,
  Check,
  Sun,
  Moon,
  ChevronDown,
  Lock,
  LogOut,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { VoiceController } from "@/components/VoiceController";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    tenantId,
    currentUser,
    switchUser,
    tenants,
    currentTenant,
    loginAsDemoSeeded,
    setProModalOpen,
    theme,
    toggleTheme,
    logout
  } = useApp();

  const isDemoWorkspace = tenantId === "acme-corp" || tenantId === "globex-inc";

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

        {/* Workspace Mode Indicator */}
        {(tenantId === "acme-corp" || tenantId === "globex-inc") ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>DEMO SIMULATION</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE WORKSPACE</span>
          </div>
        )}
      </div>

      {/* Right: Controls & Context Switchers */}
      <div className="flex items-center gap-2">
        {/* ElevenLabs Voice AI Telemetry Controller */}
        <VoiceController />

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
                ({currentUser.role === "manager" ? (isDemoWorkspace ? "CFO" : "Manager") : "Intern"})
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 dark:text-zinc-500 ml-0.5" />
          </button>

          {/* Dropdown Menu */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#141519] shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 space-y-2">
              {isDemoWorkspace ? (
                <>
                  <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase block">
                      Demo Persona Switcher
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Simulate how role policies restrict agent execution in Acme Corp
                    </span>
                  </div>

                  <div className="space-y-1">
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
                </>
              ) : (
                <>
                  {/* Real Organization User Profile Card */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#181920] border border-slate-200 dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {currentUser.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono truncate">
                          {currentUser.email || "Corporate User"}
                        </div>
                      </div>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-200 dark:border-white/[0.04]">
                      <span className="text-slate-500 dark:text-zinc-400">Workspace:</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200 truncate">{currentTenant?.name || tenantId}</span>
                    </div>
                  </div>

                  {/* Policy Testing Toggle */}
                  <div className="p-2 rounded-lg bg-white dark:bg-[#121316] border border-slate-100 dark:border-white/[0.04] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500 font-semibold uppercase">
                      <span>Policy Testing Mode</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentUser.role.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      <button
                        onClick={() => {
                          switchUser({
                            ...currentUser,
                            role: "manager",
                            scopeSummary: "Full Treasury & Wire Transfer Approval Authority"
                          });
                          setRoleDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded text-center transition-all ${
                          currentUser.role === "manager"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                        }`}
                      >
                        Manager (Full)
                      </button>
                      <button
                        onClick={() => {
                          switchUser({
                            ...currentUser,
                            role: "intern",
                            scopeSummary: "Restricted View-Only Scope · Financial Actions Blocked"
                          });
                          setRoleDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded text-center transition-all ${
                          currentUser.role === "intern"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                        }`}
                      >
                        Intern (Restricted)
                      </button>
                    </div>
                  </div>

                  {/* Switch to Sandbox Link */}
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      loginAsDemoSeeded();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#181920] flex items-center justify-between text-slate-600 dark:text-zinc-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs">Explore Acme Demo Sandbox</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </button>
                </>
              )}

              {/* Account / Sign Out Menu Footer */}
              <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    logout();
                    window.location.href = "/login?switch=true";
                  }}
                  className="px-2 py-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Switch Account...
                </button>
                <button
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    logout();
                    window.location.href = "/login";
                  }}
                  className="px-2 py-1 text-[11px] font-mono font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Sign Out</span>
                </button>
              </div>
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

        {/* Dedicated Sign Out Button */}
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="p-1.5 rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111114] hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors shadow-sm"
          title="Sign Out of Corporate Session"
        >
          <LogOut className="h-4 w-4" />
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
