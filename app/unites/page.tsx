"use client";

import { useState } from "react";
import Link from "next/link";

type Category = { label: string; emoji: string; units: { label: string; factor: number }[] };

const CATEGORIES: Category[] = [
  {
    label: "Distance", emoji: "📏",
    units: [
      { label: "km", factor: 1000 },
      { label: "m", factor: 1 },
      { label: "cm", factor: 0.01 },
      { label: "mm", factor: 0.001 },
      { label: "miles", factor: 1609.344 },
      { label: "yards", factor: 0.9144 },
      { label: "pieds (ft)", factor: 0.3048 },
      { label: "pouces (in)", factor: 0.0254 },
    ],
  },
  {
    label: "Poids", emoji: "⚖️",
    units: [
      { label: "t (tonne)", factor: 1000000 },
      { label: "kg", factor: 1000 },
      { label: "g", factor: 1 },
      { label: "mg", factor: 0.001 },
      { label: "lb (livres)", factor: 453.592 },
      { label: "oz (onces)", factor: 28.3495 },
    ],
  },
  {
    label: "Température", emoji: "🌡️",
    units: [
      { label: "°C", factor: 1 },
      { label: "°F", factor: 1 },
      { label: "K", factor: 1 },
    ],
  },
  {
    label: "Vitesse", emoji: "🚀",
    units: [
      { label: "km/h", factor: 1 },
      { label: "m/s", factor: 3.6 },
      { label: "mph", factor: 1.60934 },
      { label: "nœuds", factor: 1.852 },
    ],
  },
  {
    label: "Surface", emoji: "📐",
    units: [
      { label: "km²", factor: 1000000 },
      { label: "m²", factor: 1 },
      { label: "cm²", factor: 0.0001 },
      { label: "hectare", factor: 10000 },
      { label: "acre", factor: 4046.856 },
    ],
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === "°F") celsius = (value - 32) * 5 / 9;
  if (from === "K") celsius = value - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitesPage() {
  const [catIdx, setCatIdx] = useState(0);
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState(0);

  const cat = CATEGORIES[catIdx];
  const isTemp = cat.label === "Température";

  function convert(toIdx: number): string {
    const v = parseFloat(value);
    if (isNaN(v)) return "-";
    if (isTemp) {
      const r = convertTemp(v, cat.units[fromUnit].label, cat.units[toIdx].label);
      return Number(r.toFixed(6)).toString();
    }
    const inBase = v * cat.units[fromUnit].factor;
    const result = inBase / cat.units[toIdx].factor;
    return Number(result.toFixed(8)).toString();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📏</span>
          <h1 className="text-3xl font-bold">Convertisseur d&apos;Unités</h1>
        </div>
        <p className="text-gray-400">Distance, poids, température, vitesse et plus encore.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.label}
            onClick={() => { setCatIdx(i); setValue(""); setFromUnit(0); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              catIdx === i ? "bg-white text-black" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <div className="flex gap-3 mb-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Valeur..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-white focus:outline-none"
          >
            {cat.units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {cat.units.map((u, i) => (
          i !== fromUnit && (
            <div key={u.label} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-5 py-3">
              <span className="text-gray-400 text-sm">{u.label}</span>
              <span className="text-white font-mono font-semibold">{value ? convert(i) : "—"}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
