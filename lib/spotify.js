const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played"
].join(" ");

export function getSpotifyAuthUrl(state = "") {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/api/auth/callback";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId || "",
    scope: SCOPES,
    redirect_uri: redirectUri,
    state: state,
    show_dialog: "true"
  });

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment variables.");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to exchange token: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to refresh token: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

async function fetchFromSpotify(endpoint, accessToken) {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spotify API error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function getUserSpotifyProfile(accessToken) {
  // Try fetching short_term (last 4 weeks - freshest real-time activity) and medium_term (last 6 months)
  const [user, topArtistsShort, topArtistsMed, topTracksShort, topTracksMed, recentTracksData] = await Promise.all([
    fetchFromSpotify("/me", accessToken),
    fetchFromSpotify("/me/top/artists?time_range=short_term&limit=15", accessToken).catch(() => ({ items: [] })),
    fetchFromSpotify("/me/top/artists?time_range=medium_term&limit=15", accessToken).catch(() => ({ items: [] })),
    fetchFromSpotify("/me/top/tracks?time_range=short_term&limit=15", accessToken).catch(() => ({ items: [] })),
    fetchFromSpotify("/me/top/tracks?time_range=medium_term&limit=15", accessToken).catch(() => ({ items: [] })),
    fetchFromSpotify("/me/player/recently-played?limit=20", accessToken).catch(() => ({ items: [] }))
  ]);

  // Combine items prioritizing freshest plays
  const combinedArtists = [...(topArtistsShort.items || []), ...(topArtistsMed.items || [])];
  const uniqueArtistsMap = new Map();
  for (const art of combinedArtists) {
    if (!uniqueArtistsMap.has(art.name)) {
      uniqueArtistsMap.set(art.name, art);
    }
  }
  const rawArtists = Array.from(uniqueArtistsMap.values()).slice(0, 10);

  const combinedTracks = [...(topTracksShort.items || []), ...(topTracksMed.items || [])];
  const uniqueTracksMap = new Map();
  for (const trk of combinedTracks) {
    if (!uniqueTracksMap.has(trk.name)) {
      uniqueTracksMap.set(trk.name, trk);
    }
  }
  const rawTracks = Array.from(uniqueTracksMap.values()).slice(0, 10);

  const topArtists = rawArtists.map(a => ({
    name: a.name,
    genres: a.genres || [],
    popularity: a.popularity,
    images: a.images || []
  }));

  const topTracks = rawTracks.map(t => ({
    name: t.name,
    artists: t.artists?.map(art => ({ name: art.name })) || [],
    album: {
      name: t.album?.name,
      release_date: t.album?.release_date || "2023",
      images: t.album?.images || []
    },
    popularity: t.popularity
  }));

  const recentTracks = (recentTracksData.items || []).map(item => ({
    name: item.track?.name,
    artist: item.track?.artists?.map(a => a.name).join(", ") || "Unknown",
    played_at: item.played_at
  }));

  // Extract distinct genres
  const genreSet = new Set();
  topArtists.forEach(artist => {
    artist.genres.forEach(g => genreSet.add(g));
  });
  const topGenres = Array.from(genreSet).slice(0, 10);

  // Compute calculated metrics for fun visual vibe stats
  const avgPopularity = topTracks.length > 0
    ? Math.round(topTracks.reduce((acc, t) => acc + (t.popularity || 50), 0) / topTracks.length)
    : 70;
  
  const obscurityScore = Math.max(5, 100 - avgPopularity);
  const chaosIndex = Math.min(99, Math.round((topGenres.length * 11) + (recentTracks.length * 3) % 25));

  // 1. Basicness Index
  let basicnessLabel = "Basic but Trying";
  if (avgPopularity >= 75) basicnessLabel = "NPC Radio Listener";
  else if (avgPopularity <= 38) basicnessLabel = "Insufferable Gatekeeper";

  // 2. Emotional Stability Meter
  const gStr = topGenres.join(" ").toLowerCase();
  let emotionalStatus = "Dissociating in Public Transit";
  if (gStr.includes("metal") || gStr.includes("hardcore") || gStr.includes("drill") || gStr.includes("phonk")) {
    emotionalStatus = "Fighting Demons at the Gym";
  } else if (gStr.includes("indie") || gStr.includes("sad") || gStr.includes("folk") || gStr.includes("acoustic") || gStr.includes("lo-fi")) {
    emotionalStatus = "Crying in the Uber";
  } else if (gStr.includes("pop") || gStr.includes("dance")) {
    emotionalStatus = "Delusional Main Character Syndrome";
  }

  // 3. Aux Cord Privilege
  let auxPrivilege = "PROBATIONARY (Passenger Seat Only)";
  if (chaosIndex > 70) {
    auxPrivilege = "REVOKED (Severe Whiplash Risk)";
  } else if (avgPopularity > 85) {
    auxPrivilege = "SUPERVISED (Target / Starbucks Only)";
  }

  // 4. Era Stuck In (Average Release Year of Top Tracks)
  const years = topTracks
    .map(t => parseInt(t.album?.release_date?.slice(0, 4), 10))
    .filter(y => !isNaN(y) && y > 1950);
  const avgYear = years.length > 0 ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : 2023;
  let eraStuckIn = `Mentally Still in ${avgYear}`;
  if (avgYear >= 2023) eraStuckIn = `Chronically TikTok-Brained (Avg Year: ${avgYear})`;
  else if (avgYear < 2010) eraStuckIn = `Vintage Nostalgia Merchant (Avg Year: ${avgYear})`;

  // 5. Unhinged Listening Hours
  let unhingedHours = "Peak Activity at 2:43 AM — Who hurt you?";
  if (recentTracks.length > 0 && recentTracks[0].played_at) {
    try {
      const date = new Date(recentTracks[0].played_at);
      const hours = date.getHours();
      const mins = String(date.getMinutes()).padStart(2, '0');
      const timeStr = `${(hours % 12) || 12}:${mins} ${hours >= 12 ? 'PM' : 'AM'}`;
      if (hours >= 0 && hours < 5) {
        unhingedHours = `Peak activity at ${timeStr} — Who hurt you?`;
      } else if (hours >= 9 && hours <= 17) {
        unhingedHours = `Listening at ${timeStr} like a docile cubicle drone`;
      } else {
        unhingedHours = `Spiraling session logged at ${timeStr}`;
      }
    } catch {
      // fallback
    }
  }

  // Satirical micro-labels for artists
  const microLabels = [
    "The Co-dependent Crutch",
    "The Fake Personality Trait",
    "The Guilty Pleasure You Don't Hide Well",
    "Played 84 Times Instead of Therapy",
    "Desperate Bid for Street Cred",
    "Commercial Radio Filler"
  ];

  const artistCallouts = topArtists.slice(0, 5).map((a, i) => ({
    artist: a.name,
    tag: microLabels[i] || "Guilty Pleasure"
  }));
  
  return {
    user: {
      id: user.id,
      display_name: user.display_name || user.id,
      images: user.images || [],
      followers: user.followers || { total: 0 }
    },
    top_artists: topArtists,
    top_tracks: topTracks,
    top_genres: topGenres,
    recent_tracks: recentTracks,
    vibe_metrics: {
      obscurity_score: obscurityScore,
      chaos_index: chaosIndex,
      mainstream_quotient: avgPopularity,
      repetitiveness: Math.min(95, 30 + (10 - Math.min(topArtists.length, 10)) * 7)
    },
    satirical_stats: {
      basicness_index: `${avgPopularity}% — ${basicnessLabel}`,
      basicness_pct: avgPopularity,
      emotional_stability: emotionalStatus,
      aux_privilege: auxPrivilege,
      era_stuck_in: eraStuckIn,
      unhinged_hours: unhingedHours,
      artist_callouts: artistCallouts,
      top_track_callout: topTracks[0] ? `"${topTracks[0].name}" — Played 84 times instead of going to therapy` : ""
    }
  };
}

export function formatProfileForRoastPrompt(profile) {
  return {
    user_name: profile.user?.display_name || "Listener",
    top_artists: profile.top_artists?.map(a => a.name) || [],
    top_genres: profile.top_genres || [],
    top_tracks: profile.top_tracks?.map(t => `${t.name} by ${t.artists.map(a => a.name).join(", ")}`) || [],
    recent_tracks: profile.recent_tracks?.map(r => `${r.name} - ${r.artist}`) || [],
    metrics: profile.vibe_metrics || {}
  };
}

