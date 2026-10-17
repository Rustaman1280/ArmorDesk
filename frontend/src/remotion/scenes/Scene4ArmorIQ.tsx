import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Sliders, CheckCircle2, XCircle, Award, ExternalLink, Hash, FileCheck, ShieldAlert } from "lucide-react";
import { MotionCanvasSlot } from "../components/MotionCanvasSlot";

export function Scene4ArmorIQ() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Camera Scale & Drift
  const cameraScale = interpolate(frame, [0, 450, 900, 1350], [1.05, 1.0, 1.02, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraTranslateY = interpolate(frame, [0, 700, 1350], [8, -5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Kinetic Title Word Staggers
  const title1 = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.6 } });
  const title2 = spring({ frame: frame - 14, fps, config: { damping: 10, mass: 0.6 } });
  const title3 = spring({ frame: frame - 24, fps, config: { damping: 10, mass: 0.6 } });

  // 3. Staggered Rules & Certificate Cards
  const leftColSpring = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.8 } });
  const certSpring = spring({ frame: frame - 90, fps, config: { damping: 10, mass: 0.7 } });
  const canvasSlotSpring = spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.8 } });

  // 4. Floating Ambient Glow Orbs
  const orb1Y = Math.sin(frame * 0.035) * 35;
  const orb2X = Math.cos(frame * 0.035) * 40;

  // 5. Interactive Rule Toggles (State changes at frame 110)
  const ruleToggle = frame > 110;

  return (
    <AbsoluteFill
      style={{
        width: 1920,
        height: 1080,
        transform: `scale(${cameraScale}) translateY(${cameraTranslateY}px)`,
        transformOrigin: "center center",
      }}
      className="bg-[#FAFAFC] text-slate-900 overflow-hidden select-none font-sans"
    >
      {/* Background Kinetic Grid Lines */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translate(${orb2X * 0.2}px, ${orb1Y * 0.2}px)`,
        }}
      />

      {/* Floating Colored Ambient Studio Spotlights */}
      <div
        style={{ transform: `translateY(${orb1Y}px)` }}
        className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full bg-violet-200/35 filter blur-[130px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -left-40 w-[650px] h-[650px] rounded-full bg-cyan-200/35 filter blur-[140px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene4_armoriq.mp3")} />

      {/* FIXED 1920x1080 CONTENT CONTAINER */}
      <div style={{ width: 1920, height: 1080, padding: 80 }} className="flex flex-col justify-between relative z-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-mono text-xs font-extrabold tracking-widest flex items-center gap-2.5 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-ping" />
              <span>04 / ARMORIQL POLICY STUDIO</span>
            </div>
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              tools.armoriq.ai CONSOLE GOVERNANCE
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-bold">
            <ExternalLink className="h-4 w-4 text-violet-500" />
            <span>CONSOLE: tools.armoriq.ai</span>
          </div>
        </div>

        {/* Giant Kinetic Headline: Staggered Words */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-4 text-6xl font-black font-mono tracking-tight text-slate-900 uppercase">
            <span
              style={{
                opacity: title1,
                transform: `translateY(${interpolate(title1, [0, 1], [40, 0])}px) scale(${interpolate(title1, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
            >
              ArmorIQ
            </span>
            <span
              style={{
                opacity: title2,
                transform: `translateY(${interpolate(title2, [0, 1], [40, 0])}px) scale(${interpolate(title2, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-slate-800"
            >
              Console Rules:
            </span>
            <span
              style={{
                opacity: title3,
                transform: `translateY(${interpolate(title3, [0, 1], [40, 0])}px) scale(${interpolate(title3, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-violet-600 underline decoration-violet-300 decoration-wavy decoration-2"
            >
              Deterministic Intent Anchoring.
            </span>
          </div>

          <p className="text-lg text-slate-500 font-sans max-w-4xl leading-relaxed">
            Inside the ArmorIQ Policy Studio, we define attestation limits that anchor tool execution schemas into
            cryptographic Plan Hashes, preventing runtime prompt tampering.
          </p>
        </div>

        {/* Center Stage: Configured Rules Matrix vs Motion Canvas Slot */}
        <div className="grid grid-cols-12 gap-10 items-center my-auto">
          {/* Left Column: 3 Core Policy Rules & Certificate (Span 7) */}
          <div
            style={{
              opacity: leftColSpring,
              transform: `translateX(${interpolate(leftColSpring, [0, 1], [-40, 0])}px)`,
            }}
            className="col-span-7 space-y-5"
          >
            {/* Rules Matrix */}
            <div className="rounded-3xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-slate-200/90 p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Sliders className="h-5 w-5 text-slate-700" />
                  <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                    POLICY STUDIO RULES DEFINITION
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-mono font-bold border border-violet-200">
                  tools.armoriq.ai
                </span>
              </div>

              <div className="space-y-3 font-mono">
                {/* Rule 1: Spend Limit */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Rule 1: spend_limit_ceiling ($50.00 USD)
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      ESCROW GATE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <span className="text-emerald-700 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      Allowed: Micro-refunds &lt;= $50.00
                    </span>
                    <span className="text-rose-700 flex items-center gap-2 font-semibold">
                      <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      Blocked: Autonomous wire transfers &gt; $50.00
                    </span>
                  </div>
                </div>

                {/* Rule 2: Whitelist CRM */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Rule 2: vendor_crm_whitelist
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                      BENEFICIARY
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <span className="text-emerald-700 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      Allowed: Verified vendor allowlist
                    </span>
                    <span className="text-rose-700 flex items-center gap-2 font-semibold">
                      <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      Blocked: Unvetted offshore transit accounts
                    </span>
                  </div>
                </div>

                {/* Rule 3: Intent Anchoring */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Rule 3: plan_hash_attestation
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                      RFC 8785 HASH
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <span className="text-emerald-700 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      SHA-256 Plan Hash matching spec
                    </span>
                    <span className="text-rose-700 flex items-center gap-2 font-semibold">
                      <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      Prevents runtime parameter tampering
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Certificate Card */}
            <div
              style={{
                opacity: certSpring,
                transform: `scale(${interpolate(certSpring, [0, 1], [0.95, 1])})`,
              }}
              className="p-5 rounded-3xl bg-slate-900 text-white shadow-2xl flex items-center justify-between font-mono text-xs border border-slate-800"
            >
              <div className="flex items-center gap-4">
                <Award className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold">
                    IMMUTABLE CRYPTOGRAPHIC AUDIT CERTIFICATE
                  </span>
                  <span className="text-emerald-300 font-bold text-sm">
                    Receipt rcpt_5b521f1f (Merkle Root Verified)
                  </span>
                </div>
              </div>
              <span className="text-[11px] px-3.5 py-1.5 rounded-full bg-slate-800 text-cyan-300 border border-white/10 font-bold">
                OFFLINE INDEPENDENT PROOF
              </span>
            </div>
          </div>

          {/* Right Column: Studio Motion Canvas Display Mockup (Span 5) */}
          <div
            style={{
              opacity: canvasSlotSpring,
              transform: `translateX(${interpolate(canvasSlotSpring, [0, 1], [40, 0])}px)`,
            }}
            className="col-span-5"
          >
            <MotionCanvasSlot
              slotId="slot_03_armoriq_console"
              title="ArmorIQ Policy Studio Console"
              subtitle="Drop your live screen recording of tools.armoriq.ai showing active policy definitions and attestation receipts."
              badge="CANVAS SLOT 3"
              accentColor="violet"
              className="h-[380px]"
            />
          </div>
        </div>

        {/* Bottom Floating Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>ArmorIQ SDK Pro Integration : Staging &amp; Production API</span>
          <span>Independent Offline Cryptographic Receipt Verification</span>
          <span>https://tools.armoriq.ai</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
