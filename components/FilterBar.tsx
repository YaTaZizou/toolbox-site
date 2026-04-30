"use client";

import { useState } from "react";

type FilterItem = {
  label: string;
  value: string;
  count: number;
};

const filters: FilterItem[] = [
  { label: "Tout afficher", value: "all", count: 0 },
  { label: "PDF", value: "pdf", count: 0 },
  { label: "Images & Médias", value: "media", count: 0 },
  { label: "Générateurs", value: "ia", count: 0 },
  { label: "Texte & Langue", value: "texte", count: 0 },
  { label: "Outils Rapides", value: "utils", count: 0 },
];

type FilterBarProps = {
  categoryCounts: Record<string, number>;
  onFilter: (value: string) => void;
};

export default function FilterBar({ categoryCounts, onFilter }: FilterBarProps) {
  const [active, setActive] = useState("all");

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  function handleClick(value: string) {
    setActive(value);
    onFilter(value);
    if (value === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(`cat-${value}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function getCount(value: string): number {
    if (value === "all") return totalCount;
    return categoryCounts[value] ?? 0;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 40,
        overflowX: "auto",
        paddingBottom: 4,
        flexWrap: "wrap",
      }}
    >
      {filters.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => handleClick(f.value)}
            aria-pressed={active === f.value}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              background: isActive ? "rgba(124,58,237,0.15)" : "var(--panel)",
              border: `1px solid ${isActive ? "rgba(124,58,237,0.45)" : "var(--tb-border)"}`,
              borderRadius: 999,
              fontSize: 13,
              color: isActive ? "#ddd6fe" : "var(--text-2)",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all .15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--tb-border)";
              }
            }}
          >
            {f.label}
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: isActive ? "#c4b5fd" : "var(--text-3)",
                padding: "1px 6px",
                borderRadius: 999,
                background: isActive ? "rgba(124,58,237,0.2)" : "var(--bg-2)",
                border: `1px solid ${isActive ? "rgba(124,58,237,0.35)" : "var(--tb-border)"}`,
              }}
            >
              {getCount(f.value)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
