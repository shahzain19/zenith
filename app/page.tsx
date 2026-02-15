"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter} from "next/navigation";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, ClerkLoading } from "@clerk/nextjs";
import {
  LuVideo,
  LuZap,
  LuShieldCheck,
  LuUsers,
  LuGlobe,
  LuArrowRight,
  LuSparkles,
  LuLayoutGrid,
  LuLoader
} from "react-icons/lu";
import Link from "next/link";

export default function Home() {
  const createCall = useMutation(api.calls.createCall);
  const router = useRouter();
  const [meetingName, setMeetingName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingName.trim()) return;
    setIsCreating(true);
    try {
      const callId = await createCall({ name: meetingName });
      router.push(`/room/${callId}`);
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <LuVideo size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Zenith</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="/security" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              Security
            </a>
            <a href="#features" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              Pricing
            </a>
            <ClerkLoading>
              <LuLoader size={20} className="animate-spin text-zinc-300" />
            </ClerkLoading>
            <SignedOut>
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-6">
                <Link href="/pricing" className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2 py-0.5 rounded border border-violet-100 hover:bg-violet-100 transition-colors">Zenith Pro</Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center space-y-12 max-w-3xl mx-auto animate-calm-in">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-xs font-bold uppercase tracking-widest border border-violet-100/50">
              <LuSparkles size={14} />
              <span>Version 2.0 is here</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
              Elevated calls, <br />
              <span className="text-zinc-400">absolute focus.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium max-w-xl mx-auto">
              Professional meeting experiences designed for deep focus and absolute clarity. Welcome to the Zenith of communication.
            </p>
          </div>

          <div className="max-w-md mx-auto p-2 bg-zinc-50 border border-zinc-100 rounded-[2rem] shadow-sm">
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Name your workspace..."
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="flex-1 h-16 px-8 rounded-[1.5rem] bg-white border border-zinc-100 text-lg font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={isCreating}
                className="h-16 px-8 bg-violet-600 text-white font-bold text-lg rounded-[1.5rem] hover:bg-violet-700 transition-all active:scale-95 shadow-lg shadow-violet-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Start Meeting</span>
                    <LuArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mt-40 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 leading-tight">Everything you need.</h2>
            <p className="text-zinc-500 font-medium text-lg max-w-xl mx-auto">A full suite of professional tools designed for seamless communication.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card group">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-90 transition-transform duration-500">
                  <LuZap size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">Instant Sync</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    Engineered with WebRTC for sub-50ms latency in every interaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="bento-card group md:col-span-2">
              <div className="flex flex-col sm:flex-row h-full gap-8">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-90 transition-transform duration-500">
                    <LuShieldCheck size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">Private by Design</h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
                      True peer-to-peer encryption ensures your discussions remain entirely yours.
                    </p>
                  </div>
                </div>
                <div className="flex-1 bg-zinc-100 rounded-[1.5rem] border border-zinc-200/50 p-6 flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
                  <div className="flex -space-x-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-zinc-100 shadow-sm flex items-center justify-center text-xs font-bold text-zinc-400">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 relative z-10">Global Workspace</div>
                </div>
              </div>
            </div>

            <div className="bento-card group md:col-span-2">
              <div className="flex flex-col sm:flex-row h-full gap-8">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-90 transition-transform duration-500">
                    <LuLayoutGrid size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">Fluid Layouts</h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
                      Customizable workspace designed to adapt to your unique workflow.
                    </p>
                  </div>
                </div>
                <div className="flex-1 min-h-[140px] bg-zinc-900 rounded-[1.5rem] p-6 relative overflow-hidden group-hover:bg-zinc-800 transition-colors duration-500">
                  <div className="absolute top-1/2 left-12 -translate-y-1/2 w-32 h-20 bg-white/10 rounded-xl border border-white/20 blur-[1px] group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-1/2 left-24 -translate-y-1/2 w-32 h-20 bg-white/5 rounded-xl border border-white/10 rotate-6" />
                </div>
              </div>
            </div>

            <div className="bento-card group">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-90 transition-transform duration-500">
                  <LuGlobe size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">Zero Borders</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    Join from any device, anywhere, without installing a single plugin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-40 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 leading-tight">Simple Pricing.</h2>
            <p className="text-zinc-500 font-medium text-lg max-w-xl mx-auto">Choose the plan that fits your collaboration needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-10 rounded-[2.5rem] border border-zinc-100 bg-white space-y-8 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500">
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">Free</h3>
                <p className="text-4xl font-bold text-zinc-900">$0</p>
                <p className="text-sm text-zinc-400 font-medium italic">Perfect for small teams</p>
              </div>
              <ul className="space-y-4">
                {["Up to 4 participants", "Unlimited meetings", "Screen sharing", "Basic chat"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                    <div className="w-5 h-5 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center">
                      <LuShieldCheck size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full h-14 bg-zinc-50 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-100 transition-all active:scale-95">
                Current Plan
              </button>
            </div>
            <div className="relative p-10 rounded-[2.5rem] border border-violet-100 bg-violet-50/10 space-y-8 shadow-xl shadow-violet-100/20 hover:shadow-violet-200/40 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                Recommended
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">Pro</h3>
                <p className="text-4xl font-bold text-zinc-900">$10<span className="text-sm font-medium text-zinc-400">/mo</span></p>
                <p className="text-sm text-zinc-400 font-medium italic">Unlimited possibilities</p>
              </div>
              <ul className="space-y-4">
                {["Unlimited participants", "Recording & AI summaries", "Advanced file sharing", "Priority support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                    <div className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center">
                      <LuShieldCheck size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/pricing">
                <button className="w-full h-14 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all active:scale-95 shadow-lg shadow-violet-200">
                  Upgrade Now
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-40 pt-40 border-t border-zinc-100 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Daily Users", val: "250K+" },
            { label: "Calls Made", val: "1.2M" },
            { label: "Uptime", val: "99.99%" },
            { label: "Avg. Latency", val: "42ms" }
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-3xl font-bold tracking-tight text-zinc-900">{stat.val}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-20 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <LuVideo size={16} />
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-900">Zenith</span>
          </div>
          <p className="text-zinc-400 text-xs font-medium">
            © 2026 Zenith. All rights reserved. Built for clarity.
          </p>
          <div className="flex gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            <a href="/security" className="hover:text-zinc-900 transition-colors">Security</a>
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
