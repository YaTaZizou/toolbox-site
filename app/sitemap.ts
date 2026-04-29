import { MetadataRoute } from "next";

const BASE = "https://alltoolbox.fr";

const tools: { path: string; date: string; priority: number }[] = [
  // PDF (fort trafic)
  { path: "/pdf",                priority: 0.95, date: "2025-01-15" },
  { path: "/compresser-pdf",     priority: 0.95, date: "2025-04-01" },
  { path: "/pdf-images",         priority: 0.85, date: "2025-01-15" },
  { path: "/modifier-pdf",       priority: 0.85, date: "2025-01-15" },
  // Images & Médias
  { path: "/image",              priority: 0.9,  date: "2025-02-01" },
  { path: "/supprimer-fond",     priority: 0.9,  date: "2025-02-10" },
  { path: "/amelioration-image", priority: 0.85, date: "2025-02-15" },
  { path: "/modifier-image",     priority: 0.8,  date: "2025-02-01" },
  { path: "/gif",                priority: 0.8,  date: "2025-02-01" },
  { path: "/video",              priority: 0.85, date: "2025-02-15" },
  { path: "/audio",              priority: 0.8,  date: "2025-02-15" },
  { path: "/filigrane",          priority: 0.75, date: "2025-03-01" },
  { path: "/convertisseur-lien", priority: 0.85, date: "2025-03-01" },
  // Texte & Langue
  { path: "/traducteur",         priority: 0.9,  date: "2025-01-15" },
  { path: "/correcteur",         priority: 0.85, date: "2025-01-15" },
  { path: "/ocr",                priority: 0.85, date: "2025-02-01" },
  { path: "/dictionnaire",       priority: 0.8,  date: "2025-02-01" },
  { path: "/convertir-texte",    priority: 0.75, date: "2025-02-01" },
  { path: "/compteur",           priority: 0.75, date: "2025-02-01" },
  // Générateurs IA
  { path: "/pseudo",             priority: 0.8,  date: "2025-01-15" },
  { path: "/bio",                priority: 0.8,  date: "2025-01-15" },
  { path: "/texte",              priority: 0.8,  date: "2025-01-15" },
  { path: "/qrcode",             priority: 0.8,  date: "2025-02-01" },
  { path: "/mot-de-passe",       priority: 0.8,  date: "2025-02-01" },
  { path: "/hash",               priority: 0.75, date: "2025-02-01" },
  // Outils Rapides
  { path: "/unites",             priority: 0.75, date: "2025-02-01" },
  { path: "/couleurs",           priority: 0.75, date: "2025-02-01" },
  { path: "/formateur-json",     priority: 0.75, date: "2025-02-01" },
  // Pages importantes
  { path: "/premium",            priority: 0.7,  date: "2025-01-10" },
  { path: "/contact",            priority: 0.5,  date: "2025-03-01" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date("2025-04-01"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map(({ path, date, priority }) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(date),
      changeFrequency: "monthly" as const,
      priority,
    })),
  ];
}
