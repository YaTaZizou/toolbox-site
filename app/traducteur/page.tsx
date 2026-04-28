"use client";

import { useState } from "react";
import Link from "next/link";

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

  async function translate() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/traducteur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
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
        <p className="text-gray-400">Traduis du texte dans plus de 12 langues grâce à l&apos;IA.</p>
      </div>

      {/* Sélecteurs de langue */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
        >
          <option value="auto">Détection automatique</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <button
          onClick={swap}
          disabled={from === "auto"}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-xl transition-colors text-lg flex-shrink-0"
        >
          ⇄
        </button>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
        >
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Zones de texte */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
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
            <button onClick={() => setText("")} className="text-xs text-gray-600 hover:text-gray-400">Effacer</button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            <p className="text-gray-600 text-sm">La traduction apparaîtra ici...</p>
          )}
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

      <button
        onClick={translate}
        disabled={loading || !text.trim()}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? "Traduction en cours..." : "🌍 Traduire"}
      </button>
    </div>
  );
}
