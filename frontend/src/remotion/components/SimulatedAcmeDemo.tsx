import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import {
  Shield,
  Lock,
  CheckCircle2,
  FileCheck,
  Building2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight
} from "lucide-react";

export function SimulatedAcmeDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Camera Zoom-In & Zoom-Out with Smooth Easing Curves
  // Frame 0-160: Wide overview (scale: 1.0)
  // Frame 160-260: Smooth Ease Zoom-In (scale: 1.0 -> 1.22) focused right on the ticket
  // Frame 260-520: Hold close-up during cursor hover & click
  // Frame 520-620: Smooth Ease Zoom-Out back to wide (scale: 1.22 -> 1.0)
  const zoomScale = interpolate(
    frame,
    [0, 160, 260, 520, 620, 1080],
    [1.0, 1.0, 1.22, 1.22, 1.0, 1.0],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Pan smoothly towards the button area without cutting off the card
  const cameraOriginX = interpolate(frame, [160, 260, 520, 620], [50, 62, 62, 50], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cameraOriginY = interpolate(frame, [160, 260, 520, 620], [50, 56, 56, 50], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Animated Mouse Cursor Position (Bezier Ease)
  // Big, visible cursor moving towards the Approve button
  const cursorX = interpolate(frame, [0, 160, 360], [1320, 1320, 1160], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorY = interpolate(frame, [0, 160, 360], [220, 220, 540], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor Click effect at frame 400
  const isClicking = frame >= 400 && frame < 430;
  const isApproved = frame >= 415;

  // Click ripple expansion
  const clickRipple = isClicking ? interpolate(frame, [400, 430], [0, 60]) : 0;
  const clickOpacity = isClicking ? interpolate(frame, [400, 430], [0.9, 0]) : 0;

  // Receipt Certificate Slide-in after approval
  const receiptSpring = spring({ frame: frame - 640, fps, config: { damping: 11, mass: 0.7 } });

  return (
    <div
      style={{
        width: 1640,
        height: 840,
        margin: "0 auto",
      }}
      className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_30px_90px_rgba(0,0,0,0.08)] flex flex-col justify-between select-none"
    >
      {/* Zoomable Container with Ease Origin */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${zoomScale})`,
          transformOrigin: `${cameraOriginX}% ${cameraOriginY}%`,
        }}
        className="flex flex-col justify-between transition-transform"
      >
        {/* Browser Top Navigation Bar */}
        <div className="h-16 px-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
              <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
              <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center gap-2 ml-4 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-600 shadow-sm">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-bold text-slate-800">armordesk.crusts.dev</span>
              <span className="text-slate-400">/inbox</span>
            </div>
          </div>

          {/* User Persona Header */}
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-mono font-bold border border-amber-200 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Acme Corp Demo Workspace</span>
            </span>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono shadow-sm">
              <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                SC
              </div>
              <span className="font-bold text-slate-800">Sarah Chen</span>
              <span className="text-[10px] text-slate-500 font-semibold">(CFO)</span>
            </div>
          </div>
        </div>

        {/* Main Inbox Dashboard Body */}
        <div className="p-8 space-y-6 flex-1 flex flex-col justify-between bg-[#FBFBFC]">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">
                DUAL-CONTROL TREASURY ESCROW
              </div>
              <h2 className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                Pending High-Risk Actions
              </h2>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-mono font-extrabold border border-amber-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <span>1 ACTION REQUIRES HUMAN AUTHORIZATION</span>
            </div>
          </div>

          {/* Primary Holding Card */}
          <div
            className={`p-7 rounded-3xl bg-white border-2 transition-all shadow-md ${
              isApproved ? "border-emerald-500 bg-emerald-50/25" : "border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {isApproved ? (
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="h-7 w-7 text-amber-500 shrink-0" />
                )}
                <div>
                  <span className="font-mono text-xs text-slate-400 block font-bold">
                    ESCROW HOLD #HLD_8921 : bank.wire_transfer
                  </span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    Recipient: Cloudflare Enterprise Inc.
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block font-bold">DISBURSEMENT AMOUNT</span>
                <span className="text-3xl font-black font-mono text-rose-600">$8,000.00 USD</span>
              </div>
            </div>

            {/* Interception reason banner */}
            <div className="my-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between text-xs font-mono text-amber-900">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Escrow Triggered:</strong> Amount exceeds $50.00 spend ceiling. Indirect prompt injection
                  override neutralized.
                </span>
              </div>
              <span className="font-bold text-[11px] px-2.5 py-1 rounded bg-white border border-amber-200">
                POLICY: spend_limit_ceiling
              </span>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-slate-500">
                Authorizer: <strong>Sarah Chen</strong> (Role: CFO · Dual-Control Approved)
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 bg-slate-50 font-bold"
                >
                  Deny &amp; Quarantine
                </button>

                {/* The Approve Button where Cursor clicks */}
                <button
                  type="button"
                  style={{
                    transform: isClicking ? "scale(0.92)" : "scale(1)",
                  }}
                  className={`px-8 py-3 rounded-xl font-mono text-xs font-extrabold shadow-md flex items-center gap-2 transition-all ${
                    isApproved
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>APPROVED &amp; DISBURSED ✓</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Approve &amp; Disburse $8,000.00</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Newly Minted Cryptographic Receipt Popup */}
          {frame >= 630 && (
            <div
              style={{
                opacity: receiptSpring,
                transform: `scale(${interpolate(receiptSpring, [0, 1], [0.92, 1])}) translateY(${interpolate(receiptSpring, [0, 1], [20, 0])}px)`,
              }}
              className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between font-mono text-xs shadow-xl border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">
                    CRYPTOGRAPHIC PROOF RECEIPT MINTED : rcpt_5b521f1f
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Plan Hash: 7f9b8a1c... | Merkle Root: d4e5f6a7... (Signed by Sarah Chen · CFO)
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-white/10 font-bold text-[11px]">
                VERIFIED BY AUDIT
              </span>
            </div>
          )}
        </div>
      </div>

      {/* BIGGER, PROMINENT ANIMATED MOUSE CURSOR (54px) */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          pointerEvents: "none",
          zIndex: 60,
          transform: isClicking ? "scale(0.85)" : "scale(1)",
          transition: "transform 0.08s ease-out",
        }}
      >
        {/* Click Ripple Expanding Circle */}
        {isClicking && (
          <div
            style={{
              width: clickRipple * 2,
              height: clickRipple * 2,
              opacity: clickOpacity,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute rounded-full border-4 border-emerald-500 bg-emerald-400/30 pointer-events-none"
          />
        )}

        {/* 54px High-Contrast Cursor SVG */}
        <svg
          width="54"
          height="54"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
          }}
        >
          <path
            d="M5.5 3.5L18.5 11.5L12.5 13.5L9.5 20.5L5.5 3.5Z"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
