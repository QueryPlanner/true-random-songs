"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// --- Data ---

const GENERAL_STATS = {
  total_tracks: 256039007,
  total_artists: 15430442,
  total_albums: 58590982,
  explicit_tracks: 34590297,
  implicit_tracks: 221448710,
  explicit_percentage: 13.51,
};

const TRACK_POPULARITY_DATA = [
  { range: "0-9", count: 243591243 },
  { range: "10-19", count: 7210527 },
  { range: "20-29", count: 3158648 },
  { range: "30-39", count: 1373574 },
  { range: "40-49", count: 490602 },
  { range: "50-59", count: 158900 },
  { range: "60-69", count: 43926 },
  { range: "70-79", count: 9931 },
  { range: "80-89", count: 1592 },
  { range: "90-99", count: 63 },
  { range: "100-109", count: 1 },
];

const TOP_TRACKS_DATA = [
  { track: "Die With A Smile", artist: "Lady Gaga", popularity: 100 },
  { track: "Die With A Smile", artist: "Bruno Mars", popularity: 100 },
  { track: "BIRDS OF A FEATHER", artist: "Billie Eilish", popularity: 98 },
  { track: "DtMF", artist: "Bad Bunny", popularity: 98 },
  { track: "Clean Baby Sleep White Noise (Loopable)", artist: "Background White Noise", popularity: 97 },
  { track: "Clean Baby Sleep White Noise (Loopable)", artist: "Baby Sleeps", popularity: 97 },
  { track: "Clean Baby Sleep White Noise (Loopable)", artist: "Dream Supplier", popularity: 97 },
  { track: "BAILE INoLVIDABLE", artist: "Bad Bunny", popularity: 96 },
  { track: "Not Like Us", artist: "Kendrick Lamar", popularity: 96 },
  { track: "That’s So True", artist: "Gracie Abrams", popularity: 96 },
];

const TOP_GENRES_DATA = [
  { genre: "opera", count: 22822 },
  { genre: "choral", count: 21188 },
  { genre: "chamber music", count: 20581 },
  { genre: "psytrance", count: 18352 },
  { genre: "rockabilly", count: 14496 },
  { genre: "black metal", count: 14376 },
  { genre: "avant-garde", count: 13802 },
  { genre: "bhajan", count: 13652 },
  { genre: "traditional music", count: 13493 },
  { genre: "dancehall", count: 12724 },
];

