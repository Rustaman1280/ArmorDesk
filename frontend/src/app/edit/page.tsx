"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PlayerRef } from "@remotion/player";
import { ArmorDeskDemoVideo, TOTAL_DURATION_FRAMES } from "@/remotion/ArmorDeskDemoVideo";
import {
  Video as VideoIcon,
  RotateCcw,
  Sparkles,
  Download,
  FolderOpen,
  MonitorPlay,
  Layers,
  ArrowRight
} from "lucide-react";

// Dynamic import for Remotion Player to prevent SSR canvas issues in Next.js
const Player = dynamic(() => import("@remotion/player").then((m) => m.Player), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3">
      <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-slate-400">Initializing Remotion Studio Player...</span>
    </div>
  ),
});

export default function VideoEditorLiveProgressPage() {
  const playerRef = useRef<PlayerRef>(null);

  const chapters = [
    {
      id: 1,
      frame: 0,
      timestamp: "00:00",
      duration: "40s",
      title: "The Problem & Who It Is For",
      subtitle: "Autonomous agent vulnerability & indirect prompt injection",
      slot: "slot_01_exploit.mp4",
    },
    {
      id: 2,
      frame: 1200,
      timestamp: "00:40",
      duration: "40s",
      title: "The Architecture & 12 Agents",
      subtitle: "3D Metallic ArmorDesk shield & zero-trust MCP gateway",
      slot: "3D R3F Core Engine",
    },
    {
      id: 3,
      frame: 2400,
      timestamp: "01:20",
      duration: "45s",
      title: "End-to-End Live Product Demo",
      subtitle: "$20 auto-passed refund vs $8,000 dual-control escrow hold",
      slot: "slot_02_approval_inbox.mp4",
    },
    {
      id: 4,
      frame: 3750,
      timestamp: "02:05",
      duration: "45s",
      title: "tools.armoriq.ai & Policy Studio",
      subtitle: "Spend limit ceiling, vendor whitelist & Merkle receipts",
      slot: "slot_03_armoriq_console.mp4",
    },
    {
      id: 5,
      frame: 5100,
      timestamp: "02:50",
      duration: "40s",
      title: "Takeaways & Future Roadmap",
      subtitle: "Protocol-level defense, AWS Nitro Enclaves & consensus voting",
      slot: "Roadmap Milestones",
    },
  ];

  const seekToChapter = (frame: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 p-6 sm:p-10 font-sans space-y-8 select-none">
      {/* Top Studio Header (Apple / Linear Minimal Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-bold tracking-wide">
              REMOTION MOTION DESIGN STUDIO
            </span>
            <span className="text-xs font-mono text-slate-400">/edit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
            ArmorDesk Video Presentation Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-sans">
            Clean white motion graphics with kinetic typography, 3D React Three Fiber shield, ElevenLabs voiceover, and drop-in screen recording canvas slots.
          </p>
        </div>

        {/* Global Video Specs Pill */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-200 text-right space-y-0.5">
            <span className="text-[10px] text-slate-400 block font-bold">TOTAL DURATION</span>
            <span className="text-emerald-600 font-extrabold text-sm">03:30 (6300 Frames)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-200 text-right space-y-0.5">
            <span className="text-[10px] text-slate-400 block font-bold">STUDIO FORMAT</span>
            <span className="text-cyan-600 font-extrabold text-sm">1080p Full HD @ 30fps</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: 16:9 Viewport & Chapter Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player & Quick Scrubbing Toolbar (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.08)]">
            <Player
              ref={playerRef}
              component={ArmorDeskDemoVideo}
              durationInFrames={TOTAL_DURATION_FRAMES}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
              }}
              controls
              loop
            />
          </div>

          {/* Scrubbing Toolbar */}
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Jump to:</span>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => seekToChapter(ch.frame)}
                    className="px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 font-bold transition-all text-xs"
                  >
                    Ch {ch.id} ({ch.timestamp})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => seekToChapter(0)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart Video</span>
            </button>
          </div>
        </div>

        {/* Right Column: Chapters & Canvas Recording Slot Guide (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timeline Chapter Guide */}
          <div className="rounded-3xl bg-white p-6 space-y-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  TIMELINE CHAPTERS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold px-2 py-0.5 rounded-full bg-emerald-50">
                5 SCENES
              </span>
            </div>

            <div className="space-y-2.5">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => seekToChapter(ch.frame)}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/60 hover:border-emerald-300 transition-all space-y-1 block"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {ch.id}. {ch.title}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold">
                      {ch.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans line-clamp-1">{ch.subtitle}</p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                    <span>{ch.duration}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-semibold">{ch.slot}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Drop-in Screen Recording Slots */}
          <div className="rounded-3xl bg-white p-6 space-y-3.5 shadow-sm border border-amber-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-mono font-bold tracking-wider">
                <FolderOpen className="h-4 w-4" />
                <span>CANVAS RECORDING SLOTS</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                DROP-IN MP4
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              To overlay your actual recordings, place MP4 files in{" "}
              <code className="text-amber-800 font-mono font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                public/recordings/
              </code>
              :
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <strong className="text-slate-900 block">slot_01_exploit.mp4</strong>
                <p className="text-[10px] text-slate-500 font-sans">
                  Screen recording of indirect prompt injection test (15-20s).
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <strong className="text-slate-900 block">slot_02_approval_inbox.mp4</strong>
                <p className="text-[10px] text-slate-500 font-sans">
                  Screen recording of Approval Inbox signing in armordesk.crusts.dev (20-25s).
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <strong className="text-slate-900 block">slot_03_armoriq_console.mp4</strong>
                <p className="text-[10px] text-slate-500 font-sans">
                  Screen recording of tools.armoriq.ai Policy Studio console (20-25s).
                </p>
              </div>
            </div>
          </div>

          {/* Export Full HD MP4 */}
          <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-wider">
              <Download className="h-4 w-4" />
              <span>EXPORT PRODUCTION VIDEO (.MP4)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Render with Remotion CLI and FFmpeg at 1080p 30fps:
            </p>
            <pre className="p-3 rounded-xl bg-black text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
              npx remotion render src/remotion/Root.tsx ArmorDeskDemo out/armordesk-demo.mp4
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
