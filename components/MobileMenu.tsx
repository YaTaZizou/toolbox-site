"use client";
import { useState } from "react";
import Link from "next/link";

const TOOL_LINKS = [
  { href: "/pdf", label: "Outils PDF", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" },
  { href: "/image", label: "Convertir Image", icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" },
  { href: "/traducteur", label: "Traducteur IA", icon: "M3 5h12 M9 3v2 M12 17l4-4-4-4 M8 13h4 M21 21l-6-6" },
  { href: "/qrcode", label: "Générateur QR", icon: "M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h2v2h-2z M19 15h2v2h-2z M15 19h2v2h-2z M19 19h2v2h-2z" },
  { href: "/calculatrice", label: "Calculatrice", icon: "M4 4h16v16H4z M8 8h2v2H8z M14 8h2v2h-2z M8 11h2v2H8z M14 11h2v2h-2z M8 14h2v5H8z M14 14h2v2h-2z" },
  { href: "/generateur-mot-de-passe", label: "Mot de passe", icon: "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z M17 11V7A5 5 0 0 0 7 7v4 M5 11h14a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a1 1 0 0 1 1-1z" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        {open ? (
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        )}
      </button>
      {open && (
        <div
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="fixed inset-x-0 top-[57px] z-40 border-b p-4 flex flex-col gap-1 overflow-y-auto"
          style={{ background: "var(--bg-2)", borderColor: "var(--tb-border)", maxHeight: "calc(100dvh - 57px)" }}
        >
          {/* Outils populaires */}
          <p className="px-4 pt-1 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
            Outils populaires
          </p>
          {TOOL_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: "var(--text-2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icon} />
              </svg>
              {label}
            </Link>
          ))}

          {/* Séparateur */}
          <div className="my-2 mx-4" style={{ height: 1, background: "var(--tb-border)" }} />

          {/* Liens globaux */}
          <Link href="/premium" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "var(--amber)", background: "var(--amber-soft)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.6l1.2-6.1L3.3 9.3l6.1-.7L12 3z"/></svg>
            Premium
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--text-2)" }}>
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}
