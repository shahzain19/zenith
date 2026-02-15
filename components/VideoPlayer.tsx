"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
    stream: MediaStream | null;
    muted?: boolean;
    label?: string;
    isLocal?: boolean;
}

export function VideoPlayer({ stream, muted, label, isLocal }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="resizable-video relative group bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-lg transition-all hover:shadow-xl">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                className={`w-full h-full object-cover ${isLocal && !stream?.getVideoTracks()[0]?.label.includes("screen") ? "scale-x-[-1]" : ""}`}
            />

            {/* Glossy Label */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto">
                <div className="glass-panel px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-zinc-900 text-[11px] sm:text-xs font-bold border border-white/40 shadow-sm flex items-center gap-2 whitespace-nowrap overflow-hidden max-w-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <span className="truncate">{label} {isLocal && "(You)"}</span>
                </div>
            </div>

            {/* Resize Handle Hint (Desktop Only) */}
            <div className="absolute bottom-1 right-1 w-4 h-4 text-zinc-300 pointer-events-none hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M19 19L5 5M19 11L11 19M19 15L15 19" /></svg>
            </div>
        </div>
    );
}
