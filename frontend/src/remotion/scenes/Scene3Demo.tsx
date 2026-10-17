import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Play } from "lucide-react";
import { SimulatedAcmeDemo } from "../components/SimulatedAcmeDemo";

export function Scene3Demo() {
  const frame = useCurrentFrame();

  // Floating background spotlights
  const orb1Y = Math.sin(frame * 0.04) * 30;
  const orb2X = Math.cos(frame * 0.04) * 35;

  return (
    <AbsoluteFill
      style={{
        width: 1920,
        height: 1080,
      }}
      className="bg-[#FAFAFC] text-slate-900 overflow-hidden select-none font-sans flex flex-col justify-center items-center"
    >
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translate(${orb2X * 0.2}px, ${orb1Y * 0.2}px)`,
        }}
      />

      {/* Floating Ambient Glow Orbs */}
      <div
        style={{ transform: `translateY(${orb1Y}px)` }}
        className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-cyan-200/35 filter blur-[130px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -right-40 w-[650px] h-[650px] rounded-full bg-amber-200/35 filter blur-[140px] pointer-events-none"
      />

      {/* Top Floating Scene Tag */}
      <div className="absolute top-8 left-16 z-30 flex items-center gap-3">
        <div className="px-5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 font-mono text-xs font-bold tracking-widest flex items-center gap-2.5 shadow-sm">
          <Play className="h-3.5 w-3.5 text-cyan-600 fill-current" />
          <span>03 / LIVE END-TO-END DEMO : ACME CORP CFO WORKSPACE</span>
        </div>
      </div>

      {/* The Simulated Acme Demo App with Cursor & Smooth Zoom Ease */}
      <div className="z-20 my-auto">
        <SimulatedAcmeDemo />
      </div>

      {/* Bottom Floating Info Pill */}
      <div className="absolute bottom-6 z-30 px-6 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-mono text-slate-600 flex items-center gap-4">
        <span>Deterministic Dual-Control Policy Engine</span>
        <span>•</span>
        <span className="text-emerald-700 font-bold">Sub-millisecond wire-level interception</span>
        <span>•</span>
        <span>https://armordesk.crusts.dev</span>
      </div>
    </AbsoluteFill>
  );
}
