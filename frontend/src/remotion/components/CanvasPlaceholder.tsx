import React from "react";
import { Video, staticFile } from "remotion";
import { Video as VideoIcon, Sparkles } from "lucide-react";

interface CanvasPlaceholderProps {
  slotId: string;
  title: string;
  recommendedDuration: string;
  instructions: string;
  videoSrc?: string;
  aspectRatio?: "16/9" | "4/3";
  className?: string;
}

export function CanvasPlaceholder({
  slotId,
  title,
  recommendedDuration,
  instructions,
  videoSrc,
  className = "",
}: CanvasPlaceholderProps) {
  if (videoSrc) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 shadow-2xl bg-black ${className}`}>
        <Video
          src={staticFile(videoSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE SCREEN RECORDING ACTIVE</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-500/50 bg-[#0B0D13]/90 backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl ${className}`}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs border border-amber-500/30">
            {slotId}
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              {title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Target Duration: {recommendedDuration}
            </span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>DROP RECORDING HERE</span>
        </div>
      </div>

      {/* Center Visual Mock */}
      <div className="my-auto py-6 text-center space-y-2">
        <div className="h-14 w-14 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <VideoIcon className="h-7 w-7 opacity-80" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <p className="text-xs font-mono text-slate-200 font-semibold">
            Interactive Video Overlay Canvas
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            {instructions}
          </p>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Path: public/recordings/{slotId}.mp4</span>
        <span className="text-amber-400 font-bold">REPLACEABLE AT ANY TIME</span>
      </div>
    </div>
  );
}
