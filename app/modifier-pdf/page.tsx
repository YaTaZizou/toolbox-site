"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

const RENDER_SCALE = 1.5;

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

type TextBox = {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
};

type PageData = {
  dataUrl: string;
  width: number;
  height: number;
  pdfWidth: number;
  pdfHeight: number;
};

type Tab = "editor" | "pages";
type PageAction = "pivoter" | "supprimer" | "reorganiser";

export default function ModifierPdfPage() {
  const [tab, setTab] = useState<Tab>("editor");
  const [file, setFile] = useState<File | null>(null);
  const [renderedPages, setRenderedPages] = useState<PageData[]>([]);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [rendering, setRendering] = useState(false);
  const [saving, setSaving] = useState(false);

  // Page management tab state
  const [pageAction, setPageAction] = useState<PageAction>("pivoter");
  const [pages, setPages] = useState("");
  const [angle, setAngle] = useState(90);
  const [order, setOrder] = useState("");
  const [pgLoading, setPgLoading] = useState(false);
  const [pgError, setPgError] = useState("");
  const [pgDone, setPgDone] = useState(false);

  // Drag state
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  async function loadPdf(f: File) {
    setFile(f);
    setRenderedPages([]);
    setTextBoxes([]);
    setRendering(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const buf = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const result: PageData[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: RENDER_SCALE });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        result.push({
          dataUrl: canvas.toDataURL("image/jpeg", 0.92),
          width: vp.width,
          height: vp.height,
          pdfWidth: vp.width / RENDER_SCALE,
          pdfHeight: vp.height / RENDER_SCALE,
        });
      }
      setRenderedPages(result);
    } catch (e) {
      console.error(e);
    } finally {
      setRendering(false);
    }
  }

  function handlePageClick(e: React.MouseEvent<HTMLDivElement>, pageIndex: number) {
    if (dragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = `tb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setTextBoxes(prev => [...prev, { id, pageIndex, x, y, text: "", fontSize, color }]);
    setEditingId(id);
  }

  function handleBoxClick(e: React.MouseEvent, id: string) {
    e.stopPropagation();
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
    if (box && !box.text.trim()) {
      setTextBoxes(prev => prev.filter(b => b.id !== editingId));
    }
    setEditingId(null);
  }

  // Drag handlers
  function onDragStart(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    const box = textBoxes.find(b => b.id === id);
    if (!box) return;
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, origX: box.x, origY: box.y };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setTextBoxes(prev =>
        prev.map(b => b.id === dragRef.current!.id
          ? { ...b, x: dragRef.current!.origX + dx, y: dragRef.current!.origY + dy }
          : b
        )
      );
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  async function saveWithText() {
    if (!file) return;
    setSaving(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pdfPages = pdfDoc.getPages();

      for (const box of textBoxes) {
        if (!box.text.trim()) continue;
        const pg = pdfPages[box.pageIndex];
        const pd = renderedPages[box.pageIndex];
        const pdfFontSize = box.fontSize / RENDER_SCALE;
        const pdfX = box.x / RENDER_SCALE;
        const pdfY = pd.pdfHeight - (box.y / RENDER_SCALE) - pdfFontSize;
        const r = parseInt(box.color.slice(1, 3), 16) / 255;
        const g = parseInt(box.color.slice(3, 5), 16) / 255;
        const b = parseInt(box.color.slice(5, 7), 16) / 255;
        pg.drawText(box.text, {
          x: Math.max(0, pdfX),
          y: Math.max(0, pdfY),
          size: Math.max(6, pdfFontSize),
          font,
          color: rgb(r, g, b),
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

  // ── Page management (existing logic) ──
  async function managePage() {
    if (!file) return;
    setPgLoading(true); setPgError(""); setPgDone(false);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("action", pageAction);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📝</span>
          <h1 className="text-3xl font-bold">Modifier un PDF</h1>
        </div>
        <p className="text-gray-400">Ajoute du texte sur ton PDF ou gère les pages.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[
          { id: "editor" as Tab, emoji: "✏️", label: "Éditeur de texte" },
          { id: "pages" as Tab, emoji: "📄", label: "Gestion des pages" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-3 rounded-xl font-semibold text-sm transition-colors border ${
              tab === t.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600"
            }`}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── Upload ── */}
      {!file || renderedPages.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") loadPdf(f); }}
          className="border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-2xl p-12 text-center cursor-pointer transition-colors"
        >
          <input ref={fileRef} type="file" accept=".pdf" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadPdf(f); }} />
          {rendering ? (
            <div>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-300">Chargement du PDF...</p>
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
        /* ══════════════ ÉDITEUR DE TEXTE ══════════════ */
        <div>
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
                  <button key={c.hex} title={c.label}
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full transition-all border ${
                      color === c.hex ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-125" : "border-gray-600"
                    }`} />
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-600">{textBoxes.filter(b => b.text.trim()).length} texte(s)</span>
              <button onClick={() => { setFile(null); setRenderedPages([]); setTextBoxes([]); }}
                className="text-xs text-gray-500 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
                Nouveau PDF
              </button>
              <button onClick={saveWithText} disabled={saving || textBoxes.filter(b => b.text.trim()).length === 0}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors">
                {saving ? "Sauvegarde..." : "⬇ Télécharger PDF"}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-4 text-center">
            💡 Clique sur la page pour ajouter du texte · Glisse le <span className="text-gray-400">⠿</span> pour déplacer · Clique hors du texte pour valider
          </p>

          {/* Pages rendues */}
          <div className="space-y-6">
            {renderedPages.map((pd, pageIndex) => (
              <div key={pageIndex} className="flex flex-col items-center">
                <p className="text-xs text-gray-600 mb-2">Page {pageIndex + 1}</p>
                <div
                  ref={el => { pageRefs.current[pageIndex] = el; }}
                  className="relative cursor-crosshair shadow-2xl rounded overflow-hidden"
                  style={{ width: pd.width, maxWidth: "100%" }}
                  onClick={e => {
                    if (editingId) { finalizeEditing(); return; }
                    handlePageClick(e, pageIndex);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pd.dataUrl} alt={`Page ${pageIndex + 1}`} className="w-full block select-none" draggable={false} />

                  {/* Text boxes for this page */}
                  {textBoxes.filter(b => b.pageIndex === pageIndex).map(box => (
                    <div
                      key={box.id}
                      className="absolute group"
                      style={{ left: box.x, top: box.y, zIndex: editingId === box.id ? 20 : 10 }}
                      onClick={e => handleBoxClick(e, box.id)}
                    >
                      {/* Drag handle */}
                      <div
                        className="absolute -top-5 -left-1 cursor-grab active:cursor-grabbing bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none flex items-center gap-1"
                        onMouseDown={e => onDragStart(e, box.id)}
                      >
                        ⠿
                      </div>

                      {editingId === box.id ? (
                        <input
                          autoFocus
                          value={box.text}
                          onChange={e => updateText(box.id, e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") finalizeEditing(); if (e.key === "Escape") { deleteBox(e as unknown as React.MouseEvent, box.id); } }}
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: box.fontSize, color: box.color, minWidth: 120 }}
                          className="bg-white/10 border border-blue-400 rounded px-1 outline-none text-white backdrop-blur-sm"
                          placeholder="Tape ton texte..."
                        />
                      ) : (
                        <span
                          style={{ fontSize: box.fontSize, color: box.color, whiteSpace: "nowrap" }}
                          className="block cursor-text px-1 border border-transparent hover:border-blue-400/50 rounded"
                        >
                          {box.text || <span className="opacity-30 italic text-sm">vide</span>}
                        </span>
                      )}

                      {/* Delete */}
                      <button
                        onClick={e => deleteBox(e, box.id)}
                        className="absolute -top-5 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
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
            {[
              { value: "pivoter" as PageAction, emoji: "🔄", label: "Pivoter" },
              { value: "supprimer" as PageAction, emoji: "🗑️", label: "Supprimer" },
              { value: "reorganiser" as PageAction, emoji: "🔀", label: "Réorganiser" },
            ].map(t => (
              <button key={t.value} onClick={() => { setPageAction(t.value); setPgDone(false); setPgError(""); }}
                className={`py-3 rounded-xl text-sm font-medium transition-colors border ${
                  pageAction === t.value ? "border-red-500 bg-red-500/10 text-red-400" : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600"
                }`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {pageAction === "pivoter" && (
            <div className="space-y-3 mb-4">
              <input type="text" value={pages} onChange={e => setPages(e.target.value)}
                placeholder="Pages à pivoter (ex: 1,3,5-8 ou laisse vide pour tout)"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm" />
              <div className="flex gap-2">
                {[90, 180, 270].map(a => (
                  <button key={a} onClick={() => setAngle(a)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                      angle === a ? "border-red-500 bg-red-500/10 text-red-400" : "border-gray-800 bg-gray-900 text-gray-400"
                    }`}>
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
            {pgLoading ? "Traitement..." : "⬇ Télécharger le PDF modifié"}
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
