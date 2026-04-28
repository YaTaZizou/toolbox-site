"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export function PremiumGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "premium" | "free" | "guest">("loading");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setStatus("guest"); return; }
      const { data: prof } = await supabase
        .from("profiles")
        .select("is_subscribed")
        .eq("id", data.user.id)
        .single();
      setStatus(prof?.is_subscribed ? "premium" : "free");
    });
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "premium") return <>{children}</>;

  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-10">
        <p className="text-5xl mb-4">⭐</p>
        <h2 className="text-2xl font-bold text-white mb-2">Fonctionnalité Premium</h2>
        <p className="text-gray-400 text-sm mb-6">
          Cet outil est réservé aux membres Premium. Passe Premium pour y accéder et supprimer toutes les publicités.
        </p>
        <div className="space-y-3">
          <Link
            href="/premium"
            className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors"
          >
            ⭐ Passer Premium — 2,99€/mois
          </Link>
          {status === "guest" && (
            <Link
              href="/connexion"
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Se connecter
            </Link>
          )}
        </div>
        <ul className="mt-6 text-left space-y-2 text-sm text-gray-400">
          {["✅ Accès à tous les outils premium", "✅ Sans publicités", "✅ Résultats prioritaires", "✅ Résilie quand tu veux"].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
