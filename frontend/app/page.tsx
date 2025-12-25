"use client";

import { useState, useEffect } from "react";
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
  const [count, setCount] = useState(15);
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

  // --- Effects ---
  useEffect(() => {
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // --- Render Helpers ---
  const renderPlaylistContent = () => {
    if (tracks.length === 0 && !loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center opacity-50 p-8">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-lg font-bold">No playlist yet</p>
          <p className="text-sm mt-2 opacity-70">Configure settings and click Generate</p>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto custom-scrollbar bg-base-100">
        <div className="p-2 space-y-2">
          {tracks.map((track, i) => (
            <div key={i} className="bg-black rounded-xl overflow-hidden shadow-sm">
              <iframe
                title={`Spotify preview: ${track.name}`}
                style={spotifyEmbedIframeStyle}
                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                width="100%"
                height="80" // Compact height for mockups
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans flex flex-col">
      
      {/* Navbar */}
      <div className="navbar bg-neutral text-neutral-content shadow-lg z-50 fixed top-0 w-full">
        <div className="flex-1">
          <button className="btn btn-ghost text-xl">True Random Spotify</button>
        </div>
        <div className="flex-none">
          <div className="badge badge-accent badge-outline mr-2">v3.0</div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero bg-base-200 pt-24 pb-12">
        <div className="hero-content flex-col w-full max-w-7xl">
            {/* Text Content */}
            <div className="text-center max-w-2xl mb-8">
                <h1 className="text-5xl font-bold">Discover New Music</h1>
                <p className="py-6">
                    Break out of your echo chamber. Generate truly random playlists from a massive database of songs.
                </p>
                
                {/* Simplified Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-base-100 p-6 rounded-2xl shadow-xl border border-base-300">
                    <div className="form-control">
                        <label className="label cursor-pointer gap-4">
                            <span className="label-text font-bold text-lg">{mode === "random" ? "🎲 Random" : "🔥 Popular"}</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-accent toggle-lg"
                                checked={mode === "popular"}
                                onChange={(e) => setMode(e.target.checked ? "popular" : "random")}
                            />
                        </label>
                    </div>

                    <button
                        onClick={fetchTracks}
                        className={`btn btn-accent btn-lg px-8 ${loading ? "btn-disabled" : ""}`}
                    >
                        {loading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <span className="text-2xl mr-2">🎲</span>
                        )}
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </div>
            </div>

            {/* Playlist Display */}
            <div className="w-full flex justify-center items-start">
                {/* Desktop: Mockup Browser */}
                <div className="hidden md:block w-full max-w-4xl h-[600px]">
                  <div className="mockup-browser border border-base-300 bg-base-200 w-full h-full flex flex-col shadow-2xl">
                    <div className="mockup-browser-toolbar">
                      <div className="input">https://true-random-spotify.com</div>
                    </div>
                    <div className="flex-grow overflow-hidden relative bg-base-100">
                        {renderPlaylistContent()}
                    </div>
                  </div>
                </div>

                {/* Mobile: Mockup Phone */}
                <div className="md:hidden block w-full flex justify-center">
                   <div className="mockup-phone border-primary">
                      <div className="mockup-phone-camera"></div> 
                      <div className="mockup-phone-display">
                        <div className="artboard artboard-demo phone-1 bg-base-100 overflow-hidden relative block">
                            {renderPlaylistContent()}
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
