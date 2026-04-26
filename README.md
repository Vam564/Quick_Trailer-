# Quick Trailer

A full-featured streaming and entertainment web app built with React. Browse movies, watch TV series, stream live sports, play music, and play browser games — all in one place.

---

## Features

### Movies
- Browse popular, top-rated, upcoming, and now-playing movies powered by the TMDB API
- Search movies in real time using the header search bar or voice search (microphone)
- Click any movie to open a full detail page with backdrop image, rating, overview, and release info
- Watch the official trailer in a modal player
- Stream the full movie via an embedded player
- Download movies via an external link

### TV Series
- Browse popular, top-rated, airing today, and on-the-air TV series from TMDB
- Search series using the unified header search bar
- Select any series to see its hero detail view with backdrop, rating, and overview
- Choose season (1–10) and episode (1–30) and stream directly via vidsrc.to
- Fullscreen player dialog with close button

### Music
- Browse curated song categories: Top Hits, Trending, Telugu, Bollywood, Tamil, Hip Hop, Pop, Rock, Romantic, Party Mix, Chill, K-Pop
- In-page search bar to find songs and artists instantly
- Infinite scroll / Load More — each category has multiple sub-queries that progressively load more songs
- Toggle between Spotify and SoundCloud as the music source
- Full bottom player bar with:
  - Album art, song title, and artist
  - Previous, Play/Pause, Next controls
  - Shuffle mode
  - Repeat modes: Off, Repeat All, Repeat One
  - Seek slider with current time and duration
  - Volume control with mute toggle
  - Download button
- Auto-advances to next song when current one ends
- Header search also works on the Music page

### Live Sports TV
- Live streaming channel cards for Star Sports 1 HD, Willow TV, and Sky Sports
- HLS stream playback using ReactPlayer
- Fullscreen dialog player with LIVE badge
- Responsive card grid for mobile and desktop

### Games
- Playable browser game cards: GTA Vice City, The Race, Deadshot, EaglyMC, Subway Surfers, Hill Climb Racing, Angry Birds
- Fullscreen iframe player for each game
- Fullscreen toggle button within the player

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 17 (Create React App) |
| State Management | Redux |
| UI Components | Material UI v4 |
| Routing | React Router v5 |
| HTTP | Axios |
| Media Playback | ReactPlayer (HLS streams), HTML5 Audio API |
| Speech Input | react-speech-recognition |
| Styling | makeStyles (JSS via MUI) |
| Deployment | Netlify |

---

## APIs & Data Sources

| Source | Used For |
|---|---|
| TMDB API | Movies and TV series data, images, ratings |
| Spotify Cloudflare Worker | Music search and streaming (Spotify source) |
| SoundCloud Cloudflare Worker | Music search and streaming (SoundCloud source) |
| vidsrc.to | TV series episode streaming embeds |
| HLS (.m3u8) streams | Live sports TV channels |

---

## Project Structure

```
src/
├── assets/                  # Logo and default images
├── components/
│   ├── Header/              # App bar with search, voice input, hamburger nav drawer
│   ├── Footer/              # Site footer
│   ├── ListPage/            # Movies browse page
│   ├── DetailPage/          # Movie detail and player page
│   ├── Series/              # TV series browse and stream page
│   ├── Music/               # Music player page
│   ├── LiveTv/Sports/       # Live sports TV page
│   ├── Games/               # Browser games page
│   └── Media/               # Trailer/movie player modal
├── store/
│   ├── actions/             # Redux action types and creators
│   └── reducers/            # Redux reducers
└── App.js                   # Routes and app shell
```

---

## Getting Started

### Prerequisites

- Node.js 14+
- npm

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

---

## Deployment (Netlify)

This app is deployed on Netlify. A `public/_redirects` file is included to handle client-side routing:

```
/*  /index.html  200
```

This ensures direct URL access to routes like `/series`, `/music`, `/sports`, and `/games` works correctly without returning a 404.

---

## PWA Support

Quick Trailer is installable as a Progressive Web App (PWA). When added to your home screen:

- Displays the Quick Trailer logo as the app icon
- Runs in standalone mode (no browser chrome)
- Theme color matches the app's red accent

---

## Author

Vamshi Kumar Konduru
