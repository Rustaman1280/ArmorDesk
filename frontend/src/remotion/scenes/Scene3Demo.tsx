import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Play, CheckCircle2, Lock, ArrowRight, Shield, Clock, FileCheck } from "lucide-react";
import { CanvasPlaceholder } from "../components/CanvasPlaceholder";

export function Scene3Demo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });
  const scenarioASpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const scenarioBSpring = spring({ frame: frame - 30, fps, config: { damping: 12 } });

  // Blinking pending badge
  const pendingGlow = Math.sin(frame * 0.12) * 0.2 + 0.8;

  return (
    <AbsoluteFill className="bg-[#07080B] text-white p-16 flex flex-col justify-between font-sans overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene3_demo.mp3")} />

      {/* Header Bar */}
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
        }}
        className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
            <Play className="h-5 w-5 fill-current" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              CHAPTER 03 : LIVE END-TO-END EXECUTION
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">
              The Product Working End to End
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>PRODUCTION FLEET RUNTIME</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-8 my-auto items-stretch">
        {/* Left Column: Two Scenarios (Span 7) */}
        <div className="col-span-7 space-y-4 flex flex-col justify-between">
          {/* Scenario A: Allowed Micro-Action */}
          <div
            style={{
              opacity: scenarioASpring,
              transform: `translateY(${interpolate(scenarioASpring, [0, 1], [20, 0])}px)`,
            }}
            className="rounded-2xl border border-emerald-500/30 bg-[#0E0F14]/90 p-5 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Scenario A: Low-Risk Autonomous Micro-Action
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                PASSTHROUGH ALLOWED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500">TOOL CALL</span>
                <div className="text-emerald-400 font-bold">bank.refund</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500">AMOUNT</span>
                <div className="text-white font-bold">$20.00 USD</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500">POLICY CHECK</span>
                <div className="text-emerald-400 font-bold">&lt;= $50.00 (Pass)</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Autonomous refund executes directly in 14ms. No human friction needed for low-risk SLA compensations.
            </p>
          </div>

          {/* Scenario B: High-Risk Action Frozen in Escrow */}
          <div
            style={{
              opacity: scenarioBSpring,
              transform: `translateY(${interpolate(scenarioBSpring, [0, 1], [20, 0])}px)`,
            }}
            className="rounded-2xl border border-amber-500/40 bg-[#0E0F14]/90 p-5 space-y-3 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Scenario B: High-Risk Action Frozen in Escrow
                </span>
              </div>
              <span
                style={{ opacity: pendingGlow }}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
              >
                DUAL-CONTROL ESCROW INTERCEPTED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500">TOOL CALL</span>
                <div className="text-amber-400 font-bold">bank.wire_transfer</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500">AMOUNT</span>
                <div className="text-white font-bold">$8,000.00 USD</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500">POLICY CHECK</span>
                <div className="text-amber-400 font-bold">&gt; $50.00 (FROZEN)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-center justify-between">
              <span>Status: Frozen in Approval Inbox awaiting Manager Signature</span>
              <FileCheck className="h-4 w-4 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Right Column: Canvas Slot 2 for Live Screen Recording (Span 5) */}
        <div className="col-span-5 flex flex-col justify-between">
          <CanvasPlaceholder
            slotId="slot_02_approval_inbox"
            title="Screen Recording: Approval Inbox Sign-Off"
            recommendedDuration="20 - 25s"
            instructions="Drop a live screen recording showing the manager clicking 'Approve & Disburse' in https://armordesk.crusts.dev/inbox, releasing the escrow hold."
            className="h-full min-h-[380px]"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-white/10">
        <span>Dual-Control Escrow Mechanism : Sub-second Interception</span>
        <span>Cryptographic Audit Proof Minting on Release</span>
        <span>https://armordesk.crusts.dev/inbox</span>
      </div>
    </AbsoluteFill>
  );
}
