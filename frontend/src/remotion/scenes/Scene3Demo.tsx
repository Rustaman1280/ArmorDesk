import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Play, CheckCircle2, Lock, FileCheck, DollarSign, Clock, ShieldCheck } from "lucide-react";
import { MotionCanvasSlot } from "../components/MotionCanvasSlot";

export function Scene3Demo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Camera Scale & Drift
  const cameraScale = interpolate(frame, [0, 450, 900, 1350], [1.05, 1.0, 1.03, 1.0], {
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

  // 3. Staggered Scenarios
  const scenarioASpring = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.8 } });
  const scenarioBSpring = spring({ frame: frame - 90, fps, config: { damping: 10, mass: 0.7 } });
  const canvasSlotSpring = spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.8 } });

  // 4. Counting Numbers Animation
  const countAmountA = interpolate(frame, [45, 95], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const countAmountB = interpolate(frame, [95, 170], [0, 8000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Escrow Vault Drop Animation
  const vaultDrop = spring({ frame: frame - 120, fps, config: { damping: 9, mass: 0.6 } });

  // 6. Floating Ambient Glow Orbs
  const orb1Y = Math.sin(frame * 0.04) * 35;
  const orb2X = Math.cos(frame * 0.04) * 35;

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
        className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-cyan-200/35 filter blur-[130px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -right-40 w-[650px] h-[650px] rounded-full bg-amber-200/35 filter blur-[140px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene3_demo.mp3")} />

      {/* FIXED 1920x1080 CONTENT CONTAINER */}
      <div style={{ width: 1920, height: 1080, padding: 80 }} className="flex flex-col justify-between relative z-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs font-extrabold tracking-widest flex items-center gap-2.5 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-ping" />
              <span>03 / LIVE END-TO-END DEMO</span>
            </div>
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              DUAL-CONTROL ESCROW INTERCEPTION RUNTIME
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-bold">
            <Play className="h-4 w-4 text-cyan-500 fill-current" />
            <span>SUB-SECOND TELEMETRY</span>
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
              Deterministic
            </span>
            <span
              style={{
                opacity: title2,
                transform: `translateY(${interpolate(title2, [0, 1], [40, 0])}px) scale(${interpolate(title2, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-slate-800"
            >
              Escrow
            </span>
            <span
              style={{
                opacity: title3,
                transform: `translateY(${interpolate(title3, [0, 1], [40, 0])}px) scale(${interpolate(title3, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-cyan-600 underline decoration-cyan-300 decoration-wavy decoration-2"
            >
              In Real-Time Action.
            </span>
          </div>

          <p className="text-lg text-slate-500 font-sans max-w-4xl leading-relaxed">
            Low-risk micro-refunds pass autonomously within 14 milliseconds. Any transaction exceeding the $50
            policy ceiling is frozen in milliseconds awaiting managerial approval.
          </p>
        </div>

        {/* Center Stage: The Live Comparison Matrix vs Motion Canvas Slot */}
        <div className="grid grid-cols-12 gap-10 items-center my-auto">
          {/* Left Column: Live Scenarios Comparison (Span 7) */}
          <div className="col-span-7 space-y-6">
            {/* Scenario A: Allowed Micro-Refund */}
            <div
              style={{
                opacity: scenarioASpring,
                transform: `translateX(${interpolate(scenarioASpring, [0, 1], [-40, 0])}px)`,
              }}
              className="rounded-3xl bg-white shadow-[0_25px_60px_rgba(16,185,129,0.06)] border border-emerald-200/90 p-7 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                    SCENARIO A : LOW-RISK SLA REFUND
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                  14ms PASSTHROUGH ALLOWED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 block font-semibold">TOOL</span>
                  <span className="text-sm font-bold text-slate-900">bank.refund</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 block font-semibold">AMOUNT</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    ${countAmountA.toFixed(2)} USD
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 block font-semibold">POLICY CHECK</span>
                  <span className="text-sm font-bold text-slate-700">&lt;= $50 Ceiling (Pass)</span>
                </div>
              </div>
            </div>

            {/* Scenario B: High-Risk Wire Transfer Intercepted in Escrow */}
            <div
              style={{
                opacity: scenarioBSpring,
                transform: `translateX(${interpolate(scenarioBSpring, [0, 1], [-40, 0])}px)`,
              }}
              className="rounded-3xl bg-white shadow-[0_30px_70px_rgba(245,158,11,0.1)] border-2 border-amber-300 p-7 space-y-4 relative overflow-hidden"
            >
              {/* Vault Cage Drop Bar */}
              <div
                style={{
                  transform: `scaleY(${interpolate(vaultDrop, [0, 1], [0, 1])})`,
                  transformOrigin: "top center",
                }}
                className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 shadow-md"
              />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-amber-500" />
                  <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                    SCENARIO B : HIGH-RISK WIRE TRANSFER
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-mono font-extrabold border border-amber-300 animate-pulse">
                  FROZEN IN DUAL-CONTROL ESCROW
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 block font-semibold">TOOL</span>
                  <span className="text-sm font-bold text-slate-900">bank.wire_transfer</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 block font-semibold">AMOUNT</span>
                  <span className="text-lg font-extrabold text-rose-600">
                    ${countAmountB.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[11px] text-slate-400 block font-semibold">POLICY CHECK</span>
                  <span className="text-sm font-bold text-amber-600">&gt; $50 (Escrow Triggered)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs font-mono text-amber-900">
                <span className="font-bold">Approval Inbox: Human Managerial Signature Mandated</span>
                <FileCheck className="h-4 w-4 text-amber-600" />
              </div>
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
              slotId="slot_02_approval_inbox"
              title="Approval Inbox Sign-Off"
              subtitle="Drop your live screen recording showing human manager unlocking frozen escrow funds with cryptographic signature."
              badge="CANVAS SLOT 2"
              accentColor="emerald"
              className="h-[380px]"
            />
          </div>
        </div>

        {/* Bottom Floating Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Dual-Control Escrow Mechanism : Sub-second Wire Interception</span>
          <span>Cryptographic Audit Proof Minting on Release</span>
          <span>https://armordesk.crusts.dev/inbox</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
