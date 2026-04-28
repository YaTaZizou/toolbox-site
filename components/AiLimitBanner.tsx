"use client";

import Link from "next/link";

type Props = {
  remaining: number;
  isPremium: boolean;
  limit: number;
};

export function AiLimitBanner({ remaining, isPremium, limit }: Props) {
  if (isPremium) return null;

  if (remaining === 0) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-4 text-center">
        <p className="text-2xl mb-2">⭐</p>
        <p className="text-white font-semibold mb-1">Limite journalière atteinte</p>
        <p className="text-gray-400 text-sm mb-4">
          Tu as utilisé tes {limit} générations gratuites d&apos;aujourd&apos;hui.<br />
          Reviens demain ou passe Premium pour un accès illimité.
        </p>
        <Link
          href="/premium"
          className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          ⭐ Passer Premium — 2,99€/mois
        </Link>
      </div>
    );
  }

  const pct = (remaining / limit) * 100;
  const color = remaining <= 1 ? "bg-red-500" : remaining <= 2 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-24 bg-gray-800 rounded-full h-1.5">
          <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-400">
          {remaining}/{limit} génération{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} aujourd&apos;hui
        </span>
      </div>
      <Link href="/premium" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium shrink-0 transition-colors">
        ⭐ Illimité
      </Link>
    </div>
  );
}
