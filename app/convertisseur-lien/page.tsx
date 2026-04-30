"use client";

import { useState } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { usePremiumStatus } from "@/components/PremiumProvider";

// ── Logos SVG des plateformes ──────────────────────────────────────────────
function YouTubeLogo() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
      <rect width="28" height="20" rx="4" fill="#FF0000"/>
      <polygon points="11,5 11,15 20,10" fill="white"/>
    </svg>
  );
}
function TikTokLogo() {
  return (
    <svg width="22" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" fill="white"/>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" fill="#69C9D0" fillOpacity="0.5"/>
    </svg>
  );
}
function InstagramLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig1)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
    </svg>
  );
}
function XLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000"/>
      <path d="M18 4h-2.6l-3.4 4.7L8.6 4H4l5.8 8L4 20h2.6l3.7-5.1L14.2 20H19l-6-8.3L18 4z" fill="white"/>
    </svg>
  );
}
function SoundCloudLogo() {
  return (
    <svg width="28" height="18" viewBox="0 0 50 32" fill="none">
      <rect width="50" height="32" rx="5" fill="#FF5500"/>
      <path d="M6 20c0-1.1.5-2 1.3-2.6C7.1 17 7 16.5 7 16c0-2.2 1.8-4 4-4 .3 0 .6 0 .9.1C12.5 10.3 14.6 9 17 9c3.3 0 6 2.7 6 6v.1c1.1.5 2 1.6 2 2.9 0 1.7-1.3 3-3 3H8c-1.1 0-2-.9-2-2z" fill="white"/>
    </svg>
  );
}
function GlobeLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

// ── Détection de plateforme ────────────────────────────────────────────────
type Platform = "youtube" | "tiktok" | "instagram" | "twitter" | "soundcloud" | "other";

const PLATFORMS: Record<Platform, { label: string; icon: React.ReactNode; color: string; examples: string }> = {
  youtube:    { label: "YouTube",    icon: <YouTubeLogo />,    color: "text-red-400",    examples: "youtube.com/watch, youtu.be" },
  tiktok:     { label: "TikTok",     icon: <TikTokLogo />,    color: "text-pink-300",   examples: "tiktok.com, vm.tiktok.com" },
  instagram:  { label: "Instagram",  icon: <InstagramLogo />, color: "text-fuchsia-400", examples: "instagram.com/p, /reel" },
  twitter:    { label: "X (Twitter)",icon: <XLogo />,         color: "text-gray-200",   examples: "x.com, twitter.com" },
  soundcloud: { label: "SoundCloud", icon: <SoundCloudLogo />,color: "text-orange-400", examples: "soundcloud.com" },
  other:      { label: "Autre",      icon: <GlobeLogo />,     color: "text-gray-400",   examples: "Reddit, Twitch, Vimeo..." },
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
  const { isPremium } = usePremiumStatus();
  const [url, setUrl]               = useState("");
  const [quality, setQuality]       = useState("720");
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
            className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
            title={val.examples}
          >
            <div className="flex items-center justify-center h-7">{val.icon}</div>
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
                <span className="flex items-center">{p.icon}</span>
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
              <div className="relative">
                <select
                  value={quality}
                  onChange={(e) => {
                    if (e.target.value === "1080" && !isPremium) return;
                    setQuality(e.target.value);
                  }}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="1080" disabled={!isPremium}>
                    {isPremium ? "1080p (Full HD)" : "🔒 1080p (Full HD) — Premium"}
                  </option>
                  <option value="720">720p (HD)</option>
                  <option value="480">480p</option>
                  <option value="360">360p</option>
                  <option value="144">144p (léger)</option>
                </select>
              </div>
              {!isPremium && (
                <Link
                  href="/premium"
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.6l1.2-6.1L3.3 9.3l6.1-.7L12 3z"/>
                  </svg>
                  Passer Premium pour débloquer le Full HD
                </Link>
              )}
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
      <div className="mt-8" />
      <AdBanner />
    </div>
  );
}
