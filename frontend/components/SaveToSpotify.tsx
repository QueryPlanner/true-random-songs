"use client";

import { useState, useCallback } from "react";
import {
    hasValidToken,
    getAccessToken,
    redirectToSpotifyAuth,
    storePendingTracks,
    createPlaylistWithTracks,
    clearSpotifySession,
} from "@/lib/spotify";

interface Track {
    id: string;
    name: string;
}

type SaveState = "idle" | "saving" | "success" | "error";

interface SaveToSpotifyProps {
    tracks: Track[];
}

export default function SaveToSpotify({ tracks }: SaveToSpotifyProps) {
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSave = useCallback(async () => {
        // If no valid token, redirect to Spotify auth
        if (!hasValidToken()) {
            storePendingTracks(tracks.map((t) => t.id));
            await redirectToSpotifyAuth();
            return; // Page will navigate away
        }

        const token = getAccessToken();
        if (!token) {
            // Token was invalid despite earlier check — re-auth
            storePendingTracks(tracks.map((t) => t.id));
            await redirectToSpotifyAuth();
            return;
        }

        setSaveState("saving");
        setErrorMessage(null);

        try {
            const result = await createPlaylistWithTracks(
                token,
                tracks.map((t) => t.id)
            );
            setPlaylistUrl(result.playlistUrl);
            setSaveState("success");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong";
            setErrorMessage(message);
            setSaveState("error");

            // If it's an auth error, clear the stale session
            if (message.toLowerCase().includes("token") || message.toLowerCase().includes("unauthorized")) {
                clearSpotifySession();
            }
        }
    }, [tracks]);

    const handleReset = useCallback(() => {
        setSaveState("idle");
        setPlaylistUrl(null);
        setErrorMessage(null);
    }, []);

    if (tracks.length === 0) return null;

    return (
        <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
            {saveState === "idle" && (
                <button
                    onClick={handleSave}
                    className="btn btn-success btn-md px-6 w-full sm:w-auto gap-2"
                    title="Create a Spotify playlist with these tracks"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Save to Spotify
                </button>
            )}

            {saveState === "saving" && (
                <button className="btn btn-success btn-md px-6 w-full sm:w-auto btn-disabled gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating playlist...
                </button>
            )}

            {saveState === "success" && (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    {playlistUrl && (
                        <a
                            href={playlistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-md px-6 w-full sm:w-auto gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Open in Spotify
                        </a>
                    )}
                    <button
                        onClick={handleReset}
                        className="btn btn-ghost btn-sm opacity-70"
                        title="Dismiss"
                    >
                        ✕
                    </button>
                </div>
            )}

            {saveState === "error" && (
                <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
                    <button
                        onClick={handleSave}
                        className="btn btn-error btn-md px-6 w-full sm:w-auto gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        Retry
                    </button>
                    <p className="text-xs text-error opacity-80 text-center max-w-[250px]">
                        {errorMessage || "Failed to save. Please try again."}
                    </p>
                </div>
            )}
        </div>
    );
}
