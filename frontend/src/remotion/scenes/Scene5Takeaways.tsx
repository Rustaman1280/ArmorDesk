import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Rocket, ShieldCheck, Milestone, Package, Globe, Code2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function Scene5Takeaways() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Camera Zoom / Pan motion across the 1200 frames (40s)
  const cameraScale = interpolate(frame, [0, 400, 800, 1200], [1.05, 1.0, 1.02, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraTranslateY = interpolate(frame, [0, 600, 1200], [8, -5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Kinetic Title Word Staggers
  const title1 = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.6 } });
  const title2 = spring({ frame: frame - 14, fps, config: { damping: 10, mass: 0.6 } });
  const title3 = spring({ frame: frame - 24, fps, config: { damping: 10, mass: 0.6 } });

  // 3. Staggered Core Content Entrances
  const leftColSpring = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.8 } });
  const rightColSpring = spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.8 } });
  const bottomBarSpring = spring({ frame: frame - 80, fps, config: { damping: 11, mass: 0.7 } });

  // 4. Floating Ambient Glow Orbs
  const orb1Y = Math.cos(frame * 0.035) * 35;
  const orb2X = Math.sin(frame * 0.035) * 40;

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
        className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-emerald-200/40 filter blur-[130px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -right-40 w-[650px] h-[650px] rounded-full bg-cyan-200/40 filter blur-[140px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene5_takeaways.mp3")} />

      {/* FIXED 1920x1080 CONTENT CONTAINER */}
      <div style={{ width: 1920, height: 1080, padding: 80 }} className="flex flex-col justify-between relative z-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-extrabold tracking-widest flex items-center gap-2.5 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>05 / CONCLUSION &amp; ROADMAP</span>
            </div>
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              ARCHITECTURAL TAKEAWAYS &amp; PRODUCTION VISION
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-bold">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>PRODUCTION-READY EXPERIMENTAL FLEET</span>
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
              Protocol-Level
            </span>
            <span
              style={{
                opacity: title2,
                transform: `translateY(${interpolate(title2, [0, 1], [40, 0])}px) scale(${interpolate(title2, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-slate-800"
            >
              Defense
            </span>
            <span
              style={{
                opacity: title3,
                transform: `translateY(${interpolate(title3, [0, 1], [40, 0])}px) scale(${interpolate(title3, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2"
            >
              Over Prompt Engineering.
            </span>
          </div>

          <p className="text-lg text-slate-500 font-sans max-w-4xl leading-relaxed">
            True enterprise safety requires deterministic control at the transport layer. ArmorDesk proves that
            autonomous AI agents can be governed with cryptographic intent verification and dual-control escrows.
          </p>
        </div>

        {/* Center Stage: Takeaways vs Roadmap Milestones */}
        <div className="grid grid-cols-12 gap-10 items-center my-auto">
          {/* Left Column: 3 Architectural Takeaways (Span 6) */}
          <div
            style={{
              opacity: leftColSpring,
              transform: `translateX(${interpolate(leftColSpring, [0, 1], [-40, 0])}px)`,
            }}
            className="col-span-6 rounded-3xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-slate-200/90 p-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                  CORE ARCHITECTURAL TAKEAWAYS
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                LESSONS LEARNED
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: "01",
                  title: "Prompt Engineering Is Not Security",
                  desc: "LLMs will inevitably follow adversarial data if unconstrained. True boundaries must be enforced deterministically at the MCP wire level.",
                },
                {
                  num: "02",
                  title: "Intent Anchoring via Plan Hashes",
                  desc: "Freezing tool execution schemas into RFC 8785 hashes prevents runtime parameter drift and unauthorized recipient changes.",
                },
                {
                  num: "03",
                  title: "Frictionless Developer Adoption",
                  desc: "Security works only when adopted: one-line curl install with RFC 8628 OAuth connects all local coding agents in seconds.",
                },
              ].map((t, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-4">
                  <span className="font-mono font-extrabold text-sm text-emerald-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
                    {t.num}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-mono font-bold text-slate-900">{t.title}</h4>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: What We Would Build Next (Span 6) */}
          <div
            style={{
              opacity: rightColSpring,
              transform: `translateX(${interpolate(rightColSpring, [0, 1], [40, 0])}px)`,
            }}
            className="col-span-6 rounded-3xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-slate-200/90 p-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Milestone className="h-5 w-5 text-slate-700" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                  WHAT WE WOULD BUILD NEXT (ROADMAP)
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-mono font-bold border border-cyan-200">
                FUTURE HORIZONS
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  phase: "PHASE 2",
                  title: "AWS Nitro Enclave HSM Escrows",
                  desc: "Migrate escrow holding logic into Hardware Security Modules for cryptographic memory-level isolation against root compromises.",
                },
                {
                  phase: "PHASE 3",
                  title: "Multi-Agent Consensus Threshold Voting",
                  desc: "Require m-of-n independent agent cryptographic signatures before executing high-value treasury disbursements.",
                },
                {
                  phase: "PHASE 4",
                  title: "LangGraph, CrewAI & AutoGen Middleware",
                  desc: "Publish turnkey Python middleware packages so multi-agent framework developers gain zero-trust governance out of the box.",
                },
              ].map((r, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-slate-900">{r.title}</span>
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white text-cyan-700 border border-slate-200 font-extrabold shadow-sm">
                      {r.phase}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Links & Resources (3 Wide Cards) */}
        <div
          style={{
            opacity: bottomBarSpring,
            transform: `translateY(${interpolate(bottomBarSpring, [0, 1], [30, 0])}px)`,
          }}
          className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6"
        >
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/90 flex items-center gap-4">
            <Globe className="h-6 w-6 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">LIVE PLATFORM</span>
              <span className="text-sm font-mono font-bold text-slate-900 truncate block">
                https://armordesk.crusts.dev
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/90 flex items-center gap-4">
            <Package className="h-6 w-6 text-cyan-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">OFFICIAL NPM PACKAGE</span>
              <span className="text-sm font-mono font-bold text-slate-900 truncate block">
                @crustdev/armordesk (v1.0.6)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/90 flex items-center gap-4">
            <Code2 className="h-6 w-6 text-slate-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">OPEN SOURCE CODEBASE</span>
              <span className="text-sm font-mono font-bold text-slate-900 truncate block">
                Rustaman1280/ArmorDesk
              </span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
