"use client";

import Link from "next/link";
import { usePremiumStatus } from "@/components/PremiumProvider";

export function NavPremiumBadge() {
  const { isPremium, loading } = usePremiumStatus();

  if (loading) return null;

  if (isPremium) {
    return (
      <Link
        href="/profil"
        className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-yellow-500/20"
        title="Voir mon abonnement"
      >
        ⭐ Premium
        <span className="bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
          ✓
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/premium"
      className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 font-semibold px-3 py-1.5 rounded-lg transition-all text-xs"
    >
      ⭐ Premium
    </Link>
  );
}
