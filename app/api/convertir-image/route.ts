import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";
import { isPremiumRequest } from "@/lib/apiAuth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const FORMATS = ["jpeg", "png", "webp", "avif"] as const;
type Format = (typeof FORMATS)[number];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimitAsync(`convertir-image:${ip}`, 30);
  if (!allowed) return NextResponse.json({ error: "Limite atteinte. Réessaie plus tard." }, { status: 429 });

  const isPremium = await isPremiumRequest(req);
  if (!isPremium) return NextResponse.json({ error: "Cette fonctionnalité est réservée aux abonnés Premium." }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const format = formData.get("format") as Format | null;
    const qualityRaw = formData.get("quality");
    const quality = Math.min(100, Math.max(1, parseInt(qualityRaw as string) || 80));

    if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 20 Mo)" }, { status: 413 });
    if (!format || !FORMATS.includes(format)) return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    const ALLOWED_INPUT_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!ALLOWED_INPUT_MIMES.includes(file.type))
      return NextResponse.json({ error: "Format d'entrée non supporté. Utilisez JPG, PNG, WebP, AVIF ou GIF." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    let sharpInstance = sharp(buffer);

    if (format === "jpeg") sharpInstance = sharpInstance.jpeg({ quality });
    else if (format === "png") sharpInstance = sharpInstance.png({ compressionLevel: Math.floor((100 - quality) / 11) });
    else if (format === "webp") sharpInstance = sharpInstance.webp({ quality });
    else if (format === "avif") sharpInstance = sharpInstance.avif({ quality });

    const outputBuffer = await sharpInstance.toBuffer();
    const mimeType = format === "jpeg" ? "image/jpeg" : `image/${format}`;
    const ext = format === "jpeg" ? "jpg" : format;
    const safeOriginalName = file.name
      .replace(/\.[^.]+$/, "")           // retire l'extension
      .replace(/[^\w\-_.]/g, "_")        // remplace les caractères spéciaux
      .slice(0, 100);                    // limite la longueur

    return new Response(outputBuffer.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${safeOriginalName}.${ext}"`,
        "Content-Length": outputBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la conversion" }, { status: 500 });
  }
}
