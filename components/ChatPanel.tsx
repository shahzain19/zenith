"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useRef, useEffect } from "react";
import { LuMessageSquare, LuSend } from "react-icons/lu";

interface ChatPanelProps {
    callId: Id<"calls">;
    userName: string;
}

export function ChatPanel({ callId, userName }: ChatPanelProps) {
    const [text, setText] = useState("");
    const messages = useQuery(api.messages.getMessages, { callId });
    const sendMessage = useMutation(api.messages.sendMessage);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        await sendMessage({ callId, userName, text });
        setText("");
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
            >
                {messages?.map((msg) => (
                    <div key={msg._id} className={`flex flex-col ${msg.userName === userName ? "items-end" : "items-start"}`}>
                        <span className="text-[10px] font-bold text-zinc-300 mb-2 px-1 uppercase tracking-widest">{msg.userName}</span>
                        <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed transition-all ${msg.userName === userName
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-zinc-50 text-zinc-600 rounded-tl-none border border-zinc-100"
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {messages?.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-6 opacity-20">
                        <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                            <LuMessageSquare size={32} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest">No active signals</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-6 border-t border-zinc-100 bg-white">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-14 pl-6 pr-14 rounded-2xl bg-zinc-50 border border-zinc-100 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-zinc-300"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-30"
                        disabled={!text.trim()}
                    >
                        <LuSend size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
