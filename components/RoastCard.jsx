"use client";

import { useRef, useState } from "react";
import { Download, Flame, Share2, Sparkles, AlertOctagon, Check, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

export default function RoastCard({ roast, profile, onReRoast, isGenerating }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!roast) return null;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1DB954", "#1ED760", "#FF4D4D", "#FFFFFF"]
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `spotify-roast-${profile?.user?.display_name || "taste"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate roast card image:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = () => {
    const textToCopy = `🔥 MY SPOTIFY ROAST: "${roast.roast_title}"
Archetype: ${roast.archetype}

"${roast.roast_summary}"

Burns:
${(roast.burns || []).map(b => `• ${b}`).join("\n")}

${roast.damage_rating} | Roasted by SpotifyRoaster`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Action buttons bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-spotify-dark/70 border border-spotify-card rounded-2xl p-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <Flame className="w-3.5 h-3.5 fill-red-400" />
            {roast.damage_rating || "Damage: Maximum"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReRoast}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-spotify-light hover:text-white bg-spotify-card/80 hover:bg-spotify-card rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Re-Roast</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-spotify-light hover:text-white bg-spotify-card/80 hover:bg-spotify-card rounded-xl transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-spotify-green" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-spotify-green hover:bg-spotify-accent rounded-xl shadow-md shadow-spotify-green/20 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "Rendering..." : "Export Card"}</span>
          </button>
        </div>
      </div>

      {/* Shareable Card Canvas */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181818] via-[#141414] to-[#0d0d0d] border-2 border-red-500/30 p-6 md:p-8 shadow-2xl shadow-red-950/20"
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-spotify-green/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Flame className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-red-400 block">
                Official Music Verdict
              </span>
              <h4 className="text-lg font-black text-white">
                {profile?.user?.display_name || "Anonymous Listener"}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-spotify-green">
              Spotify Roaster
            </div>
          </div>
        </div>

        {/* Archetype Banner */}
        <div className="my-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Diagnosis: {roast.archetype || "The Algorithmic Casualty"}</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-black text-white mt-3 tracking-tight leading-tight">
            "{roast.roast_title}"
          </h2>

          {/* Summary */}
          <p className="text-base text-gray-300 mt-3 leading-relaxed font-medium">
            {roast.roast_summary}
          </p>
        </div>

        {/* Savage Burns List */}
        <div className="space-y-3 my-6">
          <h5 className="text-xs font-black uppercase tracking-widest text-spotify-light flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            Specific Indictments
          </h5>

          <div className="grid gap-2.5">
            {(roast.burns || []).map((burn, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-black text-red-400">{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-200 leading-snug">{burn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Embarrassing Confession Box */}
        {roast.embarrassing_confession && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
              Unspoken Truth You Won't Admit:
            </span>
            <p className="text-xs md:text-sm italic font-medium">
              "{roast.embarrassing_confession}"
            </p>
          </div>
        )}

        {/* Card Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-spotify-light">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Top Offender:</span>
            <span className="text-spotify-green font-bold">
              {profile?.top_artists?.[0]?.name || "Autoplay"}
            </span>
            <span>•</span>
            <span>Obscurity: {profile?.vibe_metrics?.obscurity_score || 25}/100</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-spotify-light/70">
            <span>spotify-roaster.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}

