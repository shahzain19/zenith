import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
    args: {
        callId: v.id("calls"),
        userName: v.string(),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            callId: args.callId,
            userName: args.userName,
            text: args.text,
            createdAt: Date.now(),
        });
    },
});

export const getMessages = query({
    args: { callId: v.id("calls") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_call", (q) => q.eq("callId", args.callId))
            .order("desc")
            .take(50);
    },
});
