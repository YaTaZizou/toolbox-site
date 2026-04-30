"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

const formats = [
  { value: "jpeg", label: "JPG", desc: "Idéal pour photos" },
  { value: "png", label: "PNG", desc: "Fond transparent" },
  { value: "webp", label: "WebP", desc: "Web optimisé" },
  { value: "avif", label: "AVIF", desc: "Ultra compressé" },
];

export default function ImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Fichier invalide. Accepté : JPG, PNG, WebP, AVIF, GIF");
      return;
    }
    setFile(f);
    setDone(false);
    setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("format", format);
      form.append("quality", quality.toString());

      const res = await fetch("/api/convertir-image", { method: "POST", body: form });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const blob = await res.blob();
      const ext = format === "jpeg" ? "jpg" : format;
      const name = file.name.replace(/\.[^.]+$/, "") + "." + ext;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la conversion");
    } finally {
      setLoading(false);
    }
  }

  const sizeKB = file ? (file.size / 1024).toFixed(1) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🖼️</span>
          <h1 className="text-3xl font-bold">Convertisseur d'Images</h1>
        </div>
        <p className="text-gray-400">Convertis et compresse tes images en JPG, PNG, WebP ou AVIF instantanément.</p>
      </div>

      {/* Zone de dépôt */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-6"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="preview" className="max-h-48 rounded-xl object-contain" />
            <p className="text-sm text-gray-400">{file?.name} — {sizeKB} Ko</p>
            <p className="text-xs text-gray-600">Clique pour changer l'image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <span className="text-5xl">📁</span>
            <p className="font-medium text-gray-300">Dépose ton image ici</p>
            <p className="text-sm">ou clique pour parcourir</p>
            <p className="text-xs">JPG, PNG, WebP, AVIF, GIF</p>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
          {/* Format cible */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Format de sortie</label>
            <div className="grid grid-cols-4 gap-2">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`py-3 rounded-xl text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                    format === f.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold">{f.label}</span>
                  <span className="text-xs opacity-70">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Qualité */}
          {format !== "png" && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-400">Qualité</label>
                <span className="text-white font-medium">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Petit fichier</span>
                <span>Haute qualité</span>
              </div>
            </div>
          )}

          <button
            onClick={convert}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Conversion en cours..." : `⬇️ Convertir en ${format.toUpperCase()}`}
          </button>

          {done && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm text-center">
              ✓ Téléchargement démarré !
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mt-4 text-sm">
          {error}
        </div>
      )}
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
