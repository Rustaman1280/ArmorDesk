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
  },
  {
    name: "Marcus Vance",
    role: "manager",
    title: "VP Treasury & Risk",
    avatar: "MV",
    scopeSummary: "Clean Slate Treasury · Full Policy Signing Authority"
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
  isAuthenticated: boolean;
  login: (email: string, password?: string, tenantId?: string) => Promise<boolean>;
  register: (email: string, name: string, companyName: string, password?: string, initialDeposit?: number) => Promise<boolean>;
  logout: () => void;
  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginAsDemoSeeded: () => void;
  loginAsDemoClean: () => void;
  proActive: boolean;
  setProActive: (active: boolean) => void;
  reloadTrigger: number;
  triggerReload: () => void;
  pendingApprovalsCount: number;
  theme: "dark" | "light";
  toggleTheme: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [proActive, setProActive] = useState<boolean>(false);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const authState = localStorage.getItem("armordesk_is_auth");
    const savedUser = localStorage.getItem("armordesk_user");
    const savedTenant = localStorage.getItem("armordesk_tenant");

    if (authState === "false") {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
        } catch {}
      }
      if (savedTenant) {
        setTenantId(savedTenant);
      }
    }
  }, []);

  const loginAsDemoSeeded = () => {
    setTenantId("acme-corp");
    setCurrentUser(AVAILABLE_USERS[0]);
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("armordesk_is_auth", "true");
      localStorage.setItem("armordesk_user", JSON.stringify(AVAILABLE_USERS[0]));
      localStorage.setItem("armordesk_tenant", "acme-corp");
      localStorage.setItem("armordesk_token", "jwt_demo_seeded");
    }
    addToast(
      "Signed In: Seeded Demo (Acme Corp)",
      "Active approvals ($8k AWS bill), receipts, and multi-agent audit traces loaded.",
      "success"
    );
    triggerReload();
  };

  const loginAsDemoClean = () => {
    setTenantId("globex-inc");
    setCurrentUser(AVAILABLE_USERS[2]);
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("armordesk_is_auth", "true");
      localStorage.setItem("armordesk_user", JSON.stringify(AVAILABLE_USERS[2]));
      localStorage.setItem("armordesk_tenant", "globex-inc");
      localStorage.setItem("armordesk_token", "jwt_demo_clean");
    }
    addToast(
      "Signed In: Clean Slate (Globex Inc)",
      "Pristine tenant loaded with 0 pending approvals and a clean audit buffer.",
      "info"
    );
    triggerReload();
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("armordesk_is_auth", "false");
      localStorage.removeItem("armordesk_user");
      localStorage.removeItem("armordesk_token");
    }
    addToast("Signed Out", "Session terminated. Please sign in to access corporate telemetry.", "info");
  };

  const login = async (email: string, password: string = "demo123", targetTenant?: string): Promise<boolean> => {
    try {
      const res = await api.login(email, password, targetTenant || tenantId);
      if (res.user && res.tenant) {
        setCurrentUser(res.user);
        setTenantId(res.tenant.id);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("armordesk_is_auth", "true");
          localStorage.setItem("armordesk_user", JSON.stringify(res.user));
          localStorage.setItem("armordesk_tenant", res.tenant.id);
          if (res.token) localStorage.setItem("armordesk_token", res.token);
        }
        addToast("Authentication Successful", `Welcome back, ${res.user.name} (${res.tenant.name}).`, "success");
        triggerReload();
        return true;
      }
      return false;
    } catch (e: any) {
      addToast("Login Failed", e.message || "Invalid credentials", "error");
      return false;
    }
  };

  const register = async (
    email: string,
    name: string,
    companyName: string,
    password: string = "demo123",
    initialDeposit: number = 100000.0
  ): Promise<boolean> => {
    try {
      const res = await api.register(email, name, companyName, password, initialDeposit);
      if (res.user && res.tenant) {
        await refreshTenants();
        setCurrentUser(res.user);
        setTenantId(res.tenant.id);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("armordesk_is_auth", "true");
          localStorage.setItem("armordesk_user", JSON.stringify(res.user));
          localStorage.setItem("armordesk_tenant", res.tenant.id);
          if (res.token) localStorage.setItem("armordesk_token", res.token);
        }
        addToast(
          "Workspace Registered",
          `New tenant '${res.tenant.name}' initialized with $${initialDeposit.toLocaleString()} vault.`,
          "success"
        );
        triggerReload();
        return true;
      }
      return false;
    } catch (e: any) {
      addToast("Registration Failed", e.message || "Could not register workspace", "error");
      return false;
    }
  };

  useEffect(() => {
    // Read theme preference from localStorage, default to light
    const savedTheme = localStorage.getItem("armordesk_theme") as "dark" | "light" | null;
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("armordesk_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };
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
        isAuthenticated,
        login,
        register,
        logout,
        proModalOpen,
        setProModalOpen,
        authModalOpen,
        setAuthModalOpen,
        loginAsDemoSeeded,
        loginAsDemoClean,
        proActive,
        setProActive,
        reloadTrigger,
        triggerReload,
        pendingApprovalsCount,
        theme,
        toggleTheme,
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
