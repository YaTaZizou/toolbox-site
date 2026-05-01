import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isPremiumRequest } from "@/lib/apiAuth";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Vérifier auth + premium
  const isPremium = await isPremiumRequest(req);
  if (!isPremium) {
    return NextResponse.json({ error: "Cette fonctionnalité est réservée aux abonnés Premium." }, { status: 403 });
  }

  // Rate limiting
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimitAsync(`amelioration-image:${ip}`, 100);
  if (!allowed) {
    return NextResponse.json({ error: "Limite journalière atteinte. Réessaie demain." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const scale = Math.min(Math.max(parseInt(formData.get("scale") as string) || 2, 1), 4);
  const mode = (formData.get("mode") as string) || "standard";

  if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
  if (!ALLOWED_MIMES.includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté. Utilise JPG, PNG ou WebP." }, { status: 400 });
  }
  const MAX_SIZE = 20 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 20 Mo)" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = sharp(buffer);
  const meta = await image.metadata();

  const MAX_OUTPUT_DIM = 8000;
  const newW = Math.min(Math.round((meta.width || 800) * scale), MAX_OUTPUT_DIM);
  const newH = Math.min(Math.round((meta.height || 600) * scale), MAX_OUTPUT_DIM);

  // Paramètres selon le mode
  const sharpParams = {
    subtil:   { sigma: 0.8, m1: 0.5, m2: 1.0 },
    standard: { sigma: 1.2, m1: 1.2, m2: 1.8 },
    intense:  { sigma: 1.8, m1: 2.0, m2: 3.0 },
  }[mode] ?? { sigma: 1.2, m1: 1.2, m2: 1.8 };

  const saturation = mode === "intense" ? 1.15 : mode === "standard" ? 1.08 : 1.03;

  const result = await image
    .resize(newW, newH, { kernel: "lanczos3", fastShrinkOnLoad: false })
    .sharpen({ sigma: sharpParams.sigma, m1: sharpParams.m1, m2: sharpParams.m2 })
    .modulate({ brightness: 1.02, saturation })
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();

  return new NextResponse(new Uint8Array(result), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="toolbox-enhanced.png"`,
    },
  });
}
