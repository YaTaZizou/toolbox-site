"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { getBadgeStyle } from "@/lib/badgeStyle";
import { useRecentTools } from "@/hooks/useRecentTools";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const recentTools = useRecentTools();

  const filtered = query.trim().length > 0
    ? tools.filter((t) =>
        t.available &&
        (t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Suggestions de recherche pour le message "aucun résultat"
  const SEARCH_SUGGESTIONS = ["pdf", "image", "texte", "ia", "vidéo"];

  // Raccourci clavier global : "/" ou Ctrl+K / Cmd+K pour focus
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if ((e.key === "/" && !isTyping) || ((e.ctrlKey || e.metaKey) && e.key === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Fermer en cliquant dehors
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Réinitialiser l'index actif quand les résultats changent
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // Scroll l'élément actif dans la vue
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      activeEl?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const items = query.trim() ? filtered : recentTools.slice(0, 3);

      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          const target = items[activeIndex];
          window.location.href = target.href;
          setQuery("");
          setOpen(false);
          setActiveIndex(-1);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
      }
    },
    [open, filtered, recentTools, activeIndex, query]
  );

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

  const showRecent = open && !query.trim() && recentTools.length > 0;
  const showResults = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto mb-14">
      <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 hover:border-gray-500 focus-within:border-purple-500 rounded-2xl px-4 py-3 transition-colors">
        <span className="text-gray-500 text-lg">🔍</span>
        <input
          ref={inputRef}
          type="search"
          aria-label="Rechercher un outil"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un outil... ( / ou ⌘K )"
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
        />
        {/* Badge raccourci visible quand pas de texte */}
        {!query && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-gray-700 text-gray-500 text-xs font-mono leading-none">
              ⌘K
            </kbd>
          </div>
        )}
        {query && (
          <button
            onClick={() => { setQuery(""); setActiveIndex(-1); inputRef.current?.focus(); }}
            aria-label="Effacer la recherche"
            className="text-gray-500 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Historique récent — affiché quand focus sans texte */}
      {showRecent && (
        <div
          id="search-listbox"
          role="listbox"
          aria-label="Outils récents"
          className="absolute top-full mt-2 left-0 right-0 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-50"
        >
          <div className="px-4 pt-3 pb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Récemment utilisés</span>
          </div>
          <div ref={listRef} className="divide-y divide-gray-800">
            {recentTools.slice(0, 3).map((tool, i) => (
              <Link
                key={tool.href}
                href={tool.href}
                id={`search-item-${i}`}
                data-index={i}
                role="option"
                aria-selected={activeIndex === i}
                onClick={() => { setOpen(false); setActiveIndex(-1); }}
                className={`flex items-center gap-4 px-4 py-3 transition-colors group ${
                  activeIndex === i ? "bg-gray-800" : "hover:bg-gray-800"
                }`}
              >
                <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors truncate flex-1">
                  {tool.title}
                </p>
                <span className="text-xs text-gray-600 flex-shrink-0">🕐</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      {showResults && (
        <div
          id="search-listbox"
          role="listbox"
          aria-label="Résultats de recherche"
          aria-live="polite"
          className="absolute top-full mt-2 left-0 right-0 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-50"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-400 text-sm mb-2">
                Aucun outil trouvé pour &quot;<span className="text-white">{query}</span>&quot;
              </p>
              <p className="text-gray-600 text-xs">
                Essaie{" "}
                {SEARCH_SUGGESTIONS.map((s, i) => (
                  <span key={s}>
                    <button
                      onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      &lsquo;{s}&rsquo;
                    </button>
                    {i < SEARCH_SUGGESTIONS.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          ) : (
            <div ref={listRef} className="max-h-80 overflow-y-auto divide-y divide-gray-800">
              {filtered.map((tool, i) => (
                <Link
                  key={tool.href + tool.title}
                  href={tool.href}
                  id={`search-item-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={activeIndex === i}
                  aria-label={`${tool.title} — ${tool.description}`}
                  onClick={() => { setQuery(""); setOpen(false); setActiveIndex(-1); }}
                  className={`flex items-center gap-4 px-4 py-3 transition-colors group ${
                    activeIndex === i ? "bg-gray-800" : "hover:bg-gray-800"
                  }`}
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
                    <span style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 999, fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, ...getBadgeStyle(tool.badgeColor) }}>{tool.badge}</span>
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
