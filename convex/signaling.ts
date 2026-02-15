import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendSignal = mutation({
    args: {
        callId: v.id("calls"),
        senderId: v.string(),
        receiverId: v.string(),
        data: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("signaling", {
            callId: args.callId,
            senderId: args.senderId,
            receiverId: args.receiverId,
            data: args.data,
            createdAt: Date.now(),
        });
    },
});

export const getSignals = query({
    args: {
        callId: v.id("calls"),
        receiverId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("signaling")
            .withIndex("by_call_receiver", (q) =>
                q.eq("callId", args.callId).eq("receiverId", args.receiverId)
            )
            .order("asc")
            .collect();
    },
});

export const clearSignals = mutation({
    args: {
        callId: v.id("calls"),
        receiverId: v.string(),
    },
    handler: async (ctx, args) => {
        const signals = await ctx.db
            .query("signaling")
            .withIndex("by_call_receiver", (q) =>
                q.eq("callId", args.callId).eq("receiverId", args.receiverId)
            )
            .collect();

        for (const signal of signals) {
            await ctx.db.delete(signal._id);
        }
    },
});
