"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, AVAILABLE_USERS } from "@/context/AppContext";
import {
  Shield,
  Layers,
  Swords,
  Inbox,
  FileCheck2,
  FileText,
  Lightbulb,
  Building2,
  UserCheck,
  Zap,
  Sparkles
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    tenantId,
    setTenantId,
    currentUser,
    setCurrentUser,
    tenants,
    setProModalOpen,
    proActive
  } = useApp();

  const navLinks = [
    { href: "/", label: "Overview", icon: Layers },
    { href: "/gauntlet", label: "Gauntlet & CTF", icon: Swords },
    { href: "/inbox", label: "Approval Inbox", icon: Inbox },
    { href: "/receipts", label: "Agent Receipts", icon: FileCheck2 },
    { href: "/compliance", label: "SOC 2 / ISO", icon: FileText },
    { href: "/takeaways", label: "Vision & Takeaways", icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070B14]/90 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-mono">ARMOR<span className="text-blue-400">DESK</span></span>
                <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">CONTROL PLANE</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">Enterprise AI Agent Governance & Trust Center</p>
            </div>
          </Link>
        </div>

        {/* Global Selectors */}
        <div className="flex items-center gap-2.5">
          {/* Tenant Switcher */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-400 mr-2" />
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                  {t.name}
                </option>
              ))}
              {tenants.length === 0 && (
                <option value="acme-corp" className="bg-slate-900 text-slate-200">
                  Acme Corp (Tenant A)
                </option>
              )}
            </select>
          </div>

          {/* User Role Switcher (`for_user`) */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-blue-400 mr-2" />
            <span className="text-[11px] text-slate-400 mr-1.5">for_user:</span>
            <select
              value={currentUser.name}
              onChange={(e) => {
                const found = AVAILABLE_USERS.find((u) => u.name === e.target.value);
                if (found) setCurrentUser(found);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {AVAILABLE_USERS.map((u) => (
                <option key={u.name} value={u.name} className="bg-slate-900 text-slate-200">
                  {u.name} ({u.role === "manager" ? "CFO" : "Intern"})
                </option>
              ))}
            </select>
            <span
              className={`ml-2 rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                currentUser.role === "manager"
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                  : "bg-amber-950 text-amber-400 border border-amber-800/40"
              }`}
            >
              {currentUser.role.toUpperCase()}
            </span>
          </div>

          {/* Pro Status Badge & Modal Trigger */}
          <button
            onClick={() => setProModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>ArmorTools Pro</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* Nav Link Bar */}
      <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-slate-800/90 text-white shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
