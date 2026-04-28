"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Tool = {
  href: string;
  emoji: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  available: boolean;
  category: string;
  categoryEmoji: string;
};

export function SearchBar({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim().length > 0
    ? tools.filter((t) =>
        t.available &&
        (t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Fermer en cliquant dehors
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function highlight(text: string) {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-400/30 text-white rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto mb-14">
      <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 hover:border-gray-500 focus-within:border-purple-500 rounded-2xl px-4 py-3 transition-colors">
        <span className="text-gray-500 text-lg">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un outil..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="text-gray-500 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Résultats */}
      {open && query.trim() && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-50">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              Aucun outil trouvé pour &quot;{query}&quot;
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-800">
              {filtered.map((tool) => (
                <Link
                  key={tool.href + tool.title}
                  href={tool.href}
                  onClick={() => { setQuery(""); setOpen(false); }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition-colors group"
                >
                  <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors truncate">
                      {highlight(tool.title)}
                    </p>
                    <p className="text-gray-500 text-xs truncate">{highlight(tool.description)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-600">{tool.categoryEmoji} {tool.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                  </div>
                </Link>
              ))}
              <div className="px-4 py-2 text-center text-xs text-gray-600">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
