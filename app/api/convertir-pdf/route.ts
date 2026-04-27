import { PDFDocument } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = formData.get("action") as string;

    if (action === "fusionner") {
      const files = formData.getAll("files") as File[];
      if (files.length < 2) return NextResponse.json({ error: "Minimum 2 fichiers PDF requis" }, { status: 400 });

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const outputBuffer = await mergedPdf.save();

      return new NextResponse(new Uint8Array(outputBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="fusion.pdf"`,
          "Content-Length": outputBuffer.length.toString(),
        },
      });
    }

    if (action === "image-vers-pdf") {
      const files = formData.getAll("files") as File[];
      if (files.length === 0) return NextResponse.json({ error: "Aucune image reçue" }, { status: 400 });

      const pdf = await PDFDocument.create();

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const mime = file.type;

        let image;
        if (mime === "image/jpeg" || mime === "image/jpg") {
          image = await pdf.embedJpg(buffer);
        } else if (mime === "image/png") {
          image = await pdf.embedPng(buffer);
        } else {
          continue;
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const outputBuffer = await pdf.save();

      return new NextResponse(new Uint8Array(outputBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="images.pdf"`,
          "Content-Length": outputBuffer.length.toString(),
        },
      });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors du traitement" }, { status: 500 });
  }
}
