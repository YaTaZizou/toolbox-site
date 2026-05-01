import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting (server-side) ──────────────────────────────────────
    const premium = await isPremiumRequest(req);
    if (!premium) {
      const ip = getClientIp(req);
      const { allowed } = await checkRateLimitAsync(`traducteur:${ip}`);
      if (!allowed) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
          { status: 429 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    const { text, from, to } = await req.json();
    if (!text?.trim() || !to)
      return NextResponse.json({ error: "Texte ou langue manquante" }, { status: 400 });

    if (!premium && text.length > 500)
      return NextResponse.json(
        { error: "Limite gratuite : 500 caractères max. Passe Premium pour traduire des textes plus longs." },
        { status: 403 }
      );

    if (text.length > 3000)
      return NextResponse.json({ error: "Texte trop long (max 3000 caractères)" }, { status: 400 });

    // Mapping UI labels → noms français pour le prompt IA
    const LANG_MAP: Record<string, string> = {
      "français": "français", "Français": "français",
      "english": "anglais", "English": "anglais",
      "español": "espagnol", "Español": "espagnol",
      "deutsch": "allemand", "Deutsch": "allemand",
      "italiano": "italien", "Italiano": "italien",
      "português": "portugais", "Português": "portugais",
      "nederlands": "néerlandais", "Nederlands": "néerlandais",
      "polski": "polonais", "Polski": "polonais",
      "русский": "russe", "Русский": "russe",
      "中文": "chinois",
      "日本語": "japonais",
      "العربية": "arabe",
      "한국어": "coréen",
      "türkçe": "turc", "Türkçe": "turc",
      "svenska": "suédois", "Svenska": "suédois",
    };

    const PREMIUM_LANGUAGES = ["arabe", "japonais", "coréen", "chinois"];
    const ALLOWED_LANGUAGES = ["français", "anglais", "espagnol", "allemand", "italien", "portugais", "néerlandais", "arabe", "japonais", "chinois", "russe", "coréen", "polonais", "turc", "suédois", "auto"];

    const normalizedTo = LANG_MAP[to] ?? to.toLowerCase();
    const safeTo = ALLOWED_LANGUAGES.includes(normalizedTo) ? normalizedTo : "anglais";

    if (!premium && PREMIUM_LANGUAGES.includes(safeTo))
      return NextResponse.json(
        { error: "Cette langue est réservée aux membres Premium." },
        { status: 403 }
      );
    const normalizedFrom = from === "auto" ? "auto" : (LANG_MAP[from] ?? from.toLowerCase());
    const safeFrom = normalizedFrom === "auto" || ALLOWED_LANGUAGES.includes(normalizedFrom) ? normalizedFrom : "auto";

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const source = safeFrom === "auto" ? "la langue détectée automatiquement" : safeFrom;

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      system: `Tu es un traducteur professionnel. Traduis le texte fourni par l'utilisateur depuis ${source} vers ${safeTo}. Réponds UNIQUEMENT avec la traduction, sans explication ni commentaire.`,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    });

    const translation = (message.content[0] as { text: string }).text;
    return NextResponse.json({ translation });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de la traduction" }, { status: 500 });
  }
}
