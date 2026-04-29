"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";

export default function SupprimerFondPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [bgColor, setBgColor] = useState<string>("transparent");
  const inputRef = useRef<HTMLInputElement>(null);
  const { canUse, increment, remaining, isPremium, ready, limit } = useAiLimit();

  function onFile(f: File) {
    setFile(f);
    setOutputUrl(null);
    setStatus("idle");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  const removeBackground = useCallback(async () => {
    if (!file || !canUse) return;
    increment();
    setStatus("loading");
    setProgress("Chargement du modèle IA...");
    setOutputUrl(null);

    try {
      const { removeBackground: removeBg } = await import("@imgly/background-removal");

      setProgress("Analyse de l'image...");
      const blob = await removeBg(file, {
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) {
            setProgress(`Téléchargement du modèle... ${Math.round((current / total) * 100)}%`);
          } else {
            setProgress(`Traitement... ${Math.round((current / total) * 100)}%`);
          }
        },
        output: { format: "image/png", quality: 1 },
      });

      setOutputUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, [file, canUse, increment]);

  const BG_OPTIONS = [
    { label: "Transparent", value: "transparent", style: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')]" },
    { label: "Blanc", value: "#ffffff", style: "bg-white border border-gray-300" },
    { label: "Noir", value: "#000000", style: "bg-black" },
    { label: "Rouge", value: "#ef4444", style: "bg-red-500" },
    { label: "Bleu", value: "#3b82f6", style: "bg-blue-500" },
    { label: "Vert", value: "#22c55e", style: "bg-green-500" },
    { label: "Jaune", value: "#eab308", style: "bg-yellow-500" },
    { label: "Violet", value: "#a855f7", style: "bg-purple-500" },
  ];

  function getContainerStyle(): React.CSSProperties {
    if (bgColor === "transparent") {
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23ccc'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23ccc'/%3E%3C/svg%3E")`,
        backgroundSize: "16px 16px",
      };
    }
    return { backgroundColor: bgColor };
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">✂️</span>
          <h1 className="text-3xl font-bold">Suppression de Fond</h1>
        </div>
        <p className="text-gray-400">Supprime le fond de tes images automatiquement grâce à l&apos;IA.</p>
      </div>

      {ready && <AiLimitBanner remaining={remaining} isPremium={isPremium} limit={limit} />}

      {/* Drop zone */}
      <div
        onClick={() => canUse ? inputRef.current?.click() : null}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!canUse) return;
          const f = e.dataTransfer.files[0];
          if (f && f.type.startsWith("image/")) onFile(f);
        }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors mb-4 ${
          canUse
            ? "border-gray-700 hover:border-gray-500 cursor-pointer"
            : "border-gray-800 opacity-50 cursor-not-allowed"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
          disabled={!canUse}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Aperçu" className="max-h-48 mx-auto rounded-xl object-contain" />
        ) : (
          <div>
            <p className="text-5xl mb-3">🖼️</p>
            <p className="text-gray-300 font-medium">Glisse ton image ici</p>
            <p className="text-gray-600 text-sm mt-1">JPG, PNG, WebP...</p>
          </div>
        )}
      </div>

      {file && status === "idle" && (
        <button
          onClick={removeBackground}
          disabled={!canUse}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mb-4"
        >
          {!canUse ? "⭐ Limite atteinte — Passer Premium" : "✂️ Supprimer le fond"}
        </button>
      )}

      {status === "loading" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span className="text-sm text-gray-300">{progress}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full animate-pulse w-1/2" />
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Le modèle IA (~50 Mo) est téléchargé une seule fois puis mis en cache.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4 text-red-400 text-sm">
          ❌ Une erreur est survenue. Essaie avec une autre image (JPG ou PNG recommandé).
          <button onClick={() => setStatus("idle")} className="ml-3 underline">Réessayer</button>
        </div>
      )}

      {status === "done" && outputUrl && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <p className="text-white font-semibold">✅ Fond supprimé !</p>

          {/* Choix de couleur de fond pour l'aperçu */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Aperçu avec fond :</p>
            <div className="flex flex-wrap gap-2">
              {BG_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBgColor(opt.value)}
                  title={opt.label}
                  className={`w-7 h-7 rounded-lg transition-all ${opt.style} ${
                    bgColor === opt.value ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div
            className="rounded-xl overflow-hidden flex items-center justify-center min-h-[200px]"
            style={getContainerStyle()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outputUrl} alt="Sans fond" className="max-h-64 object-contain" />
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <a
              href={outputUrl}
              download="toolbox-sans-fond.png"
              className="flex-1 bg-white text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-colors text-center"
            >
              ⬇ Télécharger PNG
            </a>
            <button
              onClick={() => { setFile(null); setPreview(null); setOutputUrl(null); setStatus("idle"); }}
              className="bg-gray-800 text-gray-300 font-semibold py-2.5 px-5 rounded-xl text-sm hover:bg-gray-700 transition-colors"
            >
              Nouvelle image
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-400 mb-1">ℹ️ 100% local & privé</p>
        <p>Ton image ne quitte jamais ton appareil. Le modèle IA tourne entièrement dans ton navigateur.</p>
      </div>
    </div>
  );
}
