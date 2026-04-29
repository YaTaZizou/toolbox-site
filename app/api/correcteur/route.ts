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
      const { allowed } = checkRateLimit(`correcteur:${ip}`);
      if (!allowed) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
          { status: 429 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    const { text, language } = await req.json();
    if (!text?.trim())
      return NextResponse.json({ error: "Texte manquant" }, { status: 400 });

    if (text.length > 5000)
      return NextResponse.json({ error: "Texte trop long (max 5000 caractères)" }, { status: 400 });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Tu es un correcteur professionnel. Corrige le texte suivant en ${language || "français"}.
Corrige : orthographe, grammaire, conjugaison, ponctuation, style.
Réponds en JSON avec exactement ce format :
{"corrected": "texte corrigé ici", "changes": ["correction 1", "correction 2", ...]}
Ne mets rien d'autre que le JSON.

Texte à corriger :
${text}`,
        },
      ],
    });

    const raw = (message.content[0] as { text: string }).text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return NextResponse.json({ error: "Réponse invalide" }, { status: 500 });

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de la correction" }, { status: 500 });
  }
}
