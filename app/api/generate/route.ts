import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function stripMarkdown(text: string): string {
  return text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
}

// Sanitize user input: strip double-quotes to prevent prompt injection via quote-breaking
function sanitizeInput(input: string): string {
  return input.replace(/"/g, "'").replace(/`/g, "'").slice(0, 2000);
}

const prompts: Record<string, (input: string) => string> = {
  pseudo: (input) =>
    `Génère 8 pseudos originaux et créatifs basés sur ce thème ou ces mots-clés : "${sanitizeInput(input)}".
Retourne UNIQUEMENT un tableau JSON valide, sans markdown, sans explication :
["pseudo1","pseudo2","pseudo3","pseudo4","pseudo5","pseudo6","pseudo7","pseudo8"]`,

  bio: (input) =>
    `Génère 3 bios différentes et percutantes pour un profil sur les réseaux sociaux.
Informations fournies : "${sanitizeInput(input)}"
Retourne UNIQUEMENT un tableau JSON valide, sans markdown, sans explication :
["bio1","bio2","bio3"]`,

  texte: (input) =>
    `Tu es un assistant de rédaction expert. Génère un texte de qualité professionnelle basé sur cette demande : "${sanitizeInput(input)}".
Retourne UNIQUEMENT le texte final, sans introduction ni explication.`,
};

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting (server-side) ──────────────────────────────────────
    const premium = await isPremiumRequest(req);
    if (!premium) {
      const ip = getClientIp(req);
      const { allowed } = await checkRateLimitAsync(`generate:${ip}`);
      if (!allowed) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
          { status: 429 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    const { type, input } = await req.json();

    if (!type || !input || !prompts[type]) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    if (input.trim().length < 2) {
      return NextResponse.json({ error: "Veuillez entrer plus de détails" }, { status: 400 });
    }

    // Limite de taille pour éviter les abus coûteux
    if (input.length > 2000) {
      return NextResponse.json({ error: "Texte trop long (max 2000 caractères)" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompts[type](input) }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const text = stripMarkdown(raw);

    if (type === "pseudo" || type === "bio") {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json({ result: parsed });
      } catch {
        const lines = text
          .split("\n")
          .map((l) => l.replace(/^[-•*\d.]\s*/, "").replace(/^"|"$/g, "").trim())
          .filter(Boolean);
        return NextResponse.json({ result: lines.slice(0, type === "pseudo" ? 8 : 3) });
      }
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Erreur generate:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Réessaie dans quelques secondes." },
      { status: 500 }
    );
  }
}
