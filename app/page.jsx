"use client";

import { useState, useEffect } from "react";
import { Flame, Sparkles, Share2, Music, Zap, Skull, ShieldCheck, Download, AlertTriangle, Disc } from "lucide-react";

export default function HomePage() {
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        if (err === "missing_credentials") {
          setErrorMessage("Spotify credentials missing in .env.local. Please check your setup.");
        } else {
          setErrorMessage(decodeURIComponent(err));
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-spotify-black text-white selection:bg-spotify-green selection:text-black">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-spotify-black/80 border-b border-spotify-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-spotify-green to-emerald-400 flex items-center justify-center shadow-lg shadow-spotify-green/20">
              <Flame className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Spotify<span className="text-spotify-green">Roaster</span>
            </span>
          </div>

          <div>
            <a
              href="/api/auth/login"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-spotify-green hover:bg-spotify-accent rounded-full shadow-md shadow-spotify-green/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect Spotify</span>
            </a>
          </div>
        </div>
      </header>

      {/* Error banner if redirected with error */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-spotify-green/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-red-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spotify-card border border-white/10 text-xs font-bold uppercase tracking-wider text-spotify-light">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>Your Taste Diagnostic</span>
            <span className="w-1.5 h-1.5 rounded-full bg-spotify-green animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Your Spotify History is a{" "}
            <span className="gradient-fire">Cry for Help.</span>
            <br />
            Let AI Roast It.
          </h1>

          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
            We pull your actual top artists, guilty genres, and late-night repeats, then feed them to an uncensored AI comedian with zero manners.
          </p>

          {/* Action CTA */}
          <div className="pt-4 flex items-center justify-center">
            <a
              href="/api/auth/login"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-black text-black bg-spotify-green hover:bg-spotify-accent shadow-2xl shadow-spotify-green/30 transition-all hover:scale-105 active:scale-95"
            >
              <Music className="w-6 h-6" />
              <span>Connect Spotify & Get Roasted</span>
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-spotify-light">
            <div className="flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-spotify-green" />
              <span>Shareable Social Cards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-red-400" />
              <span>3 Levels of Brutality</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Aux Cord Hazard Rating</span>
            </div>
          </div>
        </div>

        {/* Floating Sample Teaser Card */}
        <div className="relative mt-16 max-w-3xl mx-auto text-left">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#1c1c1c] to-[#121212] border border-red-500/30 p-6 sm:p-8 shadow-2xl shadow-red-950/30">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-spotify-green" />
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-spotify-light">
                  Sample Verdict
                </span>
              </div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                Emotional Damage: 98%
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Diagnosis: The Bipolar Aux Cord Terrorist
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                "Screaming in the Moshpit, Crying to Sabrina Carpenter"
              </h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                "You transition from Swedish metal blast beats to bubblegum synth-pop so fast you give your eardrums whiplash. Listening to Meshuggah followed directly by Taylor Swift proves your playlist was assembled during an existential panic attack."
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-spotify-light block">Top Contradiction:</span>
                <span className="font-bold text-white">Taylor Swift ➔ Meshuggah</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-spotify-light block">Aux Cord Clearance:</span>
                <span className="font-bold text-red-400">Strictly Denied</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Feature Highlights Section */}
      <section className="py-20 border-t border-spotify-card/80 bg-spotify-dark/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-black uppercase tracking-widest text-spotify-green mb-2">
              Features
            </h2>
            <h3 className="text-3xl font-black text-white">What You Get With Your Roast</h3>
            <p className="text-sm text-spotify-light mt-2">
              Built specifically for sharing, laughing, and questioning your playlist choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-spotify-dark border border-spotify-card hover:border-spotify-green/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-spotify-green/20 text-spotify-green flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-spotify-light uppercase tracking-wider">Social Ready</span>
              <h4 className="text-lg font-bold text-white mt-1 mb-2">Exportable Story Cards</h4>
              <p className="text-xs text-spotify-light leading-relaxed">
                One-click high-resolution image export designed for Instagram Stories, Twitter (X), Reddit, or Discord with celebration confetti.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-spotify-dark border border-spotify-card hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-spotify-light uppercase tracking-wider">Adjustable Damage</span>
              <h4 className="text-lg font-bold text-white mt-1 mb-2">Choose Your Severity</h4>
              <p className="text-xs text-spotify-light leading-relaxed">
                Toggle between Mild Tease, Sarcastic Friend, and Emotional Destruction depending on how brutally honest you want the burns to be.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-spotify-dark border border-spotify-card hover:border-red-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <Skull className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-spotify-light uppercase tracking-wider">Taste Science</span>
              <h4 className="text-lg font-bold text-white mt-1 mb-2">Cringe & Aux Cord Hazard</h4>
              <p className="text-xs text-spotify-light leading-relaxed">
                Get scored on obscurity, playlist chaos, mainstream quotient, and a definitive ruling on whether friends can trust you with the aux cord.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-spotify-card/80 text-center text-xs text-spotify-light">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© Spotify Roaster. Let AI expose your music crimes.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-spotify-green animate-pulse" />
            <span className="text-[11px] text-spotify-light/70">Ready to roast</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
