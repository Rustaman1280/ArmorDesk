"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Shield,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Lock,
  Building,
  User,
  AlertCircle
} from "lucide-react";

function DeviceAuthorizeContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const { currentUser, currentTenant, isAuthenticated, login, addToast } = useApp();

  const [code, setCode] = useState(initialCode);
  const [email, setEmail] = useState(currentUser?.email || "rustaman@crusts.dev");
  const [password, setPassword] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [denied, setDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleAuthorize = async (action: "APPROVE" | "DENY" = "APPROVE") => {
    if (!code.trim()) {
      setErrorMessage("Please enter the 8-character device code from your terminal.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/device/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_code: code.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          password,
          tenant_id: currentTenant?.id || "acme-corp",
          action
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Failed to authorize device");
      }

      if (action === "DENY") {
        setDenied(true);
        addToast("Authorization Rejected", "Device access was declined.", "warning");
      } else {
        setAuthorized(true);
        addToast("Device Authorized", "ArmorDesk CLI is now connected to your workspace.", "success");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-[#F8FAFC] dark:bg-[#08090B] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-zinc-800 border border-slate-700 dark:border-white/[0.15] flex items-center justify-center text-white shadow-md">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="font-bold text-xl tracking-tight font-sans">
            Armor<span className="text-slate-500 dark:text-zinc-400">Desk</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Authorize Device / CLI Login
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
          An application or terminal session is requesting access to your ArmorDesk control plane.
        </p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#0E0F14] border border-slate-200 dark:border-white/[0.08] shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
        {authorized ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                Device Successfully Authorized!
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans max-w-xs mx-auto">
                Your CLI session has received its cryptographic credentials. You can now close this browser tab and return to your terminal.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/overview"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-semibold text-xs font-mono transition-colors"
              >
                <span>Go to Control Plane Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : denied ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
              <XCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                Device Authorization Declined
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
                No credentials were exchanged. Your terminal process will abort.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthorize("APPROVE");
            }}
            className="space-y-5"
          >
            {/* User Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                <span>ONE-TIME DEVICE CODE</span>
                <span className="text-[10px] text-slate-400 font-normal">Check terminal output</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WDXZ-8842"
                  maxLength={12}
                  required
                  className="w-full text-center tracking-widest font-mono text-xl font-bold py-3 px-4 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#141519] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 uppercase shadow-inner"
                />
              </div>
            </div>

            {/* Active Workspace / Account Confirmation */}
            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121316] space-y-3">
              <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 font-semibold uppercase">
                AUTHORIZING WORKSPACE IDENTITY
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs shrink-0">
                  {currentUser?.avatar || "CU"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || "Corporate User"}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono truncate">
                    {email} · {currentTenant?.name || "Acme Corp"}
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/[0.04] space-y-2">
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                    Confirm your account email:
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-mono py-1.5 px-3 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#181920] text-slate-800 dark:text-zinc-200"
                  />
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-500/25 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 font-mono"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                <span>Authorize Device</span>
              </button>

              <button
                type="button"
                onClick={() => handleAuthorize("DENY")}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-[#16171d] text-slate-600 dark:text-zinc-400 text-xs font-mono transition-colors"
              >
                Deny Request
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-[11px] font-mono text-slate-400 dark:text-zinc-500">
        OAuth 2.0 Device Authorization Grant (RFC 8628) · ArmorDesk Security Core
      </div>
    </div>
  );
}

export default function DeviceAuthorizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs text-slate-400">Loading device authorization...</div>}>
      <DeviceAuthorizeContent />
    </Suspense>
  );
}
