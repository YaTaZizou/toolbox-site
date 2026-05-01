"use client";

import Link from "next/link";
import { usePremiumStatus } from "@/components/PremiumProvider";

/**
 * Bannière d'upsell subtile à placer en bas de chaque outil gratuit.
 * Disparaît automatiquement pour les utilisateurs Premium.
 */
export function PremiumUpsellBanner() {
  const { isPremium, loading } = usePremiumStatus();

  if (loading || isPremium) return null;

  return (
    <div className="mt-8 border border-yellow-500/20 bg-yellow-500/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">⭐</span>
        <div>
          <p className="text-sm font-semibold text-white">Passe Premium — 3,99€/mois</p>
          <p className="text-xs text-gray-500">IA illimitée · Zéro pub · Tous les outils débloqués</p>
        </div>
      </div>
      <Link
        href="/premium"
        className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors"
      >
        Découvrir →
      </Link>
    </div>
  );
}
