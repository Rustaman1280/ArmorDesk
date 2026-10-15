"use client";

import React from "react";
import {
  Lightbulb,
  Shield,
  Briefcase,
  Rocket,
  CheckCircle2,
  Lock,
  ArrowRight,
  Cpu,
  Layers,
  Network
} from "lucide-react";

export default function TakeawaysPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-amber-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Executive Takeaways, Architecture Insight & SaaS Vision
          </h1>
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-amber-400 border border-amber-500/20">
            HACKATHON EVALUATION SUMMARY
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Guiding principles, enterprise SaaS positioning, and technical roadmap for the ArmorIQ and Model Context Protocol (MCP) ecosystem.
        </p>
      </div>

      {/* Pillar 1: Core Insight */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">Pillar 1</span>
            <h2 className="text-base font-bold text-white">
              The Core Architectural Insight: Why LLM Guardrails Fail Alone
            </h2>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            Current industry attempts to secure AI agents rely almost entirely on <strong className="text-white">prompt filtering, system prompts, and LLM guardrails</strong> (e.g. asking an LLM to check if another LLM was tricked). This is fundamentally flawed: LLMs inherently treat instructions and data as a single token stream. In an indirect prompt injection attack, an adversarial PDF invoice or email easily hijacks the agent's context.
          </p>

          <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 font-mono text-[11px] text-blue-200">
            <strong>The ArmorDesk Solution:</strong> We move the security perimeter out of the probabilistic model and into the <span className="text-emerald-400">deterministic MCP protocol boundary</span>.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-900">
              <span className="font-semibold text-slate-200 block mb-1">1. Scoped Delegation</span>
              <p className="text-[11px] text-slate-400">
                A sub-agent parsing emails has cryptographic capability grants for reading only. Even when completely hallucinating or hijacked, it physically cannot invoke bank transfers.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-900">
              <span className="font-semibold text-slate-200 block mb-1">2. Verifiable Plan Hashes</span>
              <p className="text-[11px] text-slate-400">
                Orchestrators generate canonical SHA-256 signatures over allowable actions, spend caps, and recipient allowlists before sub-agents execute.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-900">
              <span className="font-semibold text-slate-200 block mb-1">3. Immutable Merkle Proofs</span>
              <p className="text-[11px] text-slate-400">
                Every step is hashed into a Merkle tree, enabling mathematical non-repudiation for audit committees and financial regulators.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar 2: Commercial Ambition */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Pillar 2</span>
            <h2 className="text-base font-bold text-white">
              Commercial Ambition: Enterprise FinOps & DevOps Control Plane
            </h2>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            ArmorDesk is positioned as a standalone B2B SaaS control plane for enterprises deploying multi-agent crews in accounts payable, procurement, customer refund resolution, and infrastructure provisioning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Value Proposition for FinOps & CFOs
              </h3>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Prevents unauthorized payments, wire fraud, and spend limit overruns.</li>
                <li>• Seamless human-in-the-loop Slack & inbox review for transactions &gt; $1,000.</li>
                <li>• Instant audit receipts that eliminate manual quarterly compliance preparation.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Business & Pricing Model
              </h3>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• <strong className="text-slate-200">Platform Subscription:</strong> $999/month base per enterprise tenant.</li>
                <li>• <strong className="text-slate-200">Supervised Seat Fee:</strong> $49/month per deployed autonomous agent.</li>
                <li>• <strong className="text-slate-200">Usage Metering:</strong> $0.005 per verified Merkle receipt & cryptographic audit proof.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar 3: Roadmap & Next Steps */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">Pillar 3</span>
            <h2 className="text-base font-bold text-white">
              Technical Roadmap & Next Steps
            </h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-purple-400 font-bold">PHASE 1 (CURRENT)</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.2 rounded font-mono">
                COMPLETED
              </span>
            </div>
            <h3 className="font-semibold text-white mb-1.5">Deterministic Local Plane</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Functional scoped delegation (`delegate()`), `await_approval()`, `for_user`, Merkle proof receipts, and Split-Screen Gauntlet.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-purple-400 font-bold">PHASE 2 (Q1 2027)</span>
              <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800/40 px-1.5 py-0.2 rounded font-mono">
                IN PROGRESS
              </span>
            </div>
            <h3 className="font-semibold text-white mb-1.5">Visual Agent Connectors</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Pre-built Langflow nodes, CrewAI decorators, and AutoGen proxies to embed ArmorIQ governance with one line of code.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-purple-400 font-bold">PHASE 3 (Q2 2027)</span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                PLANNED
              </span>
            </div>
            <h3 className="font-semibold text-white mb-1.5">Federated MCP Registry</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Global decentralized registry for authenticated MCP servers with mutual TLS attestation and zero-trust verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
