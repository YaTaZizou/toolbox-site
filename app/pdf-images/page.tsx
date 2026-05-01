"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

interface PageImage {
  pageNum: number;
  dataUrl: string;
}

export default function PdfImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<PageImage[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(fl: FileList) {
    setFile(fl[0]);
    setImages([]);
    setError("");
    setProgress(0);
  }

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setImages([]);
    setProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      const results: PageImage[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.92 : undefined);
        results.push({ pageNum: i, dataUrl });
        setProgress(Math.round((i / total) * 100));
      }

      setImages(results);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la conversion");
    } finally {
      setLoading(false);
    }
  }

  function downloadAll() {
    images.forEach(({ pageNum, dataUrl }) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `page-${pageNum}.${format}`;
      a.click();
    });
  }

  function downloadOne(img: PageImage) {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = `page-${img.pageNum}.${format}`;
    a.click();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📸</span>
          <h1 className="text-3xl font-bold">PDF → Images</h1>
        </div>
        <p className="text-gray-400">Convertis chaque page de ton PDF en image PNG ou JPG.</p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-pink-500 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files)}
        />
        <span className="text-4xl mb-3 block">📄</span>
        {file ? (
          <p className="font-medium text-white">{file.name}</p>
        ) : (
          <>
            <p className="font-medium text-gray-300">Dépose ton PDF ici</p>
            <p className="text-sm text-gray-600 mt-1">ou clique pour parcourir</p>
          </>
        )}
      </div>

      {file && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-gray-400">Qualité / Résolution</label>
              <span className="text-white font-medium">{scale}x {scale === 1 ? "(rapide)" : scale === 2 ? "(recommandé)" : "(haute qualité)"}</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {(["png", "jpeg"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                    format === f ? "bg-pink-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {f === "png" ? "PNG (sans perte)" : "JPG (plus léger)"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {file && (
        <button
          onClick={convert}
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mb-4"
        >
          {loading ? `Conversion en cours… ${progress}%` : "🖼️ Convertir en images"}
        </button>
      )}

      {loading && (
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-300 font-medium">{images.length} page{images.length > 1 ? "s" : ""} converties</p>
            <button
              onClick={downloadAll}
              className="bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              ⬇️ Tout télécharger
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.pageNum} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <img src={img.dataUrl} alt={`Page ${img.pageNum}`} className="w-full object-cover" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-gray-500">Page {img.pageNum}</span>
                  <button
                    onClick={() => downloadOne(img)}
                    className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    ⬇️ Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8" />
      <PremiumUpsellBanner />
    </div>
  );
}
