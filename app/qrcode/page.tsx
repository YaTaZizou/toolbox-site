"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import QRCode from "qrcode";

const colors = ["#ffffff", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function QRCodePage() {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#1f2937");
  const [size, setSize] = useState(300);
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) { setDataUrl(""); return; }
    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: { dark: color, light: bg },
    }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [text, color, bg, size]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📱</span>
          <h1 className="text-3xl font-bold">Générateur de QR Code</h1>
        </div>
        <p className="text-gray-400">Crée un QR code personnalisé pour n'importe quel lien ou texte.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Lien ou texte</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://toolbox-site-blue.vercel.app"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Couleur du QR</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? "border-white scale-110" : "border-gray-600"}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Taille : {size}px</label>
            <input
              type="range"
              min={150}
              max={500}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      {dataUrl ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <img src={dataUrl} alt="QR Code" className="mx-auto rounded-xl mb-6" style={{ maxWidth: "280px" }} />
          <button
            onClick={download}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            ⬇️ Télécharger le QR Code
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-2xl p-16 text-center text-gray-600">
          Entre un lien ou un texte pour générer ton QR code
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
