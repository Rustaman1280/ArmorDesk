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
  Radio
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { pendingApprovalsCount, mcpLatencies } = useApp();

  const navGroups = [
    {
      group: "CONTROL PLANE",
      items: [
        {
          href: "/",
          label: "Overview & Crew Graph",
          icon: Layers,
          badge: null,
        },
        {
          href: "/inbox",
          label: "Approval Inbox",
          icon: Inbox,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} PENDING` : null,
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
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
          badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        },
      ],
    },
    {
      group: "TRUST & AUDIT",
      items: [
        {
          href: "/receipts",
          label: "Agent Receipts",
          icon: Receipt,
          badge: null,
        },
        {
          href: "/compliance",
          label: "SOC 2 / ISO Evidence",
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
    <aside className="w-60 shrink-0 bg-[#0E0E11] border-r border-white/[0.07] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      {/* Top Header / Brand */}
      <div>
        <div className="h-14 flex items-center px-4 border-b border-white/[0.07]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-md bg-[#18181C] border border-white/[0.1] flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors shadow-hairline">
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white font-sans">
                Armor<span className="text-zinc-400">Desk</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-sm bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                v2.4 ENT
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-mono font-semibold tracking-wider text-zinc-500">
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
                        ? "bg-[#1F1F24] text-white shadow-hairline border border-white/[0.08]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-[#151518]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-emerald-400" : "text-zinc-500"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${
                          item.badgeColor || "bg-zinc-800 text-zinc-300 border-zinc-700"
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
      <div className="p-3 border-t border-white/[0.07] bg-[#0A0A0C]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-zinc-400">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>MCP SANDBOX NODES</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">HEALTHY</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#111114] border border-white/[0.04]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              email-mcp
            </span>
            <span className="text-zinc-500 tabular-nums">{mcpLatencies.email}ms</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#111114] border border-white/[0.04]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              crm-mcp
            </span>
            <span className="text-zinc-500 tabular-nums">{mcpLatencies.crm}ms</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#111114] border border-white/[0.04]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              bank-mcp
            </span>
            <span className="text-zinc-500 tabular-nums">{mcpLatencies.bank}ms</span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-zinc-500 text-center font-mono">
          Protocol: JSON-RPC 2.0 / stdio
        </div>
      </div>
    </aside>
  );
}
