import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Évite de bundler les packages natifs Node.js dans les Server Components
  serverExternalPackages: ["pdf-lib", "pdfjs-dist"],
  // Améliore le tree-shaking des packages à nombreux exports
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js", "@supabase/ssr", "@stripe/stripe-js"],
  },
  async headers() {
    return [
      // ── Headers de sécurité appliqués à toutes les routes ─────────────
      {
        source: "/(.*)",
        headers: [
          // Empêche le clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limite les infos de referrer envoyées aux tiers
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Protection XSS legacy (IE/Edge)
          { key: "X-XSS-Protection", value: "0" },
          // Force HTTPS (HSTS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Permissions Policy — désactive les APIs non utilisées
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://partner.googleadservices.com https://tpc.googlesyndication.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.resend.com https://api.stripe.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://region1.google-analytics.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://www.googletagmanager.com https://googleads.g.doubleclick.net",
              "worker-src 'self' blob:",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },

      // ── SharedArrayBuffer (requis par ffmpeg.wasm) ─────────────────────
      // COEP/COOP appliqués UNIQUEMENT aux outils qui utilisent ffmpeg
      // (les appliquer globalement casse AdSense et les scripts tiers)
      {
        source: "/video(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
      {
        source: "/audio(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
      {
        source: "/gif(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },

      // ── Assets statiques — cache long terme ───────────────────────────
      {
        source: "/icon-:size.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/google:id.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
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
