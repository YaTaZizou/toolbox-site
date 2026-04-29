"use client";

import { useState } from "react";
import Link from "next/link";

// ── Détection de plateforme ────────────────────────────────────────────────
type Platform = "youtube" | "tiktok" | "instagram" | "twitter" | "soundcloud" | "other";

const PLATFORMS: Record<Platform, { label: string; emoji: string; color: string; examples: string }> = {
  youtube:    { label: "YouTube",    emoji: "▶️",  color: "text-red-400",    examples: "youtube.com/watch, youtu.be" },
  tiktok:     { label: "TikTok",     emoji: "🎵",  color: "text-pink-400",   examples: "tiktok.com, vm.tiktok.com" },
  instagram:  { label: "Instagram",  emoji: "📸",  color: "text-purple-400", examples: "instagram.com/p, /reel" },
  twitter:    { label: "X (Twitter)",emoji: "🐦",  color: "text-sky-400",    examples: "x.com, twitter.com" },
  soundcloud: { label: "SoundCloud", emoji: "🎧",  color: "text-orange-400", examples: "soundcloud.com" },
  other:      { label: "Autre",      emoji: "🌐",  color: "text-gray-400",   examples: "Reddit, Twitch, Vimeo..." },
};

function detectPlatform(url: string): Platform {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
    if (host.includes("tiktok"))     return "tiktok";
    if (host.includes("instagram"))  return "instagram";
    if (host.includes("twitter") || host.includes("x.com")) return "twitter";
    if (host.includes("soundcloud")) return "soundcloud";
    return "other";
  } catch {
    return "other";
  }
}

type PickerItem = { url: string; type: "video" | "photo"; thumb?: string };

type Result =
  | { status: "redirect" | "tunnel"; url: string; filename?: string }
  | { status: "picker"; picker: PickerItem[]; audio?: string }
  | null;

export default function ConvertisseurLienPage() {
  const [url, setUrl]               = useState("");
  const [quality, setQuality]       = useState("1080");
  const [audioOnly, setAudioOnly]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [result, setResult]         = useState<Result>(null);

  const platform = url.trim() ? detectPlatform(url.trim()) : null;
  const p = platform ? PLATFORMS[platform] : null;

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/convertisseur-lien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), quality, audioOnly }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Erreur inconnue");
        return;
      }

      setResult(data);
    } catch {
      setError("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setUrl("");
    setResult(null);
    setError("");
    setAudioOnly(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Convertisseur de liens</h1>
        <p className="text-gray-400 text-sm">
          Télécharge des vidéos et audios depuis YouTube, TikTok, Instagram, X et plus.
        </p>
      </div>

      {/* Plateformes supportées */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
        {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(([key, val]) => (
          <div
            key={key}
            className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center"
            title={val.examples}
          >
            <p className="text-xl mb-1">{val.emoji}</p>
            <p className={`text-xs font-medium ${val.color}`}>{val.label}</p>
          </div>
        ))}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleDownload} className="space-y-4">
        {/* URL input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Lien de la vidéo</label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); setError(""); }}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pr-28 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
            />
            {/* Badge plateforme détectée */}
            {p && (
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold ${p.color}`}>
                <span>{p.emoji}</span>
                <span className="hidden sm:inline">{p.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3">
          {/* Qualité (seulement si pas audio-only) */}
          {!audioOnly && (
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-gray-500 mb-1.5">Qualité vidéo</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="1080">1080p (Full HD)</option>
                <option value="720">720p (HD)</option>
                <option value="480">480p</option>
                <option value="360">360p</option>
                <option value="144">144p (léger)</option>
              </select>
            </div>
          )}

          {/* Toggle Audio seulement */}
          <div className="flex items-end pb-0.5">
            <button
              type="button"
              onClick={() => setAudioOnly(!audioOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                audioOnly
                  ? "bg-purple-600/20 border-purple-500/40 text-purple-300"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
              }`}
            >
              <span>🎵</span>
              <span>Audio seulement (MP3)</span>
            </button>
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Récupération en cours…
            </>
          ) : (
            <>⬇️ Obtenir le lien de téléchargement</>
          )}
        </button>
      </form>

      {/* Erreur */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div className="mt-6 bg-gray-900 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-400 text-lg">✓</span>
            <p className="font-semibold text-white">Prêt à télécharger !</p>
          </div>

          {/* Lien direct */}
          {(result.status === "redirect" || result.status === "tunnel") && (
            <div className="space-y-3">
              {result.filename && (
                <p className="text-xs text-gray-500">📄 {result.filename}</p>
              )}
              <a
                href={result.url}
                download={result.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                ⬇️ Télécharger {audioOnly ? "l'audio" : "la vidéo"}
              </a>
              <p className="text-xs text-gray-600 text-center">
                Si le téléchargement ne démarre pas automatiquement, clique droit → &quot;Enregistrer sous&quot;.
              </p>
            </div>
          )}

          {/* Picker — plusieurs options */}
          {result.status === "picker" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-3">Plusieurs fichiers disponibles :</p>
              {result.picker.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-3 transition-colors"
                >
                  {item.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumb} alt="" className="w-16 h-10 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {item.type === "video" ? "🎬 Vidéo" : "🖼️ Photo"} #{i + 1}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs shrink-0">⬇️</span>
                </a>
              ))}
              {result.audio && (
                <a
                  href={result.audio}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 rounded-xl p-3 transition-colors"
                >
                  <span className="text-2xl">🎵</span>
                  <p className="text-sm font-medium text-purple-300">Audio original</p>
                  <span className="ml-auto text-gray-400 text-xs">⬇️</span>
                </a>
              )}
            </div>
          )}

          <button
            onClick={reset}
            className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Nouveau lien
          </button>
        </div>
      )}

      {/* Mention légale */}
      <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          ⚠️ <strong className="text-gray-500">Usage personnel uniquement.</strong>{" "}
          Télécharge uniquement du contenu dont tu détiens les droits ou qui est en accès libre.
          Le téléchargement de contenu protégé par droits d&apos;auteur sans autorisation peut être illégal.
          Cet outil est fourni à des fins éducatives et personnelles.
        </p>
      </div>
    </div>
  );
}
