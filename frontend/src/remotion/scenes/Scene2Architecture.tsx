import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { Cpu, CheckCircle2, Server, KeyRound, Terminal, Zap, ShieldCheck } from "lucide-react";
import { Premium3DShield } from "../components/Premium3DShield";

export function Scene2Architecture() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Camera Zoom / Pan motion across 1200 frames (40s)
  const cameraScale = interpolate(frame, [0, 400, 800, 1200], [1.05, 1.0, 1.02, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Beat 1: Kinetic Opening (Frames 0 - 280)
  const beat1Exit = interpolate(frame, [230, 280], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word1 = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.6 } });
  const word2 = spring({ frame: frame - 16, fps, config: { damping: 10, mass: 0.6 } });

  // 3. Beat 2: 3D Shield & 12 Orbiting Agents (Frames 250 - 780)
  const beat2Entrance = spring({ frame: frame - 250, fps, config: { damping: 11, mass: 0.7 } });
  const beat2Exit = interpolate(frame, [720, 780], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Beat 3: Single Command & OAuth Popup (Frames 750 - 1200)
  const beat3Entrance = spring({ frame: frame - 750, fps, config: { damping: 11, mass: 0.7 } });

  // Floating background ambient light spheres
  const orb1Y = Math.cos(frame * 0.035) * 35;
  const orb2X = Math.sin(frame * 0.035) * 40;

  const agentsList = [
    "Antigravity (agy)",
    "OpenCode CLI",
    "OpenAI Codex",
    "Hermes Agent",
    "Claude Desktop",
    "Cursor IDE",
    "Windsurf IDE",
    "Cline (VS Code)",
    "Roo Code",
    "Continue.dev",
    "Zed IDE",
    "OpenClaw",
  ];

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
        className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full bg-cyan-200/35 filter blur-[130px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full bg-emerald-200/40 filter blur-[130px] pointer-events-none"
      />

      {/* BEAT 1: KINETIC HERO TITLE (FRAMES 0 - 280) */}
      {frame < 290 && (
        <div
          style={{ opacity: beat1Exit }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-20 z-20"
        >
          <div className="px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-sm font-extrabold tracking-widest uppercase mb-6 shadow-sm flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <span>02 / THE ARCHITECTURAL DEFENSE</span>
          </div>

          <div className="space-y-4 max-w-5xl">
            <h1 className="text-8xl font-black font-mono tracking-tight text-slate-900 uppercase leading-none">
              <span
                style={{
                  opacity: word1,
                  transform: `translateY(${interpolate(word1, [0, 1], [50, 0])}px)`,
                  display: "inline-block",
                  marginRight: "1.5rem",
                }}
              >
                Enter
              </span>
              <span
                style={{
                  opacity: word1,
                  transform: `translateY(${interpolate(word1, [0, 1], [50, 0])}px)`,
                  display: "inline-block",
                }}
                className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2"
              >
                ArmorDesk!
              </span>
            </h1>

            <div
              style={{
                opacity: word2,
                transform: `scale(${interpolate(word2, [0, 1], [0.85, 1])}) translateY(${interpolate(word2, [0, 1], [40, 0])}px)`,
              }}
              className="text-6xl font-black font-mono text-slate-800 uppercase tracking-tight"
            >
              The Governed MCP Gateway.
            </div>

            <p className="text-2xl text-slate-500 font-sans pt-6 max-w-3xl mx-auto leading-relaxed">
              A zero-trust cryptographic firewall operating between autonomous coding agents and financial tools at
              the JSON-RPC transport wire level.
            </p>
          </div>
        </div>
      )}

      {/* BEAT 2: 3D SHIELD WITH 12 ORBITING AGENTS ONE BY ONE (FRAMES 260 - 780) */}
      {frame >= 250 && frame < 790 && (
        <div
          style={{
            opacity: interpolate(beat2Entrance, [0, 1], [0, 1]) * beat2Exit,
            transform: `scale(${interpolate(beat2Entrance, [0, 1], [0.92, 1])})`,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-16 z-20"
        >
          {/* Section Header Tag */}
          <div className="text-center mb-4">
            <span className="px-4 py-1 rounded-full bg-cyan-50 text-cyan-700 font-mono text-xs font-bold border border-cyan-200">
              ZERO-TRUST TRANSPORT PERIMETER : 12 AGENTS CONNECTED
            </span>
          </div>

          <div style={{ width: 1500, height: 680 }} className="relative flex items-center justify-center">
            {/* Center 3D Shield */}
            <div className="relative z-10 flex flex-col items-center">
              <Premium3DShield width={400} height={400} />
              <div className="mt-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-mono font-black text-emerald-800 shadow-md">
                ARMORDESK GATEWAY FIREWALL
              </div>
            </div>

            {/* 12 Orbiting Agent Pills Appearing Sequentially! */}
            {agentsList.map((ag, i) => {
              const angle = (i / agentsList.length) * (Math.PI * 2) + frame * 0.008;
              const radiusX = 640;
              const radiusY = 280;
              const posX = Math.cos(angle) * radiusX;
              const posY = Math.sin(angle) * radiusY;

              // Staggered entrance for each pill
              const pillSpring = spring({
                frame: frame - 280 - i * 15,
                fps,
                config: { damping: 10, mass: 0.5 },
              });

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    transform: `translate(${posX}px, ${posY}px) scale(${interpolate(pillSpring, [0, 1], [0, 1])})`,
                    opacity: pillSpring,
                  }}
                  className="px-5 py-3 rounded-2xl bg-white shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-slate-200/90 flex items-center gap-2.5 font-mono text-xs font-bold text-slate-800 z-20"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{ag}</span>
                </div>
              );
            })}
          </div>

          <p className="text-sm font-mono text-slate-400 mt-2">
            Protocol Interceptor: Auto-injected via RFC 8628 Device Authorization Grant
          </p>
        </div>
      )}

      {/* BEAT 3: SINGLE COMMAND & OAUTH MODAL IN CENTER STAGE (FRAMES 750 - 1200) */}
      {frame >= 740 && (
        <div
          style={{
            opacity: beat3Entrance,
            transform: `scale(${interpolate(beat3Entrance, [0, 1], [0.92, 1])}) translateY(${interpolate(beat3Entrance, [0, 1], [40, 0])}px)`,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-20 z-20 text-center space-y-8"
        >
          <div className="space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-extrabold tracking-widest uppercase border border-emerald-200">
              ONE-LINE INSTANT ONBOARDING
            </span>
            <h2 className="text-6xl font-black font-mono text-slate-900 uppercase tracking-tight">
              Instant Fleet Authentication
            </h2>
            <p className="text-xl text-slate-500 font-sans max-w-2xl mx-auto">
              Developers run one simple command. The browser opens for OAuth approval, automatically configuring all
              local AI agent environments.
            </p>
          </div>

          {/* Huge Center Stage Command Bar */}
          <div
            style={{ width: 1100 }}
            className="p-8 rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800 flex items-center justify-between font-mono"
          >
            <div className="flex items-center gap-4 text-left">
              <Terminal className="h-8 w-8 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block mb-1">TERMINAL COMMAND:</span>
                <span className="text-2xl font-black text-emerald-300">
                  curl -fsSL https://armordesk.crusts.dev/install.sh | bash
                </span>
              </div>
            </div>

            <div className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs text-cyan-300 font-bold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-cyan-400" />
              <span>RFC 8628 OAUTH</span>
            </div>
          </div>

          {/* 3 Steps summary pills */}
          <div style={{ width: 1100 }} className="grid grid-cols-3 gap-6 text-left font-mono">
            <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 space-y-1">
              <span className="text-[10px] text-emerald-600 font-bold block">STEP 01</span>
              <div className="text-sm font-bold text-slate-900">Run cURL Installer</div>
              <p className="text-xs text-slate-500 font-sans">Fetches verified SDK &amp; probes gateway</p>
            </div>
            <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 space-y-1">
              <span className="text-[10px] text-cyan-600 font-bold block">STEP 02</span>
              <div className="text-sm font-bold text-slate-900">Authorize in Browser</div>
              <p className="text-xs text-slate-500 font-sans">Single click at /device securely links identity</p>
            </div>
            <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 space-y-1">
              <span className="text-[10px] text-violet-600 font-bold block">STEP 03</span>
              <div className="text-sm font-bold text-slate-900">Auto-Detect &amp; Protect</div>
              <p className="text-xs text-slate-500 font-sans">12 local agents injected automatically</p>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
