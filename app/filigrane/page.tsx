"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

type Position = "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right" | "tile";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "top-left", label: "↖ Haut gauche" },
  { value: "top-center", label: "↑ Haut centre" },
  { value: "top-right", label: "↗ Haut droite" },
  { value: "center", label: "⊕ Centre" },
  { value: "bottom-left", label: "↙ Bas gauche" },
  { value: "bottom-center", label: "↓ Bas centre" },
  { value: "bottom-right", label: "↘ Bas droite" },
  { value: "tile", label: "⠿ Mosaïque" },
];

const COLORS = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0088ff", "#ffcc00", "#ff00ff"];

export default function FiligranePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("© Mon Filigrane");
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [rotation, setRotation] = useState(-30);
  const [preview, setPreview] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWatermark = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      const scaledFont = Math.max(12, Math.round((fontSize / 100) * Math.min(img.width, img.height) * 0.5));
      ctx.font = `bold ${scaledFont}px Arial, sans-serif`;
      ctx.textBaseline = "middle";

      const pad = scaledFont * 0.8;

      if (position === "tile") {
        ctx.rotate((rotation * Math.PI) / 180);
        const metrics = ctx.measureText(watermarkText);
        const tw = metrics.width + scaledFont * 2;
        const th = scaledFont * 2;
        for (let y = -canvas.height; y < canvas.height * 2; y += th) {
          for (let x = -canvas.width; x < canvas.width * 2; x += tw) {
            ctx.fillText(watermarkText, x, y);
          }
        }
      } else {
        const metrics = ctx.measureText(watermarkText);
        const textWidth = metrics.width;
        let x = 0, y = 0;
        switch (position) {
          case "top-left": x = pad; y = pad + scaledFont / 2; break;
          case "top-center": x = (canvas.width - textWidth) / 2; y = pad + scaledFont / 2; break;
          case "top-right": x = canvas.width - textWidth - pad; y = pad + scaledFont / 2; break;
          case "center": x = (canvas.width - textWidth) / 2; y = canvas.height / 2; break;
          case "bottom-left": x = pad; y = canvas.height - pad - scaledFont / 2; break;
          case "bottom-center": x = (canvas.width - textWidth) / 2; y = canvas.height - pad - scaledFont / 2; break;
          case "bottom-right": x = canvas.width - textWidth - pad; y = canvas.height - pad - scaledFont / 2; break;
        }
        ctx.fillText(watermarkText, x, y);
      }
      ctx.restore();
      setPreview(canvas.toDataURL("image/png"));
    };
    img.src = imageSrc;
  }, [imageSrc, watermarkText, fontSize, opacity, color, position, rotation]);

  useEffect(() => {
    drawWatermark();
  }, [drawWatermark]);

  function handleFile(file: File) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function download() {
    if (!preview || !imageFile) return;
    setDownloading(true);
    const a = document.createElement("a");
    const name = imageFile.name.replace(/\.[^.]+$/, "");
    a.href = preview;
    a.download = `${name}_filigrane.png`;
    a.click();
    setTimeout(() => setDownloading(false), 1000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🖊️</span>
          <h1 className="text-3xl font-bold">Ajout de Filigrane</h1>
        </div>
        <p className="text-gray-400">Protège tes images en ajoutant un filigrane personnalisé.</p>
      </div>

      {/* Upload */}
      {!imageSrc ? (
        <label className="block bg-gray-900 border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-2xl p-12 text-center cursor-pointer transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-white font-semibold mb-1">Déposer une image</p>
          <p className="text-gray-500 text-sm">JPG, PNG, WebP — cliquer pour choisir</p>
        </label>
      ) : (
        <div className="space-y-5">
          {/* Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Texte du filigrane</label>
              <input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Taille — {fontSize}%</label>
              <input type="range" min={5} max={80} value={fontSize} onChange={(e) => setFontSize(+e.target.value)}
                className="w-full accent-blue-500" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Opacité — {opacity}%</label>
              <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)}
                className="w-full accent-blue-500" />
            </div>

            {position === "tile" && (
              <div>
                <label className="block text-xs text-gray-400 mb-2">Rotation — {rotation}°</label>
                <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(+e.target.value)}
                  className="w-full accent-blue-500" />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-2">Couleur</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${color === c ? "border-blue-400 scale-110" : "border-gray-700"}`}
                  />
                ))}
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-gray-700" />
              </div>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 overflow-hidden">
              <p className="text-xs text-gray-500 mb-3">Aperçu</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Aperçu avec filigrane" className="w-full rounded-xl max-h-80 object-contain" />
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={download} disabled={!preview || downloading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors">
              {downloading ? "Téléchargement..." : "⬇️ Télécharger"}
            </button>
            <button onClick={() => { setImageFile(null); setImageSrc(null); setPreview(null); }}
              className="px-5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-xl transition-colors">
              Changer
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
