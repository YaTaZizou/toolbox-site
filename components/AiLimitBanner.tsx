"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  remaining: number;
  isPremium: boolean;
  limit: number;
};

function getTimeUntilReset(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours === 0) return `${mins} min`;
  return `${hours}h ${mins}min`;
}

export function AiLimitBanner({ remaining, isPremium, limit }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());

  useEffect(() => {
    if (remaining > 0 || isPremium) return;
    const id = setInterval(() => setTimeLeft(getTimeUntilReset()), 30_000);
    return () => clearInterval(id);
  }, [remaining, isPremium]);

  if (isPremium) return null;

  // ── Limite atteinte ────────────────────────────────────────────────────
  if (remaining === 0) {
    return (
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">⭐</span>
              <p className="text-white font-bold">Limite journalière atteinte</p>
            </div>
            <p className="text-gray-400 text-sm mb-1">
              Tu as utilisé tes {limit} générations gratuites d&apos;aujourd&apos;hui.
            </p>
            <p className="text-gray-600 text-xs flex items-center gap-1">
              <span>🕐</span>
              Réinitialisation dans{" "}
              <span className="text-gray-400 font-semibold">{timeLeft}</span>
              {" "}— ou passe Premium pour un accès illimité dès maintenant.
            </p>
          </div>
          <Link
            href="/premium"
            className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            ⭐ Passer Premium — 2,99€/mois
          </Link>
        </div>
      </div>
    );
  }

  // ── Barre de progression ───────────────────────────────────────────────
  const pct = (remaining / limit) * 100;
  const color =
    remaining <= 1 ? "bg-red-500" : remaining <= 2 ? "bg-yellow-500" : "bg-green-500";
  const urgency = remaining === 1;

  return (
    <div
      className={`border rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between gap-3 transition-colors ${
        urgency
          ? "bg-red-500/5 border-red-500/20"
          : "bg-gray-900 border-gray-800"
      }`}
    >
      <div className="flex items-center gap-2 flex-1">
        <div className="w-24 bg-gray-800 rounded-full h-1.5">
          <div
            className={`${color} h-1.5 rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">
          {urgency && <span className="text-red-400 font-semibold mr-0.5">⚠️</span>}
          {remaining}/{limit} génération{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} aujourd&apos;hui
        </span>
      </div>
      <Link
        href="/premium"
        className="text-xs text-yellow-400 hover:text-yellow-300 font-medium shrink-0 transition-colors"
      >
        ⭐ Illimité
      </Link>
    </div>
  );
}
