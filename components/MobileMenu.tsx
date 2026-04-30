"use client";
import { useState } from "react";
import Link from "next/link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        )}
      </button>
      {open && (
        <div
          className="fixed inset-x-0 top-[57px] z-40 border-b p-4 flex flex-col gap-2"
          style={{ background: "var(--bg-2)", borderColor: "var(--tb-border)" }}
        >
          <Link href="/contact" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--text-2)" }}>
            Contact
          </Link>
          <Link href="/premium" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "var(--amber)", background: "var(--amber-soft)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.6l1.2-6.1L3.3 9.3l6.1-.7L12 3z"/></svg>
            Premium
          </Link>
        </div>
      )}
    </div>
  );
}
