import { NextResponse } from "next/server";

export async function GET(request) {
  const allCookies = request.cookies.getAll();
  const accessToken = request.cookies.get("spotify_access_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;

  console.log("Auth status check - Cookies present:", allCookies.map(c => c.name));

  const hasSpotifyCredentials = Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
  );
  const hasAiKey = Boolean(
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") ||
    process.env.OPENAI_API_KEY
  );

  return NextResponse.json({
    isAuthenticated: Boolean(accessToken || refreshToken),
    hasSpotifyCredentials,
    hasAiKey,
  });
}

