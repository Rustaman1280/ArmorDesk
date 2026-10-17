import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Rocket, ShieldCheck, Milestone, Package, Globe, Code2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Premium3DShield } from "../components/Premium3DShield";

export function Scene5Takeaways() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Camera Zoom / Pan motion across the 1200 frames (40s)
  const cameraScale = interpolate(frame, [0, 400, 800, 1200], [1.05, 1.0, 1.02, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Beat 1: Kinetic Opening (Frames 0 - 300)
  const beat1Exit = interpolate(frame, [250, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word1 = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.6 } });
  const word2 = spring({ frame: frame - 16, fps, config: { damping: 10, mass: 0.6 } });

  // 3. Beat 2: Roadmap Cards Pop in One by One (Frames 280 - 780)
  const beat2Entrance = spring({ frame: frame - 280, fps, config: { damping: 11, mass: 0.7 } });
  const beat2Exit = interpolate(frame, [720, 780], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const road1 = spring({ frame: frame - 300, fps, config: { damping: 10, mass: 0.6 } });
  const road2 = spring({ frame: frame - 430, fps, config: { damping: 10, mass: 0.6 } });
  const road3 = spring({ frame: frame - 560, fps, config: { damping: 10, mass: 0.6 } });

  // 4. Beat 3: Grand Finale Outro (Frames 750 - 1200)
  const beat3Entrance = spring({ frame: frame - 750, fps, config: { damping: 11, mass: 0.7 } });

  // Floating background ambient spotlights
  const orb1Y = Math.cos(frame * 0.035) * 35;
  const orb2X = Math.sin(frame * 0.035) * 40;

  return (
    <AbsoluteFill
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "#FAFAFC",
        transform: `scale(${cameraScale})`,
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

      {/* BEAT 1: KINETIC STATEMENT (FRAMES 0 - 300) */}
      {frame < 310 && (
        <div
          style={{ opacity: beat1Exit }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-20 z-20"
        >
          <div className="px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-sm font-extrabold tracking-widest uppercase mb-6 shadow-sm flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <span>05 / CORE ARCHITECTURAL TAKEAWAY</span>
          </div>

          <div className="space-y-4 max-w-5xl">
            <h1 className="text-8xl font-black font-mono tracking-tight text-slate-900 uppercase leading-none">
              <span
                style={{
                  opacity: word1,
                  transform: `translateY(${interpolate(word1, [0, 1], [50, 0])}px)`,
                  display: "inline-block",
                }}
              >
                Protocol-Level
              </span>{" "}
              <span
                style={{
                  opacity: word1,
                  transform: `translateY(${interpolate(word1, [0, 1], [50, 0])}px)`,
                  display: "inline-block",
                }}
                className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2"
              >
                Defense
              </span>
            </h1>

            <div
              style={{
                opacity: word2,
                transform: `scale(${interpolate(word2, [0, 1], [0.85, 1])}) translateY(${interpolate(word2, [0, 1], [40, 0])}px)`,
              }}
              className="text-6xl font-black font-mono text-slate-800 uppercase tracking-tight"
            >
              Over Prompt Engineering.
            </div>

            <p className="text-2xl text-slate-500 font-sans pt-6 max-w-3xl mx-auto leading-relaxed">
              Prompt engineering is not security. True enterprise safety requires deterministic control enforced at the
              Model Context Protocol transport wire layer.
            </p>
          </div>
        </div>
      )}

      {/* BEAT 2: WHAT WE WOULD BUILD NEXT (ROADMAP POPUPS ONE BY ONE) (FRAMES 270 - 780) */}
      {frame >= 260 && frame < 790 && (
        <div
          style={{
            opacity: interpolate(beat2Entrance, [0, 1], [0, 1]) * beat2Exit,
            transform: `scale(${interpolate(beat2Entrance, [0, 1], [0.92, 1])})`,
          }}
          className="absolute inset-0 flex flex-col justify-between p-20 z-20"
        >
          <div className="text-center space-y-2">
            <span className="px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-700 font-mono text-xs font-extrabold tracking-widest uppercase border border-cyan-200">
              FUTURE HORIZONS
            </span>
            <h2 className="text-6xl font-black font-mono text-slate-900 uppercase tracking-tight">
              What We Would Build Next
            </h2>
          </div>

          {/* 3 Sequential Roadmap Cards */}
          <div className="grid grid-cols-3 gap-8 my-auto">
            {/* Roadmap 1 */}
            <div
              style={{
                opacity: road1,
                transform: `scale(${interpolate(road1, [0, 1], [0.85, 1])}) translateY(${interpolate(road1, [0, 1], [40, 0])}px)`,
              }}
              className="rounded-3xl bg-white shadow-[0_30px_70px_rgba(0,0,0,0.07)] border-2 border-emerald-400 p-8 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                  PHASE 2
                </span>
                <h3 className="text-2xl font-bold font-mono text-slate-900">
                  AWS Nitro Enclaves HSM Escrows
                </h3>
                <p className="text-sm text-slate-500 font-sans leading-relaxed">
                  Migrate escrow holding logic into Hardware Security Modules for cryptographic memory-level isolation
                  even against root host compromises.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 text-xs font-mono font-bold flex items-center justify-between">
                <span>Hardware Memory Isolation</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
            </div>

            {/* Roadmap 2 */}
            <div
              style={{
                opacity: road2,
                transform: `scale(${interpolate(road2, [0, 1], [0.85, 1])}) translateY(${interpolate(road2, [0, 1], [40, 0])}px)`,
              }}
              className="rounded-3xl bg-white shadow-[0_30px_70px_rgba(0,0,0,0.07)] border-2 border-cyan-400 p-8 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-mono text-xs font-bold border border-cyan-200">
                  PHASE 3
                </span>
                <h3 className="text-2xl font-bold font-mono text-slate-900">
                  Multi-Agent Consensus Threshold Voting
                </h3>
                <p className="text-sm text-slate-500 font-sans leading-relaxed">
                  Require m-of-n independent agent cryptographic signatures before executing high-value corporate treasury
                  disbursements.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 text-xs font-mono font-bold flex items-center justify-between">
                <span>3-of-5 Signature Consensus</span>
                <Milestone className="h-4 w-4 text-cyan-600" />
              </div>
            </div>

            {/* Roadmap 3 */}
            <div
              style={{
                opacity: road3,
                transform: `scale(${interpolate(road3, [0, 1], [0.85, 1])}) translateY(${interpolate(road3, [0, 1], [40, 0])}px)`,
              }}
              className="rounded-3xl bg-white shadow-[0_30px_70px_rgba(0,0,0,0.07)] border-2 border-violet-400 p-8 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 font-mono text-xs font-bold border border-violet-200">
                  PHASE 4
                </span>
                <h3 className="text-2xl font-bold font-mono text-slate-900">
                  LangGraph &amp; CrewAI Middleware
                </h3>
                <p className="text-sm text-slate-500 font-sans leading-relaxed">
                  Publish turnkey Python middleware packages so multi-agent framework developers gain zero-trust
                  governance out of the box.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 text-xs font-mono font-bold flex items-center justify-between">
                <span>Turnkey Python SDK</span>
                <Package className="h-4 w-4 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-slate-400">
            Next: Production Resources &amp; Live Deployment Links
          </div>
        </div>
      )}

      {/* BEAT 3: GRAND FINALE OUTRO STAGE (FRAMES 750 - 1200) */}
      {frame >= 740 && (
        <div
          style={{
            opacity: beat3Entrance,
            transform: `scale(${interpolate(beat3Entrance, [0, 1], [0.92, 1])}) translateY(${interpolate(beat3Entrance, [0, 1], [40, 0])}px)`,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-20 z-20 text-center space-y-8"
        >
          {/* 3D Shield Centerpiece */}
          <div className="relative">
            <Premium3DShield width={300} height={300} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-44 w-44 rounded-full bg-emerald-400/25 filter blur-3xl animate-pulse" />
            </div>
          </div>

          <div className="space-y-3 max-w-4xl">
            <h2 className="text-6xl font-black font-mono text-slate-900 uppercase tracking-tight">
              ArmorDesk: Governed MCP Gateway
            </h2>
            <p className="text-xl text-slate-500 font-sans leading-relaxed">
              Protecting the autonomous agent economy with deterministic protocol-level zero trust.
            </p>
          </div>

          {/* 3 Wide Link Cards */}
          <div style={{ width: 1200 }} className="grid grid-cols-3 gap-6 font-mono text-left">
            <div className="p-6 rounded-3xl bg-white shadow-xl border border-slate-200/90 flex items-center gap-4">
              <Globe className="h-8 w-8 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block font-bold">LIVE PLATFORM</span>
                <span className="text-base font-bold text-slate-900 truncate block">
                  https://armordesk.crusts.dev
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow-xl border border-slate-200/90 flex items-center gap-4">
              <Package className="h-8 w-8 text-cyan-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block font-bold">OFFICIAL NPM PACKAGE</span>
                <span className="text-base font-bold text-slate-900 truncate block">
                  @crustdev/armordesk (v1.0.6)
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow-xl border border-slate-200/90 flex items-center gap-4">
              <Code2 className="h-8 w-8 text-slate-700 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block font-bold">OPEN SOURCE REPO</span>
                <span className="text-base font-bold text-slate-900 truncate block">
                  Rustaman1280/ArmorDesk
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
