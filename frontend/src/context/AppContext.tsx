"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, TenantInfo, ApprovalItem } from "@/lib/api";

export interface UserProfile {
  name: string;
  role: "manager" | "intern";
  title: string;
  avatar: string;
  scopeSummary: string;
}

export const AVAILABLE_USERS: UserProfile[] = [
  {
    name: "Sarah Chen",
    role: "manager",
    title: "CFO · FinOps Lead",
    avatar: "SC",
    scopeSummary: "Full Treasury & Wire Transfer Approval Authority"
  },
  {
    name: "Alex Rivera",
    role: "intern",
    title: "Junior FinOps Intern",
    avatar: "AR",
    scopeSummary: "Restricted View-Only Scope · Financial Actions Blocked"
  }
];

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
}

interface AppContextType {
  tenantId: string;
  setTenantId: (id: string) => void;
  currentUser: UserProfile;
  switchUser: (u: UserProfile) => void;
  tenants: TenantInfo[];
  refreshTenants: () => Promise<void>;
  currentTenant?: TenantInfo;
  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
  proActive: boolean;
  setProActive: (active: boolean) => void;
  reloadTrigger: number;
  triggerReload: () => void;
  pendingApprovalsCount: number;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: "info" | "success" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  mcpLatencies: { email: number; crm: number; bank: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string>("acme-corp");
  const [currentUser, setCurrentUser] = useState<UserProfile>(AVAILABLE_USERS[0]);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const [proActive, setProActive] = useState<boolean>(false);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mcpLatencies, setMcpLatencies] = useState({ email: 12, crm: 8, bank: 15 });

  const triggerReload = () => setReloadTrigger((prev) => prev + 1);

  const addToast = (
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, message, type, timestamp: Date.now() };
    setToasts((prev) => [...prev.slice(-4), newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUser = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    if (newUser.role === "intern") {
      addToast(
        "Scope Restricted: Alex Rivera (Intern)",
        "for_user policy active: Financial wire transfers & approvals are now locked.",
        "warning"
      );
    } else {
      addToast(
        "Authority Elevated: Sarah Chen (CFO)",
        "for_user policy active: Full dual-authorization sign-off enabled.",
        "success"
      );
    }
  };

  const refreshTenants = async () => {
    try {
      const data = await api.getTenants();
      setTenants(data);
    } catch (e) {
      console.error("Failed to fetch tenants", e);
    }
  };

  const checkProStatus = async () => {
    try {
      const cfg = await api.getConfig();
      setProActive(cfg.armoriq_pro_active);
    } catch (e) {
      console.error("Failed to fetch config", e);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const data = await api.getApprovals(tenantId, "HELD_FOR_APPROVAL");
      setPendingApprovalsCount(data.length);
    } catch (e) {
      console.error("Failed to fetch approvals count", e);
    }
  };

  useEffect(() => {
    refreshTenants();
    checkProStatus();
    fetchPendingApprovals();
  }, [tenantId, reloadTrigger]);

  // Subtle live ping variation for MCP server latency
  useEffect(() => {
    const interval = setInterval(() => {
      setMcpLatencies({
        email: Math.floor(10 + Math.random() * 5),
        crm: Math.floor(6 + Math.random() * 4),
        bank: Math.floor(14 + Math.random() * 6),
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentTenant = tenants.find((t) => t.id === tenantId);

  return (
    <AppContext.Provider
      value={{
        tenantId,
        setTenantId,
        currentUser,
        switchUser,
        tenants,
        refreshTenants,
        currentTenant,
        proModalOpen,
        setProModalOpen,
        proActive,
        setProActive,
        reloadTrigger,
        triggerReload,
        pendingApprovalsCount,
        toasts,
        addToast,
        removeToast,
        mcpLatencies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
