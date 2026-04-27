import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const FORMATS = ["jpeg", "png", "webp", "avif"] as const;
type Format = (typeof FORMATS)[number];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const format = formData.get("format") as Format | null;
    const qualityRaw = formData.get("quality");
    const quality = qualityRaw ? parseInt(qualityRaw as string) : 80;

    if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    if (!format || !FORMATS.includes(format)) return NextResponse.json({ error: "Format invalide" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    let sharpInstance = sharp(buffer);

    if (format === "jpeg") sharpInstance = sharpInstance.jpeg({ quality });
    else if (format === "png") sharpInstance = sharpInstance.png({ compressionLevel: Math.floor((100 - quality) / 11) });
    else if (format === "webp") sharpInstance = sharpInstance.webp({ quality });
    else if (format === "avif") sharpInstance = sharpInstance.avif({ quality });

    const outputBuffer = await sharpInstance.toBuffer();
    const mimeType = format === "jpeg" ? "image/jpeg" : `image/${format}`;
    const ext = format === "jpeg" ? "jpg" : format;
    const originalName = file.name.replace(/\.[^.]+$/, "");

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${originalName}.${ext}"`,
        "Content-Length": outputBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la conversion" }, { status: 500 });
  }
}
