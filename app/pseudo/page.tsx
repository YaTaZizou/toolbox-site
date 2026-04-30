"use client";

import { useState } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";
import { AdBanner } from "@/components/AdBanner";

export default function PseudoPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { canUse, increment, remaining, isPremium, ready, limit } = useAiLimit();

  async function generate() {
    if (!input.trim() || !canUse) return;
    setLoading(true);
    setError("");
    setResults([]);
    increment();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pseudo", input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎭</span>
          <h1 className="text-3xl font-bold">Générateur de Pseudo</h1>
        </div>
        <p className="text-gray-400">Décris ton univers (gaming, sport, musique...) et l'IA crée 8 pseudos originaux pour toi.</p>
      </div>

      {ready && <AiLimitBanner remaining={remaining} isPremium={isPremium} limit={limit} />}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <label className="block text-sm text-gray-400 mb-3">Thème ou mots-clés</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: gaming FPS, dark et mystérieux, loup, ombre..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 resize-none h-28 focus:outline-none focus:border-purple-500 transition-colors"
          onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) generate(); }}
        />
        <button
          onClick={generate}
          disabled={loading || !input.trim() || !canUse}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Génération en cours..." : !canUse ? "⭐ Limite atteinte — Passer Premium" : "✨ Générer des pseudos"}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Vos pseudos générés :</h2>
          {results.map((pseudo, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-600 transition-colors">
              <span className="font-medium text-white">{pseudo}</span>
              <button onClick={() => copy(pseudo)} className="text-sm text-gray-500 hover:text-purple-400 transition-colors ml-4 flex-shrink-0">
                {copied === pseudo ? "✓ Copié !" : "Copier"}
              </button>
            </div>
          ))}
          <button onClick={generate} disabled={!canUse}
            className="w-full mt-4 border border-gray-700 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white py-3 rounded-xl transition-colors text-sm">
            🔄 Régénérer
          </button>
        </div>
      )}
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
