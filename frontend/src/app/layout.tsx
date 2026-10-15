import "./globals.css";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ProSettingsModal } from "@/components/ProSettingsModal";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata = {
  title: "ArmorDesk — Enterprise AI Agent Control Plane & Trust Center",
  description: "B2B SaaS Multi-Agent Governance, Approval Inbox, Verifiable Receipts & Gauntlet CTF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090B] text-zinc-100 antialiased min-h-screen flex selection:bg-zinc-800 selection:text-white">
        <AppProvider>
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
        </AppProvider>
      </body>
    </html>
  );
}
