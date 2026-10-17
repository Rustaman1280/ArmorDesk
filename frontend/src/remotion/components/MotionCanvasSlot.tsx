import React from "react";
import { Video, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Video as VideoIcon, Sparkles, MonitorPlay } from "lucide-react";

interface MotionCanvasSlotProps {
  slotId: string;
  title: string;
  subtitle: string;
  videoSrc?: string;
  badge?: string;
  accentColor?: "emerald" | "amber" | "cyan" | "violet";
  className?: string;
}

export function MotionCanvasSlot({
  slotId,
  title,
  subtitle,
  videoSrc,
  badge = "INTERACTIVE DEMO SLOT",
  accentColor = "emerald",
  className = "",
}: MotionCanvasSlotProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const subtleFloat = Math.sin(frame * 0.04) * 4;

  const colorStyles = {
    emerald: {
      border: "border-emerald-500/30",
      glow: "shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)]",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "#10b981",
    },
    amber: {
      border: "border-amber-500/30",
      glow: "shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)]",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "#f59e0b",
    },
    cyan: {
      border: "border-cyan-500/30",
      glow: "shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)]",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      accent: "#06b6d4",
    },
    violet: {
      border: "border-violet-500/30",
      glow: "shadow-[0_20px_60px_-15px_rgba(139,92,246,0.15)]",
      badgeBg: "bg-violet-50 text-violet-700 border-violet-200",
      accent: "#8b5cf6",
    },
  }[accentColor];

  if (videoSrc) {
    return (
      <div
        style={{
          transform: `scale(${interpolate(entrance, [0, 1], [0.92, 1])}) translateY(${subtleFloat}px)`,
          opacity: entrance,
        }}
        className={`relative rounded-3xl overflow-hidden bg-black border-4 border-slate-900 shadow-2xl ${className}`}
      >
        <Video
          src={staticFile(videoSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>LIVE RECORDING ACTIVE</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `scale(${interpolate(entrance, [0, 1], [0.92, 1])}) translateY(${subtleFloat}px)`,
        opacity: entrance,
      }}
      className={`relative rounded-3xl bg-white/95 backdrop-blur-2xl border ${colorStyles.border} ${colorStyles.glow} p-6 flex flex-col justify-between shadow-xl ${className}`}
    >
      {/* Top Device Window Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-medium ml-2">
            Canvas Mockup Window
          </span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${colorStyles.badgeBg}`}>
          {badge}
        </div>
      </div>

      {/* Middle Interactive Placeholder Area */}
      <div className="my-auto py-8 text-center space-y-3">
        <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm text-slate-400">
          <MonitorPlay className="h-8 w-8 text-slate-700" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="text-base font-bold text-slate-900 font-sans tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Floating Path Card */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>public/recordings/{slotId}.mp4</span>
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>Screen Recording Canvas</span>
        </span>
      </div>
    </div>
  );
}
