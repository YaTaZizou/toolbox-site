"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Action = "pivoter" | "supprimer" | "reorganiser";

const tabs: { value: Action; emoji: string; label: string; desc: string }[] = [
  { value: "pivoter", emoji: "🔄", label: "Pivoter pages", desc: "Tourner des pages" },
  { value: "supprimer", emoji: "🗑️", label: "Supprimer pages", desc: "Retirer des pages" },
  { value: "reorganiser", emoji: "🔀", label: "Réorganiser", desc: "Changer l'ordre" },
];

export default function ModifierPdfPage() {
  const [action, setAction] = useState<Action>("pivoter");
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("");
  const [angle, setAngle] = useState(90);
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleTab(t: Action) {
    setAction(t);
    setDone(false);
    setError("");
    setPages("");
    setOrder("");
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
      if (action === "pivoter") {
        form.append("pages", pages);
        form.append("angle", String(angle));
      }
      if (action === "supprimer") form.append("pages", pages);
      if (action === "reorganiser") form.append("order", order);

      const res = await fetch("/api/modifier-pdf", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = action === "reorganiser" ? "reorganise.pdf" : "modifie.pdf";
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
    (action === "pivoter" ? pages.trim().length > 0 : true) &&
    (action === "supprimer" ? pages.trim().length > 0 : true) &&
    (action === "reorganiser" ? order.trim().length > 0 : true);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📝</span>
          <h1 className="text-3xl font-bold">Modificateur de PDF</h1>
        </div>
        <p className="text-gray-400">Pivote, supprime ou réorganise les pages de ton PDF.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTab(t.value)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              action === t.value
                ? "border-red-500 bg-red-500/10"
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
        className="border-2 border-dashed border-gray-700 hover:border-red-500 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
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

      {file && action === "pivoter" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Pages à pivoter</label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="Ex: 1, 3, 5-8"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm"
            />
            <p className="text-xs text-gray-600 mt-1">Sépare par des virgules. Utilise un tiret pour une plage.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Angle de rotation</label>
            <div className="grid grid-cols-4 gap-2">
              {[90, 180, 270, -90].map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                    angle === a ? "bg-red-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {a > 0 ? `+${a}°` : `${a}°`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {file && action === "supprimer" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Pages à supprimer</label>
          <input
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="Ex: 2, 4, 6-8"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm"
          />
          <p className="text-xs text-gray-600 mt-2">Les autres pages seront conservées dans le nouvel PDF.</p>
        </div>
      )}

      {file && action === "reorganiser" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Nouvel ordre des pages</label>
          <input
            type="text"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Ex: 3, 1, 2, 4"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm"
          />
          <p className="text-xs text-gray-600 mt-2">Entre les numéros de page dans le nouvel ordre souhaité.</p>
        </div>
      )}

      {file && (
        <button
          onClick={process}
          disabled={loading || !canSubmit}
          className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
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
    </div>
  );
}