const ALBUM_RELEASE_DATA = [
  { year: "1901", count: 581 }, { year: "1902", count: 46 }, { year: "1903", count: 64 }, { year: "1904", count: 56 }, { year: "1905", count: 602 }, { year: "1906", count: 66 }, { year: "1907", count: 63 }, { year: "1908", count: 67 }, { year: "1909", count: 111 }, { year: "1910", count: 105 }, { year: "1911", count: 86 }, { year: "1912", count: 649 }, { year: "1913", count: 83 }, { year: "1914", count: 95 }, { year: "1915", count: 88 }, { year: "1916", count: 63 }, { year: "1917", count: 139 }, { year: "1918", count: 146 }, { year: "1919", count: 131 }, { year: "1920", count: 568 }, { year: "1921", count: 291 }, { year: "1922", count: 309 }, { year: "1923", count: 638 }, { year: "1924", count: 1559 }, { year: "1925", count: 490 }, { year: "1926", count: 543 }, { year: "1927", count: 526 }, { year: "1928", count: 449 }, { year: "1929", count: 230 }, { year: "1930", count: 325 }, { year: "1931", count: 200 }, { year: "1932", count: 192 }, { year: "1933", count: 195 }, { year: "1934", count: 213 }, { year: "1935", count: 271 }, { year: "1936", count: 273 }, { year: "1937", count: 294 }, { year: "1938", count: 317 }, { year: "1939", count: 384 }, { year: "1940", count: 540 }, { year: "1941", count: 333 }, { year: "1942", count: 390 }, { year: "1943", count: 331 }, { year: "1944", count: 339 }, { year: "1945", count: 458 }, { year: "1946", count: 460 }, { year: "1947", count: 528 }, { year: "1948", count: 574 }, { year: "1949", count: 785 }, { year: "1950", count: 1662 }, { year: "1951", count: 1009 }, { year: "1952", count: 1587 }, { year: "1953", count: 1847 }, { year: "1954", count: 2690 }, { year: "1955", count: 4477 }, { year: "1956", count: 5142 }, { year: "1957", count: 7312 }, { year: "1958", count: 8706 }, { year: "1959", count: 9128 }, { year: "1960", count: 11146 }, { year: "1961", count: 9206 }, { year: "1962", count: 9046 }, { year: "1963", count: 5537 }, { year: "1964", count: 5550 }, { year: "1965", count: 7545 }, { year: "1966", count: 6799 }, { year: "1967", count: 7697 }, { year: "1968", count: 8725 }, { year: "1969", count: 9330 }, { year: "1970", count: 15549 }, { year: "1971", count: 10713 }, { year: "1972", count: 11838 }, { year: "1973", count: 11563 }, { year: "1974", count: 11331 }, { year: "1975", count: 13008 }, { year: "1976", count: 12701 }, { year: "1977", count: 12954 }, { year: "1978", count: 13991 }, { year: "1979", count: 14563 }, { year: "1980", count: 20330 }, { year: "1981", count: 14774 }, { year: "1982", count: 15661 }, { year: "1983", count: 15715 }, { year: "1984", count: 16251 }, { year: "1985", count: 17675 }, { year: "1986", count: 18991 }, { year: "1987", count: 20898 }, { year: "1988", count: 23295 }, { year: "1989", count: 25651 }, { year: "1990", count: 34815 }, { year: "1991", count: 33089 }, { year: "1992", count: 37984 }, { year: "1993", count: 42901 }, { year: "1994", count: 49641 }, { year: "1995", count: 57955 }, { year: "1996", count: 60600 }, { year: "1997", count: 65936 }, { year: "1998", count: 70455 }, { year: "1999", count: 81571 }, { year: "2000", count: 120661 }, { year: "2001", count: 96771 }, { year: "2002", count: 102457 }, { year: "2003", count: 119168 }, { year: "2004", count: 132476 }, { year: "2005", count: 167391 }, { year: "2006", count: 204421 }, { year: "2007", count: 226234 }, { year: "2008", count: 283264 }, { year: "2009", count: 329592 }, { year: "2010", count: 426598 }, { year: "2011", count: 517312 }, { year: "2012", count: 628717 }, { year: "2013", count: 731254 }, { year: "2014", count: 831569 }, { year: "2015", count: 919023 }, { year: "2016", count: 1037967 }, { year: "2017", count: 1334737 }, { year: "2018", count: 1874418 }, { year: "2019", count: 2659874 }, { year: "2020", count: 4323336 }, { year: "2021", count: 5148811 }, { year: "2022", count: 6525064 }, { year: "2023", count: 8205708 }, { year: "2024", count: 11066418 }, { year: "2025", count: 9568894 }, { year: "2026", count: 35 }, { year: "2040", count: 1 }
];

const TRACK_DURATION_DATA = [
  { minutes: 0, count: 5222971 },
  { minutes: 1, count: 29241486 },
  { minutes: 2, count: 69899290 },
  { minutes: 3, count: 81089251 },
  { minutes: 4, count: 34950147 },
  { minutes: 5, count: 15331038 },
  { minutes: 6, count: 8806545 },
  { minutes: 7, count: 4846275 },
  { minutes: 8, count: 2329997 },
  { minutes: 9, count: 1219446 },
];

