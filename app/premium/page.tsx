"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Plan = "monthly" | "annual";

const TOTAL_TOOLS = 29;

const FEATURES_FREE = [
  { label: "Outils PDF", ok: true },
  { label: "Convertisseur image", ok: true },
  { label: "Convertisseur vidéo & audio", ok: true },
  { label: "QR Code, hash, JSON...", ok: true },
  { label: "Générateurs IA (5/jour)", ok: true },
  { label: "OCR — Image en texte (5/jour)", ok: true },
  { label: "Générateurs IA illimités", ok: false },
  { label: "Amélioration d'image IA", ok: false },
  { label: "Sans publicité", ok: false },
  { label: "Accès en avant-première aux nouveaux outils", ok: false },
];

const FEATURES_PREMIUM = [
  { label: "Outils PDF", ok: true },
  { label: "Convertisseur image", ok: true },
  { label: "Convertisseur vidéo & audio", ok: true },
  { label: "QR Code, hash, JSON...", ok: true },
  { label: "Générateurs IA illimités", ok: true },
  { label: "OCR — Image en texte illimité", ok: true },
  { label: "Amélioration d'image IA", ok: true },
  { label: "Sans publicité", ok: true },
  { label: "Accès en avant-première aux nouveaux outils", ok: true },
  { label: "Support prioritaire", ok: true },
  { label: "Correcteur illimité (plus de limite de 500 caractères)", ok: true },
  { label: "Fusionner jusqu'à 50 PDFs en une fois", ok: true },
  { label: "OCR jusqu'à 20 Mo par fichier", ok: true },
  { label: "Toutes les langues du traducteur (arabe, japonais, coréen, chinois)", ok: true },
];

const FAQ = [
  {
    q: "Comment fonctionne l'abonnement ?",
    a: "L'abonnement est mensuel ou annuel, sans engagement. Tu peux annuler à tout moment depuis ton espace membre. Le prélèvement est automatique à chaque renouvellement.",
  },
  {
    q: "Est-ce que je peux annuler à tout moment ?",
    a: "Oui, à tout moment et sans frais. Ton accès Premium reste actif jusqu'à la fin de la période payée.",
  },
  {
    q: "Y a-t-il une garantie satisfait ou remboursé ?",
    a: "Oui ! Si tu n'es pas satisfait dans les 7 jours suivant ton abonnement, écris-nous et nous te remboursons intégralement, sans question.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Carte bancaire (Visa, Mastercard, American Express) via Stripe. Paiement 100% sécurisé et chiffré.",
  },
  {
    q: "La différence entre mensuel et annuel ?",
    a: "Le plan annuel est facturé en une seule fois à 29,99€/an, soit l'équivalent de 2,50€/mois — une économie de 37% par rapport au mensuel.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Oui. Les fichiers traités ne sont jamais stockés sur nos serveurs. Tout est traité en mémoire et supprimé immédiatement après.",
  },
];

function PremiumContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email! });
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_subscribed")
          .eq("id", data.user.id)
          .single();
        setIsSubscribed(profile?.is_subscribed ?? false);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [supabase]);

  async function startCheckout(plan: Plan) {
    if (!user) return;
    setCheckoutError(null);
    setCheckoutLoading(true);
    const res = await fetch("/api/stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // On envoie seulement le plan — le serveur vérifie l'identité via les cookies
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else {
      setCheckoutLoading(false);
      setCheckoutError(data.error || "Une erreur est survenue. Réessaie.");
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">

      {/* Alerts */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl px-6 py-4 mb-10 text-center">
          🎉 Abonnement activé ! Bienvenue dans ToolBox Premium !{" "}
          <Link href="/" className="underline font-semibold hover:text-green-300">
            Explorer les outils →
          </Link>
        </div>
      )}
      {canceled && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl px-6 py-4 mb-10 text-center">
          Paiement annulé. Tu peux réessayer quand tu veux.
        </div>
      )}

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-yellow-400 text-sm mb-6">
          ⭐ ToolBox Premium
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {isSubscribed ? "Tu es déjà Premium !" : "Tous les outils. Sans limites."}
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          {isSubscribed
            ? "Profite de tous les outils sans aucune restriction."
            : "Arrête de compter tes générations IA. Travaille sans interruption, sans pub, sans limite."}
        </p>
      </div>

      {/* Active badge */}
      {isSubscribed && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-6 text-center mb-10">
          <p className="text-2xl mb-2">🏆</p>
          <p className="font-bold text-lg mb-1">Abonnement actif</p>
          <p className="text-green-500/80 text-sm mb-4">Profite de tous les outils sans restriction !</p>
          <Link
            href="/"
            className="inline-block bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Explorer les outils →
          </Link>
        </div>
      )}

      {/* Plans — only shown if not subscribed */}
      {!isSubscribed && (
        <>
          {/* Plan toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1 flex gap-1">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedPlan === "monthly"
                    ? "bg-gray-700 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setSelectedPlan("annual")}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedPlan === "annual"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Annuel
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  selectedPlan === "annual" ? "bg-black/20 text-black" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  -37%
                </span>
              </button>
            </div>
          </div>

          {/* Price card */}
          <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-8 mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                {selectedPlan === "annual" ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-5xl font-black">2,50€</span>
                      <span className="text-gray-400 text-lg">/mois</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      soit <span className="text-yellow-400 font-semibold">29,99€/an</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-5xl font-black">3,99€</span>
                      <span className="text-gray-400 text-lg">/mois</span>
                    </div>
                    <p className="text-gray-500 text-sm">Facturé 3,99€/mois · Sans engagement</p>
                  </>
                )}
                <p className="text-gray-600 text-xs mt-1">☕ Soit moins qu&apos;un café par mois</p>
              </div>
              <div className="flex flex-col gap-2 min-w-[220px]">
                {user ? (
                  <button
                    onClick={() => startCheckout(selectedPlan)}
                    disabled={checkoutLoading}
                    className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black font-bold py-4 px-8 rounded-xl transition-colors text-lg whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {checkoutLoading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                    {checkoutLoading
                      ? "Redirection..."
                      : selectedPlan === "annual"
                      ? "⭐ S'abonner — 29,99€/an"
                      : "⭐ S'abonner — 3,99€/mois"}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/inscription?redirect=/premium"
                      className="block text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-colors text-base"
                    >
                      Créer un compte gratuit
                    </Link>
                    <Link
                      href="/connexion?redirect=/premium"
                      className="block text-center border border-gray-700 hover:border-gray-500 text-gray-300 font-medium py-3 px-8 rounded-xl transition-colors text-sm"
                    >
                      J&apos;ai déjà un compte
                    </Link>
                  </div>
                )}
                {/* Badge essai gratuit 7 jours */}
                <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                  <span className="text-green-400 text-sm">🛡️</span>
                  <span className="text-xs text-green-400 font-semibold">7 jours satisfait ou remboursé — sans question</span>
                </div>
                {checkoutError && (
                  <p className="text-red-400 text-sm text-center mt-2">{checkoutError}</p>
                )}
                {/* Badges de confiance */}
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="text-xs text-gray-600 flex items-center gap-1">🔒 SSL</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-600">Stripe</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-600">Visa / Mastercard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 mb-10 text-sm text-gray-400">
            <span className="text-xl">🛡️</span>
            <span>
              <strong className="text-white">Garantie 7 jours satisfait ou remboursé.</strong>{" "}
              Si tu n&apos;es pas satisfait, on te rembourse sans question ni justification.
            </span>
          </div>
        </>
      )}

      {/* Comparison table */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-center mb-6">Gratuit vs Premium</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 text-sm text-gray-500 font-medium">Fonctionnalité</div>
            <div className="p-4 text-sm text-center text-gray-400 font-semibold border-l border-gray-800">Gratuit</div>
            <div className="p-4 text-sm text-center text-yellow-400 font-semibold border-l border-gray-800">⭐ Premium</div>
          </div>
          {FEATURES_FREE.map((feat, i) => (
            <div
              key={feat.label}
              className={`grid grid-cols-3 border-b border-gray-800/50 last:border-0 ${i % 2 === 0 ? "" : "bg-gray-900/50"}`}
            >
              <div className="p-4 text-sm text-gray-300">{feat.label}</div>
              <div className="p-4 text-center border-l border-gray-800">
                {feat.ok ? <span className="text-green-400 text-lg">✓</span> : <span className="text-gray-700 text-lg">✕</span>}
              </div>
              <div className="p-4 text-center border-l border-gray-800">
                <span className="text-green-400 text-lg">✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div className="grid md:grid-cols-3 gap-4 mb-14">
        {[
          { emoji: "🔧", stat: `${TOTAL_TOOLS}`, label: "outils disponibles" },
          { emoji: "🚀", stat: "100%", label: "en ligne, aucune install" },
          { emoji: "🛡️", stat: "7j", label: "garantie remboursement" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-2xl mb-1">{s.emoji}</p>
            <p className="text-2xl font-bold text-white">{s.stat}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Témoignages */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-center mb-2">Ce qu&apos;ils en disent</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Des utilisateurs qui ont franchi le pas</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              initials: "M.L.",
              role: "Freelance créatif",
              stars: 5,
              text: "J'utilise les générateurs IA tous les jours pour mes clients. La limite gratuite était frustrante, Premium vaut vraiment le coup pour 3,99€/mois.",
            },
            {
              initials: "S.K.",
              role: "Étudiante",
              stars: 5,
              text: "Le traducteur et le correcteur IA m'ont sauvé la vie pour mes cours. Plus de pubs partout, c'est tellement plus agréable à utiliser.",
            },
            {
              initials: "T.R.",
              role: "Entrepreneur",
              stars: 5,
              text: "L'amélioration d'image IA est bluffante. J'utilise ça pour mes produits et mes réseaux sociaux. Outil indispensable pour un prix ridicule.",
            },
          ].map((t) => (
            <div
              key={t.initials}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: "var(--panel)", border: "1px solid var(--tb-border)" }}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#facc15">
                    <path d="m12 2 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.6l1.2-6.1L3.3 9.3l6.1-.7L12 3z"/>
                  </svg>
                ))}
              </div>
              {/* Texte */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              {/* Auteur */}
              <div className="flex items-center gap-3 pt-1 border-t" style={{ borderColor: "var(--tb-border)" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}
                >
                  {t.initials.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.initials}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Questions fréquentes</h2>
        <div className="space-y-2">
          {FAQ.map((faq, i) => (
            <div key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-200 hover:text-white transition-colors"
              >
                {faq.q}
                <span className={`text-gray-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>▾</span>
              </button>
              {openFaq === i && (
                <div aria-hidden={openFaq !== i} className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      {!isSubscribed && (
        <div className="text-center bg-gray-900/50 border border-yellow-500/10 rounded-2xl p-8">
          <p className="text-white font-bold text-xl mb-1">
            À partir de 2,50€/mois. Résiliable en 1 clic.
          </p>
          <p className="text-gray-500 text-sm mb-6">Essaie 7 jours sans risque — remboursé si insatisfait.</p>
          {user ? (
            <button
              onClick={() => startCheckout(selectedPlan)}
              disabled={checkoutLoading}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black font-bold py-4 px-10 rounded-2xl transition-colors text-lg"
            >
              {checkoutLoading ? "Redirection..." : "⭐ Passer Premium maintenant"}
            </button>
          ) : (
            <Link
              href="/inscription?redirect=/premium"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-2xl transition-colors text-lg"
            >
              Commencer gratuitement →
            </Link>
          )}
        </div>
      )}
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
