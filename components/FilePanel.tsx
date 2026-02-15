"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { LuFileUp, LuFile as FileIcon, LuDownload, LuLoader } from "react-icons/lu";

interface FilePanelProps {
    callId: Id<"calls">;
    userName: string;
}

export function FilePanel({ callId, userName }: FilePanelProps) {
    const [uploading, setUploading] = useState(false);
    const files = useQuery(api.files.getFiles, { callId });
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveFileMetadata = useMutation(api.files.saveFileMetadata);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            const { storageId } = await result.json();
            await saveFileMetadata({
                callId,
                userName,
                fileName: file.name,
                storageId,
            });
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
                {files?.map((file) => (
                    <div
                        key={file._id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 transition-all hover:bg-white hover:shadow-sm group"
                    >
                        <div className="p-3.5 rounded-xl bg-white text-zinc-400 shadow-sm transition-transform duration-500">
                            <FileIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-900 tracking-tight truncate leading-none mb-1.5">{file.fileName}</p>
                            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">By {file.userName}</p>
                        </div>
                        {file.url && (
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 text-zinc-300 hover:text-blue-600 transition-all"
                            >
                                <LuDownload size={18} />
                            </a>
                        )}
                    </div>
                ))}
                {files?.length === 0 && !uploading && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-6 opacity-20">
                        <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                            <LuFileUp size={32} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Workspace empty</p>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-zinc-100 bg-white">
                <label className={`
          flex items-center justify-center gap-3 w-full h-14 px-6 rounded-2xl 
          border-2 border-dashed border-zinc-100 
          hover:bg-zinc-50 hover:border-zinc-200 transition-all cursor-pointer
          ${uploading ? "opacity-30 cursor-not-allowed" : ""}
        `}>
                    {uploading ? (
                        <>
                            <LuLoader size={20} className="animate-spin text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Encrypting...</span>
                        </>
                    ) : (
                        <>
                            <LuFileUp size={20} className="text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Drop a file</span>
                        </>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>
        </div>
    );
}
