"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PremiumContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email! });
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_subscribed")
          .eq("id", user.id)
          .single();
        setIsSubscribed(profile?.is_subscribed ?? false);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function startCheckout() {
    if (!user) return;
    setCheckoutLoading(true);
    const res = await fetch("/api/stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setCheckoutLoading(false);
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl px-6 py-4 mb-10">
          🎉 Abonnement activé ! Bienvenue dans ToolBox Premium !
        </div>
      )}
      {canceled && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl px-6 py-4 mb-10">
          Paiement annulé. Tu peux réessayer quand tu veux.
        </div>
      )}

      <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-yellow-400 text-sm mb-6">
        ⭐ ToolBox Premium
      </div>

      <h1 className="text-4xl font-bold mb-4">
        {isSubscribed ? "Tu es Premium !" : "Passe à Premium"}
      </h1>
      <p className="text-gray-400 text-lg mb-12">
        {isSubscribed
          ? "Profite de tous les outils sans aucune publicité."
          : "Supprime toutes les pubs pour seulement 2,99€/mois."}
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
        <div className="text-5xl font-bold mb-2">
          2,99€<span className="text-2xl font-normal text-gray-400">/mois</span>
        </div>
        <p className="text-gray-500 mb-8">Résiliable à tout moment</p>

        <ul className="space-y-3 text-left mb-8">
          {[
            "✅ Zéro publicité sur tout le site",
            "✅ Accès à tous les outils",
            "✅ Générateurs IA illimités",
            "✅ Conversions de fichiers illimitées",
            "✅ Accès prioritaire aux nouveaux outils",
          ].map((item) => (
            <li key={item} className="text-gray-300">{item}</li>
          ))}
        </ul>

        {isSubscribed ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3">
            ✓ Abonnement actif — profite bien !
          </div>
        ) : user ? (
          <button
            onClick={startCheckout}
            disabled={checkoutLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black font-bold py-4 rounded-xl transition-colors text-lg"
          >
            {checkoutLoading ? "Redirection..." : "⭐ S'abonner pour 2,99€/mois"}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm mb-4">Crée un compte pour t'abonner</p>
            <Link
              href="/inscription"
              className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/login"
              className="block w-full border border-gray-700 hover:border-gray-500 text-gray-300 font-medium py-3 rounded-xl transition-colors"
            >
              J'ai déjà un compte
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PremiumPage() {
  return (
    <Suspense>
      <PremiumContent />
    </Suspense>
  );
}
