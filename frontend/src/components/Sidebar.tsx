"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Shield,
  Layers,
  Swords,
  Inbox,
  Receipt,
  FileCheck,
  Compass,
  Server,
  Activity,
  Radio,
  Plug
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { pendingApprovalsCount, mcpLatencies } = useApp();

  const navGroups = [
    {
      group: "CONTROL PLANE",
      items: [
        {
          href: "/overview",
          label: "Live Telemetry & Fleet",
          icon: Layers,
          badge: null,
        },
        {
          href: "/connect",
          label: "Connect & MCP Gateway",
          icon: Plug,
          badge: "MCP v1",
          badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
        },
        {
          href: "/inbox",
          label: "Approval Inbox",
          icon: Inbox,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} PENDING` : null,
          badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
        },
      ],
    },
    {
      group: "SECURITY & RED TEAM",
      items: [
        {
          href: "/gauntlet",
          label: "Prompt Gauntlet",
          icon: Swords,
          badge: "LIVE CTF",
          badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
        },
      ],
    },
    {
      group: "TRUST & AUDIT",
      items: [
        {
          href: "/receipts",
          label: "Verifiable Receipts",
          icon: Receipt,
          badge: null,
        },
        {
          href: "/compliance",
          label: "SOC 2 & ISO Controls",
          icon: FileCheck,
          badge: null,
        },
      ],
    },
    {
      group: "EXECUTIVE",
      items: [
        {
          href: "/takeaways",
          label: "Takeaways & Vision",
          icon: Compass,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-[#0E0E11] border-r border-slate-200 dark:border-white/[0.07] flex flex-col justify-between h-screen sticky top-0 select-none z-30 transition-colors duration-200">
      {/* Top Header / Brand */}
      <div>
        <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-white/[0.07]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-md bg-slate-100 dark:bg-[#18181C] border border-slate-200 dark:border-white/[0.1] flex items-center justify-center text-slate-800 dark:text-zinc-100 group-hover:border-slate-400 dark:group-hover:border-zinc-500 transition-colors shadow-sm">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white font-sans">
                Armor<span className="text-slate-500 dark:text-zinc-400">Desk</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/80">
                v2.4 ENT
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500">
                {group.group}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-100 dark:bg-[#1F1F24] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/[0.08]"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-[#151518]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${
                          item.badgeColor || "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom MCP Telemetry Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#0A0A0C]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-500 dark:text-zinc-400">
            <Radio className="h-3 w-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>MCP NODES</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">ONLINE</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center justify-between px-2 py-1 rounded bg-white dark:bg-[#111114] border border-slate-200 dark:border-white/[0.04]">
            <span className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              email-mcp
            </span>
            <span className="text-slate-400 dark:text-zinc-500 tabular-nums">{mcpLatencies.email}ms</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 rounded bg-white dark:bg-[#111114] border border-slate-200 dark:border-white/[0.04]">
            <span className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              crm-mcp
            </span>
            <span className="text-slate-400 dark:text-zinc-500 tabular-nums">{mcpLatencies.crm}ms</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 rounded bg-white dark:bg-[#111114] border border-slate-200 dark:border-white/[0.04]">
            <span className="text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              bank-mcp
            </span>
            <span className="text-slate-400 dark:text-zinc-500 tabular-nums">{mcpLatencies.bank}ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
