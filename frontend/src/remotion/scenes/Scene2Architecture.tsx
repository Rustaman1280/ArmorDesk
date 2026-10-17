import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, Server, Globe2, KeyRound } from "lucide-react";
import { ArmorDesk3DShield } from "../components/ArmorDesk3DShield";

export function Scene2Architecture() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });
  const contentSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const terminalSpring = spring({ frame: frame - 30, fps, config: { damping: 12 } });

  const agentsList = [
    "Antigravity CLI (agy)",
    "OpenCode CLI",
    "OpenAI Codex (vodek)",
    "Hermes Agent",
    "OpenClaw Agent",
    "Claude Desktop",
    "Cursor IDE",
    "Windsurf IDE",
    "Cline (VS Code)",
    "Roo Code",
    "Continue.dev",
    "Zed IDE",
  ];

  return (
    <AbsoluteFill className="bg-[#07080B] text-white p-16 flex flex-col justify-between font-sans overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#06b6d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* Voiceover Audio */}
      <Audio src={staticFile("/voiceover/scene2_architecture.mp3")} />

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
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              CHAPTER 02 : THE SOLUTION ARCHITECTURE
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">
              Governed MCP Gateway & Zero-Trust Firewall
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TRANSPORT LAYER (JSON-RPC 2.0 / SSE)</span>
        </div>
      </div>

      {/* Main Grid: 3 Columns Architecture Flow */}
      <div
        style={{
          opacity: contentSpring,
          transform: `translateY(${interpolate(contentSpring, [0, 1], [30, 0])}px)`,
        }}
        className="relative z-10 grid grid-cols-12 gap-8 my-auto items-center"
      >
        {/* Left Column: 12 Connected AI Agents (Span 4) */}
        <div className="col-span-4 rounded-2xl border border-white/10 bg-[#0E0F14]/90 p-5 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                12 Supported AI Agents
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              AUTO-DETECTED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            {agentsList.map((ag, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-slate-900/60 border border-white/5 flex items-center gap-1.5 text-slate-300"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="truncate">{ag}</span>
              </div>
            ))}
          </div>

          {/* Quickstart Callout */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Scan with CLI:</span>
            <span className="text-cyan-300 font-bold">npx @crustdev/armordesk mcp detect</span>
          </div>
        </div>

        {/* Center Column: 3D Shield & Core Protocol Engine (Span 4) */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center relative">
          <div className="relative">
            <ArmorDesk3DShield width={340} height={340} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-40 w-40 rounded-full bg-emerald-500/10 filter blur-2xl animate-pulse" />
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-300">
              ARMORDESK CONTROL PLANE
            </div>
            <p className="text-xs text-slate-400 font-sans max-w-xs leading-relaxed">
              Deterministic Plan Hash Verification &amp; Dual-Control Escrow Interception
            </p>
          </div>
        </div>

        {/* Right Column: Governed Mission-Critical Tools & Terminal (Span 4) */}
        <div className="col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0E0F14]/90 p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Governed Execution Tools
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                ENFORCED
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { name: "bank.wire_transfer", rule: "Amount > $50 freezes in Escrow", tag: "FINANCIAL" },
                { name: "bank.refund", rule: "Amount <= $50 auto-pass SLA credit", tag: "AUTONOMOUS" },
                { name: "crm.verify_vendor", rule: "Must match verified recipient whitelist", tag: "ALLOWLIST" },
                { name: "files.parse_invoice", rule: "Sanitizes malicious indirect injection", tag: "PARSER" },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-[11px]">{t.name}</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">
                      {t.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{t.rule}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser OAuth Terminal Card */}
          <div
            style={{
              opacity: terminalSpring,
            }}
            className="rounded-2xl border border-cyan-500/30 bg-[#090C12] p-4 space-y-2 shadow-xl"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
              <div className="flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" />
                <span>RFC 8628 Browser OAuth Device Grant</span>
              </div>
              <span>PORT 443 HTTPS</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto bg-black/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-emerald-400">$</span> curl -fsSL https://armordesk.crusts.dev/install.sh | bash
            </pre>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-white/10">
        <span>Zero-Trust Architecture : Model Context Protocol 2024-11-05</span>
        <span>Cryptographic Intent Attestation via ArmorIQ Engine</span>
        <span>https://armordesk.crusts.dev/connect</span>
      </div>
    </AbsoluteFill>
  );
}
