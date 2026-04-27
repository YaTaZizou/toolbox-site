"use client";

import Link from "next/link";
import { useEffect } from "react";

declare global {
  interface Window { adsbygoogle: unknown[] }
}

export function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className="w-full text-center my-6">
      <p className="text-xs text-gray-600 mb-2">PUBLICITÉ</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9277300744556228"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Link href="/premium" className="text-xs text-gray-600 hover:text-yellow-400 transition-colors mt-2 inline-block">
        ⭐ Supprimer les pubs — 2,99€/mois
      </Link>
    </div>
  );
}

export function AdBeforeDownload({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
        <p className="text-xs text-gray-500 mb-4">PUBLICITÉ — Ferme pour télécharger</p>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "120px" }}
          data-ad-client="ca-pub-9277300744556228"
          data-ad-slot="auto"
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
          ⭐ Supprimer les pubs — 2,99€/mois
        </Link>
      </div>
    </div>
  );
}
