"use client";

import { LuVideo, LuShieldCheck, LuLock, LuUsers, LuDatabase, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:-translate-x-1">
                        <div className="w-10 h-10 bg-zinc-50 text-zinc-400 rounded-xl flex items-center justify-center border border-zinc-100">
                            <LuArrowLeft size={20} />
                        </div>
                        <span className="text-sm font-bold text-zinc-500">Back to Landing</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white">
                            <LuVideo size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-900">Zenith</span>
                    </div>
                </div>
            </nav>

            <main className="pt-40 pb-40 px-6 max-w-4xl mx-auto space-y-32">
                {/* Header Section */}
                <section className="space-y-6 animate-calm-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100/50">
                        <LuShieldCheck size={14} />
                        <span>Enterprise-Grade Privacy</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-tight">
                        Security by default, <br />
                        <span className="text-zinc-400">not as an afterthought.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium max-w-2xl">
                        We built Zenith with a privacy-first architecture. Your data never touches our servers because your privacy is non-negotiable.
                    </p>
                </section>

                {/* Security Pillars */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <LuLock size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">Peer-to-Peer Encryption</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">
                                Using WebRTC's native encryption, your audio, video, and data streams are encrypted directly between participants. There's no middle-man.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-zinc-50 text-zinc-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <LuDatabase size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">Zero-Log Policy</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">
                                We don't store your transcripts, your recordings, or your meeting metadata. Once the meeting ends, the signals disappear forever.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-zinc-50 text-zinc-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <LuUsers size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">Minimal Identity</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">
                                No account required. Join with a temporary name that's only used for the duration of the call. We collect zero personal identifiers.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <LuShieldCheck size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">Secure Signalling</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">
                                Even our signalling layer is built with high-entropy meeting IDs and secure WebSockets to prevent unauthorized room access.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Detailed Section */}
                <section className="p-10 md:p-14 bg-zinc-50/50 rounded-[3rem] border border-zinc-100 space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            Zenith utilizes a "Mesh Networking" approach for small meetings. This means every participant connects directly to every other participant.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { step: "01", title: "Handshake", desc: "Secure signaling establishes a direct path." },
                            { step: "02", title: "Key Exchange", desc: "Encryption keys are negotiated peer-to-peer." },
                            { step: "03", title: "Transmission", desc: "Data flows directly, encrypted at rest and in transit." }
                        ].map((item) => (
                            <div key={item.step} className="space-y-3">
                                <span className="text-violet-600 font-bold text-sm tracking-widest">{item.step}</span>
                                <h4 className="font-bold text-zinc-900">{item.title}</h4>
                                <p className="text-xs text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center space-y-8 py-20">
                    <h2 className="text-3xl font-bold tracking-tight">Ready to meet securely?</h2>
                    <Link href="/">
                        <button className="h-16 px-10 bg-zinc-900 text-white font-bold text-lg rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                            Start a Secure Meeting
                        </button>
                    </Link>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 bg-zinc-50 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3 opacity-30">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                            <LuVideo size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-900">Zenith</span>
                    </div>
                    <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                        © 2026 Zenith. The power of zero-knowledge connection.
                    </p>
                </div>
            </footer>
        </div>
    );
}
