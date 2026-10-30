import { NextResponse } from "next/server";

export async function POST(request) {
  const baseUrl = new URL("/", request.url).origin;
  const response = NextResponse.json({ success: true, message: "Logged out" });

  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");

  return response;
}

