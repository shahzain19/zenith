"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState, useMemo } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChatPanel } from "@/components/ChatPanel";
import { FilePanel } from "@/components/FilePanel";
import { Controls } from "@/components/Controls";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
    LuVideo,
    LuArrowRight,
    LuMessageSquare,
    LuUsers,
    LuSparkles,
    LuX,
    LuUserPlus,
    LuLayoutGrid,
    LuTriangleAlert
} from "react-icons/lu";

export default function RoomPage() {
    const params = useParams();
    const callId = params.callId as Id<"calls">;
    const { userId: clerkUserId, isLoaded } = useAuth();
    const [userName, setUserName] = useState<string>("");
    const [userId] = useState(() => Math.random().toString(36).substring(7));
    const [joined, setJoined] = useState(false);
    const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recapId, setRecapId] = useState<Id<"recaps"> | null>(null);
    const [startTime] = useState(() => Date.now());

    const isAuthenticated = !!clerkUserId;
    const call = useQuery(api.calls.getCall, { callId });
    const joinCall = useMutation(api.calls.joinCall);
    const createRecap = useMutation(api.calls.createRecap);
    const messages = useQuery(api.messages.getMessages, { callId }) || [];
    const files = useQuery(api.files.getFiles, { callId }) || [];
    const participants = useQuery(api.participants.getParticipants, { callId }) || [];

    const { localStream, screenStream, setScreenStream, remoteStreams, replaceTrack } = useWebRTC(callId, userId, userName);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) return;
        setError(null);
        try {
            await joinCall({ callId, name: userName, userId });
            setJoined(true);
        } catch (err: any) {
            setError(err.message || "Failed to join. Upgrade to Zenith Pro for larger meetings.");
        }
    };

    const handleScreenShare = (stream: MediaStream | null) => {
        setScreenStream(stream);
        if (stream) {
            replaceTrack(stream.getVideoTracks()[0]);
        } else {
            replaceTrack(null); // Reverts to camera
        }
    };

    if (!isLoaded || !call) return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200 animate-pulse-subtle">
                    <LuVideo size={20} />
                </div>
                <p className="text-zinc-500 font-bold tracking-tight text-sm">Zenith is warming up...</p>
            </div>
        </div>
    );

    if (!joined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden p-6 selection:bg-violet-100 selection:text-violet-900">
                {/* Minimal Background Decoration */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-50/50 rounded-full blur-[120px] -z-10" />

                <div className="w-full max-w-md p-10 sm:p-14 bg-white rounded-[2.5rem] border border-zinc-100 flex flex-col items-center text-center gap-10 animate-calm-in">
                    <div className="space-y-4">
                        {!isAuthenticated && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-violet-100/50">
                                <LuUsers size={12} />
                                <span>Guest: 4 Participants Max</span>
                            </div>
                        )}
                        {isAuthenticated && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-50 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-zinc-100">
                                <LuSparkles size={12} className="text-zinc-300" />
                                <span>Zenith Verified</span>
                            </div>
                        )}
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 leading-tight">{call.name}</h1>
                        <p className="text-zinc-400 font-medium text-sm leading-relaxed max-w-[240px] mx-auto">Enter your identity to join the Zenith workspace.</p>
                    </div>

                    <form onSubmit={handleJoin} className="w-full space-y-4">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Display name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full h-16 px-8 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-900 text-lg font-medium outline-none focus:ring-2 focus:ring-violet-500/10 focus:bg-white transition-all placeholder:text-zinc-300"
                                required
                                autoFocus
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-xs font-bold px-2 py-1 animate-calm-in">
                                    <LuTriangleAlert size={14} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full h-16 bg-zinc-900 text-white font-bold text-lg rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-3">
                            <span>Join Workspace</span>
                            <LuArrowRight size={20} className="opacity-40" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (recapId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white p-6">
                <div className="w-full max-w-md p-10 bg-white rounded-[2.5rem] border border-zinc-100 text-center space-y-10 animate-calm-in">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-violet-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-violet-200">
                            <LuSparkles size={32} />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Meeting Recap Ready</h2>
                        <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                            Share this professional recap with your teammates or on social media.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                const url = `${window.location.origin}/recap/${recapId}`;
                                navigator.clipboard.writeText(url);
                            }}
                            className="w-full h-16 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95"
                        >
                            <LuCopy size={20} />
                            Copy Recap Link
                        </button>
                        <a
                            href={`/recap/${recapId}`}
                            className="block w-full h-16 bg-violet-50 text-violet-600 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-violet-100 transition-all"
                        >
                            View Recap
                        </a>
                    </div>

                    <Link href="/" className="inline-block text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-600 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white text-zinc-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0">
                {/* Header */}
                <header className="px-6 h-20 flex items-center justify-between border-b border-zinc-100 bg-white/60 backdrop-blur-xl sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-50 text-zinc-400 rounded-xl flex items-center justify-center border border-zinc-100">
                            <LuVideo size={18} />
                        </div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold text-zinc-900 tracking-tight truncate max-w-[140px] sm:max-w-none">{call.name}</h2>
                            {!isAuthenticated ? (
                                <Link href="/pricing" className="flex items-center gap-1.5 px-2 py-0.5 bg-violet-50 text-[10px] font-bold text-violet-600 rounded-md border border-violet-100 uppercase tracking-widest hover:bg-violet-100 transition-colors">
                                    Guest Cap: 4
                                </Link>
                            ) : (
                                <Link href="/pricing" className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-[10px] font-bold text-green-600 rounded-md border border-green-100 uppercase tracking-widest hover:bg-green-100 transition-colors">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                    Zenith Pro
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 hover:bg-zinc-50 rounded-xl transition-colors cursor-default">
                            <div className="flex -space-x-1.5">
                                {[...Array(Math.min(3, remoteStreams.size + 1))].map((_, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                {remoteStreams.size + 1} Present
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pl-4 border-l border-zinc-100">
                            <UserButton afterSignOutUrl="/" />
                        </div>

                        {/* Mobile Sidebar Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="xl:hidden p-2.5 bg-zinc-50 text-zinc-600 rounded-xl border border-zinc-100 hover:bg-white hover:shadow-sm transition-all active:scale-95 relative"
                        >
                            <LuMessageSquare size={20} />
                        </button>
                    </div>
                </header>

                {/* Video Grid */}
                <main className="flex-1 p-6 overflow-y-auto bg-zinc-50/20 flex flex-col items-center scrollbar-hide">
                    <div className="flex flex-wrap gap-6 justify-center items-center w-full max-w-7xl mx-auto min-h-full py-12">
                        {/* Display stream (Local share) if active, else Local Camera */}
                        {screenStream ? (
                            <VideoPlayer stream={screenStream} muted isLocal label={`${userName}'s Screen`} />
                        ) : (
                            <VideoPlayer stream={localStream} muted isLocal label={userName} />
                        )}

                        {Array.from(remoteStreams.entries()).map(([remoteId, stream]) => (
                            <VideoPlayer key={remoteId} stream={stream} label={`Participant ${remoteId.substring(0, 4)}`} />
                        ))}

                        {remoteStreams.size === 0 && !screenStream && (
                            <div className="w-full flex-1 flex flex-col items-center justify-center py-20 text-zinc-400 gap-8 animate-calm-in">
                                <div className="p-10 bg-white text-zinc-300 rounded-[2.5rem] border border-zinc-100 shadow-sm animate-float-calm">
                                    <LuUserPlus size={40} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-bold text-zinc-900 tracking-tight">Isolated Room</p>
                                    <p className="text-zinc-400 font-medium text-sm">Quietly awaiting other participants...</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    className="h-12 px-8 bg-zinc-50 text-zinc-600 font-bold text-sm rounded-2xl border border-zinc-100 hover:bg-white hover:text-zinc-900 hover:shadow-sm transition-all active:scale-95"
                                >
                                    Copy Meeting URL
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Controls */}
                <footer className="px-4 py-4 sm:px-6 bg-white/80 backdrop-blur-md border-t border-zinc-100 z-20">
                    <Controls localStream={localStream} onScreenShare={handleScreenShare} onHangUp={handleEndMeeting} />
                </footer>
            </div>

            {/* Sidebar - Desktop (Fixed) & Mobile (Slide-in) */}
            <div
                className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <aside className={`
                w-full max-w-[380px] fixed top-0 right-0 h-full z-50 bg-white shadow-2xl sidebar-transition xl:relative xl:translate-x-0 xl:shadow-none xl:z-auto border-l border-zinc-100 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-20 flex items-center border-b border-zinc-100 px-6 shrink-0">
                    <div className="flex-1 flex p-1 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "chat" ? "bg-white text-violet-600 shadow-sm border border-zinc-100" : "text-zinc-400 hover:text-zinc-600"}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab("files")}
                            className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "files" ? "bg-white text-violet-600 shadow-sm border border-zinc-100" : "text-zinc-400 hover:text-zinc-600"}`}
                        >
                            Files
                        </button>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="xl:hidden ml-4 p-2 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-xl transition-all"
                    >
                        <LuX size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === "chat" ? (
                        <ChatPanel callId={callId} userName={userName} />
                    ) : (
                        <FilePanel callId={callId} userName={userName} />
                    )}
                </div>
            </aside>
        </div >
    );
}
