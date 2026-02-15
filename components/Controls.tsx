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
    LuSlack,
    LuUserPlus
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

    const [showShareMenu, setShowShareMenu] = useState(false);

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto relative">
            <button
                onClick={toggleMic}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 ${micOn
                    ? "bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:shadow-md"
                    : "bg-red-500 text-white shadow-lg shadow-red-200 border border-red-400"
                    }`}
                title={micOn ? "Mute Mic" : "Unmute Mic"}
            >
                {micOn ? <LuMic size={20} /> : <LuMicOff size={20} />}
                <span className="hidden lg:inline text-sm">{micOn ? "Mute" : "Unmute"}</span>
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
                <span className="hidden lg:inline text-sm">{camOn ? "Stop Video" : "Start Video"}</span>
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

            {/* Smart Invites Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 ${showShareMenu
                        ? "bg-violet-50 text-violet-600 border border-violet-100 shadow-md"
                        : "bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:shadow-md"
                        }`}
                >
                    <LuUserPlus size={20} />
                    <span className="hidden lg:inline text-sm">Invite</span>
                </button>

                {showShareMenu && (
                    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 animate-calm-in z-50">
                        <button
                            onClick={() => { shareToWhatsApp(); setShowShareMenu(false); }}
                            className="w-full flex items-center gap-3 p-3 text-left text-sm font-bold text-zinc-600 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors"
                        >
                            <LuMessageCircle size={18} />
                            WhatsApp
                        </button>
                        <button
                            onClick={() => { shareToSlack(); setShowShareMenu(false); }}
                            className="w-full flex items-center gap-3 p-3 text-left text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors"
                        >
                            <LuSlack size={18} />
                            Slack
                        </button>
                        <div className="h-[1px] bg-zinc-100 my-1" />
                        <button
                            onClick={() => { handleCopyLink(); setShowShareMenu(false); }}
                            className="w-full flex items-center gap-3 p-3 text-left text-sm font-bold text-zinc-600 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
                        >
                            <LuCopy size={18} />
                            Copy Link
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={() => onHangUp ? onHangUp() : window.location.href = "/"}
                className="p-3.5 sm:p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-200 flex items-center justify-center gap-2 font-bold active:scale-95 border border-red-500 ml-auto"
                title="Hang Up"
            >
                <LuPhoneOff size={20} />
                <span className="hidden md:inline text-sm">Leave</span>
            </button>
        </div>
    );
}
