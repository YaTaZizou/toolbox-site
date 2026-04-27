import { PDFDocument, degrees } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const action = formData.get("action") as string;

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    if (action === "pivoter") {
      const pagesParam = formData.get("pages") as string;
      const angle = Number(formData.get("angle") || 90);

      const pdf = await PDFDocument.load(buffer);
      const total = pdf.getPageCount();
      const indices = parsePageNumbers(pagesParam, total);
      if (indices.length === 0)
        return NextResponse.json({ error: "Aucune page valide" }, { status: 400 });

      const pages = pdf.getPages();
      for (const idx of indices) {
        const current = pages[idx].getRotation().angle;
        pages[idx].setRotation(degrees((current + angle + 360) % 360));
      }

      const outputBuffer = await pdf.save();
      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="modifie.pdf"` },
      });
    }

    if (action === "supprimer") {
      const pagesParam = formData.get("pages") as string;

      const srcPdf = await PDFDocument.load(buffer);
      const total = srcPdf.getPageCount();
      const toDelete = new Set(parsePageNumbers(pagesParam, total));

      if (toDelete.size === 0)
        return NextResponse.json({ error: "Aucune page valide" }, { status: 400 });
      if (toDelete.size >= total)
        return NextResponse.json({ error: "Impossible de supprimer toutes les pages" }, { status: 400 });

      const keepIndices = Array.from({ length: total }, (_, i) => i).filter((i) => !toDelete.has(i));

      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(srcPdf, keepIndices);
      copied.forEach((p) => newPdf.addPage(p));

      const outputBuffer = await newPdf.save();
      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="modifie.pdf"` },
      });
    }

    if (action === "reorganiser") {
      const orderParam = formData.get("order") as string;

      const srcPdf = await PDFDocument.load(buffer);
      const total = srcPdf.getPageCount();

      const newOrder = (orderParam || "")
        .split(",")
        .map((s) => Number(s.trim()) - 1)
        .filter((n) => n >= 0 && n < total);

      if (newOrder.length === 0)
        return NextResponse.json({ error: "Ordre invalide" }, { status: 400 });

      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(srcPdf, newOrder);
      copied.forEach((p) => newPdf.addPage(p));

      const outputBuffer = await newPdf.save();
      return new Response(outputBuffer.buffer as ArrayBuffer, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="reorganise.pdf"` },
      });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors du traitement" }, { status: 500 });
  }
}

function parsePageNumbers(param: string, total: number): number[] {
  const nums: number[] = [];
  for (const part of (param || "").split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      for (let i = start; i <= Math.min(end, total); i++) nums.push(i - 1);
    } else {
      const n = Number(trimmed);
      if (n >= 1 && n <= total) nums.push(n - 1);
    }
  }
  return [...new Set(nums)];
}
