import { MetadataRoute } from "next";

const BASE = "https://alltoolbox.fr";

const tools = [
  "/pseudo", "/bio", "/texte",
  "/pdf", "/pdf-images", "/modifier-pdf",
  "/image", "/modifier-image", "/gif", "/video", "/audio",
  "/supprimer-fond", "/amelioration-image",
  "/traducteur", "/correcteur", "/dictionnaire",
  "/convertir-texte", "/compteur",
  "/qrcode", "/mot-de-passe", "/unites", "/couleurs",
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
