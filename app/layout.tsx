import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import { SidebarAd, StickyBottomAd } from "@/components/AdBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolTracker } from "@/components/ToolTracker";
import { PwaRegister } from "@/components/PwaRegister";
import { NavPremiumBadge } from "@/components/NavPremiumBadge";
import { PremiumProvider } from "@/components/PremiumProvider";
import { ToolUpsellWrapper } from "@/components/ToolUpsellWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "ToolBox — Outils gratuits en ligne", template: "%s | ToolBox" },
  description: "Générateurs IA, outils PDF, convertisseurs d'images, traducteur et bien plus. Gratuit, rapide, sans inscription.",
  keywords: ["outils en ligne", "générateur IA", "convertisseur PDF", "traducteur", "compresseur image", "gratuit"],
  authors: [{ name: "ToolBox" }],
  metadataBase: new URL("https://alltoolbox.fr"),
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ToolBox",
    title: "ToolBox — Outils gratuits en ligne",
    description: "Générateurs IA, outils PDF, convertisseurs d'images, traducteur et bien plus. Gratuit, rapide, sans inscription.",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox — Outils gratuits en ligne",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9277300744556228"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ToolBox",
              "url": "https://alltoolbox.fr",
              "description": "Boîte à outils en ligne gratuite : PDF, IA, images, vidéo, texte. Sans installation, sans inscription forcée.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://alltoolbox.fr/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen transition-colors duration-300 pb-16 xl:pb-0`}>
        <ThemeProvider>
          <PremiumProvider>
          <PwaRegister />
          <ToolTracker />
          <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group">
                  <span className="text-xl group-hover:scale-110 transition-transform inline-block">⚡</span>
                  <span className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">ToolBox</span>
                </Link>
                <Link href="/contact" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  <span>✉️</span>
                  <span>Contact</span>
                </Link>
                <Link href="/premium" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-semibold">
                  <span>⭐</span>
                  <span>Premium</span>
                </Link>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <ThemeToggle />
                <NavPremiumBadge />
                <NavAuth />
              </div>
            </div>
          </nav>
          <div className="flex justify-center">
            <aside className="hidden xl:flex w-[180px] flex-shrink-0 sticky top-20 self-start h-[calc(100vh-80px)] justify-center overflow-hidden">
              <SidebarAd slot="left" />
            </aside>
            <main className="flex-1 min-w-0 max-w-[900px] pb-16 xl:pb-16">
                <ToolUpsellWrapper>{children}</ToolUpsellWrapper>
              </main>
            <aside className="hidden xl:flex w-[180px] flex-shrink-0 sticky top-20 self-start h-[calc(100vh-80px)] justify-center overflow-hidden">
              <SidebarAd slot="right" />
            </aside>
          </div>
          <StickyBottomAd />
          </PremiumProvider>
          <footer className="border-t border-gray-800/60 mt-24 py-12 text-sm">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>⚡</span>
                  <span className="font-bold text-white">ToolBox</span>
                  <span className="text-gray-600">— Tous vos outils en un seul endroit</span>
                </div>
                <div className="flex flex-wrap justify-center gap-5 text-gray-600">
                  <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
                  <Link href="/mentions-legales" className="hover:text-gray-300 transition-colors">Mentions légales</Link>
                  <Link href="/confidentialite" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
                  <Link href="/conditions" className="hover:text-gray-300 transition-colors">CGU</Link>
                </div>
                <p className="text-gray-700">© 2026 ToolBox</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
