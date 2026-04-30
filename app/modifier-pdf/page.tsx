"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const RENDER_SCALE = 2.5;
const FONT_SIZES = [10, 12, 14, 16, 18, 24, 32, 48];
const COLORS = [
  { hex: "#000000", label: "Noir" },
  { hex: "#ffffff", label: "Blanc" },
  { hex: "#ef4444", label: "Rouge" },
  { hex: "#3b82f6", label: "Bleu" },
  { hex: "#22c55e", label: "Vert" },
  { hex: "#f59e0b", label: "Jaune" },
  { hex: "#a855f7", label: "Violet" },
  { hex: "#f97316", label: "Orange" },
];

type TextBox = { id: string; pageIndex: number; x: number; y: number; text: string; fontSize: number; color: string; };
type ImageBox = { id: string; pageIndex: number; x: number; y: number; width: number; height: number; dataUrl: string; };
type ExtractedText = {
  id: string; pageIndex: number;
  x: number; y: number; width: number; height: number;
  pdfX: number; pdfY: number; pdfWidth: number; pdfFontSize: number;
  originalText: string; editedText: string;
  isEdited: boolean; isDeleted: boolean;
};
type PageData = { dataUrl: string; width: number; height: number; pdfWidth: number; pdfHeight: number; };
type Tab = "editor" | "pages";
type PageAction = "pivoter" | "supprimer" | "reorganiser";
type DragState = { id: string; kind: "text" | "image"; startX: number; startY: number; origX: number; origY: number; };
type ResizeState = { id: string; startX: number; startY: number; origW: number; origH: number; };

