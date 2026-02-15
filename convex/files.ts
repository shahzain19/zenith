import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveFileMetadata = mutation({
    args: {
        callId: v.id("calls"),
        userName: v.string(),
        fileName: v.string(),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("files", {
            callId: args.callId,
            userName: args.userName,
            fileName: args.fileName,
            storageId: args.storageId,
            createdAt: Date.now(),
        });
    },
});

export const getFiles = query({
    args: { callId: v.id("calls") },
    handler: async (ctx, args) => {
        const files = await ctx.db
            .query("files")
            .withIndex("by_call", (q) => q.eq("callId", args.callId))
            .collect();

        return Promise.all(
            files.map(async (file) => ({
                ...file,
                url: await ctx.storage.getUrl(file.storageId),
            }))
        );
    },
});
