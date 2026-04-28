"use client";

import { useState } from "react";
import Link from "next/link";

export default function CompteurPage() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter((p) => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  const speakingTime = Math.max(1, Math.ceil(words / 130));

  const stats = [
    { label: "Mots", value: words, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Caractères", value: chars, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Sans espaces", value: charsNoSpace, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Phrases", value: sentences, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Paragraphes", value: paragraphs, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Lecture (min)", value: readingTime, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Discours (min)", value: speakingTime, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Lignes", value: text ? text.split("\n").length : 0, color: "text-pink-400", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📊</span>
          <h1 className="text-3xl font-bold">Compteur de Mots</h1>
        </div>
        <p className="text-gray-400">Analyse ton texte en temps réel : mots, caractères, temps de lecture.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Colle ou écris ton texte ici pour l'analyser..."
          rows={12}
          className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed"
        />
        {text && (
          <div className="flex justify-end mt-2 pt-2 border-t border-gray-800">
            <button onClick={() => setText("")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Effacer</button>
          </div>
        )}
      </div>
    </div>
  );
}
