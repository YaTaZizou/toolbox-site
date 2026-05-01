"use client";

import { useState } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";
import { usePremiumStatus } from "@/components/PremiumProvider";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";

const FREE_CHAR_LIMIT = 500;
const PREMIUM_CHAR_LIMIT = 5000;

export default function CorrecteurPage() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("français");
  const [corrected, setCorrected] = useState("");
  const [changes, setChanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const { isPremium } = usePremiumStatus();
  const { canUse, increment, remaining, isPremium: isPremiumLimit, status: aiStatus, ready, limit } = useAiLimit();
  const charLimit = isPremium ? PREMIUM_CHAR_LIMIT : FREE_CHAR_LIMIT;
  const overLimit = !isPremium && text.length > FREE_CHAR_LIMIT;

  async function correct() {
    if (!text.trim() || overLimit || !canUse) return;
    setLoading(true);
    setError("");
    setCorrected("");
    setChanges([]);

    try {
      const res = await fetch("/api/correcteur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      increment();
      setCorrected(data.corrected);
      setChanges(data.changes || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (!msg || msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("network"))
        setError("Erreur réseau. Vérifie ta connexion et réessaie.");
      else
        setError(msg || "Erreur lors de la correction.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(corrected);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">✅</span>
          <h1 className="text-3xl font-bold">Correcteur de Texte</h1>
        </div>
        <p className="text-gray-400">Corrige l&apos;orthographe, la grammaire et le style de tes textes.</p>
      </div>

      {ready && <AiLimitBanner remaining={remaining} isPremium={isPremiumLimit} limit={limit} status={aiStatus} />}

      <div className="flex gap-3 mb-4">
        {["français", "anglais", "espagnol"].map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              language === l ? "bg-green-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {l === "français" ? "🇫🇷" : l === "anglais" ? "🇬🇧" : "🇪🇸"} {l}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Colle ton texte ici pour le corriger..."
          rows={8}
          className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm"
        />
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
          <span className="text-xs text-gray-600">{text.split(/\s+/).filter(Boolean).length} mots</span>
          <button onClick={() => { setText(""); setCorrected(""); setChanges([]); }} className="text-xs text-gray-600 hover:text-gray-400">Effacer</button>
        </div>
      </div>

      {/* Compteur de caractères */}
      <div className="mb-3">
        <span className={`text-xs font-medium ${overLimit ? "text-red-400" : "text-gray-500"}`}>
          {text.length} / {charLimit} caractères{isPremium ? "" : " (gratuit)"}
        </span>
      </div>

      {/* Avertissement dépassement limite */}
      {overLimit && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-4 text-sm text-amber-300">
          ⭐ Limite gratuite : {FREE_CHAR_LIMIT} caractères.{" "}
          <Link href="/premium" className="underline font-semibold hover:text-amber-200 transition-colors">
            Passe Premium →
          </Link>{" "}
          pour corriger des textes plus longs.
        </div>
      )}

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

      <button
        onClick={correct}
        disabled={loading || !text.trim() || overLimit || !canUse}
        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mb-6"
      >
        {loading ? "Correction en cours..." : aiStatus === "login_required" ? "🔓 Connecte-toi pour continuer" : aiStatus === "limit_reached" ? "⭐ Limite atteinte — Passer Premium" : "✅ Corriger le texte"}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Analyse en cours...
        </div>
      )}

      {corrected && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-green-400 text-sm">✓ Texte corrigé</h2>
              <button onClick={copy} className="text-xs text-gray-500 hover:text-green-400 transition-colors">
                {copied ? "✓ Copié !" : "📋 Copier"}
              </button>
            </div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{corrected}</p>
          </div>

          {changes.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-300 text-sm mb-3">📝 Corrections apportées ({changes.length})</h2>
              <ul className="space-y-1.5">
                {changes.map((change, i) => (
                  <li key={change + i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
