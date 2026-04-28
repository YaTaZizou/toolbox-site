import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { text, from, to } = await req.json();
    if (!text?.trim() || !to) return NextResponse.json({ error: "Texte ou langue manquante" }, { status: 400 });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const source = from === "auto" ? "la langue détectée automatiquement" : from;

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `Traduis ce texte depuis ${source} vers ${to}. Réponds UNIQUEMENT avec la traduction, sans explication ni commentaire :\n\n${text}`,
      }],
    });

    const translation = (message.content[0] as { text: string }).text;
    return NextResponse.json({ translation });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de la traduction" }, { status: 500 });
  }
}
