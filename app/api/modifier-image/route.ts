import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ────────────────────────────────────────────────────
    const premium = await isPremiumRequest(req);
    if (!premium) {
      const ip = getClientIp(req);
      const { allowed } = await checkRateLimitAsync(`modifier-image:${ip}`, 20);
      if (!allowed) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Passe Premium pour un accès illimité." },
          { status: 429 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const action = formData.get("action") as string;

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!ALLOWED_MIMES.includes(file.type))
      return NextResponse.json({ error: "Format non supporté. Utilisez JPG, PNG, WebP, GIF ou AVIF." }, { status: 400 });
    const mime = file.type;
    const ext = mime === "image/jpeg" ? "jpg" : (mime.split("/")[1] || "jpg");

    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 20 Mo)" }, { status: 413 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let pipeline = sharp(buffer);

    if (action === "redimensionner") {
      const MAX_DIM = 8000;
      const rawWidth = formData.get("width") ? Number(formData.get("width")) : undefined;
      const rawHeight = formData.get("height") ? Number(formData.get("height")) : undefined;
      const width = rawWidth ? Math.min(Math.max(1, rawWidth), MAX_DIM) : undefined;
      const height = rawHeight ? Math.min(Math.max(1, rawHeight), MAX_DIM) : undefined;
      const keepRatio = formData.get("keepRatio") === "true";
      if (!width && !height)
        return NextResponse.json({ error: "Largeur ou hauteur requise" }, { status: 400 });
      pipeline = pipeline.resize(width || null, height || null, {
        fit: keepRatio ? "inside" : "fill",
        withoutEnlargement: false,
      });
    } else if (action === "pivoter") {
      const angle = Number(formData.get("angle") || 90);
      pipeline = pipeline.rotate(angle);
    } else if (action === "retourner") {
      const direction = formData.get("direction") as string;
      pipeline = direction === "horizontal" ? pipeline.flop() : pipeline.flip();
    } else {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const outputBuffer = await pipeline.toBuffer();
    return new Response(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="modifie.${ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors du traitement" }, { status: 500 });
  }
}
