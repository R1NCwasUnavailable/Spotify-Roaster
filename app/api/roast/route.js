import { NextResponse } from "next/server";
import { generateRoast } from "@/lib/roastGenerator";
import { formatProfileForRoastPrompt } from "@/lib/spotify";

export async function POST(request) {
  try {
    const body = await request.json();
    const { profile, intensity = "sarcastic" } = body;

    if (!profile) {
      return NextResponse.json({ error: "Missing music profile payload." }, { status: 400 });
    }

    const formattedProfile = formatProfileForRoastPrompt(profile);
    const roastResult = await generateRoast(formattedProfile, intensity);

    return NextResponse.json({
      success: true,
      roast: roastResult,
      intensity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Roast API generation failure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate music roast." },
      { status: 500 }
    );
  }
}

