"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";
import { AdBanner } from "@/components/AdBanner";

const LANGUAGES = [
  "Français", "English", "Español", "Deutsch", "Italiano",
  "Português", "Nederlands", "Polski", "Русский", "中文", "日本語", "العربية",
];

export default function TraducteurPage() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("auto");
  const [to, setTo] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { canUse, increment, remaining, isPremium, ready, limit } = useAiLimit();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function translate(value: string, fromLang: string, toLang: string) {
    if (!value.trim() || value.trim().length < 2 || !canUse) { setResult(""); return; }
    increment();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/traducteur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, from: fromLang, to: toLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.translation);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la traduction");
    } finally {
      setLoading(false);
    }
  }

  // Traduction automatique avec debounce 800ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setResult(""); return; }
    debounceRef.current = setTimeout(() => {
      translate(text, from, to);
    }, 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [text, from, to]);

  function swap() {
    if (from === "auto") return;
    setFrom(to);
    setTo(from);
    setText(result);
    setResult("");
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🌍</span>
          <h1 className="text-3xl font-bold">Traducteur</h1>
        </div>
        <p className="text-gray-400">Traduction automatique en temps réel dans plus de 12 langues.</p>
      </div>

      {ready && <AiLimitBanner remaining={remaining} isPremium={isPremium} limit={limit} />}

      {/* Sélecteurs */}
      <div className="flex items-center gap-3 mb-4">
        <select value={from} onChange={(e) => setFrom(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm">
          <option value="auto">Détection automatique</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <button onClick={swap} disabled={from === "auto"}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-xl transition-colors text-lg flex-shrink-0">
          ⇄
        </button>

        <select value={to} onChange={(e) => setTo(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm">
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Zones de texte */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entre ton texte ici..."
            rows={8}
            className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm"
          />
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-600">{text.length} caractères</span>
            <button onClick={() => { setText(""); setResult(""); }} className="text-xs text-gray-600 hover:text-gray-400">Effacer</button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 relative">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Traduction en cours...
            </div>
          ) : result ? (
            <>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
              <div className="flex justify-end mt-2 pt-2 border-t border-gray-800">
                <button onClick={copy} className="text-xs text-gray-500 hover:text-blue-400 transition-colors">
                  {copied ? "✓ Copié !" : "📋 Copier"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-sm">La traduction apparaîtra ici automatiquement...</p>
          )}
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mt-4 text-sm">{error}</div>}
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
