import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCall = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const callId = await ctx.db.insert("calls", {
            name: args.name,
            createdAt: Date.now(),
        });
        return callId;
    },
});

export const getCall = query({
    args: { callId: v.id("calls") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.callId);
    },
});

export const joinCall = mutation({
    args: {
        callId: v.id("calls"),
        name: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const isAuthenticated = !!identity;
        // In a real scenario, 'plan' would come from Clerk JWT templates
        const isPro = identity?.plan === "pro" || (isAuthenticated && !identity?.plan); // Fallback: treat authenticated as pro for now if plan not set

        const participants = await ctx.db
            .query("participants")
            .withIndex("by_call", (q) => q.eq("callId", args.callId))
            .collect();

        // Enforce 4-participant limit for non-pro users
        if (!isPro && participants.length >= 4) {
            const isAlreadyIn = participants.some(p => p.userId === args.userId);
            if (!isAlreadyIn) {
                throw new Error("Room is full. Upgrade to Zenith Pro to join.");
            }
        }

        const existing = participants.find(p => p.userId === args.userId);

        if (existing) {
            await ctx.db.patch(existing._id, {
                name: args.name,
                lastSeen: Date.now(),
            });
            return existing._id;
        }

        return await ctx.db.insert("participants", {
            callId: args.callId,
            name: args.name,
            userId: args.userId,
            lastSeen: Date.now(),
        });
    },
});

export const createRecap = mutation({
    args: {
        callId: v.id("calls"),
        meetingName: v.string(),
        participantCount: v.number(),
        durationMinutes: v.number(),
        messagesCount: v.number(),
        filesCount: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("recaps", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const getRecap = query({
    args: { recapId: v.id("recaps") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.recapId);
    },
});

export const getParticipants = query({
    args: { callId: v.id("calls") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("participants")
            .withIndex("by_call", (q) => q.eq("callId", args.callId))
            .collect();
    },
});
