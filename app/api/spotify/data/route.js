import { NextResponse } from "next/server";
import { getUserSpotifyProfile, refreshAccessToken } from "@/lib/spotify";

export async function GET(request) {
  // Live Spotify profile only
  let accessToken = request.cookies.get("spotify_access_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;

  console.log("Spotify data endpoint called - Cookies:", request.cookies.getAll().map(c => c.name));

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: "Not authenticated. Please log in with your Spotify account." },
      { status: 401 }
    );
  }

  let cookieToSet = null;

  if (!accessToken && refreshToken) {
    try {
      const refreshed = await refreshAccessToken(refreshToken);
      accessToken = refreshed.access_token;
      cookieToSet = {
        name: "spotify_access_token",
        value: accessToken,
        maxAge: refreshed.expires_in || 3600,
      };
    } catch (err) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }
  }

  try {
    const profile = await getUserSpotifyProfile(accessToken);
    const response = NextResponse.json({ profile });

    if (cookieToSet) {
      response.cookies.set(cookieToSet.name, cookieToSet.value, {
        httpOnly: true,
        secure: request.url.startsWith("https://"),
        sameSite: "lax",
        maxAge: cookieToSet.maxAge,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Error retrieving user profile from Spotify:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load Spotify profile data." },
      { status: 500 }
    );
  }
}


