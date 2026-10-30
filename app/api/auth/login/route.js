import { NextResponse } from "next/server";
import { getSpotifyAuthUrl } from "@/lib/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || Math.random().toString(36).substring(7);

  const host = request.headers.get("host") || "127.0.0.1:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  if (!process.env.SPOTIFY_CLIENT_ID) {
    return NextResponse.redirect(`${origin}/?error=missing_credentials`);
  }

  const authUrl = getSpotifyAuthUrl(state);
  console.log("Redirecting user to Spotify Auth URL:", authUrl);
  return NextResponse.redirect(authUrl);
}


