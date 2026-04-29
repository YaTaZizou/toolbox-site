import { MetadataRoute } from "next";

const BASE = "https://alltoolbox.fr";

const tools = [
  // Générateurs
  "/pseudo", "/bio", "/texte", "/qrcode", "/mot-de-passe", "/hash",
  // PDF
  "/pdf", "/pdf-images", "/modifier-pdf",
  // Images & Médias
  "/image", "/modifier-image", "/gif", "/video", "/audio",
  "/supprimer-fond", "/amelioration-image", "/filigrane",
  // Texte & Langue
  "/traducteur", "/correcteur", "/dictionnaire",
  "/convertir-texte", "/compteur", "/ocr",
  // Outils Rapides
  "/unites", "/couleurs", "/formateur-json",
  // Pages
  "/premium",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...tools.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
