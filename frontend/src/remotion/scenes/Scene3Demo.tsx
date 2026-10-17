import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Play, CheckCircle2, Lock, FileCheck } from "lucide-react";
import { CinematicDemoBox } from "../components/CinematicDemoBox";

export function Scene3Demo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera Scale & Subtle Breathing
  const cameraScale = interpolate(frame, [0, 600, 1350], [1.02, 1.0, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic Floating Context Emoji Badge based on voiceover beat
  let activeBadge: {
    emoji: string;
    text: string;
    color: "emerald" | "amber" | "rose" | "cyan";
  } = {
    emoji: "⚡",
    text: "$20.00 SLA REFUND : 14ms AUTONOMOUS PASSTHROUGH",
    color: "emerald",
  };

  if (frame >= 300 && frame < 720) {
    activeBadge = {
      emoji: "🔒",
      text: "$8,000.00 WIRE TRANSFER : FROZEN IN DUAL-CONTROL ESCROW",
      color: "rose",
    };
  } else if (frame >= 720) {
    activeBadge = {
      emoji: "✍️",
      text: "APPROVAL INBOX : HUMAN MANAGER SIGNATURE AUTHORIZED",
      color: "amber",
    };
  }

  // Floating background spotlights
  const orb1Y = Math.sin(frame * 0.04) * 30;
  const orb2X = Math.cos(frame * 0.04) * 35;

  return (
    <AbsoluteFill
      style={{
        width: 1920,
        height: 1080,
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
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

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene3_demo.mp3")} />

      {/* Top Floating Scene Tag */}
      <div className="absolute top-8 left-12 z-30 flex items-center gap-3">
        <div className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 font-mono text-xs font-bold tracking-widest flex items-center gap-2 shadow-sm">
          <Play className="h-3.5 w-3.5 text-cyan-600 fill-current" />
          <span>03 / LIVE PRODUCT DEMO : FULL CANVAS</span>
        </div>
      </div>

      {/* Massive Cinematic Screen Recording Box (Takes Center Stage!) */}
      <CinematicDemoBox
        slotId="slot_02_approval_inbox"
        title="Live Execution Demo: Escrow Interception"
        subtitle="Full 16:9 screen capture of https://armordesk.crusts.dev/inbox showing the $8,000 escrow freeze and managerial authorization."
        activeBadge={activeBadge}
        className="z-20"
      />

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
