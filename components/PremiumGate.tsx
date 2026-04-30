"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { usePremiumStatus } from "@/components/PremiumProvider";
import { createBrowserClient } from "@supabase/ssr";

export function PremiumGate({ children }: { children: React.ReactNode }) {
  const { isPremium, loading } = usePremiumStatus();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, [supabase]);

  if (loading || isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPremium) return <>{children}</>;

  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-10">
        <p className="text-5xl mb-4">⭐</p>
        <h2 className="text-2xl font-bold text-white mb-2">Fonctionnalité Premium</h2>
        <p className="text-gray-400 text-sm mb-6">
          Cet outil est réservé aux membres Premium. Accès illimité, sans publicité, pour moins d&apos;un café par mois.
        </p>
        <div className="space-y-3">
          <Link
            href="/premium"
            className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors"
          >
            ⭐ Passer Premium — 2,99€/mois
          </Link>
          {isLoggedIn ? (
            // Connecté mais pas premium → aller directement payer
            <Link
              href="/premium"
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Voir les offres Premium
            </Link>
          ) : (
            // Non connecté → deux options : connexion ou inscription
            <>
              <Link
                href="/connexion?redirect=/premium"
                className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription?redirect=/premium"
                className="block w-full bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold py-3 rounded-xl transition-colors text-sm border border-gray-700"
              >
                Créer un compte gratuit
              </Link>
            </>
          )}
        </div>
        <ul className="mt-6 text-left space-y-2 text-sm text-gray-400">
          {[
            "✅ Accès à tous les outils premium",
            "✅ Générateurs IA illimités",
            "✅ Zéro publicité",
            "✅ Garanti 7 jours — remboursé si insatisfait",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
