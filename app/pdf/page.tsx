"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Action = "fusionner" | "image-vers-pdf";

const actions = [
  { value: "fusionner" as Action, emoji: "🔗", label: "Fusionner des PDFs", desc: "Combine plusieurs PDFs en un seul", accept: ".pdf", multiple: true },
  { value: "image-vers-pdf" as Action, emoji: "🖼️", label: "Images → PDF", desc: "Convertit JPG/PNG en fichier PDF", accept: "image/jpeg,image/png", multiple: true },
];

export default function PdfPage() {
  const [action, setAction] = useState<Action>("fusionner");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentAction = actions.find((a) => a.value === action)!;

  function handleFiles(newFiles: FileList) {
    setFiles(Array.from(newFiles));
    setDone(false);
    setError("");
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function convert() {
    if (files.length === 0) return;
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const form = new FormData();
      form.append("action", action);
      files.forEach((f) => form.append("files", f));

      const res = await fetch("/api/convertir-pdf", { method: "POST", body: form });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = action === "fusionner" ? "fusion.pdf" : "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors du traitement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📄</span>
          <h1 className="text-3xl font-bold">Outils PDF</h1>
        </div>
        <p className="text-gray-400">Fusionne des PDFs ou convertis tes images en PDF facilement.</p>
      </div>

      {/* Sélection de l'action */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {actions.map((a) => (
          <button
            key={a.value}
            onClick={() => { setAction(a.value); setFiles([]); setDone(false); setError(""); }}
            className={`p-5 rounded-2xl border text-left transition-all ${
              action === a.value
                ? "border-orange-500 bg-orange-500/10"
                : "border-gray-800 bg-gray-900 hover:border-gray-600"
            }`}
          >
            <span className="text-3xl mb-2 block">{a.emoji}</span>
            <p className="font-semibold text-white">{a.label}</p>
            <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Zone d'upload */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-orange-500 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept={currentAction.accept}
          multiple={currentAction.multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <span className="text-4xl mb-3 block">📁</span>
        <p className="font-medium text-gray-300">Dépose tes fichiers ici</p>
        <p className="text-sm text-gray-600 mt-1">ou clique pour parcourir</p>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-2 mb-6">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span>{f.type === "application/pdf" ? "📄" : "🖼️"}</span>
                <div>
                  <p className="text-sm text-white truncate max-w-xs">{f.name}</p>
                  <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} Ko</p>
                </div>
              </div>
              <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 transition-colors text-sm">✕</button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={convert}
          disabled={loading || (action === "fusionner" && files.length < 2)}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Traitement en cours..." : `⬇️ ${currentAction.label}`}
        </button>
      )}

      {action === "fusionner" && files.length === 1 && (
        <p className="text-center text-sm text-gray-600 mt-3">Ajoute au moins un 2ème PDF pour fusionner</p>
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
