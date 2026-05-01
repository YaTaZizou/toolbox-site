"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

type Action = "redimensionner" | "pivoter" | "retourner";

const tabs: { value: Action; emoji: string; label: string; desc: string }[] = [
  { value: "redimensionner", emoji: "📐", label: "Redimensionner", desc: "Changer la taille" },
  { value: "pivoter", emoji: "🔄", label: "Pivoter", desc: "Tourner l'image" },
  { value: "retourner", emoji: "↔️", label: "Retourner", desc: "Effet miroir" },
];

export default function ModifierImagePage() {
  const [action, setAction] = useState<Action>("redimensionner");
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [angle, setAngle] = useState(90);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleTab(t: Action) {
    setAction(t);
    setDone(false);
    setError("");
  }

  function handleFile(fl: FileList) {
    setFile(fl[0]);
    setDone(false);
    setError("");
  }

  async function process() {
    if (!file) return;
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("action", action);
      if (action === "redimensionner") {
        if (width) form.append("width", width);
        if (height) form.append("height", height);
        form.append("keepRatio", String(keepRatio));
      }
      if (action === "pivoter") form.append("angle", String(angle));
      if (action === "retourner") form.append("direction", direction);

      const res = await fetch("/api/modifier-image", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `modifie.${file.name.split(".").pop() || "jpg"}`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors du traitement");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    !!file &&
    (action !== "redimensionner" || width.length > 0 || height.length > 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🖼️</span>
          <h1 className="text-3xl font-bold">Modificateur d&apos;Image</h1>
        </div>
        <p className="text-gray-400">Redimensionne, pivote ou retourne tes images facilement.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTab(t.value)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              action === t.value
                ? "border-orange-500 bg-orange-500/10"
                : "border-gray-800 bg-gray-900 hover:border-gray-600"
            }`}
          >
            <span className="text-2xl block mb-1">{t.emoji}</span>
            <p className="font-semibold text-white text-sm">{t.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
          </button>
        ))}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-orange-500 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files)}
        />
        <span className="text-4xl mb-3 block">🖼️</span>
        {file ? (
          <p className="font-medium text-white">{file.name}</p>
        ) : (
          <>
            <p className="font-medium text-gray-300">Dépose ton image ici</p>
            <p className="text-sm text-gray-600 mt-1">JPG, PNG, WebP, AVIF</p>
          </>
        )}
      </div>

      {file && action === "redimensionner" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Largeur (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Ex: 800"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Hauteur (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 600"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Conserver le ratio</span>
            <button
              onClick={() => setKeepRatio(!keepRatio)}
              className={`w-12 h-6 rounded-full transition-colors relative ${keepRatio ? "bg-orange-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${keepRatio ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
          <p className="text-xs text-gray-600">Laisse un champ vide pour redimensionner proportionnellement.</p>
        </div>
      )}

      {file && action === "pivoter" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
          <label className="block text-sm text-gray-400 mb-3">Angle de rotation</label>
          <div className="grid grid-cols-4 gap-2">
            {[90, 180, 270, -90].map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  angle === a ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {a > 0 ? `+${a}°` : `${a}°`}
              </button>
            ))}
          </div>
        </div>
      )}

      {file && action === "retourner" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
          <label className="block text-sm text-gray-400 mb-3">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "horizontal" as const, label: "↔️ Horizontal", sub: "miroir gauche/droite" },
              { value: "vertical" as const, label: "↕️ Vertical", sub: "miroir haut/bas" },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDirection(d.value)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors text-left ${
                  direction === d.value ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <p>{d.label}</p>
                <p className={`text-xs mt-0.5 ${direction === d.value ? "text-orange-100" : "text-gray-500"}`}>{d.sub}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {file && (
        <button
          onClick={process}
          disabled={loading || !canSubmit}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Traitement en cours..." : `⬇️ ${tabs.find((t) => t.value === action)?.label}`}
        </button>
      )}

      {done && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 mt-4 text-sm text-center">
          ✓ Téléchargement démarré !
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mt-4 text-sm">
          {error}
        </div>
      )}
      <div className="mt-8" />
      <PremiumUpsellBanner />
    </div>
  );
}
