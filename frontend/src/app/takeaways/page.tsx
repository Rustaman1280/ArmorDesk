"use client";

import React from "react";
import {
  ShieldCheck,
  Briefcase,
  Rocket,
  CheckCircle2,
  Lock,
  ArrowRight,
  Cpu,
  Layers,
  Network,
  Compass,
  Check,
  Terminal,
  TrendingUp,
  Boxes
} from "lucide-react";

export default function TakeawaysPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Compass className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Executive Takeaways, Architecture Insight & SaaS Vision
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 font-bold">
            JUDGING CRITERIA · 15 POINTS
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Architectural depth, commercial monetization models, and future roadmap for the ArmorIQ & Model Context Protocol ecosystem.
        </p>
      </div>

      {/* 2. Three High-Craft Bento Cards */}

      {/* Bento 1: The Core Insight */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              01 / ARCHITECTURE
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              The Core Insight: Why Prompt Guardrails Are Mathematically Inadequate
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">DETERMINISTIC PERIMETER</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          Contemporary AI security relies predominantly on <strong className="text-slate-900 dark:text-white">probabilistic prompt filtering</strong> (asking an LLM or regex to decide if input looks adversarial). This fails because Transformers treat instructions and incoming data as an interleaved, undifferentiated token stream. In an indirect prompt injection attack, a payload embedded in a vendor invoice or email payload naturally assumes instruction authority over the LLM.
        </p>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-white/[0.06] bg-emerald-50/40 dark:bg-[#0E0E11] font-mono text-xs text-slate-800 dark:text-zinc-300 space-y-1.5">
          <div className="text-emerald-800 dark:text-emerald-400 font-bold">
            ArmorDesk Architectural Axiom:
          </div>
          <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
            Security cannot live inside the model's stochastic reasoning. Governance must be enforced at the <strong>MCP protocol layer</strong> via scoped delegation (<code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">delegate()</code>), deterministic identity bounds (<code className="font-mono text-amber-600 dark:text-amber-400 font-bold">for_user</code>), and non-repudiation Merkle proofs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="rounded-xl bg-slate-50 dark:bg-[#0E0E11] p-3.5 border border-slate-200 dark:border-white/[0.05]">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-200 block mb-1">
              1. Scoped Delegation
            </span>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Sub-agents parsing text possess capability tokens solely for read operations. Even if 100% hijacked by prompt injection, they physically lack protocol permission to invoke bank transfers.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-[#0E0E11] p-3.5 border border-slate-200 dark:border-white/[0.05]">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-200 block mb-1">
              2. Signed Plan Hashes
            </span>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Orchestrators sign a canonical SHA-256 plan hash bounding approved recipients and budgets prior to dispatch. Any drift at runtime aborts execution immediately.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-[#0E0E11] p-3.5 border border-slate-200 dark:border-white/[0.05]">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-200 block mb-1">
              3. Verifiable Merkle Proofs
            </span>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Every tool execution folds into an immutable Merkle tree, giving enterprise compliance teams mathematical proof that no unauthorized actions occurred.
            </p>
          </div>
        </div>
      </div>

      {/* Bento 2: Commercial Ambition */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              02 / BUSINESS
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Commercial Ambition: Enterprise FinOps & DevOps Control Plane
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">SAAS MONETIZATION</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          ArmorDesk is engineered as an enterprise-grade B2B SaaS control plane. Organizations deploying multi-agent systems for accounts payable, procurement, customer refund automation, and cloud provisioning face immense regulatory liability without verifiable control planes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0E0E11] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Target Value Proposition</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">✓</span>
                <span><strong>Zero-Loss Guarantee:</strong> Absolute protection against prompt-injection wire fraud and spend limit overflows.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">✓</span>
                <span><strong>Seamless Human Governance:</strong> Multi-channel Slack Block Kit & web inbox review for out-of-policy exceptions.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">✓</span>
                <span><strong>Automated SOC 2 / ISO 27001 Evidence:</strong> Eliminates hundreds of hours of manual audit preparation each quarter.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0E0E11] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
              <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Enterprise Pricing Architecture</span>
            </div>
            <div className="space-y-2 text-[11px] font-mono text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-[#141418] border border-slate-200/80 dark:border-white/[0.04]">
                <span className="text-slate-800 dark:text-zinc-300 font-semibold">Base Platform:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">$999 / mo</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-[#141418] border border-slate-200/80 dark:border-white/[0.04]">
                <span className="text-slate-800 dark:text-zinc-300 font-semibold">Supervised Agent Seat:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">$49 / agent / mo</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-[#141418] border border-slate-200/80 dark:border-white/[0.04]">
                <span className="text-slate-800 dark:text-zinc-300 font-semibold">Merkle Verification Metering:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">$0.005 / verified proof</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento 3: Ecosystem Roadmap */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              03 / ROADMAP
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Ecosystem Roadmap: From Hackathon to Industry Standard
            </h2>
          </div>
          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">Q4 2026 – Q2 2027</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Phase 1 */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0E0E11] p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">PHASE 1 (DELIVERED)</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold">
                LIVE
              </span>
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-zinc-200">
              Deterministic Control Plane
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              Functional scoped delegation (<code className="font-mono text-slate-800 dark:text-zinc-300 font-semibold">delegate()</code>), dual-authorization inbox (<code className="font-mono text-slate-800 dark:text-zinc-300 font-semibold">await_approval()</code>), user policy constraints (<code className="font-mono text-slate-800 dark:text-zinc-300 font-semibold">for_user</code>), Merkle proof receipts, and red-team Gauntlet.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0E0E11] p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-indigo-700 dark:text-indigo-400 font-bold">PHASE 2 (Q1 2027)</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 font-bold">
                ACTIVE
              </span>
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-zinc-200">
              Visual Agent Connectors
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              Native Langflow nodes, CrewAI decorators, and AutoGen governance proxies allowing developers to enforce ArmorIQ boundaries with one line of Python/TypeScript code.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0E0E11] p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500 dark:text-zinc-400 font-bold">PHASE 3 (Q2 2027)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 font-semibold">
                PLANNED
              </span>
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-zinc-200">
              Federated Governed MCP Registry
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              Global decentralized registry for certified MCP tool servers with mutual TLS attestation, dynamic capability issuance, and enterprise zero-trust cryptographic guarantees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
