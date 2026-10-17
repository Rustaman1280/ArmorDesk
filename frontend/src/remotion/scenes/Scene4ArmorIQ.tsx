import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Sliders, CheckCircle2, XCircle, Award, ExternalLink, Hash, FileCheck } from "lucide-react";
import { MotionCanvasSlot } from "../components/MotionCanvasSlot";

export function Scene4ArmorIQ() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring1 = spring({ frame: frame - 5, fps, config: { damping: 11, mass: 0.7 } });
  const titleSpring2 = spring({ frame: frame - 16, fps, config: { damping: 11, mass: 0.7 } });
  const leftSpring = spring({ frame: frame - 28, fps, config: { damping: 12, mass: 0.8 } });

  const orb1Y = Math.sin(frame * 0.035) * 22;
  const orb2X = Math.cos(frame * 0.035) * 25;

  return (
    <AbsoluteFill className="bg-[#FAFAFC] text-slate-900 p-16 flex flex-col justify-between font-sans overflow-hidden select-none">
      {/* Background Soft Ambient Light Spheres (Apple/Linear Studio Style) */}
      <div
        style={{ transform: `translateY(${orb1Y}px)` }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-200/40 filter blur-[95px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-cyan-200/40 filter blur-[100px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene4_armoriq.mp3")} />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 font-mono text-xs font-bold tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-500 animate-ping" />
            <span>04 / POLICY STUDIO</span>
          </div>
          <span className="text-xs font-mono text-slate-400">tools.armoriq.ai CONSOLE INTEGRATION</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-semibold">
          <ExternalLink className="h-3.5 w-3.5 text-violet-500" />
          <span>CONSOLE: tools.armoriq.ai</span>
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
          ArmorIQ Policy Studio
        </div>
        <div
          style={{
            opacity: titleSpring2,
            transform: `translateY(${interpolate(titleSpring2, [0, 1], [30, 0])}px) scale(${interpolate(titleSpring2, [0, 1], [0.96, 1])})`,
          }}
          className="text-5xl font-black tracking-tight text-violet-600 font-mono uppercase flex items-center gap-4"
        >
          <span>Deterministic Governance Rules.</span>
          <span className="text-sm font-sans font-normal text-slate-500 normal-case px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200">
            Rules configured at tools.armoriq.ai to enforce intent bounds
          </span>
        </div>
      </div>

      {/* Main Kinetic Content Row: Rules Matrix vs Motion Canvas Slot */}
      <div className="relative z-10 grid grid-cols-12 gap-8 items-center my-auto">
        {/* Left Column: 3 Core Policy Rules & Certificate (Span 7) */}
        <div
          style={{
            opacity: leftSpring,
            transform: `translateY(${interpolate(leftSpring, [0, 1], [40, 0])}px)`,
          }}
          className="col-span-7 space-y-4"
        >
          {/* Rules Card */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  ACTIVE GOVERNANCE RULES
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-mono font-bold border border-violet-200">
                tools.armoriq.ai
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Rule 1: Spend Limit */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Rule 1: spend_limit_ceiling ($50.00 USD)
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    ESCROW GATE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    Allowed: Micro-refunds &lt;= $50
                  </span>
                  <span className="text-rose-600 flex items-center gap-1 font-semibold">
                    <XCircle className="h-3 w-3 shrink-0" />
                    Blocked: Unvetted wire &gt; $50
                  </span>
                </div>
              </div>

              {/* Rule 2: Whitelist CRM */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Rule 2: vendor_crm_whitelist
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                    BENEFICIARY
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    Allowed: Whitelisted accounts
                  </span>
                  <span className="text-rose-600 flex items-center gap-1 font-semibold">
                    <XCircle className="h-3 w-3 shrink-0" />
                    Blocked: Rogue transit routing
                  </span>
                </div>
              </div>

              {/* Rule 3: Intent Anchoring */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Rule 3: plan_hash_attestation
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                    RFC 8785 HASH
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    SHA-256 Plan Hash matching spec
                  </span>
                  <span className="text-rose-600 flex items-center gap-1 font-semibold">
                    <XCircle className="h-3 w-3 shrink-0" />
                    Blocks parameter tampering
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Certificate Card */}
          <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between font-mono text-xs border border-slate-800">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">IMMUTABLE CERTIFICATE</span>
                <span className="text-emerald-300 font-bold">Receipt rcpt_5b521f1f (Merkle Verified)</span>
              </div>
            </div>
            <span className="text-[10px] px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-white/10">
              OFFLINE AUDIT PROOF
            </span>
          </div>
        </div>

        {/* Right Column: Motion Canvas Recording Slot (Span 5) */}
        <div className="col-span-5">
          <MotionCanvasSlot
            slotId="slot_03_armoriq_console"
            title="tools.armoriq.ai Policy Studio"
            subtitle="Live screen recording showing the actual ArmorIQ Console interface and configured rule definitions."
            badge="RECORDING CANVAS"
            accentColor="violet"
            className="h-[310px]"
          />
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-slate-200/80">
        <span>ArmorIQ SDK Pro Integration : Staging &amp; Production API</span>
        <span>Independent Offline Cryptographic Receipt Verification</span>
        <span>https://tools.armoriq.ai</span>
      </div>
    </AbsoluteFill>
  );
}
