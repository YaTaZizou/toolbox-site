"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">⚠️</p>
        <h2 className="text-2xl font-bold text-white mb-3">Une erreur est survenue</h2>
        <p className="text-gray-400 mb-8">
          Quelque chose s&apos;est mal passé. Tu peux réessayer ou retourner à l&apos;accueil.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
