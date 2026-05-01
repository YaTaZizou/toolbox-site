import { PDFDocument } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";
import { isPremiumRequest } from "@/lib/apiAuth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimitAsync(`convertir-pdf:${ip}`, 20);
  if (!allowed) return NextResponse.json({ error: "Limite atteinte. Réessaie plus tard." }, { status: 429 });

  const premium = await isPremiumRequest(req);

  try {
    const formData = await req.formData();
    const action = formData.get("action") as string;

    if (action === "fusionner") {
      const files = formData.getAll("files") as File[];
      if (files.length < 2) return NextResponse.json({ error: "Minimum 2 fichiers PDF requis" }, { status: 400 });

      for (const f of files) {
        if (f.size > MAX_FILE_SIZE) return NextResponse.json({ error: `Fichier trop volumineux (max 50 Mo par fichier)` }, { status: 413 });
        if (f.type !== "application/pdf") return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés." }, { status: 400 });
      }

      if (!premium && files.length > 2)
        return NextResponse.json(
          { error: "Limite gratuite : 2 PDFs max. Passe Premium pour fusionner plus de fichiers." },
          { status: 403 }
        );

      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      const outputBuffer = await mergedPdf.save();
      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="fusion.pdf"` },
      });
    }

    if (action === "image-vers-pdf") {
      const files = formData.getAll("files") as File[];
      if (files.length === 0) return NextResponse.json({ error: "Aucune image reçue" }, { status: 400 });
      for (const f of files) {
        if (f.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 50 Mo)" }, { status: 413 });
      }

      const pdf = await PDFDocument.create();
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const mime = file.type;
        let image;
        if (mime === "image/jpeg" || mime === "image/jpg") image = await pdf.embedJpg(buffer);
        else if (mime === "image/png") image = await pdf.embedPng(buffer);
        else continue;
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const outputBuffer = await pdf.save();
      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="images.pdf"` },
      });
    }

    if (action === "decouper") {
      const file = formData.get("files") as File;
      if (file?.type !== "application/pdf") return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés." }, { status: 400 });
      if (file?.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 50 Mo)" }, { status: 413 });
      const pagesParam = formData.get("pages") as string;
      if (!file || !pagesParam) return NextResponse.json({ error: "Fichier ou pages manquants" }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());
      const srcPdf = await PDFDocument.load(buffer);
      const totalPages = srcPdf.getPageCount();

      const pageNumbers: number[] = [];
      for (const part of pagesParam.split(",")) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [start, end] = trimmed.split("-").map(Number);
          for (let i = start; i <= Math.min(end, totalPages); i++) pageNumbers.push(i - 1);
        } else {
          const n = Number(trimmed);
          if (n >= 1 && n <= totalPages) pageNumbers.push(n - 1);
        }
      }

      if (pageNumbers.length === 0) return NextResponse.json({ error: "Aucune page valide" }, { status: 400 });

      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(srcPdf, pageNumbers);
      copied.forEach((p) => newPdf.addPage(p));
      const outputBuffer = await newPdf.save();

      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="decoupage.pdf"` },
      });
    }

    if (action === "proteger") {
      const file = formData.get("files") as File;
      const password = formData.get("password") as string;
      if (!file || !password) return NextResponse.json({ error: "Fichier ou mot de passe manquant" }, { status: 400 });
      if (file.type !== "application/pdf") return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés." }, { status: 400 });
      if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 50 Mo)" }, { status: 413 });
      if (password.length > 128) return NextResponse.json({ error: "Mot de passe trop long (max 128 caractères)" }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());
      const pdf = await PDFDocument.load(buffer);
      const ownerPassword = crypto.randomUUID() + crypto.randomUUID();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const outputBuffer = await pdf.save({
        userPassword: password,
        ownerPassword,
        permissions: { printing: "lowResolution", copying: false, modifying: false },
      } as any);

      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="protege.pdf"` },
      });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors du traitement" }, { status: 500 });
  }
}
