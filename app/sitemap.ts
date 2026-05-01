import { MetadataRoute } from "next";

const BASE = "https://alltoolbox.fr";

const NOW = new Date().toISOString().slice(0, 10);

const tools: { path: string; priority: number }[] = [
  // PDF (fort trafic)
  { path: "/pdf",                priority: 0.95 },
  { path: "/compresser-pdf",     priority: 0.95 },
  { path: "/pdf-images",         priority: 0.85 },
  { path: "/modifier-pdf",       priority: 0.85 },
  // Images & Médias
  { path: "/image",              priority: 0.9  },
  { path: "/supprimer-fond",     priority: 0.9  },
  { path: "/amelioration-image", priority: 0.85 },
  { path: "/modifier-image",     priority: 0.8  },
  { path: "/gif",                priority: 0.8  },
  { path: "/video",              priority: 0.85 },
  { path: "/audio",              priority: 0.8  },
  { path: "/filigrane",          priority: 0.75 },
  { path: "/convertisseur-lien", priority: 0.85 },
  // Texte & Langue
  { path: "/traducteur",         priority: 0.9  },
  { path: "/correcteur",         priority: 0.85 },
  { path: "/ocr",                priority: 0.85 },
  { path: "/dictionnaire",       priority: 0.8  },
  { path: "/convertir-texte",    priority: 0.75 },
  { path: "/compteur",           priority: 0.75 },
  // Générateurs IA
  { path: "/pseudo",             priority: 0.8  },
  { path: "/bio",                priority: 0.8  },
  { path: "/texte",              priority: 0.8  },
  { path: "/qrcode",             priority: 0.8  },
  { path: "/mot-de-passe",       priority: 0.8  },
  { path: "/hash",               priority: 0.75 },
  // Outils Rapides
  { path: "/unites",             priority: 0.75 },
  { path: "/couleurs",           priority: 0.75 },
  { path: "/formateur-json",     priority: 0.75 },
  // Pages importantes
  { path: "/premium",            priority: 0.85 },
  // Auth (pages publiques indexables)
  { path: "/connexion",          priority: 0.5  },
  { path: "/inscription",        priority: 0.5  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(NOW),
      changeFrequency: "monthly" as const,
      priority,
    })),
    {
      url: `${BASE}/conditions`,
      lastModified: new Date(NOW),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/confidentialite`,
      lastModified: new Date(NOW),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/mentions-legales`,
      lastModified: new Date(NOW),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(NOW),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
