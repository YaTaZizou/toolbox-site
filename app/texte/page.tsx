"use client";

import { useState } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";

const types = [
  { label: "Post réseaux sociaux", value: "post" },
  { label: "Description produit", value: "description" },
  { label: "Email professionnel", value: "email" },
  { label: "Accroche publicitaire", value: "accroche" },
  { label: "Légende photo", value: "legende" },
  { label: "Autre / Libre", value: "libre" },
];

export default function TextePage() {
  const [input, setInput] = useState("");
  const [type, setType] = useState("post");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { canUse, increment, remaining, isPremium, ready, limit } = useAiLimit();
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!input.trim() || !canUse) return;
    increment();
    setLoading(true);
    setError("");
    setResult("");

    const typeLabel = types.find((t) => t.value === type)?.label || type;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "texte", input: `Type: ${typeLabel}. Sujet: ${input}` }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📝</span>
          <h1 className="text-3xl font-bold">Générateur de Texte IA</h1>
        </div>
        <p className="text-gray-400">Dis ce que tu veux écrire, l'IA le rédige pour toi en quelques secondes.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <label className="block text-sm text-gray-400 mb-3">Type de texte</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                type === t.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="block text-sm text-gray-400 mb-3">Décris ce que tu veux</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Un post Instagram pour lancer ma nouvelle collection de sneakers..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 resize-none h-28 focus:outline-none focus:border-green-500 transition-colors"
        />
        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          className="mt-4 w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Rédaction en cours..." : "✨ Générer le texte"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-300">Texte généré :</h2>
            <button
              onClick={copy}
              className="text-sm text-gray-500 hover:text-green-400 transition-colors"
            >
              {copied ? "✓ Copié !" : "Copier"}
            </button>
          </div>
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{result}</p>
          <button
            onClick={generate}
            className="w-full mt-6 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-3 rounded-xl transition-colors text-sm"
          >
            🔄 Régénérer
          </button>
        </div>
      )}
    </div>
  );
}
