"use client";

import { useState } from "react";
import Link from "next/link";

const CONVERSIONS = [
  { label: "MAJUSCULES", fn: (t: string) => t.toUpperCase() },
  { label: "minuscules", fn: (t: string) => t.toLowerCase() },
  { label: "Première Lettre", fn: (t: string) => t.replace(/\b\w/g, (c) => c.toUpperCase()) },
  { label: "Inverser", fn: (t: string) => t.split("").reverse().join("") },
  { label: "slug-url", fn: (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") },
  { label: "camelCase", fn: (t: string) => t.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: "Supprimer espaces", fn: (t: string) => t.replace(/\s+/g, " ").trim() },
  { label: "Alterner casse", fn: (t: string) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
];

export default function ConvertirTextePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [active, setActive] = useState("");
  const [copied, setCopied] = useState(false);

  function apply(label: string, fn: (t: string) => string) {
    setActive(label);
    setOutput(fn(input));
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔡</span>
          <h1 className="text-3xl font-bold">Convertisseur de Texte</h1>
        </div>
        <p className="text-gray-400">Transforme ton texte en un clic : majuscules, slug, camelCase et plus.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(""); setActive(""); }}
          placeholder="Entre ton texte ici..."
          rows={5}
          className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {CONVERSIONS.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => apply(label, fn)}
            disabled={!input.trim()}
            className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              active === label
                ? "bg-purple-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-300 hover:border-purple-500 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {output && (
        <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-purple-400 font-medium">{active}</span>
            <button onClick={copy} className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
              {copied ? "✓ Copié !" : "📋 Copier"}
            </button>
          </div>
          <p className="text-white text-sm break-all whitespace-pre-wrap">{output}</p>
        </div>
      )}
    </div>
  );
}