export default function ModifierPdfPage() {
  const [tab, setTab] = useState<Tab>("editor");
  const [file, setFile] = useState<File | null>(null);
  const [renderedPages, setRenderedPages] = useState<PageData[]>([]);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [imageBoxes, setImageBoxes] = useState<ImageBox[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([]);
  const [editingExtId, setEditingExtId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [rendering, setRendering] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgTargetPage, setImgTargetPage] = useState(0);
  const [pageAction, setPageAction] = useState<PageAction>("pivoter");
  const [pages, setPages] = useState("");
  const [angle, setAngle] = useState(90);
  const [order, setOrder] = useState("");
  const [pgLoading, setPgLoading] = useState(false);
  const [pgError, setPgError] = useState("");
  const [pgDone, setPgDone] = useState(false);

  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  // ── Load PDF + extract text positions ─────────────────────────────────
  async function loadPdf(f: File) {
    setFile(f);
    setRenderedPages([]); setTextBoxes([]); setImageBoxes([]); setExtractedTexts([]);
    setRendering(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const buf = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const resultPages: PageData[] = [];
      const allTexts: ExtractedText[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: RENDER_SCALE });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        const pageData: PageData = {
          dataUrl: canvas.toDataURL("image/png"),
          width: vp.width, height: vp.height,
          pdfWidth: vp.width / RENDER_SCALE,
          pdfHeight: vp.height / RENDER_SCALE,
        };
        resultPages.push(pageData);

        // Extract text with positions
        const tc = await page.getTextContent();
        const pageIndex = i - 1;
        (tc.items as any[]).forEach((item, idx) => {
          if (!item.str?.trim()) return;
          const pdfX = item.transform[4];
          const pdfY = item.transform[5];
          const pdfFontSize = item.height > 0 ? item.height : Math.abs(item.transform[3]) || 12;
          const pdfWidth = item.width > 0 ? item.width : pdfFontSize * item.str.length * 0.55;
          const canvasX = pdfX * RENDER_SCALE;
          const canvasBaselineY = (pageData.pdfHeight - pdfY) * RENDER_SCALE;
          const canvasFontSize = pdfFontSize * RENDER_SCALE;
          allTexts.push({
            id: `et_${pageIndex}_${idx}`,
            pageIndex,
            x: canvasX,
            y: canvasBaselineY - canvasFontSize * 1.15,
            width: Math.max(pdfWidth * RENDER_SCALE, 20),
            height: canvasFontSize * 1.4,
            pdfX, pdfY, pdfWidth, pdfFontSize,
            originalText: item.str, editedText: item.str,
            isEdited: false, isDeleted: false,
          });
        });
      }
      setRenderedPages(resultPages);
      setExtractedTexts(allTexts);
    } catch (e) { console.error(e); }
    finally { setRendering(false); }
  }

  // ── Extracted text editing ─────────────────────────────────────────────
  function startEditExt(id: string) {
    setEditingId(null);
    setEditingExtId(id);
  }
  function confirmEditExt(id: string) {
    setExtractedTexts(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, isEdited: t.editedText !== t.originalText && !t.isDeleted };
    }));
    setEditingExtId(null);
  }
  function cancelEditExt(id: string) {
    setExtractedTexts(prev => prev.map(t => t.id === id ? { ...t, editedText: t.originalText } : t));
    setEditingExtId(null);
  }
  function updateExtText(id: string, value: string) {
    setExtractedTexts(prev => prev.map(t => t.id === id ? { ...t, editedText: value } : t));
  }
  function deleteExtText(id: string) {
    setExtractedTexts(prev => prev.map(t => t.id === id ? { ...t, isDeleted: true, editedText: "" } : t));
    setEditingExtId(null);
  }
  function restoreExtText(id: string) {
    setExtractedTexts(prev => prev.map(t => t.id === id
      ? { ...t, editedText: t.originalText, isEdited: false, isDeleted: false } : t));
  }

  // ── New text boxes ─────────────────────────────────────────────────────
  function handlePageClick(e: React.MouseEvent<HTMLDivElement>, pageIndex: number) {
    if (dragRef.current || resizeRef.current) return;
    if (editingExtId) { confirmEditExt(editingExtId); return; }
    if (editingId) { finalizeEditing(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const id = `tb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setTextBoxes(prev => [...prev, { id, pageIndex, x: e.clientX - rect.left, y: e.clientY - rect.top, text: "", fontSize, color }]);
    setEditingId(id);
  }
  function updateText(id: string, text: string) {
    setTextBoxes(prev => prev.map(b => b.id === id ? { ...b, text } : b));
  }
  function deleteBox(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setTextBoxes(prev => prev.filter(b => b.id !== id));
    if (editingId === id) setEditingId(null);
  }
  function finalizeEditing() {
    if (!editingId) return;
    const box = textBoxes.find(b => b.id === editingId);
    if (box && !box.text.trim()) setTextBoxes(prev => prev.filter(b => b.id !== editingId));
    setEditingId(null);
  }

  // ── Image boxes ────────────────────────────────────────────────────────
  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const pd = renderedPages[imgTargetPage]; if (!pd) return;
        const maxW = Math.min(pd.width * 0.5, 250);
        const w = maxW; const h = maxW * (img.height / img.width);
        const id = `img_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        setImageBoxes(prev => [...prev, { id, pageIndex: imgTargetPage, x: (pd.width - w) / 2, y: (pd.height - h) / 2, width: w, height: h, dataUrl }]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  }
  function deleteImageBox(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setImageBoxes(prev => prev.filter(b => b.id !== id));
  }

  // ── Drag ───────────────────────────────────────────────────────────────
  function onDragStart(e: React.MouseEvent, id: string, kind: "text" | "image") {
    e.stopPropagation(); e.preventDefault();
    const box = kind === "text" ? textBoxes.find(b => b.id === id) : imageBoxes.find(b => b.id === id);
    if (!box) return;
    dragRef.current = { id, kind, startX: e.clientX, startY: e.clientY, origX: box.x, origY: box.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX, dy = ev.clientY - dragRef.current.startY;
      if (dragRef.current.kind === "text")
        setTextBoxes(prev => prev.map(b => b.id === dragRef.current!.id ? { ...b, x: dragRef.current!.origX + dx, y: dragRef.current!.origY + dy } : b));
      else
        setImageBoxes(prev => prev.map(b => b.id === dragRef.current!.id ? { ...b, x: dragRef.current!.origX + dx, y: dragRef.current!.origY + dy } : b));
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  }

  // ── Resize ─────────────────────────────────────────────────────────────
  function onResizeStart(e: React.MouseEvent, id: string) {
    e.stopPropagation(); e.preventDefault();
    const box = imageBoxes.find(b => b.id === id); if (!box) return;
    resizeRef.current = { id, startX: e.clientX, startY: e.clientY, origW: box.width, origH: box.height };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const dx = ev.clientX - resizeRef.current.startX, dy = ev.clientY - resizeRef.current.startY;
      setImageBoxes(prev => prev.map(b => b.id === resizeRef.current!.id ? { ...b, width: Math.max(40, resizeRef.current!.origW + dx), height: Math.max(40, resizeRef.current!.origH + dy) } : b));
    };
    const onUp = () => { resizeRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  }

  // ── Save PDF ───────────────────────────────────────────────────────────
  async function saveWithText() {
    if (!file) return;
    setSaving(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pdfPages = pdfDoc.getPages();

      // 1) Apply existing-text edits/deletions
      for (const et of extractedTexts) {
        if (!et.isEdited && !et.isDeleted) continue;
        const pg = pdfPages[et.pageIndex];
        pg.drawRectangle({
          x: et.pdfX - 1,
          y: et.pdfY - et.pdfFontSize * 0.3,
          width: et.pdfWidth + 2,
          height: et.pdfFontSize * 1.5,
          color: rgb(1, 1, 1),
          borderWidth: 0,
        });
        if (!et.isDeleted && et.editedText.trim()) {
          pg.drawText(et.editedText, {
            x: et.pdfX, y: et.pdfY,
            size: Math.max(6, et.pdfFontSize),
            font, color: rgb(0, 0, 0),
          });
        }
      }

      // 2) Insert images
      for (const imgBox of imageBoxes) {
        const pg = pdfPages[imgBox.pageIndex];
        const pd = renderedPages[imgBox.pageIndex];
        const resp = await fetch(imgBox.dataUrl);
        const bytes = await resp.arrayBuffer();
        const embeddedImg = imgBox.dataUrl.startsWith("data:image/png")
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);
        pg.drawImage(embeddedImg, {
          x: Math.max(0, imgBox.x / RENDER_SCALE),
          y: Math.max(0, pd.pdfHeight - (imgBox.y / RENDER_SCALE) - (imgBox.height / RENDER_SCALE)),
          width: imgBox.width / RENDER_SCALE,
          height: imgBox.height / RENDER_SCALE,
        });
      }

      // 3) New text boxes
      for (const box of textBoxes) {
        if (!box.text.trim()) continue;
        const pg = pdfPages[box.pageIndex];
        const pd = renderedPages[box.pageIndex];
        const pdfFontSize = box.fontSize / RENDER_SCALE;
        const r = parseInt(box.color.slice(1, 3), 16) / 255;
        const g = parseInt(box.color.slice(3, 5), 16) / 255;
        const b = parseInt(box.color.slice(5, 7), 16) / 255;
        pg.drawText(box.text, {
          x: Math.max(0, box.x / RENDER_SCALE),
          y: Math.max(0, pd.pdfHeight - (box.y / RENDER_SCALE) - pdfFontSize),
          size: Math.max(6, pdfFontSize), font, color: rgb(r, g, b),
        });
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "toolbox-modifie.pdf"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  // ── Page management ────────────────────────────────────────────────────
  async function managePage() {
    if (!file) return;
    setPgLoading(true); setPgError(""); setPgDone(false);
    try {
      const form = new FormData();
      form.append("file", file); form.append("action", pageAction);
      if (pageAction === "pivoter") { form.append("pages", pages); form.append("angle", String(angle)); }
      if (pageAction === "supprimer") form.append("pages", pages);
      if (pageAction === "reorganiser") form.append("order", order);
      const res = await fetch("/api/modifier-pdf", { method: "POST", body: form });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "toolbox-pages.pdf"; a.click();
      URL.revokeObjectURL(url);
      setPgDone(true);
    } catch (e: unknown) {
      setPgError(e instanceof Error ? e.message : "Erreur");
    } finally { setPgLoading(false); }
  }

  const extChanges = extractedTexts.filter(et => et.isEdited || et.isDeleted).length;
  const hasContent = textBoxes.filter(b => b.text.trim()).length > 0 || imageBoxes.length > 0 || extChanges > 0;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📝</span>
          <h1 className="text-3xl font-bold">Modifier un PDF</h1>
        </div>
        <p className="text-gray-400">Modifie le texte existant, ajoute du texte, des images, ou gère les pages.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[{ id: "editor" as Tab, emoji: "✏️", label: "Éditeur" }, { id: "pages" as Tab, emoji: "📄", label: "Gestion des pages" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-3 rounded-xl font-semibold text-sm transition-colors border ${tab === t.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600"}`}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Upload */}
      {!file || renderedPages.length === 0 ? (
        <div onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") loadPdf(f); }}
          className="border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-2xl p-12 text-center cursor-pointer transition-colors">
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadPdf(f); }} />
          {rendering ? (
            <div>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-300">Chargement + extraction du texte…</p>
            </div>
          ) : (
            <div>
              <p className="text-5xl mb-3">📄</p>
              <p className="text-gray-300 font-medium">Glisse ton PDF ici</p>
              <p className="text-gray-600 text-sm mt-1">ou clique pour parcourir</p>
            </div>
          )}
        </div>
      ) : tab === "editor" ? (

        /* ══════════════ ÉDITEUR ══════════════ */
        <div>
          <input ref={imgFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageFile} />

          {/* Toolbar */}
          <div className="sticky top-16 z-30 bg-gray-950/95 backdrop-blur border border-gray-800 rounded-2xl p-3 mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Taille</span>
              <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none">
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Couleur</span>
              <div className="flex gap-1">
                {COLORS.map(c => (
                  <button key={c.hex} title={c.label} onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full transition-all border ${color === c.hex ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-125" : "border-gray-600"}`} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {renderedPages.length > 1 && (
                <select value={imgTargetPage} onChange={e => setImgTargetPage(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none">
                  {renderedPages.map((_, i) => <option key={i} value={i}>Page {i + 1}</option>)}
                </select>
              )}
              <button onClick={() => imgFileRef.current?.click()}
                className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                Image
              </button>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {extChanges > 0 && (
                <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-lg">
                  {extChanges} modif. texte
                </span>
              )}
              <button onClick={() => { setFile(null); setRenderedPages([]); setTextBoxes([]); setImageBoxes([]); setExtractedTexts([]); }}
                className="text-xs text-gray-500 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
                Nouveau PDF
              </button>
              <button onClick={saveWithText} disabled={saving || !hasContent}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors">
                {saving ? "Sauvegarde…" : "⬇ Télécharger PDF"}
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <span className="text-gray-500 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded border border-blue-400/50 bg-blue-500/5" />
              Survole le texte du PDF pour le sélectionner
            </span>
            <span className="text-gray-500 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-amber-200/80 border border-amber-400/40" />
              Texte modifié
            </span>
            <span className="text-gray-500 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-red-500/20 border border-red-500/40 border-dashed" />
              Texte supprimé
            </span>
            <span className="text-gray-500">· Clique sur zone vide → nouveau texte</span>
          </div>

          {/* Pages */}
          <div className="space-y-6">
            {renderedPages.map((pd, pageIndex) => (
              <div key={pageIndex} className="flex flex-col items-center">
                <p className="text-xs text-gray-600 mb-2">Page {pageIndex + 1}</p>
                <div
                  className="relative shadow-2xl rounded overflow-hidden select-none"
                  style={{ width: pd.width, maxWidth: "100%", cursor: "crosshair" }}
                  onClick={e => handlePageClick(e, pageIndex)}
                >
                  {/* PDF background */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pd.dataUrl} alt={`Page ${pageIndex + 1}`} className="w-full block" draggable={false} />

                  {/* ── Extracted text overlays ── */}
                  {extractedTexts.filter(et => et.pageIndex === pageIndex).map(et => {
                    const isEditing = editingExtId === et.id;
                    return (
                      <div
                        key={et.id}
                        className="absolute"
                        style={{ left: et.x, top: et.y, width: et.width, height: et.height, zIndex: isEditing ? 25 : 5 }}
                        onClick={e => { e.stopPropagation(); if (!et.isDeleted) startEditExt(et.id); }}
                      >
                        {/* Normal: transparent, hover shows outline */}
                        {!isEditing && !et.isEdited && !et.isDeleted && (
                          <div className="w-full h-full rounded cursor-text transition-all hover:ring-1 hover:ring-blue-400/60 hover:bg-blue-500/5" />
                        )}

                        {/* Deleted */}
                        {et.isDeleted && (
                          <div className="w-full h-full flex items-center justify-center cursor-pointer"
                            style={{ background: "rgba(239,68,68,0.15)", border: "1px dashed rgba(239,68,68,0.6)", borderRadius: 2 }}
                            onClick={e => { e.stopPropagation(); restoreExtText(et.id); }}
                            title="Cliquer pour restaurer">
                            <span style={{ fontSize: 9, color: "rgba(239,68,68,0.9)", fontWeight: 600 }}>↩</span>
                          </div>
                        )}

                        {/* Edited (confirmed) — covers original text */}
                        {et.isEdited && !et.isDeleted && !isEditing && (
                          <div className="w-full h-full cursor-text overflow-hidden"
                            style={{ background: "rgb(255,253,200)", border: "1px solid rgba(234,179,8,0.5)", borderRadius: 2, display: "flex", alignItems: "center" }}>
                            <span style={{ fontSize: et.height * 0.6, fontFamily: "Helvetica, Arial, sans-serif", color: "#000", paddingLeft: 2, whiteSpace: "nowrap" }}>
                              {et.editedText}
                            </span>
                          </div>
                        )}

                        {/* Editing */}
                        {isEditing && (
                          <>
                            <input
                              autoFocus
                              value={et.editedText}
                              onChange={e => updateExtText(et.id, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") confirmEditExt(et.id);
                                if (e.key === "Escape") cancelEditExt(et.id);
                              }}
                              onClick={e => e.stopPropagation()}
                              style={{
                                width: "100%", height: "100%", boxSizing: "border-box",
                                fontSize: et.height * 0.6,
                                fontFamily: "Helvetica, Arial, sans-serif",
                                color: "#000", background: "white",
                                border: "2px solid #3b82f6", borderRadius: 2,
                                padding: "1px 3px", outline: "none",
                              }}
                            />
                            {/* Mini toolbar */}
                            <div
                              style={{
                                position: "absolute", top: -28, left: 0,
                                display: "flex", gap: 3, alignItems: "center",
                                background: "#1e293b", border: "1px solid #334155",
                                borderRadius: 6, padding: "3px 6px", whiteSpace: "nowrap", zIndex: 30,
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              <button onClick={() => confirmEditExt(et.id)}
                                style={{ background: "#22c55e", color: "white", border: "none", borderRadius: 4, padding: "2px 7px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                                ✓ OK
                              </button>
                              <button onClick={() => cancelEditExt(et.id)}
                                style={{ background: "#475569", color: "white", border: "none", borderRadius: 4, padding: "2px 7px", fontSize: 11, cursor: "pointer" }}>
                                ↩
                              </button>
                              <button onClick={() => deleteExtText(et.id)}
                                style={{ background: "#ef4444", color: "white", border: "none", borderRadius: 4, padding: "2px 7px", fontSize: 11, cursor: "pointer" }}>
                                🗑
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* ── Image boxes ── */}
                  {imageBoxes.filter(b => b.pageIndex === pageIndex).map(imgBox => (
                    <div key={imgBox.id} className="absolute group"
                      style={{ left: imgBox.x, top: imgBox.y, width: imgBox.width, height: imgBox.height, zIndex: 10 }}
                      onClick={e => e.stopPropagation()}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgBox.dataUrl} alt="insérée" className="w-full h-full object-fill block" draggable={false} />
                      <div className="absolute -top-5 left-0 cursor-grab bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        onMouseDown={e => onDragStart(e, imgBox.id, "image")}>⠿</div>
                      <button onClick={e => deleteImageBox(e, imgBox.id)}
                        className="absolute -top-5 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(139,92,246,0.8)", borderRadius: "3px 0 4px 0" }}
                        onMouseDown={e => onResizeStart(e, imgBox.id)} />
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/60 rounded pointer-events-none transition-colors" />
                    </div>
                  ))}

                  {/* ── New text boxes ── */}
                  {textBoxes.filter(b => b.pageIndex === pageIndex).map(box => (
                    <div key={box.id} className="absolute group"
                      style={{ left: box.x, top: box.y, zIndex: editingId === box.id ? 20 : 15 }}
                      onClick={e => { e.stopPropagation(); setEditingId(box.id); }}>
                      <div className="absolute -top-5 -left-1 cursor-grab bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none"
                        onMouseDown={e => onDragStart(e, box.id, "text")}>⠿</div>
                      {editingId === box.id ? (
                        <input autoFocus value={box.text}
                          onChange={e => updateText(box.id, e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") finalizeEditing(); if (e.key === "Escape") deleteBox(e as unknown as React.MouseEvent, box.id); }}
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: box.fontSize, color: box.color, minWidth: 120 }}
                          className="bg-white/10 border border-blue-400 rounded px-1 outline-none text-white backdrop-blur-sm"
                          placeholder="Tape ton texte…" />
                      ) : (
                        <span style={{ fontSize: box.fontSize, color: box.color, whiteSpace: "nowrap" }}
                          className="block cursor-text px-1 border border-transparent hover:border-blue-400/50 rounded">
                          {box.text || <span className="opacity-30 italic text-sm">vide</span>}
                        </span>
                      )}
                      <button onClick={e => deleteBox(e, box.id)}
                        className="absolute -top-5 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : (
        /* ══════════════ GESTION DES PAGES ══════════════ */
        <div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[{ value: "pivoter" as PageAction, emoji: "🔄", label: "Pivoter" }, { value: "supprimer" as PageAction, emoji: "🗑️", label: "Supprimer" }, { value: "reorganiser" as PageAction, emoji: "🔀", label: "Réorganiser" }].map(t => (
              <button key={t.value} onClick={() => { setPageAction(t.value); setPgDone(false); setPgError(""); }}
                className={`py-3 rounded-xl text-sm font-medium transition-colors border ${pageAction === t.value ? "border-red-500 bg-red-500/10 text-red-400" : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600"}`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          {pageAction === "pivoter" && (
            <div className="space-y-3 mb-4">
              <input type="text" value={pages} onChange={e => setPages(e.target.value)}
                placeholder="Pages à pivoter (ex: 1,3,5-8 ou vide pour tout)"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm" />
              <div className="flex gap-2">
                {[90, 180, 270].map(a => (
                  <button key={a} onClick={() => setAngle(a)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${angle === a ? "border-red-500 bg-red-500/10 text-red-400" : "border-gray-800 bg-gray-900 text-gray-400"}`}>
                    {a}°
                  </button>
                ))}
              </div>
            </div>
          )}
          {pageAction === "supprimer" && (
            <input type="text" value={pages} onChange={e => setPages(e.target.value)}
              placeholder="Pages à supprimer (ex: 2, 4, 6-8)"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm mb-4" />
          )}
          {pageAction === "reorganiser" && (
            <div className="space-y-2 mb-4">
              <input type="text" value={order} onChange={e => setOrder(e.target.value)}
                placeholder="Nouvel ordre (ex: 3,1,2,4)"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm" />
              <p className="text-xs text-gray-600">Indique le numéro de chaque page dans l&apos;ordre voulu.</p>
            </div>
          )}
          <button onClick={managePage} disabled={pgLoading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors">
            {pgLoading ? "Traitement…" : "⬇ Télécharger le PDF modifié"}
          </button>
          {pgDone && <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 mt-4 text-sm text-center">✓ Téléchargement démarré !</div>}
          {pgError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mt-4 text-sm">{pgError}</div>}
          <button onClick={() => { setFile(null); setRenderedPages([]); }}
            className="mt-3 text-xs text-gray-600 hover:text-gray-400 w-full text-center">
            Charger un autre PDF
          </button>
        </div>
      )}
    </div>
  );
}
