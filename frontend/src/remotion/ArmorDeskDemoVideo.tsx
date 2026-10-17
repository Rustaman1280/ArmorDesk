import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import { Scene1Problem } from "./scenes/Scene1Problem";
import { Scene2Architecture } from "./scenes/Scene2Architecture";
import { Scene3Demo } from "./scenes/Scene3Demo";
import { Scene4ArmorIQ } from "./scenes/Scene4ArmorIQ";
import { Scene5Takeaways } from "./scenes/Scene5Takeaways";

// Total Duration: 5,700 Frames = 190 Seconds = 3 Minutes 10 Seconds at 30fps
// Strictly compliant with the 3 - 5 minute hackathon rule!
export const TOTAL_DURATION_FRAMES = 5700;

export function ArmorDeskDemoVideo() {
  const frame = useCurrentFrame();

  // Progress across the entire 5,700-frame video
  const progressPercent = Math.min(100, Math.max(0, (frame / TOTAL_DURATION_FRAMES) * 100));

  // Active chapter detection
  let currentChapter = "01: THREAT LANDSCAPE";
  if (frame >= 4560) currentChapter = "05: TAKEAWAYS & ROADMAP";
  else if (frame >= 3360) currentChapter = "04: ARMORIQL & POLICY STUDIO";
  else if (frame >= 2280) currentChapter = "03: END-TO-END LIVE DEMO";
  else if (frame >= 1140) currentChapter = "02: ZERO-TRUST ARCHITECTURE";

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#FAFAFC" }}
      className="bg-[#FAFAFC] overflow-hidden"
    >
      {/* ======================================================== */}
      {/* 1. AUDIO VOICEOVER TIMELINE (ElevenLabs v4 Adam)         */}
      {/* ======================================================== */}
      {/* Scene 1 Voiceover (Frames 0 - 950) */}
      <Sequence from={0} durationInFrames={950} name="VO 1: Problem">
        <Audio src={staticFile("voiceover/scene1_problem.mp3")} volume={1.0} />
      </Sequence>

      {/* Scene 2 Voiceover Part A (Frames 1140 - 1898) */}
      <Sequence from={1140} durationInFrames={760} name="VO 2A: Architecture">
        <Audio src={staticFile("voiceover/scene2_architecture.mp3")} volume={1.0} />
      </Sequence>

      {/* Scene 2 Voiceover Part B: Onboarding Beat (Frames 1900 - 2150) */}
      <Sequence from={1900} durationInFrames={250} name="VO 2B: Onboarding">
        <Audio src={staticFile("voiceover/scene2_onboarding.mp3")} volume={1.0} />
      </Sequence>

      {/* Scene 3 Voiceover (Frames 2280 - 2980) */}
      <Sequence from={2280} durationInFrames={700} name="VO 3: Live Demo">
        <Audio src={staticFile("voiceover/scene3_demo.mp3")} volume={1.0} />
      </Sequence>

      {/* Scene 4 Voiceover Part A: Policy Rules (Frames 3360 - 4125) */}
      <Sequence from={3360} durationInFrames={765} name="VO 4A: Policy Studio">
        <Audio src={staticFile("voiceover/scene4_armoriq.mp3")} volume={1.0} />
      </Sequence>

      {/* Scene 4 Voiceover Part B: Real Dashboard (Frames 4130 - 4460) */}
      <Sequence from={4130} durationInFrames={330} name="VO 4B: Live Dashboard">
        <Audio src={staticFile("voiceover/scene4_dashboard.mp3")} volume={1.0} />
      </Sequence>

      {/* Scene 5 Voiceover (Frames 4560 - 5300) */}
      <Sequence from={4560} durationInFrames={740} name="VO 5: Takeaways">
        <Audio src={staticFile("voiceover/scene5_takeaways.mp3")} volume={1.0} />
      </Sequence>

      {/* ======================================================== */}
      {/* 2. SOUND EFFECTS (SFX) LAYER                             */}
      {/* ======================================================== */}
      {/* Scene 1: Laser Scan Sound Effect */}
      <Sequence from={270} durationInFrames={30} name="SFX: Laser Scan">
        <Audio src={staticFile("sfx/laser.mp3")} volume={0.4} />
      </Sequence>

      {/* Scene 2: Whoosh Transition */}
      <Sequence from={1140} durationInFrames={20} name="SFX: Whoosh Scene 2">
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.35} />
      </Sequence>

      {/* Scene 3: Vault Lock Sound when $8,000 freezes in Escrow */}
      <Sequence from={2460} durationInFrames={25} name="SFX: Escrow Lock">
        <Audio src={staticFile("sfx/lock.mp3")} volume={0.5} />
      </Sequence>

      {/* Scene 3: Tactile Click Sound when Cursor Clicks Approve */}
      <Sequence from={2680} durationInFrames={15} name="SFX: Cursor Click">
        <Audio src={staticFile("sfx/click.mp3")} volume={0.6} />
      </Sequence>

      {/* Scene 3: Success Chime when Certificate Mints */}
      <Sequence from={2700} durationInFrames={40} name="SFX: Success Chime">
        <Audio src={staticFile("sfx/success.mp3")} volume={0.5} />
      </Sequence>

      {/* Scene 4: Whoosh into Dashboard */}
      <Sequence from={3360} durationInFrames={20} name="SFX: Whoosh Scene 4">
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* Scene 5: Grand Outro Chime */}
      <Sequence from={5300} durationInFrames={45} name="SFX: Finale Chime">
        <Audio src={staticFile("sfx/success.mp3")} volume={0.5} />
      </Sequence>

      {/* ======================================================== */}
      {/* 3. VISUAL SCENES TIMELINE (Total: 5,700 Frames)          */}
      {/* ======================================================== */}
      {/* 1. Scene 1: The Threat Landscape (0 - 1140 frames / 38s) */}
      <Sequence from={0} durationInFrames={1140} name="Scene 1: Threat Landscape">
        <Scene1Problem />
      </Sequence>

      {/* 2. Scene 2: Zero-Trust MCP Gateway (1140 - 2280 frames / 38s) */}
      <Sequence from={1140} durationInFrames={1140} name="Scene 2: Gateway Architecture">
        <Scene2Architecture />
      </Sequence>

      {/* 3. Scene 3: End-to-End Live Acme Demo (2280 - 3360 frames / 36s) */}
      <Sequence from={2280} durationInFrames={1080} name="Scene 3: Acme CFO Demo">
        <Scene3Demo />
      </Sequence>

      {/* 4. Scene 4: ArmorIQ Policy Studio & Live Dashboard (3360 - 4560 frames / 40s) */}
      <Sequence from={3360} durationInFrames={1200} name="Scene 4: ArmorIQ & Dashboard">
        <Scene4ArmorIQ />
      </Sequence>

      {/* 5. Scene 5: Architectural Takeaways & Roadmap (4560 - 5700 frames / 38s) */}
      <Sequence from={4560} durationInFrames={1140} name="Scene 5: Takeaways & Roadmap">
        <Scene5Takeaways />
      </Sequence>

      {/* ======================================================== */}
      {/* 4. CINEMATIC OVERLAYS & PROGRESS BAR                     */}
      {/* ======================================================== */}
      {/* Subtle Cinematic Vignette Shadow at Edges */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-25"
        style={{
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.15)",
        }}
      />

      {/* Minimalist Progress Line at Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/90 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Top-Right Watermark Chapter Pill */}
      <div className="absolute top-8 right-12 z-50 flex items-center gap-2 pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-white/95 shadow-sm backdrop-blur-md border border-slate-200 text-xs font-mono text-slate-800 font-extrabold flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentChapter}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
