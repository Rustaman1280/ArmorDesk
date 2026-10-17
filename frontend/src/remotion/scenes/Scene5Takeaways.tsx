import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Rocket, ShieldCheck, Milestone, Package, Globe, Code2, Sparkles, CheckCircle2 } from "lucide-react";

export function Scene5Takeaways() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring1 = spring({ frame: frame - 5, fps, config: { damping: 11, mass: 0.7 } });
  const titleSpring2 = spring({ frame: frame - 16, fps, config: { damping: 11, mass: 0.7 } });
  const gridSpring = spring({ frame: frame - 28, fps, config: { damping: 12, mass: 0.8 } });
  const bottomSpring = spring({ frame: frame - 42, fps, config: { damping: 12, mass: 0.8 } });

  const orb1Y = Math.cos(frame * 0.035) * 20;
  const orb2X = Math.sin(frame * 0.035) * 22;

  return (
    <AbsoluteFill className="bg-[#FAFAFC] text-slate-900 p-16 flex flex-col justify-between font-sans overflow-hidden select-none">
      {/* Background Soft Ambient Light Spheres (Apple/Linear Studio Style) */}
      <div
        style={{ transform: `translateY(${orb1Y}px)` }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 filter blur-[95px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-cyan-200/40 filter blur-[95px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene5_takeaways.mp3")} />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-mono text-xs font-bold tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>05 / CONCLUSION &amp; ROADMAP</span>
          </div>
          <span className="text-xs font-mono text-slate-400">ARCHITECTURAL TAKEAWAYS</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          <span>PRODUCTION-READY PROTOTYPE</span>
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
          Protocol-Level Defense
        </div>
        <div
          style={{
            opacity: titleSpring2,
            transform: `translateY(${interpolate(titleSpring2, [0, 1], [30, 0])}px) scale(${interpolate(titleSpring2, [0, 1], [0.96, 1])})`,
          }}
          className="text-5xl font-black tracking-tight text-emerald-600 font-mono uppercase flex items-center gap-4"
        >
          <span>Over Prompt Engineering.</span>
          <span className="text-sm font-sans font-normal text-slate-500 normal-case px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200">
            True enterprise safety requires deterministic control at the transport layer
          </span>
        </div>
      </div>

      {/* Main Kinetic Content Row: Takeaways vs What We'd Build Next */}
      <div
        style={{
          opacity: gridSpring,
          transform: `translateY(${interpolate(gridSpring, [0, 1], [40, 0])}px)`,
        }}
        className="relative z-10 grid grid-cols-12 gap-8 items-center my-auto"
      >
        {/* Left Column: 3 Architectural Takeaways (Span 6) */}
        <div className="col-span-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                CORE ARCHITECTURAL TAKEAWAYS
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
              LESSONS
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                num: "01",
                title: "Prompt Engineering Is Not Security",
                desc: "LLMs will inevitably follow adversarial data if unconstrained. True boundaries must be enforced at the MCP wire level.",
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
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <span className="font-mono font-bold text-xs text-emerald-600 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
                  {t.num}
                </span>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs font-mono font-bold text-slate-900">{t.title}</h4>
                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: What We Would Build Next (Span 6) */}
        <div className="col-span-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Milestone className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                WHAT WE WOULD BUILD NEXT (ROADMAP)
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-mono font-bold border border-cyan-200">
              ROADMAP
            </span>
          </div>

          <div className="space-y-3">
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
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">{r.title}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white text-cyan-700 border border-slate-200 font-bold">
                    {r.phase}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar: Links & Resources */}
      <div
        style={{
          opacity: bottomSpring,
          transform: `translateY(${interpolate(bottomSpring, [0, 1], [30, 0])}px)`,
        }}
        className="relative z-10 grid grid-cols-3 gap-5 pt-4 border-t border-slate-200/80"
      >
        <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center gap-3">
          <Globe className="h-4 w-4 text-emerald-600" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-400 block">LIVE PLATFORM</span>
            <span className="text-xs font-mono font-bold text-slate-900 truncate block">
              https://armordesk.crusts.dev
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center gap-3">
          <Package className="h-4 w-4 text-cyan-600" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-400 block">OFFICIAL NPM PACKAGE</span>
            <span className="text-xs font-mono font-bold text-slate-900 truncate block">
              @crustdev/armordesk (v1.0.6)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center gap-3">
          <Code2 className="h-4 w-4 text-slate-700" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-400 block">OPEN SOURCE CODEBASE</span>
            <span className="text-xs font-mono font-bold text-slate-900 truncate block">
              Rustaman1280/ArmorDesk
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
