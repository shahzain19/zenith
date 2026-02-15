import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const generateSummary = action({
    args: {
        callId: v.id("calls"),
    },
    handler: async (ctx, args) => {
        const messages = await ctx.runQuery(api.messages.getMessages, { callId: args.callId });

        if (!messages || messages.length === 0) {
            return "No messages were exchanged during this meeting.";
        }

        const transcript = messages
            .reverse() // Get chronological order
            .map((m: any) => `${m.userName}: ${m.text}`)
            .join("\n");

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set in environment variables");
            return "AI Summary is unavailable (API key missing).";
        }

        const prompt = `
            You are a professional meeting assistant for Zenith. 
            Summarize the following meeting transcript into a concise, high-impact summary.
            Focus on key decisions, action items, and the general sentiment.
            Keep it professional and minimal. Use bullet points if necessary.
            
            Transcript:
            ${transcript}
            
            Summary:
        `;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        }
                    }),
                }
            );

            const data: any = await response.json();
            const text: any = data.candidates?.[0]?.content?.parts?.[0]?.text;

            return (text as string) || "Failed to generate summary.";
        } catch (err) {
            console.error("Gemini Error:", err);
            return "Error generating AI summary.";
        }
    },
});
