"use client";

import { useState } from "react";
import axios from "axios";

// --- Types ---
interface Track {
  inx: number;
  id: string;
  name: string;
  popularity: number;
  album_name: string | null;
}

export default function Home() {
  const spotifyEmbedIframeStyle: React.CSSProperties = {
    border: "0",
    borderRadius: "var(--radius-box)",
    backgroundColor: "#000000",
    display: "block",
  };

  // --- State ---
  const [mode, setMode] = useState<"random" | "popular">("random");
  const [count, setCount] = useState(20);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Actions ---
  const fetchTracks = async () => {
    setLoading(true);
    try {
      // Call our local API
      const res = await axios.get(`http://localhost:8000/random`, {
        params: { mode, limit: count }
      });
      setTracks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tracks from local API.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold text-accent">True Random Spotify</h1>
            <div className="badge badge-accent badge-outline">v3.0</div>
          </div>
          <div className="badge badge-success p-3">🎵 Playlist Mode</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Configuration Column */}
            <div className="lg:col-span-1 space-y-6">
                {/* Controls */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body space-y-4">
                    <h2 className="card-title text-accent text-lg">Config</h2>

                    <div className="form-control">
                      <label className="label cursor-pointer flex-col items-start gap-2">
                        <span className="label-text font-bold">Mode</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-accent"
                          checked={mode === "popular"}
                          onChange={(e) => setMode(e.target.checked ? "popular" : "random")}
                        />
                      </label>
                      <div className="text-xs opacity-60 mt-1">
                        {mode === "random" ? "🎲 Random" : "🔥 Popular"}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">Count</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="range range-accent range-sm"
                      />
                      <div className="text-center text-2xl font-bold text-accent mt-2">{count}</div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={fetchTracks}
                        className={`btn btn-accent w-full ${loading ? "btn-disabled" : ""}`}
                      >
                        {loading && <span className="loading loading-spinner"></span>}
                        {loading ? "Loading..." : "Generate"}
                      </button>
                    </div>
                  </div>
                </div>
            </div>

            {/* Playlist Column */}
            <div className="lg:col-span-3">
                {tracks.length > 0 ? (
                  <div className="card bg-base-100 shadow-2xl">
                    <div className="card-body p-0">
                      {/* Playlist Header */}
                      <div className="bg-primary text-primary-content p-6">
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          <div>
                            <h2 className="text-2xl font-bold">
                              Random Playlist {mode === "random" ? "🎲" : "🔥"}
                            </h2>
                            <p className="text-sm opacity-80">{tracks.length} tracks generated</p>
                          </div>
                        </div>
                      </div>

                      {/* Playlist Tracks */}
                      <div className="h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                        {tracks.map((track, i) => (
                          <div key={i} className="border-b border-base-300 last:border-b-0">
                            <div className="bg-black rounded-2xl overflow-hidden">
                              <iframe
                                title={`Spotify preview: ${track.name}`}
                                style={spotifyEmbedIframeStyle}
                                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                                width="100%"
                                height="152"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                              ></iframe>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center opacity-50 border-2 border-dashed border-base-content/20 rounded-xl bg-base-100">
                    <div className="text-6xl mb-4">🎵</div>
                    <p className="text-lg font-bold">No playlist yet</p>
                    <p className="text-sm mt-2 opacity-70">Configure settings and click Generate</p>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
