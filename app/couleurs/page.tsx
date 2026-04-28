"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(hue: number, type: string): { hex: string; label: string }[] {
  switch (type) {
    case "monochromatique":
      return [20, 35, 50, 65, 80].map((l, i) => ({ hex: hslToHex(hue, 70, l), label: `${i * 200 + 100}` }));
    case "analogique":
      return [-40, -20, 0, 20, 40].map((d, i) => ({ hex: hslToHex((hue + d + 360) % 360, 65, 55), label: `A${i + 1}` }));
    case "complémentaire":
      return [
        { hex: hslToHex(hue, 70, 40), label: "P1" },
        { hex: hslToHex(hue, 70, 55), label: "P2" },
        { hex: hslToHex(hue, 70, 70), label: "P3" },
        { hex: hslToHex((hue + 180) % 360, 70, 55), label: "C1" },
        { hex: hslToHex((hue + 180) % 360, 70, 40), label: "C2" },
      ];
    case "triadique":
      return [0, 120, 240].flatMap((d, i) => [
        { hex: hslToHex((hue + d) % 360, 65, 55), label: `T${i + 1}a` },
        { hex: hslToHex((hue + d) % 360, 65, 70), label: `T${i + 1}b` },
      ]).slice(0, 5);
    default:
      return Array.from({ length: 5 }, () => ({
        hex: hslToHex(Math.floor(Math.random() * 360), 60 + Math.random() * 30, 45 + Math.random() * 25),
        label: "R",
      }));
  }
}

const TYPES = ["monochromatique", "analogique", "complémentaire", "triadique", "aléatoire"];

export default function CouleursPage() {
  const [hue, setHue] = useState(250);
  const [type, setType] = useState("monochromatique");
  const [palette, setPalette] = useState(() => generatePalette(250, "monochromatique"));
  const [copied, setCopied] = useState<string | null>(null);

  const generate = useCallback(() => {
    const h = type === "aléatoire" ? Math.floor(Math.random() * 360) : hue;
    setPalette(generatePalette(h, type));
  }, [hue, type]);

  function copy(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎨</span>
          <h1 className="text-3xl font-bold">Palette de Couleurs</h1>
        </div>
        <p className="text-gray-400">Génère des palettes harmonieuses pour tes projets.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                type === t ? "bg-white text-black" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {type !== "aléatoire" && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-gray-400">Teinte de base</label>
              <span className="text-white font-medium" style={{ color: hslToHex(hue, 70, 60) }}>●  {hue}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={359}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="w-full h-3 rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(0,70%,60%), hsl(60,70%,60%), hsl(120,70%,60%), hsl(180,70%,60%), hsl(240,70%,60%), hsl(300,70%,60%), hsl(360,70%,60%))`,
              }}
            />
          </div>
        )}
      </div>

      <button
        onClick={generate}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors mb-6"
      >
        🎨 Générer la palette
      </button>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {palette.map((color, i) => (
          <button
            key={i}
            onClick={() => copy(color.hex)}
            className="group relative rounded-2xl overflow-hidden aspect-square transition-transform hover:scale-105"
            style={{ backgroundColor: color.hex }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="text-white text-xs font-bold">
                {copied === color.hex ? "✓" : "📋"}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {palette.map((color, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: color.hex }} />
            <span className="font-mono text-white text-sm flex-1">{color.hex.toUpperCase()}</span>
            <button
              onClick={() => copy(color.hex)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {copied === color.hex ? "✓ Copié !" : "Copier"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
