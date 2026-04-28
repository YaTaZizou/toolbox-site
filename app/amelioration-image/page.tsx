"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PremiumGate } from "@/components/PremiumGate";

const SCALES = [
  { label: "2×", value: 2, desc: "Double la résolution" },
  { label: "3×", value: 3, desc: "Triple la résolution" },
  { label: "4×", value: 4, desc: "Quadruple la résolution" },
];

const MODES = [
  { label: "Subtil", value: "subtil", desc: "Légère amélioration", emoji: "🔅" },
  { label: "Standard", value: "standard", desc: "Équilibré", emoji: "✨" },
  { label: "Intense", value: "intense", desc: "Forte amélioration", emoji: "⚡" },
];

function Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [mode, setMode] = useState("standard");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFile(f: File) {
    setFile(f);
    setOutputUrl(null);
    setStatus("idle");
    setShowComparison(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function enhance() {
    if (!file) return;
    setStatus("processing");
    setOutputUrl(null);

    const fd = new FormData();
    fd.append("image", file);
    fd.append("scale", String(scale));
    fd.append("mode", mode);

    const res = await fetch("/api/amelioration-image", { method: "POST", body: fd });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    const blob = await res.blob();
    setOutputSize(blob.size);
    setOutputUrl(URL.createObjectURL(blob));
    setStatus("done");
  }

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f && f.type.startsWith("image/")) onFile(f);
        }}
        className="border-2 border-dashed border-gray-700 hover:border-yellow-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors"
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Original" className="max-h-48 mx-auto rounded-xl object-contain" />
        ) : (
          <div>
            <p className="text-4xl mb-3">🖼️</p>
            <p className="text-gray-300 font-medium">Glisse ton image ici</p>
            <p className="text-gray-600 text-sm mt-1">JPG, PNG, WebP...</p>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          {/* Échelle */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Agrandissement</p>
            <div className="grid grid-cols-3 gap-2">
              {SCALES.map((s) => (
                <button key={s.value} onClick={() => setScale(s.value)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-colors border ${
                    scale === s.value
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500"
                  }`}>
                  {s.label}
                  <span className="block text-xs font-normal opacity-70">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Niveau d&apos;amélioration</p>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button key={m.value} onClick={() => setMode(m.value)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    mode === m.value
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500"
                  }`}>
                  {m.emoji} {m.label}
                  <span className="block text-xs font-normal opacity-70">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {file && status !== "processing" && (
        <button onClick={enhance}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors">
          ✨ Améliorer l&apos;image
        </button>
      )}

      {status === "processing" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Amélioration en cours...</p>
          <p className="text-gray-600 text-xs mt-1">Upscaling {scale}× + netteté + couleurs</p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
          ❌ Une erreur est survenue. Réessaie avec une image JPG ou PNG.
          <button onClick={() => setStatus("idle")} className="ml-3 underline">Réessayer</button>
        </div>
      )}

      {status === "done" && outputUrl && preview && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">✅ Image améliorée !</p>
              <p className="text-gray-500 text-sm mt-0.5">
                {scale}× la résolution • {formatSize(file!.size)} → {formatSize(outputSize)}
              </p>
            </div>
            <a href={outputUrl} download="toolbox-enhanced.png"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
              ⬇ Télécharger
            </a>
          </div>

          {/* Comparaison avant/après */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                {showComparison ? "Masquer" : "Voir"} la comparaison Avant / Après
              </button>
            </div>
            {showComparison && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1 text-center">Avant</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Avant" className="w-full rounded-xl object-contain max-h-48" />
                </div>
                <div>
                  <p className="text-xs text-yellow-400 mb-1 text-center">✨ Après</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={outputUrl} alt="Après" className="w-full rounded-xl object-contain max-h-48" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AmeliorationImagePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">✨</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Amélioration d&apos;Image</h1>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30 font-bold">
                ⭐ PREMIUM
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-400">Augmente la résolution et améliore la netteté de tes images jusqu&apos;à 4×.</p>
      </div>

      <PremiumGate>
        <Tool />
      </PremiumGate>
    </div>
  );
}
