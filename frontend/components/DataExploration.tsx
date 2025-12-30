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
  PieChart,
  Pie,
  Cell,
  Legend,
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

const SECONDS_PER_MINUTE = 60;

const SONG_DURATION_TREND_MINUTES = SONG_DURATION_TREND.map(({ year, avg_duration_sec }) => ({
  year,
  avg_duration_min: avg_duration_sec / SECONDS_PER_MINUTE,
}));

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

type GenrePieSlice = {
  name: string;
  artists: number;
};

// Values taken from the "Genre Hierarchy (Artists > 500)" image in the referenced blog post.
// We keep the visible top-level buckets explicit and roll everything else into a single "Others" slice.
const GENRE_HIERARCHY_TOP_LEVEL_ARTISTS_GT_500: GenrePieSlice[] = [
  { name: "Electronic/Dance", artists: 520_075 },
  { name: "Rock", artists: 370_179 },
  { name: "World/Traditional", artists: 202_529 },
  { name: "Latin", artists: 189_438 },
  { name: "Hip Hop/Rap", artists: 166_516 },
  { name: "Pop", artists: 151_135 },
  { name: "Classical", artists: 106_573 },
  { name: "Jazz", artists: 72_173 },

  // Smaller labeled top-level buckets from the image (kept for computing "Others"):
  { name: "Regional/National", artists: 63_518 },
  { name: "Gospel/Christian", artists: 62_318 },
  { name: "Country/Folk", artists: 58_253 },
  { name: "Other", artists: 39_649 },
  { name: "Reggae/Dancehall", artists: 37_810 },
  { name: "Funk/Disco", artists: 52_552 },
  { name: "Comedy/Novelty", artists: 30_837 },
  { name: "R&B/Soul", artists: 27_013 },
  { name: "Experimental/Avant-Garde", artists: 26_258 },
  { name: "Easy Listening/Lounge", artists: 13_004 },
  { name: "Blues", artists: 12_520 },
];

