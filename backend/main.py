import duckdb
from fastapi import FastAPI, HTTPException, Query, Request
from pydantic import BaseModel
from typing import List, Optional
import time
import logging
import os
import re

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="True Random Spotify API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

from fastapi.middleware.cors import CORSMiddleware

# Secure CORS: Allow specific origins from environment, fallback to localhost for dev
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://random-songs.lordpatil.com,https://songs-api.lordpatil.com").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

def sanitize_search_query(text: str) -> str:
    """Basic sanitization for search queries."""
    if not text:
        return ""
    # Remove potentially problematic characters
    return re.sub(r'[^\w\s\-\(\)\[\]]', '', text).strip()

def search_yt_id(track_name: str, artist_name: str, album_name: Optional[str] = None) -> Optional[str]:
    try:
        t_name = sanitize_search_query(track_name)
        a_name = sanitize_search_query(artist_name)
        query = f"{t_name} {a_name}"
        if album_name:
            query += f" {sanitize_search_query(album_name)}"
        
        results = yt_music.search(query, filter="songs")
        if results and isinstance(results, list) and len(results) > 0:
            return results[0].get("videoId")
    except Exception as e:
        logger.error(f"Error searching YT for '{track_name}' by '{artist_name}': {e}")
    return None

@app.get("/random", response_model=List[Track])
@limiter.limit("20/minute")
def get_random_tracks(request: Request, mode: str = Query("random", enum=["random", "popular"]), limit: int = Query(15, gt=0, le=100)):
    try:
        # Create a connection per request for thread safety and concurrency
        conn = duckdb.connect(database=':memory:')
        
        if mode == "random":
            # True random using reservoir sampling (USING SAMPLE)
            # Note: USING SAMPLE currently only supports constants in DuckDB
            query = f"""
                WITH random_tracks AS (
                    SELECT * FROM '{TRACKS_FILE}'
                    USING SAMPLE {int(limit)}
                )
                SELECT 
                    t.id, 
                    t.name, 
                    t.popularity, 
                    a.name as album_name
                FROM random_tracks t
                LEFT JOIN '{ALBUMS_FILE}' a ON t.album_rowid = a.rowid
            """
            params = ()
        elif mode == "popular":
            # Somewhat popular: popularity >= 10
            # We use ORDER BY random() as we filter first
            query = f"""
                SELECT 
                    t.id, 
                    t.name, 
                    t.popularity, 
                    a.name as album_name
                FROM '{TRACKS_FILE}' t
                LEFT JOIN '{ALBUMS_FILE}' a ON t.album_rowid = a.rowid
                WHERE t.popularity >= 10
                ORDER BY random()
                LIMIT ?
            """
            params = (limit,)
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")

        # Execute and fetch as dictionaries
        rel = conn.execute(query, params)
        columns = [desc[0] for desc in rel.description]
        result = rel.fetchall()
        
        tracks = []
        for i, row in enumerate(result):
            row_dict = dict(zip(columns, row))
            tracks.append(Track(
                inx=i,
                id=row_dict["id"],
                name=row_dict["name"],
                popularity=row_dict["popularity"],
                artist_name="Unknown Artist",
                album_name=row_dict.get("album_name")
            ))
            
        return tracks

    except Exception as e:
        logger.error(f"Error fetching random tracks: {e}")
        # Do not leak internal error details to the client
        raise HTTPException(status_code=500, detail="An internal server error occurred while fetching tracks.")

@app.get("/yt_id")
@limiter.limit("30/minute")
def get_yt_id(request: Request, track_name: str, artist_name: str, album_name: Optional[str] = None):
    yt_id = search_yt_id(track_name, artist_name, album_name)
    if not yt_id:
        raise HTTPException(status_code=404, detail="YouTube Music ID not found")
    return {"yt_id": yt_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
