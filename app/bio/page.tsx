"use client";

import { useState } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

const platforms = ["Instagram", "TikTok", "Twitter/X", "LinkedIn", "YouTube", "Twitch"];

export default function BioPage() {
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const { canUse, increment, remaining, isPremium, status, ready, limit } = useAiLimit();

  async function generate() {
    if (!input.trim() || !canUse) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bio", input: `Plateforme: ${platform}. Infos: ${input}` }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Erreur inconnue");
      increment();
      setResults(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, i: number) {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">✍️</span>
          <h1 className="text-3xl font-bold">Générateur de Bio</h1>
        </div>
        <p className="text-gray-400">Décris qui tu es et l&apos;IA génère 3 bios percutantes adaptées à ta plateforme.</p>
      </div>

      {ready && <AiLimitBanner remaining={remaining} isPremium={isPremium} limit={limit} status={status} />}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <label className="block text-sm text-gray-400 mb-3">Plateforme cible</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                platform === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="block text-sm text-gray-400 mb-3">Parle-moi de toi</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Ex: Je suis créateur de contenu gaming, j'adore les FPS, je stream le soir..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 resize-none h-28 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <p className="text-xs text-gray-600 mt-1 text-right">{input.length}/500</p>
        <button
          onClick={generate}
          disabled={loading || !input.trim() || !canUse}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Génération en cours..." : status === "login_required" ? "🔓 Connecte-toi pour continuer" : status === "limit_reached" ? "⭐ Limite atteinte — Passer Premium" : "✨ Générer des bios"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Vos bios générées :</h2>
          {results.map((bio, i) => (
            <div key={bio + i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-200 leading-relaxed flex-1">{bio}</p>
                <button
                  onClick={() => copy(bio, i)}
                  className="text-sm text-gray-500 hover:text-blue-400 transition-colors flex-shrink-0 mt-1"
                >
                  {copied === i ? "✓ Copié !" : "Copier"}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={generate}
            disabled={loading || !canUse}
            className="w-full mt-2 border border-gray-700 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white py-3 rounded-xl transition-colors text-sm"
          >
            🔄 Régénérer
          </button>
        </div>
      )}
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
