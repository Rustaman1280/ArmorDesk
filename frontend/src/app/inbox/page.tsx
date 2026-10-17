"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { api, ApprovalItem } from "@/lib/api";
import { playVoiceAlert, playExecutiveBriefing } from "@/lib/audio";
import {
  Inbox,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  FileText,
  DollarSign,
  Building,
  Check,
  X,
  RefreshCw,
  Shield,
  Headphones,
  Mic,
  MicOff,
  Volume2,
  Bot,
  Zap
} from "lucide-react";

export default function ApprovalInboxPage() {
  const { tenantId, currentUser, reloadTrigger, triggerReload, addToast } = useApp();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showRawPayload, setShowRawPayload] = useState<boolean>(false);
  const [isSimulatingQuick, setIsSimulatingQuick] = useState<number | null>(null);

  // ElevenLabs Voice Assistant State
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadApprovals();
  }, [tenantId, reloadTrigger]);

  const loadApprovals = async () => {
    try {
      const data = await api.getApprovals(tenantId);
      setApprovals(data);
      if (data.length > 0 && !selectedId) {
        const firstPending = data.find((d) => d.status === "HELD_FOR_APPROVAL") || data[0];
        setSelectedId(firstPending.delegation_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (delegationId: string, action: "APPROVE" | "REJECT") => {
    if (action === "APPROVE" && currentUser.role === "intern") {
      addToast(
        "Action Denied by Policy (for_user)",
        `Intern account (${currentUser.name}) lacks treasury authorization. Switch role to Manager in the top-right header.`,
        "error"
      );
      return;
    }

    setProcessingId(delegationId);
    try {
      await api.takeApprovalAction(
        delegationId,
        action,
        currentUser.role,
        currentUser.name,
        `Processed via ArmorDesk Inbox by ${currentUser.name}`
      );
      addToast(
        `Transaction ${action === "APPROVE" ? "Approved" : "Rejected"}`,
        `Delegation ticket ${delegationId} finalized. Cryptographic receipt emitted to ledger.`,
        action === "APPROVE" ? "success" : "warning"
      );
      await loadApprovals();
      triggerReload();
    } catch (e: any) {
      addToast("Failed to Process Ticket", e.message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleTriggerQuickScenario = async (scenarioId: number) => {
    setIsSimulatingQuick(scenarioId);
    try {
      const res = await api.runScenario(scenarioId, tenantId, currentUser.role, currentUser.name);
      await loadApprovals();
      triggerReload();
      addToast(
        "Scenario Dispatched",
        `${res.scenario_name}: Status ${res.overall_status}`,
        res.overall_status === "HELD_FOR_APPROVAL" ? "warning" : "info"
      );
    } catch (e: any) {
      addToast("Simulation Failed", e.message, "error");
    } finally {
      setIsSimulatingQuick(null);
    }
  };

  // 1. ElevenLabs Audio Briefing
  const handlePlayBriefing = async () => {
    setIsBriefingLoading(true);
    addToast(
      "Executive Briefing Requested",
      "ElevenLabs synthesizing executive summary of pending escrow holdings...",
      "info"
    );
    try {
      const res = await playExecutiveBriefing(tenantId, currentUser.name);
      addToast("Briefing Active", res.script, "success");
    } catch (e: any) {
      addToast("Briefing Error", e.message, "error");
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // 2. Voice-Activated Approval Handler
  const handleVoiceApproval = async (actionCommand: "APPROVE" | "REJECT") => {
    const topPending = approvals.find((a) => a.status === "HELD_FOR_APPROVAL");
    if (!topPending) {
      playVoiceAlert("No pending transactions awaiting authorization in escrow queue.", "executive");
      addToast("Queue Empty", "No pending transactions in escrow to authorize.", "info");
      return;
    }

    if (currentUser.role === "intern") {
      playVoiceAlert(
        "Action denied. Intern role does not have authorization authority under protocol governance.",
        "security"
      );
      addToast(
        "Voice Authorization Denied",
        "Intern account cannot sign or approve escrow disbursements.",
        "error"
      );
      return;
    }

    await handleAction(topPending.delegation_id, actionCommand);

    if (actionCommand === "APPROVE") {
      playVoiceAlert(
        "Delegation approved. Funds released and signed receipt generated.",
        "executive"
      );
    } else {
      playVoiceAlert(
        "Delegation rejected. Transaction cancelled and audit log committed.",
        "executive"
      );
    }
  };

  // 3. Web Speech Recognition for Hold-to-Speak
  const startVoiceRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast(
        "Speech Recognition API Unavailable",
        "Your browser does not support Web Speech Recognition. You can trigger voice approvals directly.",
        "warning"
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setRecognizedText("Listening... (Say 'Approve' or 'Reject')");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setRecognizedText(`Heard: "${transcript}"`);

        if (
          transcript.includes("approve") ||
          transcript.includes("accept") ||
          transcript.includes("yes") ||
          transcript.includes("setuju") ||
          transcript.includes("release")
        ) {
          handleVoiceApproval("APPROVE");
        } else if (
          transcript.includes("reject") ||
          transcript.includes("deny") ||
          transcript.includes("block") ||
          transcript.includes("tolak") ||
          transcript.includes("cancel")
        ) {
          handleVoiceApproval("REJECT");
        } else {
          addToast(
            "Command Unrecognized",
            `Recognized: "${transcript}". Please say "Approve" or "Reject".`,
            "warning"
          );
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        setRecognizedText(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setRecognizedText(null), 3500);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("SpeechRecognition initialization failed:", err);
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const filtered = approvals.filter((a) => {
    if (filterStatus === "ALL") return true;
    return a.status === filterStatus;
  });

  const selectedItem = approvals.find((a) => a.delegation_id === selectedId) || filtered[0] || null;
  const pendingCount = approvals.filter((a) => a.status === "HELD_FOR_APPROVAL").length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
              Human-in-the-Loop Dual Control
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 font-bold">
              {pendingCount} PENDING SIGNATURE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Approval Inbox (Dual-Control Escrow)
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            When autonomous agents request capital movements exceeding policy limits ($50.00), execution freezes here until authorized by an executive.
          </p>
        </div>

        {/* Quick Simulation Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerQuickScenario(2)}
            disabled={isSimulatingQuick !== null}
            className="px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            + Trigger $8,000 Test Invoice
          </button>
        </div>
      </div>

      {/* 2. Intern Policy Warning Banner if Intern is Active */}
      {currentUser.role === "intern" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-200">
              Notice: Active Session is {currentUser.name} (Restricted Intern Role)
            </div>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              Under role policy enforcement (<code className="font-mono text-amber-700 dark:text-amber-300 font-bold">for_user</code>), intern roles <strong>do not possess treasury approval privileges</strong>. The "Approve & Disburse" action is locked. Switch role to <strong>Manager</strong> in the top-right header to sign and execute this disbursement.
            </p>
          </div>
        </div>
      )}

      {/* 2.5. ElevenLabs Executive Assistant Interactive Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101115] p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Headphones className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <span>ElevenLabs Executive Assistant</span>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                VOICE-AI v2.5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
              Live hands-free escrow briefings & voice-commanded authorization for executive sign-off.
            </p>
            {recognizedText && (
              <div className="mt-1 text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 inline-block animate-pulse">
                🎙️ {recognizedText}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action A: Audio Briefing */}
          <button
            type="button"
            onClick={handlePlayBriefing}
            disabled={isBriefingLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#16171d] hover:bg-slate-100 dark:hover:bg-[#1F2026] text-xs font-mono font-semibold transition-all shadow-xs disabled:opacity-50"
            title="Listen to an AI speech summary of all pending escrow holds"
          >
            {isBriefingLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-500" />
            ) : (
              <Headphones className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            )}
            <span>🎧 Audio Briefing</span>
          </button>

          {/* Action B: Hold to Speak (Voice Approval) */}
          <button
            type="button"
            onPointerDown={startVoiceRecognition}
            onPointerUp={stopVoiceRecognition}
            onPointerLeave={stopVoiceRecognition}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold transition-all select-none shadow-xs ${
              isListening
                ? "bg-rose-500 border-rose-600 text-white animate-pulse shadow-rose-500/20"
                : "border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#16171d] hover:bg-slate-100 dark:hover:bg-[#1F2026] text-slate-800 dark:text-zinc-200"
            }`}
            title="Hold down this button and speak 'Approve' or 'Reject' to execute top held ticket"
          >
            {isListening ? (
              <Mic className="h-3.5 w-3.5 animate-bounce" />
            ) : (
              <Mic className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>{isListening ? "Listening... (Release to Act)" : "🎙️ Hold to Speak (Voice Approval)"}</span>
          </button>

          {/* Quick Fallback Command Buttons (for no-mic environments) */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171d] p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleVoiceApproval("APPROVE")}
              className="px-2 py-1 rounded hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold"
              title="Voice simulator shortcut: Say 'Approve'"
            >
              "Approve"
            </button>
            <span className="text-slate-300 dark:text-zinc-600">|</span>
            <button
              type="button"
              onClick={() => handleVoiceApproval("REJECT")}
              className="px-2 py-1 rounded hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold"
              title="Voice simulator shortcut: Say 'Reject'"
            >
              "Reject"
            </button>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { key: "ALL", label: `All Tickets (${approvals.length})` },
          { key: "HELD_FOR_APPROVAL", label: `Pending Escrow (${pendingCount})` },
          { key: "APPROVED", label: "Approved" },
          { key: "REJECTED", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === tab.key
                ? "bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                : "bg-slate-100 dark:bg-[#141519] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Master-Detail Clean Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transaction List (Span 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] overflow-hidden shadow-sm flex flex-col h-[520px]">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-zinc-400 font-semibold">ESCROW QUEUE</span>
            <span className="text-slate-400 dark:text-zinc-500">{filtered.length} tickets</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
            {filtered.map((item) => {
              const isSelected = selectedItem?.delegation_id === item.delegation_id;

              return (
                <div
                  key={item.delegation_id}
                  onClick={() => setSelectedId(item.delegation_id)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-100 dark:bg-[#181920] border-l-4 border-l-emerald-600 dark:border-l-emerald-400"
                      : "hover:bg-slate-50 dark:hover:bg-[#121317]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.recipient}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 font-sans">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.status === "HELD_FOR_APPROVAL"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                          : item.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                          : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {item.status === "HELD_FOR_APPROVAL" ? "⏳ AWAITING CFO" : item.status}
                    </span>
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px]">
                      {item.created_at ? new Date(item.created_at).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-slate-400 dark:text-zinc-500 font-mono text-xs">
                No delegation tickets found in this view.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Inspector & Action Panel (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E0F12] shadow-sm flex flex-col h-[520px] overflow-hidden">
          {selectedItem ? (
            <div className="flex flex-col h-full justify-between">
              {/* Header Details */}
              <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
                    TICKET ID: {selectedItem.delegation_id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      selectedItem.status === "HELD_FOR_APPROVAL"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                        : selectedItem.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {selectedItem.status === "HELD_FOR_APPROVAL" ? "AWAITING CFO SIGNATURE" : selectedItem.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedItem.recipient}
                  </h2>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    ${selectedItem.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                    <span className="text-xs font-normal text-slate-400">USD</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 font-sans">
                  {selectedItem.description}
                </p>
              </div>

              {/* Middle Body Info */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
                {/* Reason Banner */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 font-mono">
                    <Shield className="h-4 w-4" />
                    <span>Dual-Control Escrow Reason:</span>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
                    Disbursement request of <strong>${selectedItem.amount.toLocaleString()}</strong> exceeds automated policy threshold ($50.00). Under dual-control protocol, execution is frozen until authorized by an executive officer (CFO).
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141519] border border-slate-100 dark:border-white/[0.04] space-y-0.5">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-semibold">INITIATOR / AGENT</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-bold">{selectedItem.requested_by || "FinOps Executor"}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141519] border border-slate-100 dark:border-white/[0.04] space-y-0.5">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-semibold">PAYMENT METHOD</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-bold">{selectedItem.action_type || "bank.wire_transfer"}</span>
                  </div>
                </div>

                {/* Collapsible Raw JSON / Hash */}
                <div>
                  <button
                    onClick={() => setShowRawPayload(!showRawPayload)}
                    className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-mono text-[11px] transition-colors"
                  >
                    <span>{showRawPayload ? "Hide Technical Details" : "View Technical Details (JSON Payload & Plan Hash)"}</span>
                    {showRawPayload ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {showRawPayload && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                      <pre className="text-emerald-400 leading-tight">
                        {JSON.stringify(selectedItem.payload || selectedItem, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#121317] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 font-medium">
                  {currentUser.role === "manager"
                    ? `✓ Authorized for ${currentUser.name} (${currentUser.title || "Manager"})`
                    : `🔒 Locked: ${currentUser.name} (Intern) lacks disbursement permission`}
                </span>

                {selectedItem.status === "HELD_FOR_APPROVAL" ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction(selectedItem.delegation_id, "REJECT")}
                      disabled={processingId !== null}
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/[0.1] hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-zinc-300 hover:text-rose-600 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleAction(selectedItem.delegation_id, "APPROVE")}
                      disabled={processingId !== null || currentUser.role === "intern"}
                      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                        currentUser.role === "intern"
                          ? "bg-slate-300 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                      }`}
                    >
                      {processingId === selectedItem.delegation_id ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Finalizing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve & Disburse (${selectedItem.amount.toLocaleString()})</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>This delegation ticket has been finalized ({selectedItem.status})</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-500 text-xs font-mono p-8 text-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-zinc-200">
                Escrow Queue Clear
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-xs max-w-sm font-sans">
                Zero disbursements currently held for dual-control authorization. When autonomous agents exceed spend limits, they freeze here.
              </p>
              <button
                onClick={() => handleTriggerQuickScenario(2)}
                disabled={isSimulatingQuick !== null}
                className="px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-medium transition-colors disabled:opacity-50 shadow-xs"
              >
                + Dispatch $8,000 Test Invoice to Escrow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
