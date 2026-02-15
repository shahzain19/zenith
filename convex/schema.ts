import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  calls: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),
  participants: defineTable({
    callId: v.id("calls"),
    name: v.string(),
    userId: v.string(), // Unique identifier for the session
    lastSeen: v.number(),
  }).index("by_call", ["callId"]),
  messages: defineTable({
    callId: v.id("calls"),
    userName: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_call", ["callId"]),
  files: defineTable({
    callId: v.id("calls"),
    userName: v.string(),
    fileName: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  }).index("by_call", ["callId"]),
  signaling: defineTable({
    callId: v.id("calls"),
    senderId: v.string(),
    receiverId: v.string(),
    data: v.string(), // JSON stringified WebRTC data
    createdAt: v.number(),
  })
    .index("by_call_receiver", ["callId", "receiverId"])
    .index("by_call_sender", ["callId", "senderId"]),
});
