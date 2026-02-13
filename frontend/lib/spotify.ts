// Spotify PKCE OAuth 2.0 utility for client-side playlist creation

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const SCOPES = "playlist-modify-public";

/**
 * Dynamically build the redirect URI from the current browser origin.
 * This ensures the redirect always comes back to the same domain,
 * whether running on localhost or production.
 */
function getRedirectUri(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/callback`;
  }
  return "http://localhost:3000/callback";
}

// --- PKCE Crypto Helpers ---

function generateRandomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
}

// --- Storage Keys ---
// Using localStorage so values survive the OAuth redirect round-trip

const STORAGE_KEYS = {
  CODE_VERIFIER: "spotify_code_verifier",
  ACCESS_TOKEN: "spotify_access_token",
  TOKEN_EXPIRY: "spotify_token_expiry",
  PENDING_TRACKS: "spotify_pending_tracks",
} as const;

// --- Public API ---

/**
 * Check if we have a valid (non-expired) Spotify access token.
 */
export function hasValidToken(): boolean {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!token || !expiry) return false;
  return Date.now() < parseInt(expiry, 10);
}

/**
 * Get the stored access token, or null if expired/missing.
 */
export function getAccessToken(): string | null {
  if (!hasValidToken()) return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Store tracks that should be saved after OAuth completes.
 */
export function storePendingTracks(trackIds: string[]): void {
  localStorage.setItem(STORAGE_KEYS.PENDING_TRACKS, JSON.stringify(trackIds));
}

/**
 * Retrieve and clear pending tracks after OAuth callback.
 */
export function consumePendingTracks(): string[] | null {
  const raw = localStorage.getItem(STORAGE_KEYS.PENDING_TRACKS);
  if (!raw) return null;
  localStorage.removeItem(STORAGE_KEYS.PENDING_TRACKS);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Redirect user to Spotify authorization page with PKCE challenge.
 */
export async function redirectToSpotifyAuth(): Promise<void> {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

  const redirectUri = getRedirectUri();
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange the authorization code for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const codeVerifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
  if (!codeVerifier) {
    throw new Error("Missing code verifier. Please try logging in again.");
  }

  const redirectUri = getRedirectUri();
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error_description || "Failed to exchange code for token");
  }

  const data = await response.json();
  const expiresAt = Date.now() + data.expires_in * 1000;

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString());
  localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);

  return data.access_token;
}

/**
 * Get the current Spotify user's ID.
 */
async function getSpotifyUserId(token: string): Promise<string> {
  const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch Spotify user profile");
  const data = await response.json();
  return data.id;
}

/**
 * Create a playlist and add tracks to it. Returns the playlist URL.
 */
export async function createPlaylistWithTracks(
  token: string,
  trackIds: string[]
): Promise<{ playlistUrl: string; playlistName: string }> {
  const userId = await getSpotifyUserId(token);

  // Build playlist name with current date
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const playlistName = `TRS Discovery – ${date}`;

  // Create the playlist
  const createResponse = await fetch(
    `${SPOTIFY_API_BASE}/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description:
          "Generated by True Random Songs (random-songs.lordpatil.com)",
        public: true,
      }),
    }
  );

  if (!createResponse.ok) throw new Error("Failed to create Spotify playlist");
  const playlist = await createResponse.json();

  // Add tracks to the playlist
  const uris = trackIds.map((id) => `spotify:track:${id}`);
  const addResponse = await fetch(
    `${SPOTIFY_API_BASE}/playlists/${playlist.id}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    }
  );

  if (!addResponse.ok) throw new Error("Failed to add tracks to playlist");

  return {
    playlistUrl: playlist.external_urls.spotify,
    playlistName,
  };
}

/**
 * Clear all Spotify session data (logout).
 */
export function clearSpotifySession(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
