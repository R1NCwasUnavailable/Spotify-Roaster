"use client";

import { Smile, Zap, Skull } from "lucide-react";

const INTENSITIES = [
  {
    id: "mild",
    label: "Mild Tease",
    icon: Smile,
    desc: "Gentle ribbing, still invited to parties",
    activeColor: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
    badge: "Friendly",
  },
  {
    id: "sarcastic",
    label: "Sarcastic Friend",
    icon: Zap,
    desc: "Dry wit, sharp eye-rolls & honest burns",
    activeColor: "border-amber-500 bg-amber-500/10 text-amber-400",
    badge: "Recommended",
  },
  {
    id: "brutal",
    label: "Emotional Destruction",
    icon: Skull,
    desc: "No mercy. Unapologetic psychological damage",
    activeColor: "border-red-500 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/20",
    badge: "Savage 18+",
  },
];

export default function IntensitySelector({ value, onChange, disabled }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-wider font-semibold text-spotify-light">
          Roast Severity Level
        </label>
        <span className="text-[11px] text-spotify-light">Choose how hard you want to get humbled</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {INTENSITIES.map((tier) => {
          const Icon = tier.icon;
          const isSelected = value === tier.id;

          return (
            <button
              key={tier.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(tier.id)}
              className={`relative flex flex-col p-3.5 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? `${tier.activeColor} border-2 scale-[1.02]`
                  : "border-spotify-card bg-spotify-dark/70 text-spotify-light hover:border-spotify-card/80 hover:text-white"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-current" : "text-spotify-light"}`} />
                  <span className="font-bold text-sm text-white">{tier.label}</span>
                </div>
                {tier.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                    tier.id === "brutal"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : tier.id === "sarcastic"
                      ? "bg-spotify-green/20 text-spotify-green border border-spotify-green/30"
                      : "bg-white/10 text-white/70"
                  }`}>
                    {tier.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-spotify-light mt-0.5 line-clamp-1">{tier.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

