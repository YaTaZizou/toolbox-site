import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting (server-side) ──────────────────────────────────────
    const premium = await isPremiumRequest(req);
    if (!premium) {
      const ip = getClientIp(req);
      const { allowed } = checkRateLimit(`traducteur:${ip}`);
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

    if (text.length > 3000)
      return NextResponse.json({ error: "Texte trop long (max 3000 caractères)" }, { status: 400 });

    const ALLOWED_LANGUAGES = ["français", "anglais", "espagnol", "allemand", "italien", "portugais", "néerlandais", "arabe", "japonais", "chinois", "russe", "coréen", "polonais", "turc", "suédois", "auto"];
    const safeTo = ALLOWED_LANGUAGES.includes(to) ? to : "anglais";
    const safeFrom = from === "auto" || ALLOWED_LANGUAGES.includes(from) ? from : "auto";

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const source = safeFrom === "auto" ? "la langue détectée automatiquement" : safeFrom;

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Traduis ce texte depuis ${source} vers ${safeTo}. Réponds UNIQUEMENT avec la traduction, sans explication ni commentaire :\n\n${text}`,
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
