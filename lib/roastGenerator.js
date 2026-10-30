import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an elite, brutally funny stand-up comedian and music snob critic (think Anthony Fantano mixed with a ruthless roast master).
Your job is to roast the user's music taste based on their Spotify listening habits, top artists, top tracks, genres, and recent plays.

Output ONLY valid, parseable JSON with NO markdown formatting or code fences. Match this exact JSON structure:
{
  "roast_title": "Punchy 3-6 word roast headline",
  "archetype": "A funny 2-4 word diagnosis (e.g. 'The Aux Cord Terrorist' or 'The Depressed Indie Poser')",
  "roast_summary": "A hilarious, sharp 2-3 sentence paragraph ripping into their music habits.",
  "burns": [
    "Sharp burn #1 highlighting funny artist/genre contradictions or overplayed tracks.",
    "Sharp burn #2 calling out their personality flaw revealed by their music.",
    "Sharp burn #3 on their recent repeat listening or desperate cry for help."
  ],
  "embarrassing_confession": "One brutally accurate sentence summarizing what they would never admit in public.",
  "damage_rating": "A funny percentage or score (e.g. 'Emotional Damage: 96%')",
  "stat_pills": [
    { "label": "Personality Base", "value": "TikTok Audios & Mainstream Radio" },
    { "label": "Therapy Substitute", "value": "Acoustic Whining on Repeat" },
    { "label": "Mental Age", "value": "19 & Angry" },
    { "label": "Aux Clearance", "value": "Strictly Prohibited" }
  ],
  "artist_callouts": [
    { "artist": "Primary Top Artist", "tag": "The Co-dependent Crutch" },
    { "artist": "Secondary Artist", "tag": "The Fake Personality Trait" },
    { "artist": "Third Artist", "tag": "Guilty Pleasure You Can't Hide" }
  ],
  "nutritional_facts": {
    "serving_size": "1 Delusional Listener",
    "calories": "4,200 (Empty Pop Calories)",
    "basicness_dv": "180% Daily Value",
    "sodium_dv": "94% Pure Saltiness",
    "copium_dv": "300% Maximum Allowance",
    "ingredients": ["Distorted 808s", "Recycled TikTok Audios", "Repressed Rage", "Sad Girl Indie", "Zero Musical Discernment"]
  },
  "dating_flags": {
    "red_flags": [
      "Listens to 4 different contradictory sub-genres before 10 AM",
      "Top track is 4 minutes of self-indulgent whining",
      "Has three breakup anthems in heavy rotation while claiming to be 'totally fine'"
    ],
    "white_flag": "Actually has one decent classic song in the rotation"
  },
  "medical_bill": {
    "diagnoses": [
      { "item": "Main Character Delusion", "price": "$49.99" },
      { "item": "Overplayed TikTok Edits", "price": "$29.99" },
      { "item": "Originality Deficit", "price": "$0.00" },
      { "item": "Aux Cord Hazard Insurance", "price": "$89.50" }
    ],
    "total_copium": "MAX DOSE REQUIRED",
    "treatment": "Touch grass immediately and delete your 'Late Night Depressed Vibes' playlist."
  }
}
`;

function getIntensityInstructions(intensity) {
  switch (intensity) {
    case "mild":
      return "Tone: Mild Tease. Keep it playful, lighthearted, and mildly sarcastic like teasing a good friend over brunch.";
    case "brutal":
      return "Tone: EMOTIONAL DESTRUCTION. Be completely merciless, devastatingly funny, brutally observant, and unapologetic. Savage burns only.";
    case "sarcastic":
    default:
      return "Tone: Sarcastic & Cynical. Witty, dry, cutting, and full of snark.";
  }
}

export async function generateRoast(musicProfile, intensity = "sarcastic") {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  const intensityGuidance = getIntensityInstructions(intensity);
  const prompt = `
${intensityGuidance}

Here is the user's Spotify music profile:
- User Display Name: ${musicProfile.user_name || "Listener"}
- Top Artists: ${(musicProfile.top_artists || []).join(", ")}
- Top Genres: ${(musicProfile.top_genres || []).join(", ")}
- Top Tracks: ${(musicProfile.top_tracks || []).slice(0, 7).join("; ")}
- Recently Played Tracks: ${(musicProfile.recent_tracks || []).slice(0, 5).join("; ")}
- Vibe Metrics: Obscurity ${musicProfile.metrics?.obscurity_score || 20}/100, Chaos Index ${musicProfile.metrics?.chaos_index || 50}/100

