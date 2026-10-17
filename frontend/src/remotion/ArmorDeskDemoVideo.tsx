import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import { Scene1Problem } from "./scenes/Scene1Problem";
import { Scene2Architecture } from "./scenes/Scene2Architecture";
import { Scene3Demo } from "./scenes/Scene3Demo";
import { Scene4ArmorIQ } from "./scenes/Scene4ArmorIQ";
import { Scene5Takeaways } from "./scenes/Scene5Takeaways";

export const TOTAL_DURATION_FRAMES = 6300; // 210s = 3m30s at 30fps

export function ArmorDeskDemoVideo() {
  const frame = useCurrentFrame();

  // Progress across the entire 6300-frame video
  const progressPercent = Math.min(100, Math.max(0, (frame / TOTAL_DURATION_FRAMES) * 100));

  // Active chapter detection
  let currentChapter = "01: THREAT LANDSCAPE";
  if (frame >= 5100) currentChapter = "05: TAKEAWAYS & ROADMAP";
  else if (frame >= 3750) currentChapter = "04: ARMORIQL & POLICY STUDIO";
  else if (frame >= 2400) currentChapter = "03: END-TO-END DEMO";
  else if (frame >= 1200) currentChapter = "02: ARCHITECTURE";

  return (
    <AbsoluteFill className="bg-[#FAFAFC]">
      {/* 5 Audio Voiceover Tracks (ElevenLabs v4 Expressive Adam) */}
      <Sequence from={0} durationInFrames={1200} name="Audio 1: Problem">
        <Audio src={staticFile("voiceover/scene1_problem.mp3")} />
      </Sequence>
      <Sequence from={1200} durationInFrames={1200} name="Audio 2: Architecture">
        <Audio src={staticFile("voiceover/scene2_architecture.mp3")} />
      </Sequence>
      <Sequence from={2400} durationInFrames={1350} name="Audio 3: Live Demo">
        <Audio src={staticFile("voiceover/scene3_demo.mp3")} />
      </Sequence>
      <Sequence from={3750} durationInFrames={1350} name="Audio 4: ArmorIQ">
        <Audio src={staticFile("voiceover/scene4_armoriq.mp3")} />
      </Sequence>
      <Sequence from={5100} durationInFrames={1200} name="Audio 5: Takeaways">
        <Audio src={staticFile("voiceover/scene5_takeaways.mp3")} />
      </Sequence>

      {/* Visual Scenes */}
      {/* 1. Scene 1: The Problem & Who It Is For (0 - 1200 frames / 40s) */}
      <Sequence from={0} durationInFrames={1200} name="Scene 1: Problem">
        <Scene1Problem />
      </Sequence>

      {/* 2. Scene 2: Solution Architecture & 12 Agents (1200 - 2400 frames / 40s) */}
      <Sequence from={1200} durationInFrames={1200} name="Scene 2: Architecture">
        <Scene2Architecture />
      </Sequence>

      {/* 3. Scene 3: End-to-End Live Product Demo (2400 - 3750 frames / 45s) */}
      <Sequence from={2400} durationInFrames={1350} name="Scene 3: Live Demo">
        <Scene3Demo />
      </Sequence>

      {/* 4. Scene 4: ArmorIQ Console & Policy Studio (3750 - 5100 frames / 45s) */}
      <Sequence from={3750} durationInFrames={1350} name="Scene 4: ArmorIQ Console">
        <Scene4ArmorIQ />
      </Sequence>

      {/* 5. Scene 5: Takeaways & Roadmap (5100 - 6300 frames / 40s) */}
      <Sequence from={5100} durationInFrames={1200} name="Scene 5: Takeaways">
        <Scene5Takeaways />
      </Sequence>

      {/* Global Minimalist Progress Bar Overlay at Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/80 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Global Top-Right Watermark / Chapter Indicator */}
      <div className="absolute top-6 right-8 z-50 flex items-center gap-2 pointer-events-none">
        <div className="px-3.5 py-1 rounded-full bg-white/90 shadow-sm backdrop-blur-md border border-slate-200 text-xs font-mono text-slate-700 font-bold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentChapter}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
