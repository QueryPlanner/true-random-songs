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

// Sampled from 2000 onwards for clarity in the modern era
const SONG_DURATION_TREND = [
  { year: "2000", avg_duration_sec: 248.22 }, { year: "2001", avg_duration_sec: 243.06 },
  { year: "2002", avg_duration_sec: 239.39 }, { year: "2003", avg_duration_sec: 239.71 },
  { year: "2004", avg_duration_sec: 239.4 }, { year: "2005", avg_duration_sec: 241.75 },
  { year: "2006", avg_duration_sec: 240.4 }, { year: "2007", avg_duration_sec: 245.25 },
  { year: "2008", avg_duration_sec: 243.46 }, { year: "2009", avg_duration_sec: 246.81 },
  { year: "2010", avg_duration_sec: 251.99 }, { year: "2011", avg_duration_sec: 250.73 },
  { year: "2012", avg_duration_sec: 247.36 }, { year: "2013", avg_duration_sec: 250.74 },
  { year: "2014", avg_duration_sec: 251.34 }, { year: "2015", avg_duration_sec: 247.75 },
  { year: "2016", avg_duration_sec: 246.94 }, { year: "2017", avg_duration_sec: 240.06 },
  { year: "2018", avg_duration_sec: 236.1 }, { year: "2019", avg_duration_sec: 226.14 },
  { year: "2020", avg_duration_sec: 212.73 }, { year: "2021", avg_duration_sec: 209.44 },
  { year: "2022", avg_duration_sec: 194.31 }, { year: "2023", avg_duration_sec: 196.39 },
  { year: "2024", avg_duration_sec: 193.83 }
];

// Sampled from 2000 onwards for clarity in the modern era
const EXPLICIT_CONTENT_TREND = [
  { year: "2000", explicit_pct: 2.45 }, { year: "2001", explicit_pct: 2.94 },
  { year: "2002", explicit_pct: 2.84 }, { year: "2003", explicit_pct: 3.2 },
  { year: "2004", explicit_pct: 4.35 }, { year: "2005", explicit_pct: 3.02 },
  { year: "2006", explicit_pct: 3.55 }, { year: "2007", explicit_pct: 3.47 },
  { year: "2008", explicit_pct: 3.67 }, { year: "2009", explicit_pct: 3.87 },
  { year: "2010", explicit_pct: 4.27 }, { year: "2011", explicit_pct: 3.83 },
  { year: "2012", explicit_pct: 4.16 }, { year: "2013", explicit_pct: 4.08 },
  { year: "2014", explicit_pct: 4.69 }, { year: "2015", explicit_pct: 5.08 },
  { year: "2016", explicit_pct: 6.93 }, { year: "2017", explicit_pct: 8.74 },
  { year: "2018", explicit_pct: 11.9 }, { year: "2019", explicit_pct: 15.03 },
  { year: "2020", explicit_pct: 17.0 }, { year: "2021", explicit_pct: 18.44 },
  { year: "2022", explicit_pct: 16.57 }, { year: "2023", explicit_pct: 18.56 },
  { year: "2024", explicit_pct: 17.84 }
];

const TOP_GENRES_DATA = [
  { genre: "sad sierreño", avg_popularity: 23.53, track_count: 25315 },
  { genre: "trap", avg_popularity: 23.15, track_count: 65298 },
  { genre: "trap latino", avg_popularity: 21.66, track_count: 44919 },
  { genre: "trap funk", avg_popularity: 21.51, track_count: 49423 },
  { genre: "electro corridos", avg_popularity: 21.17, track_count: 24776 },
  { genre: "rap", avg_popularity: 21.14, track_count: 42569 },
  { genre: "k-pop", avg_popularity: 21.01, track_count: 57687 },
  { genre: "urbano latino", avg_popularity: 20.92, track_count: 41247 },
  { genre: "corridos tumbados", avg_popularity: 20.45, track_count: 44186 },
  { genre: "agronejo", avg_popularity: 19.46, track_count: 37049 },
  { genre: "reggaeton", avg_popularity: 19.37, track_count: 89118 },
  { genre: "pop urbaine", avg_popularity: 19.23, track_count: 65088 },
  { genre: "latin pop", avg_popularity: 19.1, track_count: 56629 },
  { genre: "latin", avg_popularity: 19.0, track_count: 36242 },
  { genre: "argentine trap", avg_popularity: 18.37, track_count: 32801 }
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
            <h3 className="card-title text-2xl mb-4">Song Duration Trend (2000-2024)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SONG_DURATION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={11} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" interval={4} />
                  <YAxis fontSize={11} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" unit="s" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Line type="monotone" dataKey="avg_duration_sec" stroke="var(--primary)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Average track length peaked around 2010 and has sharply declined since.</p>
          </div>
        </div>

        {/* Explicit Content Trend */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Explicit Content Trend (2000-2024)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EXPLICIT_CONTENT_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={11} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" interval={4} />
                  <YAxis fontSize={11} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="explicit_pct" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">The proportion of explicit tracks has grown exponentially in the streaming era.</p>
          </div>
        </div>

        {/* Top 15 Genres */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Top 15 Most Popular Genres</h3>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_GENRES_DATA} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis type="number" domain={[0, 25]} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" fontSize={11} />
                  <YAxis dataKey="genre" type="category" fontSize={11} width={120} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '1rem',
                      color: 'var(--foreground)' 
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: any, name: any, props: any) => {
                      if (name === "Avg Popularity") return [value, name];
                      return [value, name];
                    }}
                    labelFormatter={(label) => {
                      const item = TOP_GENRES_DATA.find(d => d.genre === label);
                      return `${label} (${item?.track_count.toLocaleString()} tracks)`;
                    }}
                  />
                  <Bar dataKey="avg_popularity" fill="var(--warning)" radius={[0, 4, 4, 0]} name="Avg Popularity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Regional genres like 'sad sierreño' lead in average popularity (min. 5k tracks).</p>
          </div>
        </div>

      </div>
    </div>
  );
}