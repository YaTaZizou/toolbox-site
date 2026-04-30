"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePremiumStatus } from "@/components/PremiumProvider";

declare global {
  interface Window { adsbygoogle: unknown[] }
}

function pushAd() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {}
}

/* ── Bannière horizontale (homepage entre catégories) ── */
export function AdBanner() {
  const { isPremium, loading } = usePremiumStatus();
  useEffect(() => { if (!isPremium && !loading) pushAd(); }, [isPremium, loading]);

  if (loading || isPremium) return null;

  return (
    <div className="w-full text-center my-6">
      <p className="text-xs text-gray-600 mb-1">PUBLICITÉ</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9277300744556228"
        data-ad-slot="4223758608"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Link href="/premium" className="text-xs text-gray-600 hover:text-yellow-400 transition-colors mt-1 inline-block">
        ⭐ Supprimer les pubs — 3,99€/mois
      </Link>
    </div>
  );
}

/* ── Sidebar verticale gauche / droite ── */
export function SidebarAd({ slot }: { slot: "left" | "right" }) {
  const { isPremium, loading } = usePremiumStatus();
  useEffect(() => { if (!isPremium && !loading) pushAd(); }, [isPremium, loading]);

  if (loading || isPremium) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <p className="text-xs text-gray-700">PUB</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "160px", minHeight: "600px" }}
        data-ad-client="ca-pub-9277300744556228"
        data-ad-slot="9201901898"
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
      <Link href="/premium" className="text-xs text-gray-700 hover:text-yellow-400 transition-colors text-center leading-tight">
        ⭐ Sans pub<br />3,99€/mois
      </Link>
    </div>
  );
}

/* ── Bannière sticky en bas (mobile) ── */
export function StickyBottomAd() {
  const { isPremium, loading } = usePremiumStatus();
  useEffect(() => { if (!isPremium && !loading) pushAd(); }, [isPremium, loading]);

  if (loading || isPremium) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-800/60 py-1 px-2 flex items-center justify-center gap-3">
      <p className="text-xs text-gray-600 shrink-0">PUB</p>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "320px", height: "50px" }}
        data-ad-client="ca-pub-9277300744556228"
        data-ad-slot="7888820223"
        data-ad-format="auto"
      />
      <Link
        href="/premium"
        className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors shrink-0 font-medium"
      >
        ✕ Pubs
      </Link>
    </div>
  );
}

/* ── Pop-up pub avant téléchargement ── */
export function AdBeforeDownload({ onContinue }: { onContinue: () => void }) {
  const { isPremium, loading } = usePremiumStatus();

  // Tous les hooks AVANT tout return conditionnel
  useEffect(() => { if (!isPremium && !loading) pushAd(); }, [isPremium, loading]);

  // Premium : téléchargement direct sans pub
  useEffect(() => {
    if (!loading && isPremium) onContinue();
  }, [isPremium, loading, onContinue]);

  if (loading || isPremium) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
        <p className="text-xs text-gray-500 mb-4">PUBLICITÉ — Ferme pour télécharger</p>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "120px" }}
          data-ad-client="ca-pub-9277300744556228"
          data-ad-slot="3879554340"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <button
          onClick={onContinue}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
        >
          ⬇️ Télécharger maintenant
        </button>
        <Link href="/premium" className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">
          ⭐ Supprimer les pubs — 3,99€/mois
        </Link>
      </div>
    </div>
  );
}
