import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { Sliders, CheckCircle2, XCircle, Award, ExternalLink, Hash, Lock, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export function Scene4ArmorIQ() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera Drift
  const cameraScale = interpolate(frame, [0, 600, 1200], [1.03, 1.0, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Modal 1: Spend Limit (Frames 0 - 240)
  const modal1In = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.6 } });
  const modal1Out = interpolate(frame, [200, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Modal 2: Vendor Whitelist (Frames 230 - 450)
  const modal2In = spring({ frame: frame - 230, fps, config: { damping: 10, mass: 0.6 } });
  const modal2Out = interpolate(frame, [410, 450], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Modal 3: Intent Anchoring (Frames 440 - 660)
  const modal3In = spring({ frame: frame - 440, fps, config: { damping: 10, mass: 0.6 } });
  const modal3Out = interpolate(frame, [620, 660], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 2: Real ARMOR Tools Dashboard Screenshot (Frames 650 - 1200)
  const dashboardEntrance = spring({ frame: frame - 650, fps, config: { damping: 11, mass: 0.7 } });
  const dashboardZoom = interpolate(frame, [650, 900, 1200], [1.0, 1.12, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating background glow spotlights
  const orb1Y = Math.sin(frame * 0.035) * 35;
  const orb2X = Math.cos(frame * 0.035) * 40;

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
      {/* Dynamic Background Grid Pattern */}
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

      {/* Top Floating Scene Tag */}
      <div className="absolute top-8 left-16 z-30 flex items-center gap-3">
        <div className="px-5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 font-mono text-xs font-bold tracking-widest flex items-center gap-2.5 shadow-sm">
          <Sliders className="h-3.5 w-3.5 text-violet-600" />
          <span>04 / ARMORIQL POLICY STUDIO : MODAL BEATS &amp; DASHBOARD</span>
        </div>
      </div>

      {/* MODAL POPUP 1: SPEND LIMIT CEILING (FRAMES 0 - 240) */}
      {frame < 250 && (
        <div
          style={{
            opacity: interpolate(modal1In, [0, 1], [0, 1]) * modal1Out,
            transform: `scale(${interpolate(modal1In, [0, 1], [0.85, 1])}) translateY(${interpolate(modal1In, [0, 1], [40, 0])}px)`,
          }}
          className="z-20 text-center space-y-6"
        >
          <div className="space-y-2">
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
              POLICY RULE 01
            </span>
            <h2 className="text-6xl font-black font-mono text-slate-900 uppercase tracking-tight">
              Spend Limit Ceiling ($50.00 USD)
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans">
              Autonomous execution allowed ONLY for micro-actions. All wire transfers &gt; $50 freeze in escrow.
            </p>
          </div>

          <div
            style={{ width: 900 }}
            className="p-8 rounded-3xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)] border-2 border-emerald-400 mx-auto grid grid-cols-2 gap-6 text-left font-mono"
          >
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Micro-Refunds (&lt;= $50)</span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Passes automatically in 14ms without manual intervention.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <XCircle className="h-5 w-5 text-rose-600" />
                <span>Large Disbursements (&gt; $50)</span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Instantly frozen into Dual-Control Escrow awaiting human approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP 2: VENDOR ALLOWLIST CHECK (FRAMES 230 - 450) */}
      {frame >= 225 && frame < 460 && (
        <div
          style={{
            opacity: interpolate(modal2In, [0, 1], [0, 1]) * modal2Out,
            transform: `scale(${interpolate(modal2In, [0, 1], [0.85, 1])}) translateY(${interpolate(modal2In, [0, 1], [40, 0])}px)`,
          }}
          className="z-20 text-center space-y-6"
        >
          <div className="space-y-2">
            <span className="px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-700 font-mono text-xs font-bold border border-cyan-200">
              POLICY RULE 02
            </span>
            <h2 className="text-6xl font-black font-mono text-slate-900 uppercase tracking-tight">
              Vendor CRM Allowlist Check
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans">
              All payment beneficiaries must match verified corporate supplier records.
            </p>
          </div>

          <div
            style={{ width: 900 }}
            className="p-8 rounded-3xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)] border-2 border-cyan-400 mx-auto grid grid-cols-2 gap-6 text-left font-mono"
          >
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Allowlisted CRM Vendors</span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Matching verified routing accounts proceed to policy evaluation.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <XCircle className="h-5 w-5 text-rose-600" />
                <span>Rogue Injected Accounts</span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Unvetted transit routing numbers are intercepted and blocked immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP 3: INTENT ANCHORING & MERKLE PROOF (FRAMES 440 - 660) */}
      {frame >= 435 && frame < 670 && (
        <div
          style={{
            opacity: interpolate(modal3In, [0, 1], [0, 1]) * modal3Out,
            transform: `scale(${interpolate(modal3In, [0, 1], [0.85, 1])}) translateY(${interpolate(modal3In, [0, 1], [40, 0])}px)`,
          }}
          className="z-20 text-center space-y-6"
        >
          <div className="space-y-2">
            <span className="px-4 py-1.5 rounded-full bg-violet-50 text-violet-700 font-mono text-xs font-bold border border-violet-200">
              POLICY RULE 03
            </span>
            <h2 className="text-6xl font-black font-mono text-slate-900 uppercase tracking-tight">
              Cryptographic Intent Anchoring
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-sans">
              RFC 8785 canonical JSON produces a SHA-256 Plan Hash and Merkle proof.
            </p>
          </div>

          <div
            style={{ width: 950 }}
            className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 mx-auto space-y-4 text-left font-mono"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>VERIFIABLE AUDIT CERTIFICATE : rcpt_5b521f1f</span>
              </span>
              <span className="text-[11px] text-cyan-300 px-3 py-1 rounded-full bg-slate-800 border border-white/10 font-bold">
                OFFLINE PROOF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                <span className="text-slate-400 block">SHA-256 PLAN HASH:</span>
                <span className="text-emerald-300 font-bold block truncate">
                  7f9b8a1c3d2e...4c1e
                </span>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                <span className="text-slate-400 block">MERKLE TREE ROOT:</span>
                <span className="text-cyan-300 font-bold block truncate">
                  d4e5f6a7b8c9...9a8b
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BEAT 2: ACTUAL LIVE ARMOR TOOLS DASHBOARD SCREENSHOT DISPLAY (FRAMES 650 - 1200) */}
      {frame >= 640 && (
        <div
          style={{
            opacity: dashboardEntrance,
            transform: `scale(${interpolate(dashboardEntrance, [0, 1], [0.93, 1])})`,
          }}
          className="z-20 w-full flex flex-col items-center justify-center my-auto"
        >
          {/* High-Tech Apple Style Window Frame displaying User's Real Screenshot */}
          <div
            style={{
              width: 1640,
              height: 840,
            }}
            className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_30px_90px_rgba(0,0,0,0.1)] flex flex-col justify-between relative"
          >
            {/* Window Top Bar */}
            <div className="h-16 px-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
                  <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
                  <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center gap-2 ml-4 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 font-bold shadow-sm">
                  <ExternalLink className="h-3.5 w-3.5 text-violet-600" />
                  <span>tools.armoriq.ai</span>
                  <span className="text-slate-400">/coding-agents</span>
                </div>
              </div>

              {/* Live Metric Badges Floating in Header */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>3.50M Tokens Tracked</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                  OpenCode + Claude Code
                </div>
              </div>
            </div>

            {/* The Actual Dashboard Image with Smooth Zoom/Pan */}
            <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
              <Img
                src={staticFile("images/armortools-dashboard.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `scale(${dashboardZoom})`,
                  transformOrigin: "center 40%",
                  transition: "transform 0.1s linear",
                }}
              />

              {/* Floating Highlight Callout Box over OpenCode Row */}
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 40,
                }}
                className="px-6 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 shadow-2xl text-white font-mono text-xs space-y-1 z-30"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>ARMOR TOOLS LIVE TELEMETRY</span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  Enforcing spend limit ceilings &amp; token telemetry on <strong>OpenCode</strong> (3.14M tokens) &amp;{" "}
                  <strong>Claude Code</strong>.
                </div>
              </div>
            </div>

            {/* Bottom Window Bar */}
            <div className="h-12 px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500 z-20">
              <span>REAL AUDIT CONSOLE : TOOLS.ARMORIQ.AI</span>
              <span className="font-bold text-violet-700">LIVE PRODUCTION CODING AGENT METRICS</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Info Pill */}
      <div className="absolute bottom-6 z-30 px-6 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-mono text-slate-600 flex items-center gap-4">
        <span>Integrated via ArmorIQ SDK Pro</span>
        <span>•</span>
        <span className="text-violet-700 font-bold">tools.armoriq.ai Policy Studio</span>
        <span>•</span>
        <span>Independent offline Merkle verification</span>
      </div>
    </AbsoluteFill>
  );
}
