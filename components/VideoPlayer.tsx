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
        <div className="video-container group animate-calm-in">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                className={`w-full h-full object-cover transition-transform duration-700 ${isLocal && !stream?.getVideoTracks()[0]?.label.includes("screen") ? "scale-x-[-1]" : ""}`}
            />

            {/* Premium Glass Label */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 transition-all duration-300 group-hover:translate-x-1">
                <div className="glass-panel px-4 py-2 rounded-2xl text-zinc-900 text-[11px] sm:text-xs font-bold border border-white/40 shadow-xl flex items-center gap-2 whitespace-nowrap overflow-hidden max-w-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="truncate">{label} {isLocal && "(You)"}</span>
                </div>
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
