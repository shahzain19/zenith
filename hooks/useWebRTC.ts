"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useWebRTC(callId: Id<"calls">, userId: string, userName: string) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

    // Perfect Negotiation States per peer
    const makingOffer = useRef<Map<string, boolean>>(new Map());
    const isIgnoringOffer = useRef<Map<string, boolean>>(new Map());

    const sendSignal = useMutation(api.signaling.sendSignal);
    const clearSignals = useMutation(api.signaling.clearSignals);
    const signals = useQuery(api.signaling.getSignals, { callId, receiverId: userId });
    const participants = useQuery(api.calls.getParticipants, { callId });

    useEffect(() => {
        let active = true;
        async function initMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (active) setLocalStream(stream);
            } catch (err) {
                console.error("[WebRTC] Failed to get local media:", err);
            }
        }
        initMedia();

        return () => {
            active = false;
            localStream?.getTracks().forEach(track => track.stop());
            screenStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    // Handle incoming signals
    useEffect(() => {
        if (!signals || signals.length === 0) return;

        async function processSignals() {
            for (const signal of signals!) {
                const { senderId, data } = signal;
                const description = JSON.parse(data);

                let pc = peerConnections.current.get(senderId);
                if (!pc) {
                    pc = createPeerConnection(senderId);
                }

                try {
                    if (description.type === "offer" || description.type === "answer") {
                        const offerCollision = (description.type === "offer") &&
                            (makingOffer.current.get(senderId) || pc.signalingState !== "stable");

                        // Polite peer yields on collision
                        const polite = userId < senderId;
                        isIgnoringOffer.current.set(senderId, !polite && offerCollision);

                        if (isIgnoringOffer.current.get(senderId)) {
                            console.log(`[WebRTC] Ignoring offer from ${senderId} (collision)`);
                            continue;
                        }

                        await pc.setRemoteDescription(description);
                        if (description.type === "offer") {
                            await pc.setLocalDescription();
                            await sendSignal({
                                callId,
                                senderId: userId,
                                receiverId: senderId,
                                data: JSON.stringify(pc.localDescription)
                            });
                        }
                    } else if (description.type === "candidate") {
                        try {
                            await pc.addIceCandidate(description.candidate);
                        } catch (err) {
                            if (!isIgnoringOffer.current.get(senderId)) {
                                throw err;
                            }
                        }
                    }
                } catch (err) {
                    console.error(`[WebRTC] Error processing signal from ${senderId}:`, err);
                }
            }
            await clearSignals({ callId, receiverId: userId });
        }

        processSignals();
    }, [signals]);

    // Track participants and create connections
    useEffect(() => {
        if (!participants || !userId || !localStream) return;

        participants.forEach(p => {
            if (p.userId !== userId && !peerConnections.current.has(p.userId)) {
                createPeerConnection(p.userId);
            }
        });
    }, [participants, localStream, userId]);

    function createPeerConnection(remoteUserId: string) {
        console.log(`[WebRTC] Creating PeerConnection for ${remoteUserId}`);
        const pc = new RTCPeerConnection(iceServers);
        peerConnections.current.set(remoteUserId, pc);
        makingOffer.current.set(remoteUserId, false);
        isIgnoringOffer.current.set(remoteUserId, false);

        if (localStream) {
            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
        }

        pc.onnegotiationneeded = async () => {
            try {
                makingOffer.current.set(remoteUserId, true);
                await pc.setLocalDescription();
                await sendSignal({
                    callId,
                    senderId: userId,
                    receiverId: remoteUserId,
                    data: JSON.stringify(pc.localDescription),
                });
            } catch (err) {
                console.error(`[WebRTC] Negotiation error for ${remoteUserId}:`, err);
            } finally {
                makingOffer.current.set(remoteUserId, false);
            }
        };

        pc.onicecandidate = ({ candidate }) => {
            if (candidate) {
                sendSignal({
                    callId,
                    senderId: userId,
                    receiverId: remoteUserId,
                    data: JSON.stringify({ type: "candidate", candidate }),
                });
            }
        };

        pc.ontrack = ({ track, streams }) => {
            console.log(`[WebRTC] Received remote track: ${track.kind} from ${remoteUserId}`);
            setRemoteStreams(prev => {
                const next = new Map(prev);
                if (streams && streams[0]) {
                    next.set(remoteUserId, streams[0]);
                } else {
                    const stream = prev.get(remoteUserId) || new MediaStream();
                    stream.addTrack(track);
                    next.set(remoteUserId, stream);
                }
                return next;
            });
        };

        pc.onconnectionstatechange = () => {
            console.log(`[WebRTC] Connection state with ${remoteUserId}: ${pc.connectionState}`);
            if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
                cleanupConnection(remoteUserId);
            }
        };

        return pc;
    }

    function cleanupConnection(remoteUserId: string) {
        const pc = peerConnections.current.get(remoteUserId);
        if (pc) {
            pc.close();
            peerConnections.current.delete(remoteUserId);
            makingOffer.current.delete(remoteUserId);
            isIgnoringOffer.current.delete(remoteUserId);
            setRemoteStreams(prev => {
                const next = new Map(prev);
                next.delete(remoteUserId);
                return next;
            });
        }
    }

    function replaceTrack(newTrack: MediaStreamTrack | null) {
        const trackToUse = newTrack || localStream?.getVideoTracks()[0];
        if (!trackToUse) return;

        peerConnections.current.forEach(pc => {
            const sender = pc.getSenders().find(s => s.track?.kind === "video");
            if (sender) {
                sender.replaceTrack(trackToUse);
            }
        });
    }

    return { localStream, screenStream, setScreenStream, remoteStreams, replaceTrack };
}
