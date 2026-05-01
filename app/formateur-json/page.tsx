"use client";

import { useState } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

type Mode = "format" | "minify" | "validate";

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "text-yellow-300"; // number
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "text-blue-300" : "text-green-300"; // key vs string
        } else if (/true|false/.test(match)) {
          cls = "text-purple-300";
        } else if (/null/.test(match)) {
          cls = "text-red-300";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

export default function FormateurJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [indent, setIndent] = useState(2);

  function processJson(mode: Mode) {
    setActiveMode(mode);
    setError("");
    const trimmed = input.trim();
    if (!trimmed) { setError("Aucun texte à traiter."); return; }
    try {
      const parsed = JSON.parse(trimmed);
      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, indent));
      } else if (mode === "minify") {
        setOutput(JSON.stringify(parsed));
      } else if (mode === "validate") {
        setOutput(JSON.stringify(parsed, null, indent));
        // If we got here, JSON is valid
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? `❌ JSON invalide : ${e.message}` : "JSON invalide");
      setOutput("");
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const charCount = (s: string) => new TextEncoder().encode(s).length;
  const savings = input && output && activeMode === "minify"
    ? Math.round((1 - output.length / input.length) * 100)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{ }</span>
          <h1 className="text-3xl font-bold">Formateur JSON</h1>
        </div>
        <p className="text-gray-400">Formatez, minifiez et validez vos données JSON instantanément.</p>
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-2">
          {([2, 4] as const).map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                indent === n ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {n} espaces
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <button
            onClick={() => processJson("format")}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            ✨ Formater
          </button>
          <button
            onClick={() => processJson("minify")}
            disabled={!input.trim()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            🗜 Minifier
          </button>
          <button
            onClick={() => processJson("validate")}
            disabled={!input.trim()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            ✅ Valider
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Entrée</span>
            <div className="flex gap-2">
              {input && <span className="text-xs text-gray-600">{charCount(input)} o</span>}
              <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="text-xs text-gray-600 hover:text-gray-400">Effacer</button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'{\n  "exemple": "Collez votre JSON ici..."\n}'}
            rows={16}
            className="w-full bg-transparent text-white placeholder-gray-700 resize-none focus:outline-none text-xs font-mono leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Résultat</span>
              {activeMode === "validate" && !error && output && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✓ Valide</span>
              )}
              {savings !== null && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">-{savings}%</span>
              )}
            </div>
            {output && (
              <button onClick={copy} className="text-xs text-gray-500 hover:text-blue-400 transition-colors">
                {copied ? "✓ Copié !" : "Copier"}
              </button>
            )}
          </div>
          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-mono">
              {error}
            </div>
          ) : output ? (
            <pre
              className="text-xs font-mono leading-relaxed overflow-auto max-h-80 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(output) }}
            />
          ) : (
            <p className="text-gray-600 text-xs">Le résultat apparaîtra ici...</p>
          )}
        </div>
      </div>

      {/* Paste sample */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setInput('{\n  "nom": "ToolBox",\n  "version": 1,\n  "actif": true,\n  "outils": ["PDF", "Image", "IA"],\n  "config": {\n    "theme": "dark",\n    "langue": "fr"\n  }\n}')}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors border border-gray-800 rounded-lg px-3 py-1.5"
        >
          Charger un exemple
        </button>
      </div>
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
