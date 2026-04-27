import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const prompts: Record<string, (input: string) => string> = {
  pseudo: (input) =>
    `Génère 8 pseudos originaux et créatifs basés sur ce thème ou ces mots-clés : "${input}".
    Retourne UNIQUEMENT une liste JSON sous ce format exact (sans markdown, sans explication) :
    ["pseudo1","pseudo2","pseudo3","pseudo4","pseudo5","pseudo6","pseudo7","pseudo8"]`,

  bio: (input) =>
    `Génère 3 bios différentes et percutantes pour un profil sur les réseaux sociaux.
    Informations fournies : "${input}"
    Retourne UNIQUEMENT un JSON sous ce format exact (sans markdown, sans explication) :
    ["bio1","bio2","bio3"]`,

  texte: (input) =>
    `Tu es un assistant de rédaction expert. Génère un texte de qualité professionnelle basé sur cette demande : "${input}".
    Retourne UNIQUEMENT le texte final, sans introduction ni explication.`,
};

export async function POST(req: NextRequest) {
  try {
    console.log("API KEY présente:", !!process.env.ANTHROPIC_API_KEY, "| Début:", process.env.ANTHROPIC_API_KEY?.substring(0, 10));
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { type, input } = await req.json();

    if (!type || !input || !prompts[type]) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    if (input.trim().length < 2) {
      return NextResponse.json({ error: "Veuillez entrer plus de détails" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompts[type](input) }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    if (type === "pseudo" || type === "bio") {
      const parsed = JSON.parse(text);
      return NextResponse.json({ result: parsed });
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
