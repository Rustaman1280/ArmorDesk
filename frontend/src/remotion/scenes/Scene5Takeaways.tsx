import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Rocket, ShieldCheck, Milestone, Package, Globe, Code2, Sparkles } from "lucide-react";

export function Scene5Takeaways() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });
  const takeawaysSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const roadmapSpring = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const linksSpring = spring({ frame: frame - 45, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill className="bg-[#07080B] text-white p-16 flex flex-col justify-between font-sans overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene5_takeaways.mp3")} />

      {/* Header Bar */}
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
        }}
        className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              CHAPTER 05 : TAKEAWAYS &amp; FUTURE ROADMAP
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">
              Governing the Autonomous Agent Economy
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>PRODUCTION-READY EXPERIMENTAL PROTOTYPE</span>
        </div>
      </div>

      {/* Main Grid: Takeaways vs What We'd Build Next */}
      <div className="relative z-10 grid grid-cols-12 gap-8 my-auto items-stretch">
        {/* Left Column: 3 Core Takeaways (Span 6) */}
        <div
          style={{
            opacity: takeawaysSpring,
            transform: `translateY(${interpolate(takeawaysSpring, [0, 1], [30, 0])}px)`,
          }}
          className="col-span-6 rounded-2xl border border-white/10 bg-[#0E0F14]/90 p-6 space-y-4 shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Key Architectural Takeaways
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              LESSONS LEARNED
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "1. Prompt Engineering is Not Security",
                body: "LLMs will inevitably follow adversarial data if unconstrained. True security boundaries must be enforced deterministically at the MCP protocol gateway.",
              },
              {
                title: "2. Intent Anchoring via RFC 8785 Plan Hashes",
                body: "Freezing tool execution schemas into canonical cryptographic hashes prevents runtime parameter drift and unauthorized beneficiary hijacking.",
              },
              {
                title: "3. Frictionless Enterprise Adoption",
                body: "Security mechanisms succeed only when developers embrace them: one-line curl install with RFC 8628 OAuth connects all local agents in seconds.",
              },
            ].map((t, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-400">{t.title}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: What We'd Build Next (Span 6) */}
        <div
          style={{
            opacity: roadmapSpring,
            transform: `translateY(${interpolate(roadmapSpring, [0, 1], [30, 0])}px)`,
          }}
          className="col-span-6 rounded-2xl border border-white/10 bg-[#0E0F14]/90 p-6 space-y-4 shadow-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Milestone className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                What We Would Build Next (Roadmap)
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              FUTURE ROADMAP
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Hardware Security Module (HSM) Enclaves",
                tag: "PHASE 2",
                desc: "Migrate escrow holding logic into AWS Nitro Enclaves to guarantee memory-level isolation even against root host compromises.",
              },
              {
                title: "Multi-Agent Consensus Threshold Voting",
                tag: "PHASE 3",
                desc: "Require m-of-n independent agent cryptographic signatures before executing wire transfers exceeding $100,000 USD.",
              },
              {
                title: "LangGraph, CrewAI & AutoGen Middleware",
                tag: "PHASE 4",
                desc: "Publish turnkey Python middleware packages so enterprise multi-agent frameworks connect to ArmorDesk out of the box.",
              },
            ].map((r, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">{r.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                    {r.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Ecosystem & Resource Links */}
      <div
        style={{
          opacity: linksSpring,
        }}
        className="relative z-10 grid grid-cols-3 gap-4 pt-4 border-t border-white/10"
      >
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
          <Globe className="h-4 w-4 text-emerald-400" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-500 block">LIVE PLATFORM</span>
            <span className="text-xs font-mono font-bold text-white truncate block">
              https://armordesk.crusts.dev
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
          <Package className="h-4 w-4 text-cyan-400" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-500 block">OFFICIAL NPM PACKAGE</span>
            <span className="text-xs font-mono font-bold text-white truncate block">
              @crustdev/armordesk (v1.0.6)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
          <Code2 className="h-4 w-4 text-slate-300" />
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-500 block">OPEN SOURCE CODEBASE</span>
            <span className="text-xs font-mono font-bold text-white truncate block">
              Rustaman1280/ArmorDesk
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
