# Spotify Roast App 🔥

A full-stack web application that authenticates with your Spotify account, analyzes your listening history and top music preferences, and uses Generative AI (Google Gemini or OpenAI) to generate a personalized, brutally honest, and hilarious roast of your music taste.

## ✨ Features

- **Spotify OAuth 2.0 Integration:** Secure Authorization Code flow requesting `user-top-read` and `user-read-recently-played`.
- **Taste Diagnostics:** Analyzes top artists, heavy repeat tracks, obscure genres, and calculates:
  - *Obscurity Score* (Are you a hipster or a radio NPC?)
  - *Chaos Index* (Severe playlist contradiction factor)
  - *Mainstream Quotient* (Department store soundtrack factor)
  - *Aux Cord Hazard Rating*
- **Generative AI Roasting:** Powered by Google Gemini (`gemini-1.5-flash` / `gemini-2.5-flash`) with fallback to OpenAI (`gpt-4o-mini`) and an offline heuristic engine.
- **Roast Severity Selector:**
  - 🌿 **Mild Tease:** Gentle ribbing for casual fun.
  - 😏 **Sarcastic Friend:** Witty, dry, and sharp eye-rolls.
  - 💀 **Emotional Destruction:** Merciless psychological damage.
- **Exportable Social Cards:** Generates downloadable high-resolution cards (PNG) ready for Instagram Stories, Twitter (X), Reddit, or Discord via `html-to-image`.
- **Instant Demo Mode:** Includes realistic pre-configured profiles (*Pop Addict*, *Metal & K-Pop Contradiction*, *Indie Snob*) so you can test the app immediately without Spotify credentials.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Spotify App Credentials (https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback

# AI Model Provider (Google Gemini or OpenAI)
GEMINI_API_KEY=your_gemini_api_key
# Optional:
OPENAI_API_KEY=
```

> **Note:** If `.env.local` is not configured, the app seamlessly defaults to **Interactive Demo Mode** with offline intelligence so you can immediately explore and enjoy all features!

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Dark Spotify `#121212` & `#1DB954` theme)
- **Icons:** Lucide React
- **Export:** `html-to-image` & `canvas-confetti`
- **AI Models:** `@google/generative-ai` (Gemini) / OpenAI API
- **APIs:** Spotify Web API (Top Artists, Top Tracks, Recently Played)

---

## 🛡️ Spotify Developer Configuration
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create an App**.
3. In App Settings, add `http://127.0.0.1:3000/api/auth/callback` to the **Redirect URIs** section (Note: Spotify blocks `localhost`, use `127.0.0.1`).
4. Copy your **Client ID** and **Client Secret** into `.env.local`.

