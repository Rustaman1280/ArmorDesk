import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Play, CheckCircle2, Lock, ArrowRight, Shield, Zap, FileCheck } from "lucide-react";
import { MotionCanvasSlot } from "../components/MotionCanvasSlot";

export function Scene3Demo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring1 = spring({ frame: frame - 5, fps, config: { damping: 11, mass: 0.7 } });
  const titleSpring2 = spring({ frame: frame - 16, fps, config: { damping: 11, mass: 0.7 } });
  const leftSpring = spring({ frame: frame - 28, fps, config: { damping: 12, mass: 0.8 } });

  const orb1Y = Math.sin(frame * 0.04) * 20;
  const orb2X = Math.cos(frame * 0.04) * 20;

  // Staggered pending glow pulse
  const pendingPulse = Math.sin(frame * 0.12) * 0.15 + 0.85;

  return (
    <AbsoluteFill className="bg-[#FAFAFC] text-slate-900 p-16 flex flex-col justify-between font-sans overflow-hidden select-none">
      {/* Background Soft Ambient Light Spheres (Apple/Linear Studio Style) */}
      <div
        style={{ transform: `translateY(${orb1Y}px)` }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-200/35 filter blur-[90px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-200/40 filter blur-[100px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene3_demo.mp3")} />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 font-mono text-xs font-bold tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            <span>03 / LIVE DEMO</span>
          </div>
          <span className="text-xs font-mono text-slate-400">END-TO-END EXECUTION &amp; INTERCEPTION</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-semibold">
          <Play className="h-3.5 w-3.5 text-cyan-500 fill-current" />
          <span>PRODUCTION FLEET RUNTIME</span>
        </div>
      </div>

      {/* Giant Kinetic Hero Typography (Apple Keynote Style) */}
      <div className="relative z-10 my-2 space-y-1">
        <div
          style={{
            opacity: titleSpring1,
            transform: `translateY(${interpolate(titleSpring1, [0, 1], [30, 0])}px) scale(${interpolate(titleSpring1, [0, 1], [0.96, 1])})`,
          }}
          className="text-5xl font-black tracking-tight text-slate-900 font-mono uppercase"
        >
          Deterministic Escrow
        </div>
        <div
          style={{
            opacity: titleSpring2,
            transform: `translateY(${interpolate(titleSpring2, [0, 1], [30, 0])}px) scale(${interpolate(titleSpring2, [0, 1], [0.96, 1])})`,
          }}
          className="text-5xl font-black tracking-tight text-cyan-600 font-mono uppercase flex items-center gap-4"
        >
          <span>In Real-Time Action.</span>
          <span className="text-sm font-sans font-normal text-slate-500 normal-case px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200">
            Autonomous micro-actions pass; high-stakes payments freeze instantly
          </span>
        </div>
      </div>

      {/* Main Kinetic Content Row: Scenarios vs Motion Canvas Slot */}
      <div className="relative z-10 grid grid-cols-12 gap-8 items-center my-auto">
        {/* Left Column: Live Scenarios Comparison (Span 7) */}
        <div
          style={{
            opacity: leftSpring,
            transform: `translateY(${interpolate(leftSpring, [0, 1], [40, 0])}px)`,
          }}
          className="col-span-7 space-y-4"
        >
          {/* Scenario A: Allowed Micro-Action */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-200/80 shadow-[0_20px_50px_rgba(16,185,129,0.06)] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  SCENARIO A: LOW-RISK SLA REFUND
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                14ms AUTO-PASSED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">TOOL</span>
                <span className="text-xs font-bold text-slate-800">bank.refund</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">AMOUNT</span>
                <span className="text-xs font-bold text-emerald-600">$20.00 USD</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">POLICY VERDICT</span>
                <span className="text-xs font-bold text-slate-700">&lt;= $50 Limit (Pass)</span>
              </div>
            </div>
          </div>

          {/* Scenario B: High-Risk Action Frozen in Escrow */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-amber-300 shadow-[0_25px_60px_rgba(245,158,11,0.08)] p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  SCENARIO B: WIRE TRANSFER DISBURSEMENT
                </span>
              </div>
              <span
                style={{ opacity: pendingPulse }}
                className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold border border-amber-300"
              >
                FROZEN IN DUAL-CONTROL ESCROW
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">TOOL</span>
                <span className="text-xs font-bold text-slate-800">bank.wire_transfer</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">AMOUNT</span>
                <span className="text-xs font-bold text-rose-600">$8,000.00 USD</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">INTERCEPTION</span>
                <span className="text-xs font-bold text-amber-600">&gt; $50 (Escrow Lock)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs font-mono text-amber-900 flex items-center justify-between">
              <span>Approval Inbox: Human Managerial Signature Mandated</span>
              <FileCheck className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Right Column: Motion Canvas Recording Slot (Span 5) */}
        <div className="col-span-5">
          <MotionCanvasSlot
            slotId="slot_02_approval_inbox"
            title="Approval Inbox Sign-Off"
            subtitle="Live screen recording showing human manager unlocking frozen escrow funds with cryptographic signature."
            badge="RECORDING CANVAS"
            accentColor="emerald"
            className="h-[310px]"
          />
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-slate-200/80">
        <span>Dual-Control Escrow Mechanism : Sub-second Interception</span>
        <span>Cryptographic Audit Proof Minting on Release</span>
        <span>https://armordesk.crusts.dev/inbox</span>
      </div>
    </AbsoluteFill>
  );
}
