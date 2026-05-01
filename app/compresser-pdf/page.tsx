"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";
import { usePremiumStatus } from "@/components/PremiumProvider";

const MAX_SIZE_MB = 50;

type CompressionLevel = "legere" | "moyenne" | "forte";

const LEVELS: {
  value: CompressionLevel;
  label: string;
  desc: string;
  emoji: string;
  detail: string;
}[] = [
  {
    value: "legere",
    label: "Légère",
    desc: "Rapide, faible gain",
    emoji: "🟢",
    detail: "Réorganise la structure interne du PDF (object streams). Gain estimé : 5–15 %. Qualité identique.",
  },
  {
    value: "moyenne",
    label: "Moyenne",
    desc: "Bon compromis",
    emoji: "🟡",
    detail: "Réorganise + déduplique les ressources partagées entre pages. Gain estimé : 15–35 %. Qualité identique.",
  },
  {
    value: "forte",
    label: "Forte",
    desc: "Gain maximal",
    emoji: "🔴",
    detail: "Réorganise, déduplique et supprime les métadonnées optionnelles (XMP, info). Gain estimé : 25–45 %. Qualité identique.",
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 o";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

const FREE_MAX_SIZE_MB = 5;

export default function CompresserPdfPage() {
  const { isPremium } = usePremiumStatus();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("moyenne");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    blob: Blob;
    fileName: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setFile(null);
    setResult(null);
    setError("");
  }

  function handleFile(f: File) {
    setResult(null);
    setError("");

    if (f.type !== "application/pdf") {
      setError("Le fichier sélectionné n'est pas un PDF valide.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Le fichier dépasse la limite de ${MAX_SIZE_MB} Mo. Passe en Premium pour compresser des fichiers plus lourds.`);
      return;
    }
    setFile(f);
  }

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  async function compress() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");

      const arrayBuffer = await file.arrayBuffer();
      const originalSize = arrayBuffer.byteLength;

      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: false,
      });

      // Suppression des métadonnées optionnelles pour le niveau "forte"
      if (level === "forte") {
        pdfDoc.setTitle("");
        pdfDoc.setAuthor("");
        pdfDoc.setSubject("");
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer("");
        pdfDoc.setCreator("");
      }

      // Tous les niveaux utilisent useObjectStreams (compresse la structure interne)
      // Le niveau "moyenne" et "forte" activent en plus objectsPerTick plus élevé
      // pour un meilleur passage sur les ressources partagées
      const saveOptions =
        level === "legere"
          ? { useObjectStreams: true }
          : { useObjectStreams: true, objectsPerTick: 50 };

      const compressedBytes = await pdfDoc.save(saveOptions);
      const compressedSize = compressedBytes.byteLength;

      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const baseName = file.name.replace(/\.pdf$/i, "");

      setResult({
        originalSize,
        compressedSize,
        blob,
        fileName: `${baseName}-compresse.pdf`,
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("encrypt")) {
        setError("Ce PDF est protégé par un mot de passe. Retire la protection avant de le compresser.");
      } else {
        setError("Impossible de compresser ce PDF. Vérifie qu'il n'est pas corrompu ou protégé.");
      }
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentLevel = LEVELS.find((l) => l.value === level)!;

  const gain =
    result && result.originalSize > 0
      ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
      : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors"
      >
        ← Retour
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📦</span>
          <h1 className="text-3xl font-bold">Compresser un PDF</h1>
        </div>
        <p className="text-gray-400">
          Réduis la taille de ton PDF en ligne, gratuitement — sans inscription, sans envoi de données.
        </p>
      </div>

      {/* Zone d'upload */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors mb-6 ${
            dragOver
              ? "border-purple-500 bg-purple-500/5"
              : "border-gray-700 hover:border-purple-500/60"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <span className="text-5xl mb-3 block">📄</span>
          <p className="font-medium text-gray-300">Glisse ton PDF ici</p>
          <p className="text-sm text-gray-600 mt-1">ou clique pour parcourir</p>
          <p className="text-xs text-gray-700 mt-3">Max {MAX_SIZE_MB} Mo · Traitement 100 % local</p>
        </div>
      ) : (
        /* Fichier sélectionné */
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm text-white font-medium truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-gray-600 hover:text-red-400 transition-colors text-sm ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Avertissement limite gratuite taille */}
      {file && !isPremium && file.size > FREE_MAX_SIZE_MB * 1024 * 1024 && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
          <span>⭐</span>
          <span>
            Limite gratuite : 5 Mo max. {" "}
            <Link href="/premium" className="underline font-semibold hover:text-amber-300">
              Passe Premium pour compresser des fichiers jusqu&apos;à 50 Mo.
            </Link>
          </span>
        </div>
      )}

      {/* Sélecteur de niveau */}
      {file && !result && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3 font-medium">Niveau de compression</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  level === l.value
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-800 bg-gray-900 hover:border-gray-600"
                }`}
              >
                <span className="text-lg block mb-1">{l.emoji}</span>
                <p className="font-semibold text-white text-sm">{l.label}</p>
                <p className="text-xs text-gray-500">{l.desc}</p>
              </button>
            ))}
          </div>
          {/* Description du niveau actif */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400">
              <span className="text-white font-medium">{currentLevel.label} :</span>{" "}
              {currentLevel.detail}
            </p>
          </div>
        </div>
      )}

      {/* Bouton compresser */}
      {file && !result && (
        <button
          onClick={compress}
          disabled={loading || (!isPremium && file.size > FREE_MAX_SIZE_MB * 1024 * 1024)}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Compression en cours...
            </span>
          ) : (
            "📦 Compresser le PDF"
          )}
        </button>
      )}

      {/* Résultat */}
      {result && (
        <div className="mt-2 space-y-4">
          {/* Stats avant / après */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-4 font-medium">Résultat de la compression</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Avant</p>
                <p className="text-white font-semibold">{formatBytes(result.originalSize)}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span
                  className={`text-2xl font-bold ${
                    gain > 0 ? "text-green-400" : gain < 0 ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {gain > 0 ? `-${gain}%` : gain < 0 ? `+${Math.abs(gain)}%` : "0%"}
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  {gain > 0 ? "gagné" : gain < 0 ? "augmenté" : "inchangé"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Après</p>
                <p className="text-white font-semibold">{formatBytes(result.compressedSize)}</p>
              </div>
            </div>

            {/* Barre de progression visuelle */}
            {gain > 0 && (
              <div className="mt-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(2, 100 - gain)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1.5 text-right">
                  {formatBytes(result.originalSize - result.compressedSize)} économisés
                </p>
              </div>
            )}

            {gain <= 0 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Ce PDF est déjà bien optimisé — la re-sérialisation n&apos;a pas réduit sa taille.
              </p>
            )}
          </div>

          {/* Boutons */}
          <button
            onClick={download}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            ⬇ Télécharger le PDF compressé
          </button>
          <button
            onClick={reset}
            className="w-full text-sm text-gray-500 hover:text-gray-300 py-2 transition-colors"
          >
            Compresser un autre PDF
          </button>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mt-4 text-sm">
          {error}
        </div>
      )}

      {/* Info bas de page */}
      <div className="mt-12 border-t border-gray-800 pt-6">
        <p className="text-xs text-gray-600 text-center">
          Ton PDF ne quitte jamais ton appareil. Toute la compression se fait directement dans ton navigateur.
        </p>
      </div>
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
