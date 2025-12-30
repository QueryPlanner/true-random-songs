from ytmusicapi import YTMusic
import requests
import sys

def get_spotify_metadata(spotify_id):
    """
    Fetches basic metadata from Spotify's open embed API 
    (No API key required for basic title/artist).
    """
    try:
        url = f"https://open.spotify.com/oembed?url=spotify:track:{spotify_id}"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        return data['title'] # Returns "Track Name - Artist Name"
    except Exception as e:
        print(f"Error fetching Spotify metadata: {e}")
        return None

def get_yt_link(spotify_id):
    yt = YTMusic()
    query = get_spotify_metadata(spotify_id)
    
    if not query:
        return "Could not fetch Spotify metadata. Check if the ID is valid."

    print(f"Searching YT Music for: {query}")
    results = yt.search(query, filter="songs")
    
    if results:
        video_id = results[0]['videoId']
        return f"https://music.youtube.com/watch?v={video_id}"
    
    return "No results found on YouTube Music."

if __name__ == "__main__":
    sid = sys.argv[1] if len(sys.argv) > 1 else "4cOdzhRZWyw6ZOR9R2Z0TV"
    print(get_yt_link(sid))
