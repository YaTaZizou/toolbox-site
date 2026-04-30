import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting (server-side) ──────────────────────────────────────
    const premium = await isPremiumRequest(req);
    if (!premium) {
      const ip = getClientIp(req);
      const { allowed } = checkRateLimit(`ocr:${ip}`, 3);
      if (!allowed) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
          { status: 429 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    const { image, mediaType, fileSize } = await req.json();

    if (!image || !mediaType) {
      return NextResponse.json({ error: "Image manquante" }, { status: 400 });
    }

    // Vérification de taille selon le plan
    if (!premium && typeof fileSize === "number" && fileSize > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Limite gratuite : 2 Mo max. Passe Premium pour des fichiers plus volumineux (20 Mo)." },
        { status: 403 }
      );
    }
    if (premium && typeof fileSize === "number" && fileSize > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 20 Mo)" },
        { status: 413 }
      );
    }

    const supportedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!supportedTypes.includes(mediaType)) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez JPG, PNG, GIF ou WebP." },
        { status: 400 }
      );
    }

    // Limite de taille base64 (filet de sécurité général)
    const MAX_BASE64_LENGTH = 8 * 1024 * 1024;
    if (typeof image !== "string" || image.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "Image trop volumineuse (max 6 Mo)" },
        { status: 413 }
      );
    }

    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: image,
              },
            },
            {
              type: "text",
              text: `Tu es un outil OCR (reconnaissance optique de caractères).
Extrait TOUT le texte visible dans cette image, exactement comme il apparaît.
- Préserve les sauts de ligne et la mise en page autant que possible
- Transcris les chiffres, symboles et caractères spéciaux fidèlement
- Si le texte est dans plusieurs langues, transcris tout sans traduire
- Ne commente pas, ne résume pas, ne reformule pas — retourne uniquement le texte brut extrait
- Si aucun texte n'est détectable, réponds uniquement: "[Aucun texte détecté dans cette image]"`,
            },
          ],
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'extraction du texte" },
      { status: 500 }
    );
  }
}
