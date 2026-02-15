"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    LuVideo,
    LuUsers,
    LuMessageSquare,
    LuClock,
    LuFile,
    LuSparkles,
    LuArrowRight,
    LuGlobe,
    LuCopy
} from "react-icons/lu";
import Link from "next/link";

export default function RecapPage() {
    const params = useParams();
    const recapId = params.recapId as Id<"recaps">;
    const recap = useQuery(api.calls.getRecap, { recapId });

    if (!recap) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white">
                            <LuVideo size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-900">Zenith</span>
                    </div>
                </div>
            </nav>

            <main className="pt-40 pb-40 px-6 max-w-2xl mx-auto space-y-12">
                <div className="text-center space-y-6 animate-calm-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-violet-100/50 shadow-sm">
                        <LuSparkles size={12} />
                        <span>Meeting Memory</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                        {recap.meetingName} <br />
                        <span className="text-zinc-400">Recap</span>
                    </h1>
                </div>

                {recap.aiSummary && (
                    <div className="p-10 bg-violet-600 text-white rounded-[2.5rem] shadow-2xl shadow-violet-200 animate-calm-in space-y-6" style={{ animationDelay: "50ms" }}>
                        <div className="flex items-center gap-3 opacity-80">
                            <LuSparkles size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Genius AI Summary</span>
                        </div>
                        <div className="prose prose-invert max-w-none text-violet-50 font-medium leading-relaxed">
                            {recap.aiSummary.split('\n').map((line: string, i: number) => (
                                <p key={i} className={line.trim().startsWith('*') || line.trim().startsWith('-') ? "ml-4" : ""}>
                                    {line.replace(/^[* -]\s*/, '')}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recap Card */}
                <div className="p-10 bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl shadow-violet-100/50 space-y-12 animate-calm-in" style={{ animationDelay: "100ms" }}>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <LuUsers size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Participants</span>
                            </div>
                            <p className="text-4xl font-bold text-zinc-900">{recap.participantCount}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <LuClock size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                            </div>
                            <p className="text-4xl font-bold text-zinc-900">{recap.durationMinutes}m</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <LuMessageSquare size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Messages</span>
                            </div>
                            <p className="text-4xl font-bold text-zinc-900">{recap.messagesCount}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <LuFile size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Resources</span>
                            </div>
                            <p className="text-4xl font-bold text-zinc-900">{recap.filesCount}</p>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-zinc-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 opacity-30">
                            <LuGlobe size={14} className="text-zinc-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Public Record</span>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-300">
                            {new Date(recap.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-8 py-10 animate-calm-in" style={{ animationDelay: "200ms" }}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }}
                            className="h-16 px-8 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 w-full sm:w-auto"
                        >
                            <LuCopy size={20} />
                            Copy Recap Link
                        </button>
                        <Link href="/" className="w-full sm:w-auto">
                            <button className="h-16 px-10 bg-violet-600 text-white font-bold text-lg rounded-2xl hover:bg-violet-700 transition-all active:scale-95 shadow-xl shadow-violet-200 flex items-center justify-center gap-3 w-full">
                                Start Hosting Free
                                <LuArrowRight size={20} />
                            </button>
                        </Link>
                    </div>
                    <p className="text-zinc-400 font-medium text-xs">Elevated calls. Absolute focus. Built for teams who move fast.</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 bg-zinc-50 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                        Powered by Zenith Workspace
                    </p>
                </div>
            </footer>
        </div>
    );
}