export default function DataExploration() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTinyMobile, setIsTinyMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTinyMobile(window.innerWidth < 480);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(num);
  };

  const formatInteger = (num: number) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatMinutes = (value: number) => {
    return `${value.toFixed(1)} min`;
  };

  const KAGGLE_CLEANED_DATASET_URL = "https://www.kaggle.com/datasets/lordpatil/spotify-metadata-by-annas-archive";

  const INFO_BLOCK = (
    <div role="alert" className="alert alert-info alert-soft">
      <div className="space-y-2 text-sm text-base-content/80">
        <div>
          Popularity is Spotify’s 0–100 score that reflects how much a track or artist is being listened to right now (higher means more currently popular).
        </div>
        <div>
          The raw data was downloaded from the Anna’s Archive release of Spotify metadata. A cleaned version (used for this app) is published on{" "}
          <a className="link link-primary" href={KAGGLE_CLEANED_DATASET_URL} target="_blank" rel="noopener noreferrer">
            Kaggle
          </a>
          .
        </div>
      </div>
    </div>
  );

  const GENRE_PIE_MAJOR_CATEGORIES = [
    "Electronic/Dance",
    "Rock",
    "World/Traditional",
    "Latin",
    "Hip Hop/Rap",
    "Pop",
    "Classical",
    "Jazz",
  ] as const;

  const buildGenrePieData = (): GenrePieSlice[] => {
    const majorSlices = GENRE_HIERARCHY_TOP_LEVEL_ARTISTS_GT_500.filter((slice) => GENRE_PIE_MAJOR_CATEGORIES.includes(slice.name as typeof GENRE_PIE_MAJOR_CATEGORIES[number]));
    const majorNames = new Set(majorSlices.map((s) => s.name));

    const otherCount = GENRE_HIERARCHY_TOP_LEVEL_ARTISTS_GT_500
      .filter((slice) => !majorNames.has(slice.name))
      .reduce((sum, slice) => sum + slice.artists, 0);

    const hasOthers = otherCount > 0;
    const othersSlice: GenrePieSlice | null = hasOthers ? { name: "Others", artists: otherCount } : null;

    const slices = [...majorSlices, ...(othersSlice ? [othersSlice] : [])];
    return slices;
  };

  const GENRE_PIE_DATA = buildGenrePieData();

  const PIE_COLORS = [
    // Ice-cream-shop inspired palette (pastel, high-contrast, theme-friendly)
    "#FFB3C1", // strawberry
    "#A7F3D0", // mint
    "#FDE68A", // vanilla
    "#BFDBFE", // blueberry
    "#FBCFE8", // bubblegum
    "#FDBA74", // mango sorbet
    "#C7D2FE", // ube
    "#BBF7D0", // pistachio
    "#E5E7EB", // others (neutral)
  ];

  const TOTAL_ARTISTS_IN_PIE = GENRE_PIE_DATA.reduce((sum, slice) => sum + slice.artists, 0);

  const RADIAN = Math.PI / 180;
  const renderGenrePieLabel = (labelProps: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = labelProps;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = (Number(value) / TOTAL_ARTISTS_IN_PIE) * 100;
    const labelText = `${name} (${formatPercent(percentage)})`;
    
    // Using component-level state for responsiveness
    const fontSize = isTinyMobile ? 0 : (isMobile ? 9 : 11);

    if (fontSize === 0) return null;

    return (
      <text
        x={x}
        y={y}
        fill="var(--base-content)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={700}
        stroke="color-mix(in oklab, var(--base-100) 85%, transparent)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {labelText}
      </text>
    );
  };

  const MODE_DISTRIBUTION_BY_KEY = [
    { key: "C", major_pct: 9.3, minor_pct: 2.8 },
    { key: "C#/Db", major_pct: 7.9, minor_pct: 2.8 },
    { key: "D", major_pct: 7.5, minor_pct: 2.4 },
    { key: "D#/Eb", major_pct: 2.1, minor_pct: 1.3 },
    { key: "E", major_pct: 3.0, minor_pct: 4.0 },
    { key: "F", major_pct: 4.6, minor_pct: 3.8 },
    { key: "F#/Gb", major_pct: 3.2, minor_pct: 3.2 },
    { key: "G", major_pct: 8.3, minor_pct: 2.8 },
    { key: "G#/Ab", major_pct: 4.5, minor_pct: 1.9 },
    { key: "A", major_pct: 5.1, minor_pct: 4.6 },
    { key: "A#/Bb", major_pct: 3.3, minor_pct: 3.8 },
    { key: "B", major_pct: 3.1, minor_pct: 4.6 },
  ];

  return (
    <div id="exploration" className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 md:space-y-12 bg-base-200 rounded-3xl my-12">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">Data Exploration</h2>
        <p className="text-base md:text-xl opacity-80 max-w-2xl mx-auto px-4">
          Deep dive into the Spotify ecosystem. Analysis based on a cleaned dataset of 256M+ tracks.
        </p>
      </div>

      {/* General Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100 overflow-hidden">
        <div className="stat place-items-center lg:place-items-start">
          <div className="stat-title">Total Tracks</div>
          <div className="stat-value text-primary text-2xl md:text-3xl lg:text-4xl font-extrabold">{formatNumber(GENERAL_STATS.total_tracks)}</div>
          <div className="stat-desc">256,039,007 unique entries</div>
        </div>

        <div className="stat place-items-center lg:place-items-start border-t lg:border-t-0">
          <div className="stat-title">Total Artists</div>
          <div className="stat-value text-base-content text-2xl md:text-3xl lg:text-4xl font-extrabold">{formatNumber(GENERAL_STATS.total_artists)}</div>
          <div className="stat-desc">15,430,442 creators</div>
        </div>

        <div className="stat place-items-center lg:place-items-start border-t lg:border-t-0">
          <div className="stat-title">Total Albums</div>
          <div className="stat-value text-base-content text-2xl md:text-3xl lg:text-4xl font-extrabold">{formatNumber(GENERAL_STATS.total_albums)}</div>
          <div className="stat-desc">58,590,982 collections</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        
        <div className="xl:col-span-2 px-2 md:px-0">{INFO_BLOCK}</div>

        {/* Top 10 Tracks Table */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2 overflow-hidden">
          <div className="card-body p-4 md:p-8">
            <h3 className="card-title text-xl md:text-2xl mb-4">Top 10 Most Popular Tracks</h3>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="table table-sm md:table-md table-zebra w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="w-12">Rank</th>
                    <th>Track</th>
                    <th>Artists</th>
                    <th className="w-32">Popularity</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_TRACKS_DATA.map((track, index) => (
                    <tr key={index}>
                      <th className="text-center">{index + 1}</th>
                      <td className="font-bold max-w-[150px] md:max-w-none truncate">{track.track}</td>
                      <td className="max-w-[150px] md:max-w-none truncate">{track.artists}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <progress className="progress progress-primary w-12 md:w-24" value={track.popularity} max="100"></progress>
                          <span className="text-xs md:text-sm">{track.popularity}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Song Duration Trend */}
        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <div className="card-body p-4 md:p-8">
            <h3 className="card-title text-xl md:text-2xl mb-4">Song Duration Trend</h3>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SONG_DURATION_TREND_MINUTES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={10} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" interval={4} />
                  <YAxis
                    fontSize={10}
                    tick={{fill: 'var(--foreground)'}}
                    stroke="var(--border)"
                    unit="m"
                    tickFormatter={(value) => Number(value).toFixed(1)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: any) => [formatMinutes(Number(value || 0)), "Avg duration"]}
                  />
                  <Line type="monotone" dataKey="avg_duration_min" stroke="var(--primary)" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs md:text-sm opacity-70 mt-4 text-center px-4">Track length peaked around 2010 and has declined significantly.</p>
          </div>
        </div>

        {/* Explicit Content Trend */}
        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <div className="card-body p-4 md:p-8">
            <h3 className="card-title text-xl md:text-2xl mb-4">Explicit Content Trend</h3>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EXPLICIT_CONTENT_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={10} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" interval={4} />
                  <YAxis fontSize={10} tick={{fill: 'var(--foreground)'}} stroke="var(--border)" unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: any) => [formatPercent(Number(value || 0)), "Explicit %"]}
                  />
                  <Area type="monotone" dataKey="explicit_pct" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs md:text-sm opacity-70 mt-4 text-center px-4">Explicit content has grown exponentially in the streaming era.</p>
          </div>
        </div>

        {/* Genre Hierarchy */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2 overflow-hidden">
          <div className="card-body p-4 md:p-8">
            <h3 className="card-title text-xl md:text-2xl mb-4">Genre Hierarchy</h3>
            <div className="h-[400px] md:h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GENRE_PIE_DATA}
                    dataKey="artists"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? "30%" : "40%"}
                    outerRadius={isMobile ? "65%" : "75%"}
                    paddingAngle={1}
                    labelLine={false}
                    label={renderGenrePieLabel}
                    stroke="var(--border)"
                  >
                    {GENRE_PIE_DATA.map((entry, index) => (
                      <Cell key={`genre-slice-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: any, name: any) => [`${formatInteger(Number(value || 0))} artists`, String(name)]}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs md:text-sm opacity-70 mt-4 text-center px-4">
              Genre landscape (minimum 500 artists per genre). Smaller slices are grouped in “Others”.
            </p>
          </div>
        </div>

        {/* Audio Features */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2 overflow-hidden">
          <div className="card-body p-4 md:p-8">
            <h3 className="card-title text-xl md:text-2xl mb-4">Mode Distribution by Key</h3>
            <p className="text-xs md:text-sm opacity-70 -mt-2 mb-4">
              Percentage of songs in each musical key split by major/minor mode.
            </p>
            <div className="h-[300px] md:h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MODE_DISTRIBUTION_BY_KEY} margin={{ left: -20, right: 0, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="key" tick={{ fill: "var(--foreground)" }} stroke="var(--border)" fontSize={10} />
                  <YAxis tick={{ fill: "var(--foreground)" }} stroke="var(--border)" fontSize={10} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '1rem', color: 'var(--foreground)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: any, name: any) => [formatPercent(Number(value || 0)), String(name)]}
                    labelFormatter={(label) => `Key: ${label}`}
                  />
                  <Bar dataKey="minor_pct" stackId="mode" name="Minor" fill="#BFDBFE" />
                  <Bar dataKey="major_pct" stackId="mode" name="Major" fill="#A7F3D0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}