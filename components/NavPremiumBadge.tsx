"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export function NavPremiumBadge() {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsPremium(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_subscribed")
        .eq("id", user.id)
        .single();

      setIsPremium(profile?.is_subscribed === true);
    }

    check();

    // Mettre à jour si l'état auth change (connexion / déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange(() => check());
    return () => listener.subscription.unsubscribe();
  }, []);

  // Pendant le chargement : ne rien afficher pour éviter le flash
  if (isPremium === null) return null;

  // ── Déjà Premium ─────────────────────────────────────────────────────
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

  // ── Pas Premium : lien d'upgrade ─────────────────────────────────────
  return (
    <Link
      href="/premium"
      className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 font-semibold px-3 py-1.5 rounded-lg transition-all text-xs"
    >
      ⭐ Premium
    </Link>
  );
}
