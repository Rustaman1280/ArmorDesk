"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = "border-slate-200 dark:border-white/[0.08]";
        let icon = <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />;
        let titleColor = "text-slate-900 dark:text-zinc-200";

        if (toast.type === "success") {
          borderColor = "border-emerald-300 dark:border-emerald-500/30";
          icon = <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
          titleColor = "text-emerald-800 dark:text-emerald-300";
        } else if (toast.type === "warning") {
          borderColor = "border-amber-300 dark:border-amber-500/30";
          icon = <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />;
          titleColor = "text-amber-800 dark:text-amber-300";
        } else if (toast.type === "error") {
          borderColor = "border-rose-300 dark:border-rose-500/30";
          icon = <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />;
          titleColor = "text-rose-800 dark:text-rose-300";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border bg-white/95 dark:bg-[#111114]/95 backdrop-blur-md p-3.5 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 ${borderColor}`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{icon}</div>
                <div>
                  <h4 className={`text-xs font-bold ${titleColor}`}>{toast.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
