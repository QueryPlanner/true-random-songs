"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DotGrid from "@/components/DotGrid";
import DataExploration from "@/components/DataExploration";

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
    backgroundColor: "transparent",
    display: "block",
  };

  // --- State ---
  const [mode, setMode] = useState<"random" | "popular">("random");
  const [count] = useState(15);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Actions ---
  const fetchTracks = async () => {
    setLoading(true);
    try {
      // Use the correct endpoint /random and parameter limit
      const response = await axios.get(`http://localhost:8000/random?mode=${mode}&limit=${count}`);
      setTracks(response.data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
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
          {tracks.map((track) => (
            <div key={track.id} className="bg-base-200 rounded-xl overflow-hidden shadow-sm">
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
    <div className="min-h-screen bg-base-300 text-base-content flex flex-col">
      
      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content shadow-lg z-50 fixed top-0 w-full px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><button onClick={() => {}}>Blog</button></li>
              <li><a href="#exploration">Data Exploration</a></li>
            </ul>
          </div>
          <button className="btn btn-ghost text-xl">True Random Spotify</button>
        </div>
        
        <div className="navbar-center hidden lg:flex gap-2">
          <button className="btn btn-ghost">Blog</button>
          <a href="#exploration" className="btn btn-ghost">Data Exploration</a>
        </div>

        <div className="navbar-end">
          <a 
            href="https://github.com/QueryPlanner/true-random-songs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hero Section (offset for fixed navbar) */}
      <div className="hero bg-base-200 min-h-screen relative overflow-hidden pt-16">
        <div className="absolute inset-0 w-full h-full z-0">
          <DotGrid
            dotSize={10}
            gap={15}
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
            baseColor="#fff9f0"
            activeColor="#ffb2c1"
          />
        </div>
        <div className="hero-content flex-col lg:flex-row w-full max-w-[1400px] relative z-10 gap-12">
            {/* Text Content */}
            <div className="text-center lg:text-left lg:w-1/2 max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-0">
                <h1 className="text-5xl font-bold">Discover New Music</h1>
                <p className="py-6">
                    Break out of your echo chamber. Generate truly random playlists from a massive database of songs.
                </p>
                
                {/* Simplified Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 bg-base-100 p-6 rounded-2xl shadow-xl border border-base-300 w-full lg:w-fit mx-auto lg:mx-0">
                    <div className="form-control">
                        <label className="label cursor-pointer gap-4 pb-0">
                            <span className="label-text font-bold text-lg">{mode === "random" ? "🎲 True Random" : "🔥 Somewhat popular random"}</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-accent toggle-lg"
                                checked={mode === "popular"}
                                onChange={(e) => setMode(e.target.checked ? "popular" : "random")}
                            />
                        </label>
                        {mode === "popular" && (
                          <div className="text-left px-1">
                            <button className="link link-primary text-xs">read more in blog</button>
                          </div>
                        )}
                    </div>

                    <button
                        onClick={fetchTracks}
                        className={`btn btn-warning btn-lg px-8 ${loading ? "btn-disabled" : ""}`}
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
            <div className="w-full lg:w-1/2 flex justify-center items-start">
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
                        <div className="artboard artboard-demo phone-1 bg-base-100 overflow-hidden relative block pt-12">
                            {renderPlaylistContent()}
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Data Exploration Section */}
      <DataExploration />

    </div>
  );
}
