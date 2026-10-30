"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatSummary from "@/components/StatSummary";
import RoastCard from "@/components/RoastCard";
import IntensitySelector from "@/components/IntensitySelector";
import { Flame, Sparkles, Loader2, Music, AlertCircle, LogIn, Lock } from "lucide-react";
import confetti from "canvas-confetti";

function DashboardContent() {
  const router = useRouter();

  const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, hasSpotifyCredentials: false, hasAiKey: false });
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [intensity, setIntensity] = useState("sarcastic");
  const [roast, setRoast] = useState(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastError, setRoastError] = useState(null);

  // Check auth status and load profile on mount
  useEffect(() => {
    async function loadData() {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const res = await fetch("/api/spotify/data", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAuthStatus({ isAuthenticated: true, hasSpotifyCredentials: true, hasAiKey: true });
          setProfile(data.profile);
          await triggerRoast(data.profile, intensity);
        } else if (res.status === 401) {
          setAuthStatus(prev => ({ ...prev, isAuthenticated: false }));
        } else {
          const errorData = await res.json();
          setProfileError(errorData.error || "Failed to load Spotify data.");
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setProfileError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadData();
  }, []);

  const fetchProfileData = async () => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/spotify/data", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setAuthStatus(prev => ({ ...prev, isAuthenticated: false }));
        }
        throw new Error(data.error || "Failed to load Spotify profile data.");
      }

      setAuthStatus({ isAuthenticated: true, hasSpotifyCredentials: true, hasAiKey: true });
      setProfile(data.profile);
      await triggerRoast(data.profile, intensity);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const triggerRoast = async (targetProfile = profile, currentIntensity = intensity) => {
    if (!targetProfile) return;
    setIsRoasting(true);
    setRoastError(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: targetProfile,
          intensity: currentIntensity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate roast.");
      }

      setRoast(data.roast);

      // Light confetti celebration
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#FF4D4D", "#1DB954", "#F59E0B"],
      });
    } catch (err) {
      setRoastError(err.message);
    } finally {
      setIsRoasting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthStatus(prev => ({ ...prev, isAuthenticated: false }));
    setProfile(null);
    setRoast(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-spotify-black text-white pb-24">
      <Navbar
        isAuthenticated={authStatus.isAuthenticated}
        onLogout={handleLogout}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* If Not Authenticated, prompt to connect Spotify */}
        {!authStatus.isAuthenticated && !loadingProfile && (
          <div className="max-w-xl mx-auto my-16 text-center p-8 rounded-3xl bg-spotify-dark border border-spotify-card shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                Spotify Authorization Required
              </h2>
              <p className="text-sm text-spotify-light">
                To generate your personalized roast, you must connect your Spotify account. We only read your top artists, top tracks, and recent history.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/api/auth/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-black text-black bg-spotify-green hover:bg-spotify-accent shadow-xl shadow-spotify-green/25 transition-all hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In With Spotify</span>
              </a>
            </div>
          </div>
        )}

        {/* Live Authenticated View */}
        {authStatus.isAuthenticated && (
          <>
            {/* Live Account Connected Banner */}
            {profile && (
              <div className="p-3.5 rounded-2xl bg-spotify-green/10 border border-spotify-green/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-spotify-green animate-pulse" />
                  <span className="font-bold text-white">
                    Live Spotify Connected:{" "}
                    <span className="text-spotify-green font-extrabold">{profile?.user?.display_name}</span>
                  </span>
                </div>
                <span className="text-spotify-light hidden sm:inline">Analyzing your real listening activity</span>
              </div>
            )}

            {/* Profile and Roast Controls Header */}
            <div className="pb-4 border-b border-spotify-card/80">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-spotify-green mb-1">
                <Flame className="w-3.5 h-3.5 fill-spotify-green" />
                <span>Taste Diagnostic Laboratory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                {profile?.user?.display_name || "Your"}'s Roast Chamber
              </h1>
              <p className="text-sm text-spotify-light mt-1">
                Analyzing your top artists, tracks, and secret repeat habits.
              </p>
            </div>

            {/* Roast Intensity Selector */}
            <div className="bg-spotify-dark/80 border border-spotify-card rounded-2xl p-5 shadow-lg">
              <IntensitySelector
                value={intensity}
                onChange={(newVal) => {
                  setIntensity(newVal);
                  triggerRoast(profile, newVal);
                }}
                disabled={isRoasting || !profile}
              />
            </div>
          </>
        )}

        {/* Error notifications if any */}
        {(profileError || roastError) && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <div>
              <p className="font-bold">Error:</p>
              <p className="text-xs text-red-200">{profileError || roastError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingProfile && (
          <div className="py-24 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-spotify-green/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-spotify-dark border-2 border-spotify-green flex items-center justify-center">
                <Music className="w-7 h-7 text-spotify-green animate-bounce" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Inspecting Your Spotify Music Crimes...</h3>
            <p className="text-xs text-spotify-light">Fetching top artists, tracks, and calculating cringe factor.</p>
          </div>
        )}

        {/* Active Roast Section */}
        {!loadingProfile && roast && profile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                The Verdict
              </h2>
              <span className="text-xs text-spotify-light">Updated in real-time</span>
            </div>

            <RoastCard
              roast={roast}
              profile={profile}
              onReRoast={() => triggerRoast(profile, intensity)}
              isGenerating={isRoasting}
            />
          </div>
        )}

        {/* Satirical Taste Diagnostics & Evidence */}
        {!loadingProfile && profile && (
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-spotify-card/80">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  Satirical Diagnostics & Evidence File
                </h3>
                <p className="text-xs text-spotify-light">
                  Raw Spotify metadata transformed into calculated behavioral metrics and viral formats.
                </p>
              </div>
            </div>

            <StatSummary profile={profile} roast={roast} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-spotify-green" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
