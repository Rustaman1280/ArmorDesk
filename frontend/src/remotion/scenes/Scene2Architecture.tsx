import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, Server, KeyRound, Terminal, Zap } from "lucide-react";
import { Premium3DShield } from "../components/Premium3DShield";

export function Scene2Architecture() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring1 = spring({ frame: frame - 5, fps, config: { damping: 11, mass: 0.7 } });
  const titleSpring2 = spring({ frame: frame - 16, fps, config: { damping: 11, mass: 0.7 } });
  const centerSpring = spring({ frame: frame - 25, fps, config: { damping: 12, mass: 0.8 } });
  const commandSpring = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.8 } });

  const orb1Y = Math.cos(frame * 0.035) * 22;
  const orb2X = Math.sin(frame * 0.035) * 25;

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
    <AbsoluteFill className="bg-[#FAFAFC] text-slate-900 p-16 flex flex-col justify-between font-sans overflow-hidden select-none">
      {/* Background Soft Ambient Light Spheres (Apple/Linear Studio Style) */}
      <div
        style={{ transform: `translateY(${orb1Y}px)` }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-200/40 filter blur-[95px] pointer-events-none"
      />
      <div
        style={{ transform: `translateX(${orb2X}px)` }}
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 filter blur-[95px] pointer-events-none"
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene2_architecture.mp3")} />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-mono text-xs font-bold tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>02 / THE ARCHITECTURE</span>
          </div>
          <span className="text-xs font-mono text-slate-400">ZERO-TRUST TRANSPORT FIREWALL</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-mono text-slate-700 font-semibold">
          <Zap className="h-3.5 w-3.5 text-emerald-500" />
          <span>JSON-RPC 2.0 &amp; SSE WIRE INTERCEPTION</span>
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
          Governed MCP Gateway
        </div>
        <div
          style={{
            opacity: titleSpring2,
            transform: `translateY(${interpolate(titleSpring2, [0, 1], [30, 0])}px) scale(${interpolate(titleSpring2, [0, 1], [0.96, 1])})`,
          }}
          className="text-5xl font-black tracking-tight text-emerald-600 font-mono uppercase flex items-center gap-4"
        >
          <span>A Cryptographic Defense Shield.</span>
          <span className="text-sm font-sans font-normal text-slate-500 normal-case px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200">
            Intercepts tool calls at the wire level before execution
          </span>
        </div>
      </div>

      {/* Main Kinetic Content Row: 12 Agents -> 3D Shield Core -> Governed Tools */}
      <div
        style={{
          opacity: centerSpring,
          transform: `translateY(${interpolate(centerSpring, [0, 1], [40, 0])}px)`,
        }}
        className="relative z-10 grid grid-cols-12 gap-8 items-center my-auto"
      >
        {/* Left Column: 12 Auto-Detected Agents (Span 4) */}
        <div className="col-span-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                12 CONNECTED AI AGENTS
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-mono font-bold border border-cyan-200">
              AUTO-DETECTED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {agentsList.map((ag, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-1.5 text-slate-700 hover:border-emerald-300 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate font-semibold">{ag}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Scan local agents:</span>
            <span className="text-emerald-600 font-bold">npx @crustdev/armordesk mcp detect</span>
          </div>
        </div>

        {/* Center Column: 3D Shield (Span 4) */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <Premium3DShield width={350} height={350} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-48 w-48 rounded-full bg-emerald-300/30 filter blur-3xl" />
            </div>
          </div>
          <div className="mt-1 space-y-0.5">
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-mono font-extrabold text-emerald-800 shadow-sm">
              ARMORDESK CONTROL PLANE
            </div>
            <p className="text-xs text-slate-500 font-sans max-w-xs leading-relaxed pt-1">
              Zero-Trust Verification, Merkle Tree Proofs, &amp; Dual-Control Escrow
            </p>
          </div>
        </div>

        {/* Right Column: Governed Tools & Enforced Execution (Span 4) */}
        <div className="col-span-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                GOVERNED TOOL PERIMETER
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
              ENFORCED
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {[
              { tool: "bank.wire_transfer", policy: "Amount > $50 freezes in Escrow", tag: "FINANCIAL" },
              { tool: "bank.refund", policy: "Amount <= $50 auto-pass SLA credit", tag: "AUTONOMOUS" },
              { tool: "crm.verify_vendor", policy: "Beneficiary whitelist matching", tag: "ALLOWLIST" },
              { tool: "files.parse_invoice", policy: "Sanitizes malicious prompt injections", tag: "PARSER" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-[11px]">{item.tool}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-bold">
                    {item.tag}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans">{item.policy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Command Bar: Single-Command Onboarding */}
      <div
        style={{
          opacity: commandSpring,
          transform: `translateY(${interpolate(commandSpring, [0, 1], [30, 0])}px)`,
        }}
        className="relative z-10 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between font-mono text-xs border border-slate-800"
      >
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-400">One-Line Instant Onboarding:</span>
          <span className="text-emerald-300 font-bold">
            curl -fsSL https://armordesk.crusts.dev/install.sh | bash
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
          <span>RFC 8628 Browser OAuth Device Grant</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
