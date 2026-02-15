"use client";

import { PricingTable } from "@clerk/nextjs";
import { LuVideo, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:-translate-x-1">
                        <div className="w-10 h-10 bg-zinc-50 text-zinc-400 rounded-xl flex items-center justify-center border border-zinc-100">
                            <LuArrowLeft size={20} />
                        </div>
                        <span className="text-sm font-bold text-zinc-500">Back to Zenith</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white">
                            <LuVideo size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-900">Zenith</span>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-20 animate-calm-in">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
                        Choose your <span className="text-violet-600">Zenith</span>
                    </h1>
                    <p className="text-lg text-zinc-500 font-medium max-w-xl mx-auto">
                        Scale your connections with professional limits and enterprise-grade tools.
                    </p>
                </div>

                <div className="animate-calm-in" style={{ animationDelay: "100ms" }}>
                    <PricingTable />
                </div>

                <div className="mt-20 text-center space-y-4 animate-calm-in" style={{ animationDelay: "200ms" }}>
                    <p className="text-sm text-zinc-400 font-medium">
                        Securely processed via Stripe. Powered by Clerk.
                    </p>
                </div>
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
                        © 2026 Zenith. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
