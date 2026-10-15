import "./globals.css";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ProSettingsModal } from "@/components/ProSettingsModal";

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
      <body className="bg-[#070B14] text-slate-100 antialiased min-h-screen flex flex-col">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            {children}
          </main>
          <ProSettingsModal />
        </AppProvider>
      </body>
    </html>
  );
}