Roast them relentlessly based on these exact artists and tracks. Return pure JSON only.
`;

  // 1. Try Gemini API if key is present
  if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here") {
    const candidateModels = [
      process.env.GEMINI_MODEL,
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
    ].filter(Boolean);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9,
          }
        });

        const result = await model.generateContent([
          { text: SYSTEM_PROMPT },
          { text: prompt }
        ]);
        const response = await result.response;
        const text = response.text().trim();
        const parsed = JSON.parse(cleanJsonString(text));
        return { ...parsed, generated_by: modelName };
      } catch (err) {
        console.warn(`Gemini generation with ${modelName} failed:`, err.message);
      }
    }
  }

  // 2. Try OpenAI API if key is present
  if (openAiApiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.9,
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices[0]?.message?.content;
        const parsed = JSON.parse(content);
        return { ...parsed, generated_by: "GPT-4o-mini" };
      }
    } catch (err) {
      console.warn("OpenAI generation failed:", err.message);
    }
  }

  // 3. Fallback Heuristic Generator (Offline / Demo Mode)
  // Ensures the app works 100% out of the box even before adding API keys
  return generateOfflineRoast(musicProfile, intensity);
}

function cleanJsonString(str) {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```$/, "");
  }
  return cleaned.trim();
}

function generateOfflineRoast(profile, intensity) {
  const artists = profile.top_artists || [];
  const primaryArtist = artists[0] || "your secret guilty pleasure";
  const secondaryArtist = artists[1] || "commercial radio filler";
  const tracks = profile.top_tracks || [];
  const topTrack = tracks[0] || "that song you play on repeat";
  const genres = profile.top_genres || ["pop"];

  const hasPop = genres.some(g => g.includes("pop") || g.includes("dance"));
  const hasMetal = genres.some(g => g.includes("metal") || g.includes("death") || g.includes("djent") || g.includes("rock"));
  const hasIndie = genres.some(g => g.includes("indie") || g.includes("folk") || g.includes("lo-fi") || g.includes("shoegaze"));
  const hasRap = genres.some(g => g.includes("rap") || g.includes("hip hop") || g.includes("trap"));

  let title = `The "Please Hand Me The Aux" Delusion`;
  let archetype = "The Algorithmic NPC";
  let summary = `Your Spotify profile screams that your entire personality was generated by a Spotify algorithm trying to satisfy three completely different people. Listening to ${primaryArtist} back-to-back with ${secondaryArtist} is proof that your brain is holding on by a single thread.`;
  let burns = [
    `You listen to ${primaryArtist} with the obsessive devotion of someone avoiding therapy at all costs.`,
    `Your playlist has the sonic consistency of a shopping mall elevator experiencing an electrical malfunction.`,
    `Playing "${topTrack}" this many times is technically considered self-inflicted psychological warfare.`
  ];
  let confession = `You tell everyone you have an 'eclectic palate', but really you just let autoplay run while dissociating.`;
  let damage = "Emotional Damage: 89%";

  if (hasMetal && hasPop) {
    title = "Screaming in the Moshpit, Crying to Pop";
    archetype = "The Bipolar Playlist Architect";
    summary = `You transition from guttural blast beats to bubblegum synth-pop so fast you give your eardrums whiplash. Are you headbanging or applying lip gloss? Pick a struggle.`;
    burns = [
      `Headbanging to metal while quietly knowing all the lyrics to ${primaryArtist} is peak cognitive dissonance.`,
      `Your recent history looks like a demon possessed your phone, got bored, and turned on a Disney soundtrack.`,
      `If someone passes you the aux cord at a party, police will be called within 4 minutes.`
    ];
    confession = `You pretend to be dangerous, but a sad bridge will bring you to your knees in seconds.`;
    damage = "Emotional Damage: 94%";
  } else if (hasIndie) {
    title = "Pretentious Sadness & Vintage Coffee Bags";
    archetype = "The Pitchfork Disciple";
    summary = `You won't listen to anything unless the singer sounds like they haven't seen sunlight since 2017 and recorded the vocals through an unwashed wool sweater. ${primaryArtist} is your entire emotional crutch.`;
    burns = [
      `You would rather freeze in an unheated room than admit you enjoyed a Billboard Top 40 melody.`,
      `Your listening history feels like reading a handwritten journal from an 1800s poet who died of cholera.`,
      `You definitely judge other people's Spotify Wrapped before they even finish posting it.`
    ];
    confession = `You secretly crave a stadium pop hook, but your fear of being labeled basic keeps you in the dark.`;
    damage = "Emotional Damage: 92%";
  } else if (hasPop) {
    title = "Department Store Background Noise";
    archetype = "The Top-40 Zombie";
    summary = `Your taste is so aggressively mainstream that your headphones might as well be sponsored by Target. If ${primaryArtist} doesn't sing it or TikTok doesn't trend it, does the song even exist in your universe?`;
    burns = [
      `Your music taste is the audible equivalent of an unseasoned chicken breast boiled in tap water.`,
      `You let the Spotify 'Today's Top Hits' playlist dictate your actual heart rate.`,
      `There is zero risk of you ever shocking anyone, anywhere, with your choices.`
    ];
    confession = `You think liking an acoustic remix counts as being 'deep and experimental'.`;
    damage = "Emotional Damage: 87%";
  }

  if (intensity === "brutal") {
    title = `CRITICAL FAILURE: ${title}`;
    damage = "Emotional Damage: 99.9%";
    burns[0] = `[BRUTAL] ` + burns[0];
  } else if (intensity === "mild") {
    damage = "Gentle Tease: 60%";
    summary = `You've got an enthusiastic collection of tunes here! Sure, bouncing between ${primaryArtist} and ${secondaryArtist} is a little goofy, but at least nobody can accuse you of being predictable.`;
  }

  const statPills = [
    { label: "Personality Base", value: hasPop ? "TikTok Algorithm" : hasIndie ? "Cold Coffee & Overthinking" : "Distorted Basslines" },
    { label: "Therapy Substitute", value: `${primaryArtist} on repeat` },
    { label: "Mental Age", value: hasIndie ? "1800s Victorian Ghost" : "19 & Angry" },
    { label: "Aux Cord Clearance", value: "REVOKED (Hazard)" }
  ];

  const artistCallouts = [
    { artist: primaryArtist, tag: "The Co-dependent Crutch" },
    { artist: secondaryArtist, tag: "The Fake Personality Trait" },
    { artist: artists[2] || "Autoplay Filler", tag: "The Guilty Pleasure You Can't Hide" }
  ];

  const nutritionalFacts = {
    serving_size: "1 Delusional Listener",
    calories: "4,200 (Empty Pop Calories)",
    basicness_dv: `${hasPop ? "190%" : "85%"} Daily Value`,
    sodium_dv: "94% Pure Saltiness",
    copium_dv: "350% Maximum Dosage",
    ingredients: [
      `Heavy doses of ${primaryArtist}`,
      "Recycled TikTok Audios",
      "Repressed Rage",
      "Late-Night Spiral Energy",
      "Zero Musical Discernment"
    ]
  };

  const datingFlags = {
    red_flags: [
      `Listens to ${primaryArtist} with the fervor of someone desperately avoiding introspection`,
      `Top track "${topTrack}" played enough times to warrant an intervention`,
      "Has two breakup anthems back-to-back while actively telling friends they are 'thriving'"
    ],
    white_flag: `Occasionally lets a tolerable song play before ruining the vibe again`
  };

  const medicalBill = {
    diagnoses: [
      { item: "Main Character Delusion", price: "$49.99" },
      { item: "Overplayed TikTok Edits", price: "$29.99" },
      { item: "Originality Deficit", price: "$0.00" },
      { item: "Emergency Aux Cord Insurance", price: "$89.50" }
    ],
    total_copium: "MAX DOSE PRESCRIBED",
    treatment: "Touch grass immediately and delete your 'Late Night Depressed Vibes' playlist."
  };

  return {
    roast_title: title,
    archetype: archetype,
    roast_summary: summary,
    burns: burns,
    embarrassing_confession: confession,
    damage_rating: damage,
    stat_pills: statPills,
    artist_callouts: artistCallouts,
    nutritional_facts: nutritionalFacts,
    dating_flags: datingFlags,
    medical_bill: medicalBill,
    generated_by: "Roaster Engine (Built-in Heuristic)"
  };
}

