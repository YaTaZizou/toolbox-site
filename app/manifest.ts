import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToolBox — Outils gratuits en ligne",
    short_name: "ToolBox",
    description:
      "Générateurs IA, outils PDF, convertisseurs d'images, traducteur et bien plus. Gratuit, rapide, sans inscription.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#7c3aed",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["utilities", "productivity"],
    lang: "fr",
  };
}
