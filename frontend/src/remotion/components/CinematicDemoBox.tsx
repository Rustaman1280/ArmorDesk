import React from "react";
import { Video, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { MonitorPlay, Sparkles } from "lucide-react";

interface CinematicDemoBoxProps {
  slotId: string;
  title: string;
  subtitle: string;
  videoSrc?: string;
  activeBadge?: {
    emoji: string;
    text: string;
    color: "emerald" | "amber" | "rose" | "cyan" | "violet";
  };
  className?: string;
}

export function CinematicDemoBox({
  slotId,
  title,
  subtitle,
  videoSrc,
  activeBadge,
  className = "",
}: CinematicDemoBoxProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const pulse = Math.sin(frame * 0.08) * 0.1 + 0.9;

  const badgeColorClass = {
    emerald: "bg-emerald-500 text-white shadow-emerald-500/30",
    amber: "bg-amber-500 text-white shadow-amber-500/30",
    rose: "bg-rose-500 text-white shadow-rose-500/30",
    cyan: "bg-cyan-500 text-white shadow-cyan-500/30",
    violet: "bg-violet-500 text-white shadow-violet-500/30",
  }[activeBadge?.color || "emerald"];

  return (
    <div
      style={{
        width: 1760,
        height: 880,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1])})`,
      }}
      className={`relative mx-auto rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_30px_90px_rgba(0,0,0,0.08)] flex flex-col justify-between ${className}`}
    >
      {/* Top Window Header Bar */}
      <div className="h-16 px-8 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
            <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
            <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 ml-4 tracking-wider uppercase">
            {title}
          </span>
        </div>

        {/* Floating Context Emoji Badge */}
        {activeBadge && (
          <div
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-extrabold shadow-lg flex items-center gap-2 transition-all ${badgeColorClass}`}
          >
            <span className="text-sm">{activeBadge.emoji}</span>
            <span>{activeBadge.text}</span>
          </div>
        )}
      </div>

      {/* Main Video Viewport: Large & Uncluttered */}
      <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
        {videoSrc ? (
          <Video
            src={staticFile(videoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div className="text-center space-y-4 max-w-xl p-8 z-10">
            <div
              style={{ transform: `scale(${pulse})` }}
              className="h-24 w-24 rounded-3xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl"
            >
              <MonitorPlay className="h-12 w-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black font-mono text-white tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Drop clip to: public/recordings/{slotId}.mp4</span>
              </span>
            </div>
          </div>
        )}

        {/* Subtle grid background inside empty video player */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Bottom Timeline Watermark Bar */}
      <div className="h-12 px-8 bg-slate-50/90 border-t border-slate-200/70 flex items-center justify-between text-xs font-mono text-slate-500 z-20">
        <span>ARMORDESK ENTERPRISE CONTROL PLANE DEMO</span>
        <span className="font-bold text-emerald-600">LIVE RECORDING BOX : 16:9 FULL CANVAS</span>
      </div>
    </div>
  );
}
