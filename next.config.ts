import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      // ── Headers appliqués à toutes les routes ──────────────────────────
      {
        source: "/(.*)",
        headers: [
          // SharedArrayBuffer (requis par ffmpeg.wasm)
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          // Empêche le clickjacking (intégration dans une iframe)
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limite les infos de referrer envoyées aux tiers
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Désactive la détection auto de numéros de téléphone sur iOS
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Force HTTPS (HSTS) — activer seulement en production
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Permissions Policy — désactive les APIs inutiles
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
      // ── Service worker — ne jamais mettre en cache ─────────────────────
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
