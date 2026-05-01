"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useAiLimit } from "@/hooks/useAiLimit";
import { AiLimitBanner } from "@/components/AiLimitBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

export default function OcrPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { canUse, increment, remaining, isPremium, status, ready, limit } = useAiLimit();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      return;
    }
    setImageFile(file);
    setResult("");
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function extract() {
    if (!imageFile || !canUse) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve((e.target?.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mediaType: imageFile.type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'extraction");
      increment();
      setResult(data.text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setImageFile(null);
    setImagePreview(null);
    setResult("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔍</span>
          <h1 className="text-3xl font-bold">OCR — Image en Texte</h1>
        </div>
        <p className="text-gray-400">Extrayez le texte de n&apos;importe quelle image ou document scanné grâce à l&apos;IA.</p>
      </div>

      {ready && <AiLimitBanner remaining={remaining} isPremium={isPremium} limit={limit} status={status} />}

      {/* Bandeau Premium — visible uniquement pour les non-Premium quand il reste des générations */}
      {ready && !isPremium && remaining > 0 && (
        <div className="mb-6 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              ⭐ Premium — extractions illimitées + amélioration d&apos;image 4×
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Tu utilises <strong className="text-gray-300">{limit - remaining}/{limit}</strong> extractions gratuites aujourd&apos;hui.
              Premium = illimité, zéro pub, essai gratuit 7 jours.
            </p>
          </div>
          <Link
            href="/premium"
            className="shrink-0 text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Essai 7 jours gratuit →
          </Link>
        </div>
      )}

      {/* Upload zone */}
      {!imagePreview ? (
        <label className="block bg-gray-900 border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-2xl p-12 text-center cursor-pointer transition-colors mb-6">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <p className="text-5xl mb-3">📄</p>
          <p className="text-white font-semibold mb-1">Déposer une image</p>
          <p className="text-gray-500 text-sm">JPG, PNG, WebP, PDF scanné — cliquer pour choisir</p>
        </label>
      ) : (
        <div className="mb-6 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">Image sélectionnée</p>
              <button onClick={reset} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Changer
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Image à analyser"
              className="w-full max-h-60 object-contain rounded-xl"
            />
          </div>

          <button
            onClick={extract}
            disabled={loading || !canUse}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Extraction en cours...
              </span>
            ) : status === "login_required" ? "🔓 Connecte-toi pour continuer" : status === "limit_reached" ? "⭐ Limite atteinte — Passer Premium" : "🔍 Extraire le texte"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-300">Texte extrait</span>
              <span className="text-xs text-gray-600">{result.split(/\s+/).filter(Boolean).length} mots</span>
            </div>
            <button
              onClick={copy}
              className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
            >
              {copied ? "✓ Copié !" : "📋 Copier"}
            </button>
          </div>
          <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {result}
          </pre>
        </div>
      )}

      {!imagePreview && (
        <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-400">💡 Exemples d&apos;utilisation :</strong> reçus, cartes de visite,
            captures d&apos;écran de texte, tableaux scannés, documents manuscrits, factures...
          </p>
        </div>
      )}
      <PremiumUpsellBanner />
    </div>
  );
}
