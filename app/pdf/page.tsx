"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePremiumStatus } from "@/components/PremiumProvider";

type Action = "fusionner" | "image-vers-pdf" | "decouper" | "proteger";

const tabs: { value: Action; emoji: string; label: string; desc: string }[] = [
  { value: "fusionner", emoji: "🔗", label: "Fusionner", desc: "Combine plusieurs PDFs" },
  { value: "image-vers-pdf", emoji: "🖼️", label: "Images → PDF", desc: "JPG/PNG en PDF" },
  { value: "decouper", emoji: "✂️", label: "Découper", desc: "Extraire des pages" },
  { value: "proteger", emoji: "🔒", label: "Protéger", desc: "Ajouter un mot de passe" },
];

function PdfTool() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Action) ?? "fusionner";
  const { isPremium } = usePremiumStatus();

  const [action, setAction] = useState<Action>(initialTab);
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptMap: Record<Action, string> = {
    fusionner: ".pdf",
    "image-vers-pdf": "image/jpeg,image/png",
    decouper: ".pdf",
    proteger: ".pdf",
  };

  const multipleMap: Record<Action, boolean> = {
    fusionner: true,
    "image-vers-pdf": true,
    decouper: false,
    proteger: false,
  };

  function handleTab(t: Action) {
    setAction(t);
    setFiles([]);
    setDone(false);
    setError("");
    setPages("");
    setPassword("");
  }

  function handleFiles(fl: FileList) {
    setFiles(Array.from(fl));
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
      if (action === "decouper") form.append("pages", pages);
      if (action === "proteger") form.append("password", password);

      const res = await fetch("/api/convertir-pdf", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const blob = await res.blob();
      const names: Record<Action, string> = {
        fusionner: "fusion.pdf",
        "image-vers-pdf": "images.pdf",
        decouper: "decoupage.pdf",
        proteger: "protege.pdf",
      };
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = names[action];
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
    files.length > 0 &&
    (action !== "fusionner" || files.length >= 2) &&
    (action !== "decouper" || pages.trim().length > 0) &&
    (action !== "proteger" || password.length >= 4);

  const current = tabs.find((t) => t.value === action)!;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{current.emoji}</span>
          <h1 className="text-3xl font-bold">{current.label} PDF</h1>
        </div>
        <p className="text-gray-400">{current.desc}</p>
      </div>

      {/* Onglets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTab(t.value)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              action === t.value ? "border-red-500 bg-red-500/10" : "border-gray-800 bg-gray-900 hover:border-gray-600"
            }`}
          >
            <span className="text-xl block mb-1">{t.emoji}</span>
            <p className="font-semibold text-white text-sm">{t.label}</p>
          </button>
        ))}
      </div>

      {/* Zone upload */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-red-500 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptMap[action]}
          multiple={multipleMap[action]}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <span className="text-4xl mb-3 block">📁</span>
        <p className="font-medium text-gray-300">Dépose ton fichier ici</p>
        <p className="text-sm text-gray-600 mt-1">ou clique pour parcourir</p>
      </div>

      {/* Fichiers */}
      {files.length > 0 && (
        <div className="space-y-2 mb-4">
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

      {action === "fusionner" && files.length > 2 && !isPremium && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
          <span>⭐</span>
          <span>
            Limite gratuite : 2 PDFs max —{" "}
            <Link href="/premium" className="underline font-semibold hover:text-amber-300">
              Passe Premium pour en fusionner plus
            </Link>
          </span>
        </div>
      )}

      {action === "decouper" && files.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Pages à extraire</label>
          <input type="text" value={pages} onChange={(e) => setPages(e.target.value)}
            placeholder="Ex: 1, 3, 5-8, 12"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors text-sm" />
          <p className="text-xs text-gray-600 mt-2">Sépare par des virgules. Utilise un tiret pour une plage (ex: 2-5)</p>
        </div>
      )}

      {action === "proteger" && files.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 4 caractères"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors text-sm" />
        </div>
      )}

      {files.length > 0 && (
        <button onClick={convert} disabled={loading || !canSubmit}
          className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
          {loading ? "Traitement en cours..." : `⬇️ ${current.label}`}
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

export default function PdfPage() {
  return <Suspense><PdfTool /></Suspense>;
}
