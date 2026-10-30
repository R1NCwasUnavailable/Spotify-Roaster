import { NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const host = request.headers.get("host") || "127.0.0.1:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  console.log("Spotify callback hit on host:", host, { code: Boolean(code), error });

  if (error) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code_provided`);
  }

  try {
    const tokenData = await exchangeCodeForTokens(code);
    const { access_token, refresh_token, expires_in } = tokenData;

    console.log("Spotify Token Exchanged Successfully:", {
      hasAccessToken: Boolean(access_token),
      hasRefreshToken: Boolean(refresh_token),
      expiresIn: expires_in,
    });

    const targetUrl = `${origin}/dashboard`;
    console.log("Redirecting to target URL:", targetUrl);
    const response = NextResponse.redirect(targetUrl);

    // Set cookie on the response
    response.cookies.set("spotify_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expires_in || 3600,
      path: "/",
    });

    if (refresh_token) {
      response.cookies.set("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Spotify Auth Callback Error:", err);
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(err.message)}`);
  }
}



