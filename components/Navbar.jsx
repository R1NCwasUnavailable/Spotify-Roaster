"use client";

import Link from "next/link";
import { Flame, LogOut, Sparkles, HelpCircle } from "lucide-react";

export default function Navbar({ isAuthenticated, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-spotify-black/80 border-b border-spotify-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spotify-green to-emerald-400 flex items-center justify-center shadow-lg shadow-spotify-green/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Spotify<span className="text-spotify-green">Roaster</span>
            </span>
            <span className="block text-[10px] text-spotify-light font-medium tracking-wider uppercase -mt-1">
              AI Taste Executioner
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-spotify-light hover:text-spotify-danger bg-spotify-dark hover:bg-spotify-card border border-spotify-card rounded-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          ) : (
            <a
              href="/api/auth/login"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-black bg-spotify-green hover:bg-spotify-accent rounded-full shadow-md shadow-spotify-green/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect Spotify</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

