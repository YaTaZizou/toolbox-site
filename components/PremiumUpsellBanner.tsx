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
    <div className="mt-8 border border-yellow-500/25 bg-gradient-to-r from-yellow-500/8 to-purple-600/8 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-sm font-bold text-white">
            Débloquer les 8 outils Premium — dès 3,99€/mois
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            IA illimitée · Zéro pub · Amélioration d&apos;image 4× · OCR avancé · Satisfait ou remboursé 7 jours
          </p>
        </div>
      </div>
      <Link
        href="/premium"
        className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
      >
        Essai gratuit 7 jours →
      </Link>
    </div>
  );
}
