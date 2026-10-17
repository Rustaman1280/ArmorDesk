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
  const cameraTranslateY = interpolate(frame, [0, 600, 1200], [8, -5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Kinetic Title Word Staggers
  const title1 = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.6 } });
  const title2 = spring({ frame: frame - 14, fps, config: { damping: 10, mass: 0.6 } });
  const title3 = spring({ frame: frame - 24, fps, config: { damping: 10, mass: 0.6 } });

  // 3. Staggered Core Entrances
  const leftColSpring = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.8 } });
  const centerShieldSpring = spring({ frame: frame - 55, fps, config: { damping: 10, mass: 0.7 } });
  const rightColSpring = spring({ frame: frame - 70, fps, config: { damping: 12, mass: 0.8 } });
  const terminalBarSpring = spring({ frame: frame - 90, fps, config: { damping: 11, mass: 0.7 } });

  // 4. Floating Ambient Glow Orbs
  const orb1Y = Math.cos(frame * 0.035) * 35;
  const orb2X = Math.sin(frame * 0.035) * 40;

  // 5. Data Packet Flow Pulse from Agents to Shield
  const packetOffset = (frame * 3) % 200;

  const agentsList = [
    "Antigravity CLI (agy)",
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
        className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full bg-cyan-200/35 filter blur-[130px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full bg-emerald-200/40 filter blur-[130px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene2_architecture.mp3")} />

      {/* FIXED 1920x1080 CONTENT CONTAINER */}
      <div style={{ width: 1920, height: 1080, padding: 80 }} className="flex flex-col justify-between relative z-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-extrabold tracking-widest flex items-center gap-2.5 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>02 / THE ARCHITECTURE</span>
            </div>
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              ZERO-TRUST MCP TRANSPORT FIREWALL
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-bold">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span>JSON-RPC 2.0 &amp; SSE WIRE INTERCEPTION</span>
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
              Governed
            </span>
            <span
              style={{
                opacity: title2,
                transform: `translateY(${interpolate(title2, [0, 1], [40, 0])}px) scale(${interpolate(title2, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-slate-800"
            >
              MCP Gateway:
            </span>
            <span
              style={{
                opacity: title3,
                transform: `translateY(${interpolate(title3, [0, 1], [40, 0])}px) scale(${interpolate(title3, [0, 1], [0.9, 1])})`,
                display: "inline-block",
              }}
              className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2"
            >
              A Cryptographic Defense Shield.
            </span>
          </div>

          <p className="text-lg text-slate-500 font-sans max-w-4xl leading-relaxed">
            Rather than hoping LLMs follow system instructions, ArmorDesk intercepts tool calls at the transport
            layer, enforcing spend ceilings, vendor allowlists, and cryptographic intent hashes.
          </p>
        </div>

        {/* Center Stage: 3D Shield flanked by 12 Agents and Governed Execution Tools */}
        <div className="grid grid-cols-12 gap-10 items-center my-auto">
          {/* Left Column: 12 Connected AI Agents (Span 4) */}
          <div
            style={{
              opacity: leftColSpring,
              transform: `translateX(${interpolate(leftColSpring, [0, 1], [-40, 0])}px)`,
            }}
            className="col-span-4 rounded-3xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-slate-200/90 p-7 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-slate-700" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                  12 CONNECTED AI AGENTS
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-mono font-bold border border-cyan-200">
                AUTO-DETECTED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              {agentsList.map((ag, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2 text-slate-700 font-medium hover:border-emerald-300 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{ag}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Scan local agents:</span>
              <span className="text-emerald-600 font-bold">npx @crustdev/armordesk mcp detect</span>
            </div>
          </div>

          {/* Center Column: 3D Interactive Shield (Span 4) */}
          <div
            style={{
              opacity: centerShieldSpring,
              transform: `scale(${interpolate(centerShieldSpring, [0, 1], [0.8, 1])})`,
            }}
            className="col-span-4 flex flex-col items-center justify-center text-center relative"
          >
            <div className="relative">
              <Premium3DShield width={380} height={380} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-52 w-52 rounded-full bg-emerald-400/25 filter blur-3xl animate-pulse" />
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <div className="inline-block px-5 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-mono font-extrabold text-emerald-800 shadow-sm">
                ARMORDESK CONTROL PLANE
              </div>
              <p className="text-xs text-slate-500 font-sans max-w-xs leading-relaxed pt-1">
                Zero-Trust Verification, Merkle Tree Proofs, &amp; Dual-Control Escrow
              </p>
            </div>
          </div>

          {/* Right Column: Governed Tool Execution Perimeter (Span 4) */}
          <div
            style={{
              opacity: rightColSpring,
              transform: `translateX(${interpolate(rightColSpring, [0, 1], [40, 0])}px)`,
            }}
            className="col-span-4 rounded-3xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-slate-200/90 p-7 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Server className="h-5 w-5 text-slate-700" />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                  GOVERNED TOOL PERIMETER
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                ENFORCED
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {[
                { tool: "bank.wire_transfer", policy: "Amount > $50 freezes in Escrow", tag: "FINANCIAL" },
                { tool: "bank.refund", policy: "Amount <= $50 auto-pass SLA credit", tag: "AUTONOMOUS" },
                { tool: "crm.verify_vendor", policy: "Beneficiary whitelist matching", tag: "ALLOWLIST" },
                { tool: "files.parse_invoice", policy: "Sanitizes malicious prompt injections", tag: "PARSER" },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.tool}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">{item.policy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Single-Command Onboarding Bar */}
        <div
          style={{
            opacity: terminalBarSpring,
            transform: `translateY(${interpolate(terminalBarSpring, [0, 1], [30, 0])}px)`,
          }}
          className="p-5 rounded-3xl bg-slate-900 text-white shadow-2xl flex items-center justify-between font-mono text-sm border border-slate-800"
        >
          <div className="flex items-center gap-4">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <span className="text-slate-400">One-Line Instant Developer Setup:</span>
            <span className="text-emerald-300 font-bold text-base">
              curl -fsSL https://armordesk.crusts.dev/install.sh | bash
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300 text-xs">
            <KeyRound className="h-4 w-4 text-cyan-400" />
            <span>RFC 8628 Browser OAuth Device Grant</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