const ARTIST_SCATTER_DATA = [
  { artist: "Bad Bunny", popularity: 100, followers: 93195263 },
  { artist: "Drake", popularity: 98, followers: 97342434 },
  { artist: "Taylor Swift", popularity: 98, followers: 135140074 },
  { artist: "Kendrick Lamar", popularity: 97, followers: 39723389 },
  { artist: "The Weeknd", popularity: 97, followers: 102484717 },
  { artist: "Playboi Carti", popularity: 96, followers: 13916270 },
  { artist: "Billie Eilish", popularity: 95, followers: 109602603 },
  { artist: "Bruno Mars", popularity: 95, followers: 70128274 },
  { artist: "Lady Gaga", popularity: 94, followers: 36284092 },
  { artist: "Travis Scott", popularity: 94, followers: 37925115 },
  { artist: "SZA", popularity: 94, followers: 28531682 },
  { artist: "Future", popularity: 93, followers: 20956290 },
  { artist: "Ariana Grande", popularity: 93, followers: 104565684 },
  { artist: "Rihanna", popularity: 92, followers: 66253125 },
  { artist: "Sabrina Carpenter", popularity: 92, followers: 20832859 },
  { artist: "Kanye West", popularity: 92, followers: 29611309 },
  { artist: "Tate McRae", popularity: 91, followers: 7289503 },
  { artist: "Lana Del Rey", popularity: 91, followers: 46159930 },
  { artist: "Tito Double P", popularity: 91, followers: 6001349 },
  { artist: "Justin Bieber", popularity: 91, followers: 81570336 },
  { artist: "Eminem", popularity: 91, followers: 99077863 },
  { artist: "Peso Pluma", popularity: 91, followers: 20563855 },
  { artist: "Tyler, The Creator", popularity: 91, followers: 21067783 },
  { artist: "Coldplay", popularity: 91, followers: 57510550 },
  { artist: "Rauw Alejandro", popularity: 91, followers: 27553592 },
  { artist: "Arijit Singh", popularity: 91, followers: 141174367 },
  { artist: "Fuerza Regida", popularity: 90, followers: 14887721 },
  { artist: "Morgan Wallen", popularity: 90, followers: 12215620 },
  { artist: "Feid", popularity: 90, followers: 16725291 },
  { artist: "Linkin Park", popularity: 90, followers: 29373821 },
  { artist: "Neton Vega", popularity: 90, followers: 1738733 },
  { artist: "Doechii", popularity: 89, followers: 2601586 },
  { artist: "JENNIE", popularity: 89, followers: 9600256 },
  { artist: "Gracie Abrams", popularity: 89, followers: 5092270 },
  { artist: "Lil Wayne", popularity: 89, followers: 16673335 },
  { artist: "Junior H", popularity: 89, followers: 23779701 },
  { artist: "J Balvin", popularity: 89, followers: 38111906 },
  { artist: "Post Malone", popularity: 89, followers: 46765570 },
  { artist: "Juice WRLD", popularity: 89, followers: 39406626 },
  { artist: "KAROL G", popularity: 89, followers: 55763966 },
  { artist: "David Guetta", popularity: 89, followers: 26994252 },
  { artist: "Shakira", popularity: 89, followers: 37430782 },
  { artist: "Pritam", popularity: 89, followers: 48095903 },
  { artist: "Ozuna", popularity: 88, followers: 38328617 },
  { artist: "Zach Bryan", popularity: 88, followers: 6371495 },
  { artist: "PARTYNEXTDOOR", popularity: 88, followers: 8735087 },
  { artist: "Chappell Roan", popularity: 88, followers: 5753465 },
  { artist: "Dua Lipa", popularity: 88, followers: 45755045 },
  { artist: "Frank Ocean", popularity: 88, followers: 18274646 },
  { artist: "Ed Sheeran", popularity: 88, followers: 119773468 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"];

export default function DataExploration() {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(num);
  };

  return (
    <div id="exploration" className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 bg-base-200 rounded-3xl my-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold text-primary">Data Exploration</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          Let’s dive into the data! Here are some high-level statistics pulled from the dataset of over 256 million tracks.
        </p>
      </div>

      {/* General Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">Total Tracks</div>
          <div className="stat-value text-primary">{formatNumber(GENERAL_STATS.total_tracks)}</div>
          <div className="stat-desc">From 15.4M Artists</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Albums</div>
          <div className="stat-value text-secondary">{formatNumber(GENERAL_STATS.total_albums)}</div>
          <div className="stat-desc">Spanning 120+ years</div>
        </div>

        <div className="stat">
          <div className="stat-title">Explicit Content</div>
          <div className="stat-value text-accent">{GENERAL_STATS.explicit_percentage}%</div>
          <div className="stat-desc">{formatNumber(GENERAL_STATS.explicit_tracks)} tracks</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Track Popularity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Track Popularity Distribution</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRACK_POPULARITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="range" fontSize={12} tick={{fill: 'currentColor'}} />
                  <YAxis fontSize={12} tick={{fill: 'currentColor'}} tickFormatter={formatNumber} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}
                    itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" name="Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Most tracks have very low popularity (0-9).</p>
          </div>
        </div>

        {/* Top 10 Genres */}
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h3 className="card-title text-2xl mb-4">Top 10 Genres</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={TOP_GENRES_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="genre"
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                        {TOP_GENRES_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Albums Release Trend */}
        <div className="card bg-base-100 shadow-xl xl:col-span-2">
            <div className="card-body">
                <h3 className="card-title text-2xl mb-4">Albums Release Trend (1901 - 2025)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ALBUM_RELEASE_DATA.filter(d => parseInt(d.year) <= 2025)}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="year" fontSize={12} tick={{fill: 'currentColor'}} minTickGap={30} />
                            <YAxis fontSize={12} tick={{fill: 'currentColor'}} tickFormatter={formatNumber} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}
                                itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm opacity-70 mt-4 text-center">Exponential growth in album releases, especially after the digital revolution.</p>
            </div>
        </div>

        {/* Track Duration */}
         <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-4">Track Duration (Minutes)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRACK_DURATION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="minutes" fontSize={12} tick={{fill: 'currentColor'}} />
                  <YAxis fontSize={12} tick={{fill: 'currentColor'}} tickFormatter={formatNumber} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}
                    itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)/1))' }}
                  />
                  <Bar dataKey="count" fill="var(--color-accent)" name="Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
             <p className="text-sm opacity-70 mt-4 text-center">Most songs are around 2-3 minutes long.</p>
          </div>
        </div>

        {/* Artist Popularity vs Followers */}
        <div className="card bg-base-100 shadow-xl">
             <div className="card-body">
                <h3 className="card-title text-2xl mb-4">Artist Popularity vs Followers</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid opacity={0.3} />
                            <XAxis type="number" dataKey="popularity" name="Popularity" domain={[85, 100]} tick={{fill: 'currentColor'}} />
                            <YAxis type="number" dataKey="followers" name="Followers" tickFormatter={formatNumber} tick={{fill: 'currentColor'}} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-base-100 p-2 border border-base-300 rounded shadow-lg text-xs">
                                                <p className="font-bold">{payload[0].payload.artist}</p>
                                                <p>Pop: {payload[0].value}</p>
                                                <p>Followers: {formatNumber(payload[1].value as number)}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter name="Artists" data={ARTIST_SCATTER_DATA} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

         {/* Top 10 Tracks Table */}
         <div className="card bg-base-100 shadow-xl xl:col-span-2">
            <div className="card-body overflow-x-auto">
                <h3 className="card-title text-2xl mb-4">Top 10 Most Popular Tracks</h3>
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Track</th>
                            <th>Artist</th>
                            <th>Popularity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOP_TRACKS_DATA.map((track, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td className="font-bold">{track.track}</td>
                                <td>{track.artist}</td>
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

      </div>
    </div>
  );
}
