"use client";

import Link from "next/link";
import { usePremiumStatus } from "@/components/PremiumProvider";

export function HeroPremiumBadge() {
  const { isPremium, loading } = usePremiumStatus();

  if (loading) return null;

  if (isPremium) {
    return (
      <Link
        href="/profil"
        className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-500/20 transition-colors text-sm flex items-center gap-2"
      >
        ⭐ Premium actif
        <span className="bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">✓</span>
      </Link>
    );
  }

  return (
    <Link
      href="/premium"
      className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-500/20 transition-colors text-sm"
    >
      ⭐ Passer Premium
    </Link>
  );
}
