"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

export default function GifPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [delay, setDelay] = useState(200);
  const [loop, setLoop] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fl: FileList) {
    setFiles((prev) => [...prev, ...Array.from(fl)]);
    setGifUrl("");
    setError("");
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setGifUrl("");
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...files];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setFiles(next);
  }

  function moveDown(i: number) {
    if (i === files.length - 1) return;
    const next = [...files];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setFiles(next);
  }

  async function generate() {
    if (files.length < 2) return;
    setLoading(true);
    setError("");
    setGifUrl("");
    setProgress(0);

    try {
      const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

      // Load first image to get dimensions
      const firstImg = await loadImage(files[0]);
      const width = firstImg.naturalWidth;
      const height = firstImg.naturalHeight;

      const gif = GIFEncoder();

      for (let i = 0; i < files.length; i++) {
        const img = i === 0 ? firstImg : await loadImage(files[i]);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);

        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, width, height, { palette, delay, repeat: loop ? 0 : -1 });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      gif.finish();
      const bytes = gif.bytes();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "image/gif" });
      setGifUrl(URL.createObjectURL(blob));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création du GIF");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = "animation.gif";
    a.click();
  }

  function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = reject;
      img.src = url;
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎞️</span>
          <h1 className="text-3xl font-bold">Créateur de GIF</h1>
        </div>
        <p className="text-gray-400">Transforme plusieurs images en GIF animé en quelques secondes.</p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-yellow-500 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <span className="text-4xl mb-3 block">🖼️</span>
        <p className="font-medium text-gray-300">Ajoute tes images ici</p>
        <p className="text-sm text-gray-600 mt-1">JPG, PNG, WebP — minimum 2 images</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mb-4">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <span className="text-gray-500 text-xs w-5 text-center font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{f.name}</p>
                <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} Ko</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => moveUp(i)} disabled={i === 0} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors text-xs px-1">▲</button>
                <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors text-xs px-1">▼</button>
                <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 transition-colors text-sm ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-gray-400">Vitesse par image</label>
              <span className="text-white font-medium">{delay} ms ({(1000 / delay).toFixed(1)} fps)</span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Rapide</span>
              <span>Lent</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Boucle infinie</span>
            <button
              onClick={() => setLoop(!loop)}
              className={`w-12 h-6 rounded-full transition-colors relative ${loop ? "bg-yellow-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${loop ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      )}

      {files.length >= 2 && (
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mb-4"
        >
          {loading ? `Génération en cours… ${progress}%` : "🎞️ Créer le GIF"}
        </button>
      )}

      {files.length === 1 && (
        <p className="text-center text-sm text-gray-600 mt-2">Ajoute au moins une 2ème image pour créer un GIF</p>
      )}

      {loading && (
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-yellow-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {gifUrl && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <img src={gifUrl} alt="GIF animé" className="mx-auto rounded-xl mb-4 max-h-64 object-contain" />
          <button
            onClick={download}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            ⬇️ Télécharger le GIF
          </button>
        </div>
      )}
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
