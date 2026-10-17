import "./globals.css";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "ArmorDesk: Enterprise AI Agent Control Plane & Trust Center",
  description: "Cryptographic Intent Governance, Human-in-the-Loop Approval Inbox, and Break-the-Agent Gauntlet for Autonomous AI Agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 dark:bg-[#08090B] dark:text-zinc-100 antialiased min-h-screen">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
