"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PlayerRef } from "@remotion/player";
import { ArmorDeskDemoVideo, TOTAL_DURATION_FRAMES } from "@/remotion/ArmorDeskDemoVideo";
import {
  Video as VideoIcon,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  ExternalLink,
  Code2,
  Download,
  AlertTriangle,
  FolderOpen
} from "lucide-react";

// Dynamic import for Remotion Player to prevent SSR canvas issues in Next.js
const Player = dynamic(() => import("@remotion/player").then((m) => m.Player), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-2xl bg-[#090A0F] border border-white/10 flex flex-col items-center justify-center space-y-3">
      <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-slate-400">Loading Remotion Video Engine...</span>
    </div>
  ),
});

export default function VideoEditorLiveProgressPage() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const chapters = [
    {
      id: 1,
      frame: 0,
      timestamp: "00:00",
      duration: "40s",
      title: "The Problem & Who It Is For",
      subtitle: "Autonomous agent vulnerability & indirect prompt injection",
      voiceover: "scene1_problem.mp3 (29.4s)",
      canvasSlot: "slot_01_exploit",
    },
    {
      id: 2,
      frame: 1200,
      timestamp: "00:40",
      duration: "40s",
      title: "The Architecture & 12 Agents",
      subtitle: "3D ArmorDesk shield & protocol-level MCP gateway",
      voiceover: "scene2_architecture.mp3 (24.9s)",
      canvasSlot: "None (3D R3F Core)",
    },
    {
      id: 3,
      frame: 2400,
      timestamp: "01:20",
      duration: "45s",
      title: "End-to-End Live Product Demo",
      subtitle: "$20 allowed refund vs $8,000 dual-control escrow hold",
      voiceover: "scene3_demo.mp3 (25.2s)",
      canvasSlot: "slot_02_approval_inbox",
    },
    {
      id: 4,
      frame: 3750,
      timestamp: "02:05",
      duration: "45s",
      title: "tools.armoriq.ai & Policy Studio",
      subtitle: "Spend limit ceiling, vendor whitelist & Merkle receipts",
      voiceover: "scene4_armoriq.mp3 (24.7s)",
      canvasSlot: "slot_03_armoriq_console",
    },
    {
      id: 5,
      frame: 5100,
      timestamp: "02:50",
      duration: "40s",
      title: "Takeaways & Future Roadmap",
      subtitle: "Lessons learned, AWS Nitro Enclaves & multi-agent voting",
      voiceover: "scene5_takeaways.mp3 (26.5s)",
      canvasSlot: "None (Roadmap Grid)",
    },
  ];

  const seekToChapter = (frame: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 p-6 sm:p-10 font-sans space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold">
              LIVE REMOTION STUDIO
            </span>
            <span className="text-xs font-mono text-slate-500">/edit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            ArmorDesk Hackathon Demo Video Preview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-sans">
            Scrub through the timeline, verify ElevenLabs audio voiceover synchronization, and preview where your real screen recordings will be slotted.
          </p>
        </div>

        {/* Global Video Specs Badge */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-right space-y-0.5">
            <span className="text-[10px] text-slate-500 block">TOTAL DURATION</span>
            <span className="text-emerald-400 font-bold">03:30 (6300 Frames)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-right space-y-0.5">
            <span className="text-[10px] text-slate-500 block">RESOLUTION &amp; FPS</span>
            <span className="text-cyan-400 font-bold">1080p Full HD @ 30fps</span>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport (16:9 Player) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player & Playback Scrubbing (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
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

          {/* Quick Scene Jump Toolbar */}
          <div className="p-4 rounded-xl bg-[#0D0E14] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Jump to Chapter:</span>
              <div className="inline-flex rounded-lg bg-black/60 p-1 border border-white/5 gap-1">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => seekToChapter(ch.frame)}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-[11px]"
                  >
                    Ch {ch.id} ({ch.timestamp})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => seekToChapter(0)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restart Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chapters & Screen Recording Canvas Guide (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Chapter Outline List */}
          <div className="rounded-2xl border border-white/10 bg-[#0D0E14] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Timeline Chapters
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">5 SCENES</span>
            </div>

            <div className="space-y-2.5">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => seekToChapter(ch.frame)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-emerald-500/40 transition-all space-y-1 block"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {ch.id}. {ch.title}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {ch.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{ch.subtitle}</p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-500">
                    <span>Audio: {ch.duration}</span>
                    <span>•</span>
                    <span className="text-amber-400/80">{ch.canvasSlot}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Screen Recording Canvas Placement Guide */}
          <div className="rounded-2xl border border-amber-500/30 bg-[#0D0E14] p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <FolderOpen className="h-4 w-4" />
              <span>Canvas Recording Slots</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              To overlay your actual screen recordings into the video, place MP4 clips in{" "}
              <code className="text-amber-300 font-mono font-bold bg-black/50 px-1 rounded">
                public/recordings/
              </code>
              :
            </p>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="p-2 rounded bg-black/40 border border-white/5">
                <strong className="text-amber-400">slot_01_exploit.mp4</strong>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Screen recording of indirect prompt injection test (15-20s).
                </p>
              </li>
              <li className="p-2 rounded bg-black/40 border border-white/5">
                <strong className="text-amber-400">slot_02_approval_inbox.mp4</strong>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Screen recording of Approval Inbox signing in armordesk.crusts.dev (20-25s).
                </p>
              </li>
              <li className="p-2 rounded bg-black/40 border border-white/5">
                <strong className="text-amber-400">slot_03_armoriq_console.mp4</strong>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Screen recording of tools.armoriq.ai Policy Studio console (20-25s).
                </p>
              </li>
            </ul>
          </div>

          {/* Export MP4 Command Box */}
          <div className="rounded-2xl border border-white/10 bg-[#0D0E14] p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Download className="h-4 w-4" />
              <span>Export Full HD Video (.mp4)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Run this command in the terminal to render the final presentation video with FFmpeg:
            </p>
            <pre className="p-3 rounded-xl bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto border border-white/5">
              npx remotion render src/remotion/Root.tsx ArmorDeskDemo out/armordesk-demo.mp4
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
