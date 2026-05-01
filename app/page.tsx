"use client";

import Link from "next/link";
import { useState } from "react";
import { AdBanner } from "@/components/AdBanner";
import { SearchBar } from "@/components/SearchBar";
import { RecentTools } from "@/components/RecentTools";
import FilterBar from "@/components/FilterBar";
import { getBadgeStyle } from "@/lib/badgeStyle";

type Tool = {
  href: string;
  emoji: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  available: boolean;
};

type Category = {
  id: string;
  emoji: string;
  title: string;
  cardClass: string;
  titleColor: string;
  borderColor: string;
  bgColor: string;
  // new design tokens
  iconBg: string;
  iconColor: string;
  catIconBg: string;
  catIconColor: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    id: "pdf",
    emoji: "📄",
    title: "Outils PDF",
    cardClass: "card-red",
    titleColor: "text-red-400",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/5",
    iconBg: "rgba(244, 63, 94, 0.12)",
    iconColor: "#f43f5e",
    catIconBg: "rgba(244, 63, 94, 0.12)",
    catIconColor: "#f43f5e",
    tools: [
      { href: "/pdf?tab=fusionner", emoji: "🔗", title: "Fusionner des PDFs", description: "Combine plusieurs PDFs en un seul fichier.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/pdf?tab=image-vers-pdf", emoji: "🖼️", title: "Images → PDF", description: "Convertis tes JPG/PNG en fichier PDF.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/pdf?tab=decouper", emoji: "✂️", title: "Découper un PDF", description: "Extrait des pages spécifiques d'un PDF.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/pdf?tab=proteger", emoji: "🔒", title: "Protéger un PDF", description: "Ajoute un mot de passe à ton PDF.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/pdf-images", emoji: "📸", title: "PDF → Images", description: "Convertis chaque page d'un PDF en image.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/modifier-pdf", emoji: "📝", title: "Modifier un PDF", description: "Pivote, supprime ou réorganise les pages.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/compresser-pdf", emoji: "🗜️", title: "Compresser un PDF", description: "Réduis la taille de tes PDFs jusqu'à 80%.", badge: "Gratuit", badgeColor: "free", available: true },
    ],
  },
  {
    id: "ia",
    emoji: "🤖",
    title: "Générateurs",
    cardClass: "card-purple",
    titleColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/5",
    iconBg: "rgba(124, 58, 237, 0.14)",
    iconColor: "#a78bfa",
    catIconBg: "rgba(124, 58, 237, 0.14)",
    catIconColor: "#a78bfa",
    tools: [
      { href: "/pseudo", emoji: "🎭", title: "Générateur de Pseudo", description: "Pseudos uniques pour gaming, réseaux sociaux, streaming...", badge: "IA", badgeColor: "ai", available: true },
      { href: "/bio", emoji: "✍️", title: "Générateur de Bio", description: "Bio percutante pour Instagram, TikTok, LinkedIn...", badge: "IA", badgeColor: "ai", available: true },
      { href: "/texte", emoji: "📝", title: "Générateur de Texte", description: "Posts, emails, descriptions, accroches...", badge: "IA", badgeColor: "ai", available: true },
      { href: "/logo", emoji: "🎨", title: "Générateur de Logo", description: "Crée un logo unique avec l'IA en quelques secondes.", badge: "Bientôt", badgeColor: "soon", available: false },
      { href: "/qrcode", emoji: "📱", title: "Générateur de QR Code", description: "Crée un QR code pour n'importe quel lien ou texte.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/mot-de-passe", emoji: "🔑", title: "Générateur de Mot de Passe", description: "Génère des mots de passe sécurisés.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/hash", emoji: "🔐", title: "Générateur de Hash", description: "MD5, SHA-256, SHA-512 de n'importe quel texte", badge: "Gratuit", badgeColor: "free", available: true },
    ],
  },
  {
    id: "media",
    emoji: "🖼️",
    title: "Images & Médias",
    cardClass: "card-orange",
    titleColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    iconBg: "rgba(245, 158, 11, 0.12)",
    iconColor: "#f59e0b",
    catIconBg: "rgba(245, 158, 11, 0.12)",
    catIconColor: "#f59e0b",
    tools: [
      { href: "/image", emoji: "🔄", title: "Convertisseur d'Images", description: "JPG, PNG, WebP, AVIF + compression.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/modifier-image", emoji: "✏️", title: "Modifier une Image", description: "Redimensionne, pivote ou retourne.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/gif", emoji: "🎞️", title: "Créateur de GIF", description: "Crée des GIFs animés depuis tes images.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/video", emoji: "🎬", title: "Convertisseur Vidéo", description: "Convertis et compresse tes vidéos MP4, WebM, MOV...", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/supprimer-fond", emoji: "✂️", title: "Suppression de Fond", description: "Supprime le fond de tes images avec l'IA.", badge: "IA", badgeColor: "ai", available: true },
      { href: "/audio", emoji: "🎵", title: "Convertisseur Audio", description: "Convertis en MP3, WAV, OGG, FLAC, OPUS...", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/amelioration-image", emoji: "✨", title: "Amélioration d'Image", description: "Augmente la résolution jusqu'à 4× avec l'IA.", badge: "⭐ Premium", badgeColor: "premium", available: true },
      { href: "/filigrane", emoji: "🖊️", title: "Ajout de Filigrane", description: "Protège tes images avec un filigrane personnalisé.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/convertisseur-lien", emoji: "⬇️", title: "Téléchargeur de Vidéos", description: "YouTube, TikTok, Instagram, X — télécharge en MP4 ou MP3.", badge: "Gratuit", badgeColor: "free", available: true },
    ],
  },
  {
    id: "texte",
    emoji: "📝",
    title: "Texte & Langue",
    cardClass: "card-blue",
    titleColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    iconBg: "rgba(59, 130, 246, 0.12)",
    iconColor: "#60a5fa",
    catIconBg: "rgba(59, 130, 246, 0.12)",
    catIconColor: "#60a5fa",
    tools: [
      { href: "/traducteur", emoji: "🌍", title: "Traducteur", description: "Traduis dans plus de 12 langues grâce à l'IA.", badge: "IA", badgeColor: "ai", available: true },
      { href: "/correcteur", emoji: "✅", title: "Correcteur de Texte", description: "Corrige orthographe, grammaire et style.", badge: "IA", badgeColor: "ai", available: true },
      { href: "/dictionnaire", emoji: "📖", title: "Dictionnaire", description: "Définitions, synonymes et antonymes.", badge: "IA", badgeColor: "ai", available: true },
      { href: "/convertir-texte", emoji: "🔡", title: "Convertisseur de Texte", description: "Majuscules, slug, camelCase et plus.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/compteur", emoji: "📊", title: "Compteur de Mots", description: "Mots, caractères, temps de lecture.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/ocr", emoji: "🔍", title: "OCR — Image en Texte", description: "Extrait le texte de n'importe quelle image.", badge: "IA", badgeColor: "ai", available: true },
    ],
  },
  {
    id: "utils",
    emoji: "⚡",
    title: "Outils Rapides",
    cardClass: "card-orange",
    titleColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    iconBg: "rgba(251, 146, 60, 0.12)",
    iconColor: "#fb923c",
    catIconBg: "rgba(251, 146, 60, 0.12)",
    catIconColor: "#fb923c",
    tools: [
      { href: "/unites", emoji: "📏", title: "Convertisseur d'Unités", description: "Distance, poids, température, vitesse...", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/couleurs", emoji: "🎨", title: "Palette de Couleurs", description: "Génère des palettes harmonieuses.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/formateur-json", emoji: "{ }", title: "Formateur JSON", description: "Formate, minifie et valide tes données JSON.", badge: "Gratuit", badgeColor: "free", available: true },
      { href: "/lien", emoji: "🔗", title: "Raccourcisseur de Lien", description: "Raccourcis tes URLs en un clic.", badge: "Bientôt", badgeColor: "soon", available: false },
    ],
  },
];

// Sort: available first, then alphabetical
function sortTools(tools: Tool[]): Tool[] {
  return [...tools].sort((a, b) => {
    if (a.available && !b.available) return -1;
    if (!a.available && b.available) return 1;
    return a.title.localeCompare(b.title, "fr", { sensitivity: "base" });
  });
}

categories.forEach((cat) => {
  cat.tools = sortTools(cat.tools);
});

const allTools = categories.flatMap((cat) =>
  cat.tools.map((tool) => ({
    ...tool,
    category: cat.title,
    categoryEmoji: cat.emoji,
  }))
);

const totalAvailable = categories.reduce(
  (acc, cat) => acc + cat.tools.filter((t) => t.available).length,
  0
);

const categoryCounts: Record<string, number> = {};
categories.forEach((cat) => {
  categoryCounts[cat.id] = cat.tools.filter((t) => t.available).length;
});

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>

      {/* ── Hero ── */}
      <section style={{
        position: "relative",
        padding: "96px 0 56px",
        textAlign: "center",
      }}>
        {/* Halo effects */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 720,
            height: 480,
            background: "radial-gradient(closest-side, rgba(124,58,237,0.32), rgba(124,58,237,0) 70%)",
            filter: "blur(20px)",
          }} />
          <div style={{
            position: "absolute",
            top: 240,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1100,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)",
            opacity: 0.5,
          }} />
        </div>

        {/* Pill badge */}
        <div className="animate-fade-in" style={{ marginBottom: 22, position: "relative" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px 6px 8px",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            background: "linear-gradient(180deg, rgba(124,58,237,0.12), rgba(124,58,237,0.04))",
            borderRadius: 999,
            fontSize: 12.5,
            color: "var(--primary-2)",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#c4b5fd",
              boxShadow: "0 0 10px #a78bfa",
              display: "inline-block",
            }} />
            {totalAvailable} outils disponibles — sans inscription
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              background: "rgba(124,58,237,0.25)",
              color: "#ddd6fe",
              padding: "2px 7px",
              borderRadius: 999,
              marginLeft: 4,
            }}>v2.4</span>
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 600,
            fontSize: "clamp(44px, 6.4vw, 80px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            margin: "0 auto 18px",
            maxWidth: "14ch",
            position: "relative",
          }}
        >
          Tous vos outils en{" "}
          <span style={{
            background: "linear-gradient(180deg, #c4b5fd 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            un seul endroit
          </span>
        </h1>

        <p
          className="animate-fade-in-up"
          style={{
            color: "var(--text-2)",
            fontSize: 17,
            lineHeight: 1.55,
            maxWidth: "56ch",
            margin: "0 auto",
            position: "relative",
          }}
        >
          PDF, IA, images, vidéo, texte — sans installation,
          sans inscription forcée, sans filigrane.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up"
          style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap", position: "relative" }}
        >
          <Link
            href="/pdf"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 22px",
              borderRadius: 10,
              fontSize: 14.5,
              fontWeight: 600,
              background: "var(--tb-primary)",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 0 0 1px rgba(124,58,237,0.6), 0 10px 30px -10px rgba(124,58,237,0.7)",
              transition: "transform .12s, box-shadow .15s, background .15s",
            }}
          >
            Essayer un outil
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
            </svg>
          </Link>
          <button
            aria-label="Aller à la barre de recherche"
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="recherch" i], input[placeholder*="outil" i]');
              if (el) el.focus();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 22px",
              borderRadius: 10,
              fontSize: 14.5,
              fontWeight: 600,
              background: "var(--panel)",
              color: "var(--text)",
              border: "1px solid var(--border-strong)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "transform .12s, background .15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            Rechercher
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: "var(--text-3)",
              padding: "2px 6px",
              border: "1px solid var(--border-strong)",
              borderRadius: 5,
            }}>⌘K</span>
          </button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in"
          style={{ display: "flex", justifyContent: "center", gap: 56, marginTop: 48, flexWrap: "wrap", position: "relative" }}
        >
          {[
            { value: `${totalAvailable}`, suffix: "+", label: "Outils gratuits" },
            { value: "100%", suffix: "", label: "en ligne, aucune install" },
            { value: "Gratuit", suffix: "", label: "sans inscription forcée" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: 0,
              }}>
                {stat.value}
                {stat.suffix && <span style={{ color: "var(--text-3)", fontSize: 20, marginLeft: 2 }}>{stat.suffix}</span>}
              </p>
              <p style={{
                fontSize: 11.5,
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginTop: 4,
              }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Search bar ── */}
      <SearchBar tools={allTools} />

      {/* ── Recent tools ── */}
      <RecentTools />

      {/* ── Filter bar ── */}
      <div style={{ paddingTop: 40 }}>
        <FilterBar
          categoryCounts={categoryCounts}
          onFilter={setActiveFilter}
        />
      </div>

      {/* ── Categories ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        {categories.map((cat, catIdx) => {
          const isVisible = activeFilter === "all" || activeFilter === cat.id;
          return (
            <div
              key={cat.id}
              id={`cat-${cat.id}`}
              style={{
                scrollMarginTop: 80,
                display: isVisible ? undefined : "none",
              }}
            >
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: `${catIdx * 80 + 300}ms` }}
              >
                {/* Cat head */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    display: "grid", placeItems: "center",
                    flexShrink: 0,
                    background: cat.catIconBg,
                    color: cat.catIconColor,
                    fontSize: 16,
                  }}>
                    {cat.emoji}
                  </div>
                  <h2 style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    color: "var(--text)",
                  }}>{cat.title}</h2>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11,
                    color: "var(--text-3)",
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid var(--tb-border)",
                  }}>
                    {cat.tools.filter((t) => t.available).length} outils
                  </span>
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: "linear-gradient(90deg, var(--tb-border), transparent)",
                    marginLeft: 4,
                  }} />
                </div>

                {/* Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                }}
                className="tool-grid"
                >
                  {cat.tools.map((tool, toolIdx) =>
                    tool.available ? (
                      <Link key={tool.href + tool.title} href={tool.href} style={{ textDecoration: "none", display: "flex", height: "100%" }}>
                        <div
                          className="tool-card animate-fade-in-up"
                          style={{
                            position: "relative",
                            background: "var(--panel)",
                            border: "1px solid var(--tb-border)",
                            borderRadius: 12,
                            padding: 18,
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 144,
                            flex: 1,
                            transition: "transform .15s ease, border-color .15s, background .15s",
                            animationDelay: `${catIdx * 80 + toolIdx * 40 + 350}ms`,
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.borderColor = "var(--border-strong)";
                            el.style.transform = "translateY(-2px)";
                            el.style.background = "var(--panel-2)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.borderColor = "var(--tb-border)";
                            el.style.transform = "translateY(0)";
                            el.style.background = "var(--panel)";
                          }}
                        >
                          {/* Card top */}
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 9,
                              display: "grid", placeItems: "center",
                              flexShrink: 0,
                              background: cat.iconBg,
                              color: cat.iconColor,
                              fontSize: 18,
                            }}>
                              {tool.emoji}
                            </div>
                            <span style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: 10.5,
                              fontWeight: 500,
                              padding: "3px 8px",
                              borderRadius: 999,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              whiteSpace: "nowrap",
                              ...getBadgeStyle(tool.badgeColor),
                            }}>
                              {tool.badge}
                            </span>
                          </div>
                          <h3 style={{
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            fontSize: 15,
                            fontWeight: 600,
                            letterSpacing: "-0.005em",
                            color: "var(--text)",
                            margin: "0 0 6px",
                            lineHeight: 1.25,
                          }}>
                            {tool.title}
                          </h3>
                          <p style={{
                            fontSize: 12.5,
                            color: "var(--text-3)",
                            lineHeight: 1.5,
                            margin: 0,
                          }}>
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={tool.href + tool.title}
                        aria-disabled="true"
                        aria-label={`${tool.title} — bientôt disponible`}
                        style={{
                          position: "relative",
                          background: "var(--panel)",
                          border: "1px solid var(--tb-border)",
                          borderRadius: 12,
                          padding: 18,
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 144,
                          opacity: 0.35,
                          cursor: "not-allowed",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 9,
                            display: "grid", placeItems: "center",
                            flexShrink: 0,
                            background: cat.iconBg,
                            color: cat.iconColor,
                            fontSize: 18,
                          }}>
                            {tool.emoji}
                          </div>
                          <span style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 10.5,
                            fontWeight: 500,
                            padding: "3px 8px",
                            borderRadius: 999,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            whiteSpace: "nowrap",
                            ...getBadgeStyle(tool.badgeColor),
                          }}>
                            {tool.badge}
                          </span>
                        </div>
                        <h3 style={{
                          fontFamily: '"Space Grotesk", system-ui, sans-serif',
                          fontSize: 15,
                          fontWeight: 600,
                          letterSpacing: "-0.005em",
                          color: "var(--text-3)",
                          margin: "0 0 6px",
                          lineHeight: 1.25,
                        }}>
                          {tool.title}
                        </h3>
                        <p style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5, margin: 0 }}>
                          {tool.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Upsell Premium inline — after 2nd category */}
              {catIdx === 1 && (
                <div className="max-w-4xl mx-auto px-4 my-6">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">⭐</span>
                      <div>
                        <p className="font-bold text-white text-lg">ToolBox Premium — 3,99€/mois</p>
                        <p className="text-gray-400 text-sm">IA illimitée · Zéro publicité · Tous les outils · Annulable à tout moment</p>
                      </div>
                    </div>
                    <a
                      href="/premium"
                      aria-label="Découvrir ToolBox Premium"
                      className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      Découvrir →
                    </a>
                  </div>
                </div>
              )}

              {/* Ad after category 2 and 4 (index 1 and 3) */}
              {(catIdx === 1 || catIdx === 3) && <AdBanner />}
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1000px) { .tool-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 720px)  { .tool-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .tool-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
