"use client";

import { useState } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";
import { AdBanner } from "@/components/AdBanner";

interface DictResult {
  word: string;
  nature: string;
  definition: string;
  examples: string[];
  synonymes: string[];
  antonymes: string[];
}

export default function DictionnairePage() {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("français");
  const [result, setResult] = useState<DictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/dictionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim(), language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📖</span>
          <h1 className="text-3xl font-bold">Dictionnaire</h1>
        </div>
        <p className="text-gray-400">Définitions, exemples, synonymes et antonymes en un clic.</p>
      </div>

      <div className="flex gap-2 mb-4">
        {["français", "anglais", "espagnol"].map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              language === l ? "bg-indigo-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {l === "français" ? "🇫🇷" : l === "anglais" ? "🇬🇧" : "🇪🇸"} {l}
          </button>
        ))}
      </div>

      <form onSubmit={search} className="flex gap-3 mb-6">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Rechercher un mot..."
          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !word.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex-shrink-0"
        >
          {loading ? "..." : "🔍"}
        </button>
      </form>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-12">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Recherche en cours...
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-black text-white">{result.word}</h2>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">{result.nature}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">{result.definition}</p>
          </div>

          {result.examples?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">💬 Exemples</h3>
              <ul className="space-y-2">
                {result.examples.map((ex, i) => (
                  <li key={i} className="text-gray-300 text-sm italic border-l-2 border-indigo-500/40 pl-3">
                    &ldquo;{ex}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {result.synonymes?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">≈ Synonymes</h3>
                <div className="flex flex-wrap gap-2">
                  {result.synonymes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setWord(s); }}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {result.antonymes?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">≠ Antonymes</h3>
                <div className="flex flex-wrap gap-2">
                  {result.antonymes.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => { setWord(a); }}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
