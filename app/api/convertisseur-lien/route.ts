import { NextRequest, NextResponse } from "next/server";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const maxDuration = 30;

// Cobalt.tools — API open-source multi-plateforme
// Supporte YouTube, TikTok, Instagram, X, SoundCloud, Twitch, Reddit, etc.
const COBALT_API = process.env.COBALT_API_URL ?? "https://api.cobalt.tools/";

export async function POST(req: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────
  const premium = await isPremiumRequest(req);
  if (!premium) {
    const ip = getClientIp(req);
    const { allowed } = await checkRateLimitAsync(`convertisseur-lien:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
        { status: 429 }
      );
    }
  }

  const { url, quality: rawQuality = "1080", audioOnly = false } = await req.json().catch(() => ({}));
  const ALLOWED_QUALITIES = ["144", "360", "480", "720", "1080", "1440", "2160", "max"];
  const quality = ALLOWED_QUALITIES.includes(rawQuality) ? rawQuality : "1080";

  if (!url?.trim()) {
    return NextResponse.json({ error: "URL manquante" }, { status: 400 });
  }

  // Validation de l'URL : doit être http ou https uniquement
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "URL invalide (protocole non supporté)" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "URL invalide" }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Clé API optionnelle (ajouter COBALT_API_KEY dans .env si nécessaire)
    if (process.env.COBALT_API_KEY) {
      headers["Authorization"] = `Api-Key ${process.env.COBALT_API_KEY}`;
    }

    const res = await fetch(COBALT_API, {
      method: "POST",
      headers,
      body: JSON.stringify({
        url: url.trim(),
        videoQuality: quality,
        downloadMode: audioOnly ? "audio" : "auto",
        filenameStyle: "pretty",
        tiktokFullAudio: true,
        twitterGif: false,
        youtubeHLS: false,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    const data = await res.json();

    // Erreur retournée par cobalt
    if (data.status === "error") {
      const code = data.error?.code ?? "";
      const messages: Record<string, string> = {
        "error.api.link.invalid":
          "Lien invalide ou non supporté. Vérifie l'URL et réessaie.",
        "error.api.link.unsupported":
          "Cette plateforme n'est pas encore supportée.",
        "error.api.content.unavailable":
          "Ce contenu est introuvable ou a été supprimé.",
        "error.api.content.private":
          "Ce contenu est privé — impossible de le télécharger.",
        "error.api.rate_exceeded":
          "Trop de requêtes. Réessaie dans quelques secondes.",
      };
      return NextResponse.json(
        { error: messages[code] ?? "Impossible de traiter ce lien." },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Cobalt API error:", err);
    return NextResponse.json(
      { error: "Erreur réseau. Réessaie dans quelques secondes." },
      { status: 500 }
    );
  }
}
