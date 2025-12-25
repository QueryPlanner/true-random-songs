"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

// --- Data ---

const GENERAL_STATS = {
  total_tracks: 256039007,
  total_artists: 15430442,
  total_albums: 58590982,
};

const TOP_TRACKS_DATA = [
  { track: "Die With A Smile", artists: "Lady Gaga, Bruno Mars", popularity: 100 },
  { track: "DtMF", artists: "Bad Bunny", popularity: 98 },
  { track: "BIRDS OF A FEATHER", artists: "Billie Eilish", popularity: 98 },
  { track: "That’s So True", artists: "Gracie Abrams", popularity: 96 },
  { track: "Not Like Us", artists: "Kendrick Lamar", popularity: 96 },
  { track: "BAILE INoLVIDABLE", artists: "Bad Bunny", popularity: 96 },
  { track: "APT.", artists: "ROSÉ, Bruno Mars", popularity: 95 },
  { track: "WILDFLOWER", artists: "Billie Eilish", popularity: 95 },
  { track: "All The Stars (with SZA)", artists: "SZA, Kendrick Lamar", popularity: 95 },
  { track: "Sailor Song", artists: "Gigi Perez", popularity: 95 }
];

const SONG_DURATION_TREND = [
  { year: "1960", avg_duration_sec: 211.75 }, { year: "1965", avg_duration_sec: 191.06 },
  { year: "1970", avg_duration_sec: 199.26 }, { year: "1975", avg_duration_sec: 214.56 },
  { year: "1980", avg_duration_sec: 234.98 }, { year: "1985", avg_duration_sec: 212.34 },
  { year: "1990", avg_duration_sec: 248.31 }, { year: "1995", avg_duration_sec: 245.11 },
  { year: "2000", avg_duration_sec: 248.22 }, { year: "2005", avg_duration_sec: 241.75 },
  { year: "2010", avg_duration_sec: 251.99 }, { year: "2015", avg_duration_sec: 247.75 },
  { year: "2020", avg_duration_sec: 212.73 }, { year: "2024", avg_duration_sec: 193.83 }
];

const EXPLICIT_CONTENT_TREND = [
  { year: "1990", explicit_pct: 1.35 }, { year: "1995", explicit_pct: 2.21 },
  { year: "2000", explicit_pct: 2.45 }, { year: "2005", explicit_pct: 3.02 },
  { year: "2010", explicit_pct: 4.27 }, { year: "2015", explicit_pct: 5.08 },
  { year: "2020", explicit_pct: 17.0 }, { year: "2024", explicit_pct: 17.84 }
];

const TOP_GENRES_DATA = [
  { genre: "sad sierreño", avg_popularity: 23.53 },
  { genre: "trap", avg_popularity: 23.15 },
  { genre: "trap latino", avg_popularity: 21.66 },
  { genre: "trap funk", avg_popularity: 21.51 },
  { genre: "electro corridos", avg_popularity: 21.17 },
  { genre: "rap", avg_popularity: 21.14 },
  { genre: "k-pop", avg_popularity: 21.01 },
  { genre: "urbano latino", avg_popularity: 20.92 },
  { genre: "corridos tumbados", avg_popularity: 20.45 },
  { genre: "agronejo", avg_popularity: 19.46 },
  { genre: "reggaeton", avg_popularity: 19.37 },
  { genre: "pop urbaine", avg_popularity: 19.23 },
  { genre: "latin pop", avg_popularity: 19.1 },
  { genre: "latin", avg_popularity: 19.0 },
  { genre: "argentine trap", avg_popularity: 18.37 }
];

export default function DataExploration() {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(num);
  };

  const POPULARITY_DEFINITION = (
    <div role="alert" className="alert alert-info alert-soft">
      <div className="space-y-1">
        <div className="font-semibold text-base-content">What does “popularity” mean?</div>
        <div className="text-sm text-base-content/80">
          Popularity is Spotify’s 0–100 score that reflects how much a track or artist is being listened to right now (higher means more currently popular).
        </div>
      </div>
    </div>
  );

  return (
    <div id="exploration" className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 bg-base-200 rounded-3xl my-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold text-primary">Data Exploration</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          Deep dive into the Spotify ecosystem. Analysis based on the cleaned dataset of 256M+ tracks.
        </p>
      </div>

      {/* General Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">Total Tracks</div>
          <div className="stat-value text-primary font-extrabold">{formatNumber(GENERAL_STATS.total_tracks)}</div>
          <div className="stat-desc">256,039,007 unique entries</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Artists</div>
          <div className="stat-value text-base-content font-extrabold">{formatNumber(GENERAL_STATS.total_artists)}</div>
          <div className="stat-desc">15,430,442 creators</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Albums</div>
          <div className="stat-value text-base-content font-extrabold">{formatNumber(GENERAL_STATS.total_albums)}</div>
          <div className="stat-desc">58,590,982 collections</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <div className="xl:col-span-2">{POPULARITY_DEFINITION}</div>

        {/* Top 10 Tracks Table */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2">
          <div className="card-body overflow-x-auto">
            <h3 className="card-title text-2xl mb-4">Top 10 Most Popular Tracks</h3>
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Track</th>
                  <th>Artists</th>
                  <th>Popularity</th>
                </tr>
              </thead>
              <tbody>
                {TOP_TRACKS_DATA.map((track, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td className="font-bold">{track.track}</td>
                    <td>{track.artists}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-primary w-24" value={track.popularity} max="100"></progress>
                        <span>{track.popularity}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Song Duration Trend */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Song Duration Trend (1960-2024)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SONG_DURATION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={12} tick={{fill: 'currentColor'}} />
                  <YAxis fontSize={12} tick={{fill: 'currentColor'}} unit="s" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}
                    itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}
                  />
                  <Line type="monotone" dataKey="avg_duration_sec" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Average track length has significantly decreased since its peak in the 2010s.</p>
          </div>
        </div>

        {/* Explicit Content Trend */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Explicit Content Trend (1990-2024)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EXPLICIT_CONTENT_TREND}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={12} tick={{fill: 'currentColor'}} />
                  <YAxis fontSize={12} tick={{fill: 'currentColor'}} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}
                    itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}
                  />
                  <Area type="monotone" dataKey="explicit_pct" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Percentage of explicit tracks has seen exponential growth in the last decade.</p>
          </div>
        </div>

        {/* Top 15 Genres */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Top 15 Most Popular Genres</h3>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_GENRES_DATA} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" domain={[0, 25]} tick={{fill: 'currentColor'}} />
                  <YAxis dataKey="genre" type="category" fontSize={12} width={120} tick={{fill: 'currentColor'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}
                    itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}
                  />
                  <Bar dataKey="avg_popularity" fill="var(--warning)" radius={[0, 4, 4, 0]} name="Avg Popularity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Regional genres like 'sad sierreño' currently lead in average track popularity.</p>
          </div>
        </div>

      </div>
    </div>
  );
}