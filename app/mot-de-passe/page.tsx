"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

function generate(length: number, upper: boolean, numbers: boolean, symbols: boolean): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const num = "0123456789";
  const sym = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let chars = lower;
  if (upper) chars += up;
  if (numbers) chars += num;
  if (symbols) chars += sym;

  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function strength(pwd: string): { label: string; color: string; width: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  if (score <= 1) return { label: "Très faible", color: "bg-red-500", width: "w-1/5" };
  if (score === 2) return { label: "Faible", color: "bg-orange-500", width: "w-2/5" };
  if (score === 3) return { label: "Moyen", color: "bg-yellow-500", width: "w-3/5" };
  if (score === 4) return { label: "Fort", color: "bg-blue-500", width: "w-4/5" };
  return { label: "Très fort", color: "bg-green-500", width: "w-full" };
}

export default function MotDePassePage() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState(() => generate(16, true, true, true));
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(generate(length, upper, numbers, symbols));
    setCopied(false);
  }, [length, upper, numbers, symbols]);

  function copy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const str = strength(password);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔑</span>
          <h1 className="text-3xl font-bold">Générateur de Mot de Passe</h1>
        </div>
        <p className="text-gray-400">Génère des mots de passe sécurisés et personnalisés en un clic.</p>
      </div>

      {/* Mot de passe généré */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <p className="flex-1 font-mono text-lg text-white bg-gray-800 rounded-xl px-4 py-3 break-all">{password}</p>
          <button onClick={copy} className="flex-shrink-0 text-sm text-gray-400 hover:text-green-400 transition-colors px-3 py-3 bg-gray-800 rounded-xl">
            {copied ? "✓" : "📋"}
          </button>
        </div>

        {/* Force */}
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>Force</span>
          <span className={copied ? "text-green-400" : ""}>{copied ? "Copié !" : str.label}</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${str.color} ${str.width}`} />
        </div>
      </div>

      {/* Options */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-gray-400">Longueur</label>
            <span className="text-white font-medium">{length} caractères</span>
          </div>
          <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-green-500" />
        </div>

        {[
          { label: "Majuscules (A-Z)", value: upper, set: setUpper },
          { label: "Chiffres (0-9)", value: numbers, set: setNumbers },
          { label: "Symboles (!@#...)", value: symbols, set: setSymbols },
        ].map(({ label, value, set }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">{label}</span>
            <button
              onClick={() => set(!value)}
              className={`w-12 h-6 rounded-full transition-colors relative ${value ? "bg-green-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${value ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={regenerate}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        🔄 Générer un nouveau mot de passe
      </button>
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
