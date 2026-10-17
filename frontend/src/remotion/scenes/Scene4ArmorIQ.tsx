import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { ShieldAlert, FileText, CheckCircle2, XCircle, Sliders, Hash, Award, ExternalLink } from "lucide-react";
import { CanvasPlaceholder } from "../components/CanvasPlaceholder";

export function Scene4ArmorIQ() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });
  const rulesSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const receiptSpring = spring({ frame: frame - 30, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill className="bg-[#07080B] text-white p-16 flex flex-col justify-between font-sans overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene4_armoriq.mp3")} />

      {/* Header Bar */}
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
        }}
        className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/40">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-violet-400 uppercase">
              CHAPTER 04 : ARMORIQL CONSOLE &amp; POLICY RULES
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">
              tools.armoriq.ai &amp; Policy Studio
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>CONSOLE: tools.armoriq.ai</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-8 my-auto items-stretch">
        {/* Left Column: Policy Studio Rules Configured (Span 7) */}
        <div
          style={{
            opacity: rulesSpring,
            transform: `translateY(${interpolate(rulesSpring, [0, 1], [30, 0])}px)`,
          }}
          className="col-span-7 space-y-4"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0E0F14]/90 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Configured Policy Rules in ArmorTools
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                POLICY STUDIO ENGINE
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Rule 1: Spend Limit */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Rule 1: spend_limit_ceiling ($50.00 USD)
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    ESCROW GATE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Allowed: Micro-refunds &lt;= $50</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-400">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Blocked: Unsupervised wire &gt; $50</span>
                  </div>
                </div>
              </div>

              {/* Rule 2: Allowed Vendor Whitelist */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Rule 2: vendor_crm_whitelist
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                    BENEFICIARY CHECK
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Allowed: Verified vendor accounts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-400">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Blocked: Unvetted routing numbers</span>
                  </div>
                </div>
              </div>

              {/* Rule 3: Cryptographic Intent Anchoring */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Rule 3: plan_hash_attestation
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-bold">
                    RFC 8785 CANONICAL
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>SHA-256 Plan Hash matching allowed spec</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-400">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Intercepts runtime parameter tampering</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Output Snippet */}
          <div
            style={{
              opacity: receiptSpring,
            }}
            className="p-3.5 rounded-2xl bg-[#090C12] border border-violet-500/30 text-[10px] font-mono text-slate-300 space-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between text-violet-300 font-bold pb-1 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                <span>Verifiable Receipt Certificate (Offline Proof)</span>
              </span>
              <span>rcpt_5b521f1f</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 block">PLAN HASH:</span>
                <span className="text-emerald-400 truncate block">7f9b8a1c3d2e...4c1e</span>
              </div>
              <div>
                <span className="text-slate-500 block">MERKLE ROOT:</span>
                <span className="text-cyan-400 truncate block">d4e5f6a7b8c9...9a8b</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Canvas Slot 3 for Live tools.armoriq.ai Screen Recording (Span 5) */}
        <div className="col-span-5 flex flex-col justify-between">
          <CanvasPlaceholder
            slotId="slot_03_armoriq_console"
            title="Screen Recording: tools.armoriq.ai Console"
            recommendedDuration="20 - 25s"
            instructions="Drop a screen recording of your actual ArmorIQ Console showing the Policy Studio interface and active attestation rules."
            className="h-full min-h-[380px]"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-white/10">
        <span>ArmorIQ SDK Pro Integration : Staging &amp; Production API</span>
        <span>Independent Offline Cryptographic Receipt Verification</span>
        <span>https://tools.armoriq.ai</span>
      </div>
    </AbsoluteFill>
  );
}
