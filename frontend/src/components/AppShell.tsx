"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ProSettingsModal } from "@/components/ProSettingsModal";
import { ToastContainer } from "@/components/ToastContainer";
import { AuthModal } from "@/components/AuthModal";
import { useApp } from "@/context/AppContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { authModalOpen, setAuthModalOpen } = useApp();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] dark:bg-[#08090B] text-slate-900 dark:text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300 transition-colors duration-200">
        {children}
        <ProSettingsModal />
        <ToastContainer />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#09090B] text-slate-900 dark:text-zinc-100 antialiased selection:bg-slate-200 dark:selection:bg-zinc-800 selection:text-slate-900 dark:selection:text-white transition-colors duration-200">
      {/* Left Command Center Sidebar (Width 240px) */}
      <Sidebar />

      {/* Right Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Telemetry & Context Bar (56px) */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

      <ProSettingsModal />
      <ToastContainer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
