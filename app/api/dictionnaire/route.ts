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
      const { allowed } = checkRateLimit(`dictionnaire:${ip}`);
      if (!allowed) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
          { status: 429 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    const { word, language } = await req.json();
    if (!word?.trim())
      return NextResponse.json({ error: "Mot manquant" }, { status: 400 });

    if (word.length > 100)
      return NextResponse.json({ error: "Mot trop long (max 100 caractères)" }, { status: 400 });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Donne la définition du mot "${word}" en ${language || "français"}.
Réponds en JSON avec exactement ce format :
{"word": "${word}", "nature": "nom/verbe/adjectif/etc", "definition": "définition claire", "examples": ["exemple 1", "exemple 2"], "synonymes": ["syn1", "syn2", "syn3"], "antonymes": ["ant1", "ant2"]}
Ne mets rien d'autre que le JSON.`,
        },
      ],
    });

    const raw = (message.content[0] as { text: string }).text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return NextResponse.json({ error: "Réponse invalide" }, { status: 500 });

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de la recherche" }, { status: 500 });
  }
}
