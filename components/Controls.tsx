"use client";

import { useState } from "react";
import {
    LuCamera,
    LuCameraOff,
    LuMic,
    LuMicOff,
    LuMonitor,
    LuPhoneOff,
    LuCopy,
    LuShare2,
    LuMessageCircle,
    LuSlack
} from "react-icons/lu";

interface ControlsProps {
    localStream: MediaStream | null;
    onScreenShare?: (stream: MediaStream | null) => void;
    onHangUp?: () => void;
}

export function Controls({ localStream, onScreenShare, onHangUp }: ControlsProps) {
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !micOn;
            });
            setMicOn(!micOn);
        }
    };

    const toggleCam = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !camOn;
            });
            setCamOn(!camOn);
        }
    };

    const toggleScreenShare = async () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
            onScreenShare?.(null);
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                setScreenStream(stream);
                onScreenShare?.(stream);

                stream.getVideoTracks()[0].onended = () => {
                    setScreenStream(null);
                    onScreenShare?.(null);
                };
            } catch (err) {
                console.error("Screen share error:", err);
            }
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const shareToWhatsApp = () => {
        const text = encodeURIComponent(`Join my Zenith workspace for a professional video call: ${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareToSlack = () => {
        const text = encodeURIComponent(`Join my Zenith workspace: ${window.location.href}`);
        window.open(`https://slack.com/share?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
            <button
                onClick={toggleMic}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 ${micOn
                    ? "bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:shadow-md"
                    : "bg-red-500 text-white shadow-lg shadow-red-200 border border-red-400"
                    }`}
                title={micOn ? "Mute Mic" : "Unmute Mic"}
            >
                {micOn ? <LuMic size={20} /> : <LuMicOff size={20} />}
                <span className="hidden md:inline text-sm">{micOn ? "Mute" : "Unmute"}</span>
            </button>

            <button
                onClick={toggleCam}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 ${camOn
                    ? "bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:shadow-md"
                    : "bg-red-500 text-white shadow-lg shadow-red-200 border border-red-400"
                    }`}
                title={camOn ? "Stop Cam" : "Start Cam"}
            >
                {camOn ? <LuCamera size={20} /> : <LuCameraOff size={20} />}
                <span className="hidden md:inline text-sm">{camOn ? "Stop Video" : "Start Video"}</span>
            </button>

            <button
                onClick={toggleScreenShare}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 ${screenStream
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200 border-violet-400"
                    : "bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:shadow-md"
                    }`}
                title={screenStream ? "Stop Share" : "Share Screen"}
            >
                <LuMonitor size={20} />
                <span className="hidden lg:inline text-sm">{screenStream ? "Sharing" : "Present"}</span>
            </button>

            <div className="h-8 w-[1px] bg-zinc-200 mx-1 sm:mx-2 hidden sm:block" />

            {/* Smart Invites */}
            <button
                onClick={shareToWhatsApp}
                className="p-3.5 sm:p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-300 shadow-lg shadow-green-100 flex items-center justify-center gap-2 font-bold active:scale-95 border border-green-400"
                title="Share to WhatsApp"
            >
                <LuMessageCircle size={20} />
                <span className="hidden xl:inline text-sm">WhatsApp</span>
            </button>

            <button
                onClick={shareToSlack}
                className="p-3.5 sm:p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-zinc-200 flex items-center justify-center gap-2 font-bold active:scale-95 border border-zinc-700"
                title="Share to Slack"
            >
                <LuSlack size={20} />
                <span className="hidden xl:inline text-sm">Slack</span>
            </button>

            <button
                onClick={() => onHangUp ? onHangUp() : window.location.href = "/"}
                className="p-3.5 sm:p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-200 flex items-center justify-center gap-2 font-bold active:scale-95 border border-red-500"
                title="Hang Up"
            >
                <LuPhoneOff size={20} />
                <span className="hidden md:inline text-sm">Leave</span>
            </button>
        </div>
    );
}
