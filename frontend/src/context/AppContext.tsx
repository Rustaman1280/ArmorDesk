"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, TenantInfo } from "@/lib/api";

export interface UserProfile {
  name: string;
  role: "manager" | "intern";
  title: string;
  avatar: string;
}

export const AVAILABLE_USERS: UserProfile[] = [
  {
    name: "Sarah Chen",
    role: "manager",
    title: "CFO / FinOps Lead",
    avatar: "SC"
  },
  {
    name: "Alex Rivera",
    role: "intern",
    title: "Junior FinOps Intern",
    avatar: "AR"
  }
];

interface AppContextType {
  tenantId: string;
  setTenantId: (id: string) => void;
  currentUser: UserProfile;
  setCurrentUser: (u: UserProfile) => void;
  tenants: TenantInfo[];
  refreshTenants: () => Promise<void>;
  currentTenant?: TenantInfo;
  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
  proActive: boolean;
  setProActive: (active: boolean) => void;
  reloadTrigger: number;
  triggerReload: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string>("acme-corp");
  const [currentUser, setCurrentUser] = useState<UserProfile>(AVAILABLE_USERS[0]);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const [proActive, setProActive] = useState<boolean>(false);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const triggerReload = () => setReloadTrigger((prev) => prev + 1);

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

  useEffect(() => {
    refreshTenants();
    checkProStatus();
  }, [reloadTrigger]);

  const currentTenant = tenants.find((t) => t.id === tenantId);

  return (
    <AppContext.Provider
      value={{
        tenantId,
        setTenantId,
        currentUser,
        setCurrentUser,
        tenants,
        refreshTenants,
        currentTenant,
        proModalOpen,
        setProModalOpen,
        proActive,
        setProActive,
        reloadTrigger,
        triggerReload
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
