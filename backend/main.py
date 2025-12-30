import duckdb
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(title="True Random Spotify API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Database connection
# We use an in-memory database and query the parquet files directly.
# This avoids loading everything into memory.
# conn = duckdb.connect(database=':memory:', read_only=False) # Moved inside request

# Pre-register parquet files as views for convenience? 
# Or just use direct paths. Direct paths are fine.
# DATA_DIR = "data"
# TRACKS_FILE = f"{DATA_DIR}/tracks_lite.parquet"
# ALBUMS_FILE = f"{DATA_DIR}/albums_lite.parquet"

TRACKS_FILE = "data/tracks_lite.parquet"
ALBUMS_FILE = "data/albums_lite.parquet"

class Track(BaseModel):
    inx: int
    id: str
    name: str
    popularity: int
    artist_name: Optional[str] = None
    album_name: Optional[str] = None
    yt_id: Optional[str] = None

from ytmusicapi import YTMusic
yt_music = YTMusic()

def search_yt_id(track_name: str, artist_name: str, album_name: Optional[str] = None) -> Optional[str]:
    try:
        query = f"{track_name} {artist_name}"
        if album_name:
            query += f" {album_name}"
        results = yt_music.search(query, filter="songs")
        if results:
            return results[0]["videoId"]
    except Exception as e:
        print(f"Error searching YT: {e}")
    return None

@app.get("/random", response_model=List[Track])
def get_random_tracks(mode: str = Query("random", enum=["random", "popular"]), limit: int = 15):
    try:
        # Create a connection per request for thread safety and concurrency
        conn = duckdb.connect(database=':memory:')
        
        if mode == "random":
            # True random using reservoir sampling (USING SAMPLE)
            # Sample tracks first, then join albums
            query = f"""
                WITH random_tracks AS (
                    SELECT * FROM '{TRACKS_FILE}'
                    USING SAMPLE {limit}
                )
                SELECT 
                    t.id, 
                    t.name, 
                    t.popularity, 
                    a.artist_name,
                    a.name as album_name
                FROM random_tracks t
                LEFT JOIN '{ALBUMS_FILE}' a ON t.album_rowid = a.rowid
            """
        elif mode == "popular":
            # Somewhat popular: popularity >= 10
            # We use ORDER BY random() as we filter first
            query = f"""
                SELECT 
                    t.id, 
                    t.name, 
                    t.popularity, 
                    a.artist_name,
                    a.name as album_name
                FROM '{TRACKS_FILE}' t
                LEFT JOIN '{ALBUMS_FILE}' a ON t.album_rowid = a.rowid
                WHERE t.popularity >= 10
                ORDER BY random()
                LIMIT {limit}
            """
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")

        result = conn.execute(query).fetchall()
        
        tracks = []
        for i, row in enumerate(result):
            # row: (id, name, popularity, artist_name, album_name)
            tracks.append(Track(
                inx=i,
                id=row[0],
                name=row[1],
                popularity=row[2],
                artist_name=row[3],
                album_name=row[4]
            ))
            
        return tracks

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/yt_id")
def get_yt_id(track_name: str, artist_name: str, album_name: Optional[str] = None):
    yt_id = search_yt_id(track_name, artist_name, album_name)
    if not yt_id:
        raise HTTPException(status_code=404, detail="YouTube Music ID not found")
    return {"yt_id": yt_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
