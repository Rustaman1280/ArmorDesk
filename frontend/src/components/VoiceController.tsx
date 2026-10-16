"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Radio, Sparkles, Activity } from "lucide-react";
import { isVoiceEnabled, setVoiceEnabled, subscribeAudioPlaying, playVoiceAlert, stopVoiceAlert } from "@/lib/audio";
import { useApp } from "@/context/AppContext";

export function VoiceController() {
  const { addToast } = useApp();
  const [enabled, setEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setEnabled(isVoiceEnabled());
    const unsubscribe = subscribeAudioPlaying((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setVoiceEnabled(next);
    addToast(
      next ? "Voice Telemetry Active" : "Voice Telemetry Muted",
      next
        ? "ElevenLabs voice feedback enabled for SOC alerts & executive briefings."
        : "All audio alerts muted.",
      next ? "success" : "info"
    );
  };

  const handleTestAlert = async (type: "security" | "executive") => {
    setMenuOpen(false);
    if (!enabled) {
      setEnabled(true);
      setVoiceEnabled(true);
    }

    if (type === "security") {
      await playVoiceAlert(
        "Security alert. Sub-agent Reader attempted unauthorized bank transfer. Blocked at protocol layer by ArmorIQ scoped delegation. Merkle proof hash committed.",
        "security"
      );
    } else {
      await playVoiceAlert(
        "Executive briefing for CFO Sarah. You have 2 high-value disbursements held in escrow by ArmorIQ policy, totaling $8,500. Awaiting dual-control authorization.",
        "executive"
      );
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121317] p-0.5 shadow-sm text-xs font-mono">
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
            enabled
              ? "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
              : "text-slate-400 dark:text-zinc-500 hover:text-slate-700"
          }`}
          title={enabled ? "Voice Telemetry is ON (Click to Mute)" : "Voice Telemetry is OFF (Click to Enable)"}
        >
          {enabled ? (
            <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-slate-400" />
          )}

          <span className="hidden sm:inline">Voice:</span>
          <span className={enabled ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}>
            {enabled ? "ON" : "OFF"}
          </span>

          {/* 4-Bar Animated Waveform Visualizer */}
          {enabled && (
            <div className="flex items-end gap-0.5 h-3 ml-1">
              <span
                className={`w-0.5 rounded-full bg-emerald-500 transition-all ${
                  isPlaying ? "animate-waveform-1 h-3" : "h-1 opacity-50"
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-emerald-500 transition-all ${
                  isPlaying ? "animate-waveform-2 h-3" : "h-2 opacity-50"
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-emerald-500 transition-all ${
                  isPlaying ? "animate-waveform-3 h-3" : "h-1.5 opacity-50"
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-emerald-500 transition-all ${
                  isPlaying ? "animate-waveform-4 h-3" : "h-1 opacity-50"
                }`}
              />
            </div>
          )}
        </button>

        {/* Test Dropdown Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-1.5 py-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          title="ElevenLabs Audio Options"
        >
          <Sparkles className="h-3 w-3 text-amber-500" />
        </button>
      </div>

      {/* Mini Popover */}
      {menuOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#141519] shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 border-b border-slate-100 dark:border-white/[0.06] mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase block">
              ElevenLabs Voice AI Telemetry
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              Model: eleven_flash_v2_5 (Low Latency)
            </span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleTestAlert("security")}
              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2026] text-slate-700 dark:text-zinc-200 font-mono text-[11px] flex items-center justify-between"
            >
              <span>⚡ Test SOC Security Alert</span>
              <span className="text-[9px] text-rose-500 font-bold">DANIEL</span>
            </button>

            <button
              onClick={() => handleTestAlert("executive")}
              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2026] text-slate-700 dark:text-zinc-200 font-mono text-[11px] flex items-center justify-between"
            >
              <span>🎧 Test Executive Briefing</span>
              <span className="text-[9px] text-emerald-500 font-bold">SARAH</span>
            </button>

            {isPlaying && (
              <button
                onClick={stopVoiceAlert}
                className="w-full text-left px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 font-mono text-[10px]"
              >
                ■ Stop Current Audio
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
