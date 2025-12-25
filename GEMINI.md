# True Random Songs

"True Random Songs" is a full-stack application designed to help users discover new music on Spotify by generating truly random playlists from a massive dataset. It aims to break users out of their Spotify echo chambers by providing discovery mechanisms that go beyond standard recommendation algorithms.

## Project Overview

- **Frontend**: A modern, interactive UI built with Next.js, featuring smooth animations and data visualization.
- **Backend**: A high-performance FastAPI server that queries a large music dataset (stored as Parquet files) using DuckDB.
- **Core Feature**: Generates random or "somewhat popular" playlists and embeds them using Spotify's iframe player.

## Technologies

### Frontend
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4, DaisyUI 5
- **Animations**: GSAP (GreenSock Animation Platform)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

### Backend
- **Framework**: FastAPI (Python)
- **Database Engine**: DuckDB (for efficient Parquet querying)
- **Web Server**: Uvicorn
- **Data Format**: Parquet

## Architecture

1.  **Data Layer**: Music data (tracks and albums) is stored in `backend/data/` as `.parquet` files.
2.  **API Layer**: FastAPI provides endpoints (like `/random`) that execute SQL queries via DuckDB to fetch random records from the data layer.
3.  **UI Layer**: The React frontend fetches data from the API and renders Spotify Embeds for playback and exploration.

## Building and Running

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

- **Dev Server**: `http://localhost:3000`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: URL of the backend API (defaults to `http://localhost:8000`)

### Backend

```bash
cd backend
# Recommended: Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

pip install -r requirements.txt
python main.py
```

- **API Server**: `http://localhost:8000`
- **Data Dependencies**: Ensure `data/tracks_lite.parquet` and `data/albums_lite.parquet` exist in the `backend` directory.

## Development Conventions

- **Component Organization**: UI components are located in `frontend/components/`.
- **API Clients**: Axios is used for frontend API calls.
- **State Management**: React `useState` and `useEffect` are primarily used for local state and data fetching.
- **Styling**: Use Tailwind CSS and DaisyUI classes. Follow the established `icecream` theme.
- **Animations**: Use GSAP for complex background or interactive animations (e.g., `DotGrid.tsx`).
