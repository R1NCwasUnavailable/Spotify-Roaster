"use client";

import { useState } from "react";
import { 
  FileText, 
  AlertTriangle, 
  Receipt, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Radio, 
  HeartCrack, 
  Sparkles, 
  Flag, 
  Pill,
  Volume2
} from "lucide-react";

export default function StatSummary({ profile, roast }) {
  const [activeViralFormat, setActiveViralFormat] = useState("nutrition"); // 'nutrition' | 'flags' | 'receipt'

  if (!profile) return null;

  const satStats = profile.satirical_stats || {};
  const artistCallouts = roast?.artist_callouts?.length > 0 
    ? roast.artist_callouts 
    : satStats.artist_callouts || [];

  const nutritional = roast?.nutritional_facts || {
    serving_size: "1 Delusional Listener",
    calories: "4,200 (Empty Pop Calories)",
    basicness_dv: "180% Daily Value",
    sodium_dv: "94% (Pure Saltiness)",
    copium_dv: "350% Maximum Dosage",
    ingredients: [
      `Heavy doses of ${profile.top_artists?.[0]?.name || "Autoplay"}`,
      "Recycled TikTok Audios",
      "Repressed Rage",
      "Sad Girl Indie Whispers",
      "Zero Musical Discernment"
    ]
  };

  const datingFlags = roast?.dating_flags || {
    red_flags: [
      `Listens to ${profile.top_artists?.[0]?.name || "their top artist"} with the devotion of someone desperately avoiding therapy`,
      `Top track "${profile.top_tracks?.[0]?.name || "their anthem"}" played enough times to warrant an intervention`,
      "Has two breakup anthems back-to-back while actively telling people they are 'thriving'"
    ],
    white_flag: "Occasionally lets an actually decent classic song play before ruining the vibe again"
  };

  const medicalBill = roast?.medical_bill || {
    diagnoses: [
      { item: "Main Character Delusion", price: "$49.99" },
      { item: "Overplayed TikTok Edits", price: "$29.99" },
      { item: "Originality Deficit", price: "$0.00" },
      { item: "Aux Cord Hazard Insurance", price: "$89.50" }
    ],
    total_copium: "MAX DOSE PRESCRIBED",
    treatment: "Touch grass immediately and delete your 'Late Night Depressed Vibes' playlist."
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Satirical "Calculated" Metrics Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-spotify-green" />
          <h3 className="text-xs font-black uppercase tracking-widest text-spotify-light">
            Calculated Satirical Diagnostics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basicness Index */}
          <div className="bg-spotify-dark/95 border border-spotify-card rounded-2xl p-4 shadow-xl hover:border-spotify-green/30 transition-all">
            <div className="flex items-center justify-between text-xs text-spotify-light mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-spotify-green" />
                Basicness Index
              </span>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-mono">Popularity Clout</span>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-black text-white block">
                {satStats.basicness_index || "88% — NPC Radio Listener"}
              </span>
              <p className="text-xs text-spotify-light/70 mt-1">
                {(satStats.basicness_pct || 70) > 75
                  ? "Plays whatever the Spotify algorithm feeds them like a docile civilian"
                  : "Pretends to enjoy obscure static noise for social validation"}
              </p>
            </div>
          </div>

          {/* Emotional Stability Meter */}
          <div className="bg-spotify-dark/95 border border-spotify-card rounded-2xl p-4 shadow-xl hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-spotify-light mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HeartCrack className="w-3.5 h-3.5 text-amber-400" />
                Emotional Stability
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono">Real-time</span>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block">
                {satStats.emotional_stability || "Status: Crying in the Uber"}
              </span>
              <p className="text-xs text-spotify-light/70 mt-1">
                Calculated from extreme genre whiplash and melancholic acoustics.
              </p>
            </div>
          </div>

          {/* Aux Cord Privilege */}
          <div className="bg-spotify-dark/95 border border-spotify-card rounded-2xl p-4 shadow-xl hover:border-red-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-spotify-light mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Aux Cord Privilege
              </span>
              <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono">Verdict</span>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-black text-red-400 block">
                {satStats.aux_privilege || "REVOKED (Whiplash Risk)"}
              </span>
              <p className="text-xs text-spotify-light/70 mt-1">
                Zero passengers have ever felt safe when you connect to Bluetooth.
              </p>
            </div>
          </div>

          {/* Era Stuck In */}
          <div className="bg-spotify-dark/95 border border-spotify-card rounded-2xl p-4 shadow-xl hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-spotify-light mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Era Stuck In
              </span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded font-mono">Release Year</span>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-black text-cyan-300 block">
                {satStats.era_stuck_in || "Chronically TikTok-Brained (Avg: 2024)"}
              </span>
              <p className="text-xs text-spotify-light/70 mt-1">
                Based on the average release year of your heavy rotation tracks.
              </p>
            </div>
          </div>

          {/* Unhinged Listening Hours */}
          <div className="bg-spotify-dark/95 border border-spotify-card rounded-2xl p-4 shadow-xl sm:col-span-2 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between text-xs text-spotify-light mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Unhinged Listening Hours
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded font-mono">Timestamp</span>
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-black text-purple-300 block">
                {satStats.unhinged_hours || "Peak Activity at 2:43 AM — Who hurt you?"}
              </span>
              <p className="text-xs text-spotify-light/70 mt-1">
                Pulled directly from your recent Spotify listening timestamps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Micro-Labels for Top Artists & Tracks */}
      <div className="bg-spotify-dark/95 border border-spotify-card rounded-3xl p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-spotify-green" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Satirical Micro-Labels: Top Suspects
            </h3>
          </div>
          <span className="text-xs text-spotify-light">AI Behavioral Diagnosis</span>
        </div>

        {/* Top Track Therapy Substitute Banner */}
        {profile.top_tracks?.[0] && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border border-red-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-black">
              #1
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-red-400 block">
                Primary Therapy Substitute
              </span>
              <h4 className="text-sm font-black text-white">
                "{profile.top_tracks[0].name}" by {profile.top_tracks[0].artists?.[0]?.name || "Artist"}
              </h4>
              <p className="text-xs text-spotify-light mt-0.5">
                Played dozens of times on repeat instead of confronting actual life choices.
              </p>
            </div>
          </div>
        )}

        {/* Artist Micro-Label Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {artistCallouts.slice(0, 6).map((item, i) => {
            const matchedArtist = profile.top_artists?.[i];
            return (
              <div
                key={item.artist + i}
                className="p-3.5 rounded-2xl bg-spotify-card/40 border border-white/5 hover:border-white/20 transition-all flex items-center gap-3"
              >
                {matchedArtist?.images?.[0]?.url ? (
                  <img
                    src={matchedArtist.images[0].url}
                    alt={item.artist}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-spotify-card flex items-center justify-center text-spotify-light font-black shrink-0">
                    #{i + 1}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-amber-400 block truncate">
                    {item.tag || `Role #${i + 1}`}
                  </span>
                  <h5 className="font-black text-sm text-white truncate">
                    {item.artist}
                  </h5>
                  <span className="text-[10px] text-spotify-light capitalize block truncate">
                    {matchedArtist?.genres?.[0] || "Artist"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Viral UI Formats (Tabs) */}
      <div className="space-y-4">
        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-spotify-green" />
              Viral Share Formats
            </h3>
            <p className="text-xs text-spotify-light">Choose your preferred satirical summary layout</p>
          </div>

          <div className="flex items-center gap-1.5 bg-spotify-card p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveViralFormat("nutrition")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViralFormat === "nutrition"
                  ? "bg-spotify-green text-black shadow-md shadow-spotify-green/20"
                  : "text-spotify-light hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Nutritional Label</span>
            </button>
            <button
              onClick={() => setActiveViralFormat("flags")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViralFormat === "flags"
                  ? "bg-spotify-green text-black shadow-md shadow-spotify-green/20"
                  : "text-spotify-light hover:text-white"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Red / Green Flags</span>
            </button>
            <button
              onClick={() => setActiveViralFormat("receipt")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViralFormat === "receipt"
                  ? "bg-spotify-green text-black shadow-md shadow-spotify-green/20"
                  : "text-spotify-light hover:text-white"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Medical Bill</span>
            </button>
          </div>
        </div>

        {/* FORMAT A: Nutritional Facts Label */}
        {activeViralFormat === "nutrition" && (
          <div className="max-w-md mx-auto bg-white text-black p-6 rounded-2xl border-4 border-black font-sans shadow-2xl">
            <h2 className="text-3xl font-black tracking-tight leading-none uppercase border-b-8 border-black pb-1">
              Music Facts
            </h2>
            <div className="text-xs border-b border-black py-1 font-bold">
              Serving Size: {nutritional.serving_size || "1 Delusional Listener"}
            </div>
            <div className="text-xs border-b-4 border-black py-1">
              <span className="font-bold">Servings Per Personality:</span> 1 (Depleted)
            </div>

            <div className="flex justify-between items-baseline border-b border-black py-1.5">
              <span className="text-sm font-black">Calories</span>
              <span className="text-2xl font-black">{nutritional.calories || "4,200"}</span>
            </div>

            <div className="text-right text-[10px] font-black border-b border-black py-0.5">
              % Daily Value*
            </div>

            <div className="flex justify-between text-xs font-black border-b border-black py-1">
              <span>Total Basicness</span>
              <span>{nutritional.basicness_dv || "180%"}</span>
            </div>

            <div className="flex justify-between text-xs font-black border-b border-black py-1">
              <span>Sodium (Saltiness)</span>
              <span>{nutritional.sodium_dv || "94%"}</span>
            </div>

            <div className="flex justify-between text-xs font-black border-b border-black py-1">
              <span>Copium Reserve</span>
              <span>{nutritional.copium_dv || "350%"}</span>
            </div>

            <div className="flex justify-between text-xs font-bold border-b border-black py-1 pl-3">
              <span>Aux Cord Contamination</span>
              <span className="font-black">CRITICAL</span>
            </div>

            <div className="flex justify-between text-xs font-bold border-b-4 border-black py-1 pl-3">
              <span>Originality</span>
              <span className="font-black">0%</span>
            </div>

            <div className="pt-2 text-[11px] leading-snug">
              <span className="font-black">INGREDIENTS: </span>
              <span className="font-medium">
                {(nutritional.ingredients || []).join(", ")}.
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-black text-[9px] text-gray-700 italic">
              *Percent Daily Values are based on a balanced human being with healthy emotional coping mechanisms. Your values may be drastically higher.
            </div>
          </div>
        )}

        {/* FORMAT B: Toxic Dating Profile (Red & White Flags) */}
        {activeViralFormat === "flags" && (
          <div className="max-w-xl mx-auto bg-spotify-dark/95 border-2 border-red-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-500 fill-red-500" />
                <h4 className="text-base font-black text-white uppercase tracking-tight">
                  Relationship Risk Assessment
                </h4>
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                Threat Level: Severe
              </span>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span>🚩</span> Confirmed Red Flags
              </h5>

              <div className="space-y-2.5">
                {(datingFlags.red_flags || []).map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-200 flex items-start gap-2.5"
                  >
                    <span className="shrink-0 font-bold text-red-400">🚩 #{idx + 1}:</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* White Flag */}
            <div className="pt-2 border-t border-white/10">
              <h5 className="text-xs font-black uppercase tracking-wider text-spotify-green flex items-center gap-1.5 mb-2">
                <span>🏳️</span> Lone White Flag (Redeeming Quality)
              </h5>
              <div className="p-3.5 rounded-2xl bg-spotify-green/10 border border-spotify-green/20 text-xs sm:text-sm text-spotify-green font-medium">
                "{datingFlags.white_flag || "Occasionally plays one good song before ruining the vibe again."}"
              </div>
            </div>
          </div>
        )}

        {/* FORMAT C: Psychiatric Evaluation / Pharmacy Receipt */}
        {activeViralFormat === "receipt" && (
          <div className="max-w-md mx-auto bg-[#f4ecd8] text-[#1c1917] font-mono p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-2xl text-xs space-y-4 relative">
            {/* Perforated top receipt visual */}
            <div className="text-center border-b-2 border-dashed border-[#1c1917]/30 pb-4">
              <h3 className="text-lg font-black tracking-widest uppercase">
                CLINICAL PSYCHIATRIC INVOICE
              </h3>
              <p className="text-[10px] text-stone-600">Department of Terminal Music Taste</p>
              <p className="text-[10px] text-stone-500 mt-1">Patient: {profile.user?.display_name || "Anonymous Listener"}</p>
            </div>

            <div className="space-y-2 border-b-2 border-dashed border-[#1c1917]/30 pb-4">
              {(medicalBill.diagnoses || []).map((diag, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span>{diag.item}</span>
                  <span className="font-bold">{diag.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-black border-b-2 border-[#1c1917] pb-2">
              <span>TOTAL COPIUM REQUIRED</span>
              <span className="text-red-700">{medicalBill.total_copium || "MAX DOSE"}</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/5 border border-amber-950/10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                Prescribed Treatment Plan:
              </span>
              <p className="text-xs italic text-stone-800">
                "{medicalBill.treatment || "Touch grass immediately and delete your 'Late Night' playlist."}"
              </p>
            </div>

            <div className="text-center text-[10px] text-stone-500 pt-1">
              *** PLEASE DO NOT DISCLOSE AUX CORD ACCESS TO DRIVERS ***
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
