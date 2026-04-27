"use client";

import Link from "next/link";

export function AdBanner() {
  return (
    <div className="w-full bg-gray-900 border border-gray-800 border-dashed rounded-xl p-4 text-center my-6">
      <p className="text-xs text-gray-600 mb-2">PUBLICITÉ</p>
      {/* Remplace ce bloc par ton code AdSense une fois le site approuvé */}
      <div className="h-20 flex items-center justify-center bg-gray-800/50 rounded-lg">
        <span className="text-gray-600 text-sm">Espace publicitaire</span>
      </div>
      <Link href="/premium" className="text-xs text-gray-600 hover:text-yellow-400 transition-colors mt-2 inline-block">
        ⭐ Supprimer les pubs — 2,99€/mois
      </Link>
    </div>
  );
}

export function AdBeforeDownload({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
        <p className="text-xs text-gray-500 mb-4">PUBLICITÉ — Ton téléchargement commence dans 5 secondes</p>
        <div className="h-32 flex items-center justify-center bg-gray-800 rounded-xl mb-6">
          <span className="text-gray-600">Espace publicitaire</span>
        </div>
        <button
          onClick={onContinue}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
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
