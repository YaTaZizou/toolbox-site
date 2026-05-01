import type { Metadata } from "next";
import { Geist, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import { MobileMenu } from "@/components/MobileMenu";
import { SidebarAd, StickyBottomAd } from "@/components/AdBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolTracker } from "@/components/ToolTracker";
import { PwaRegister } from "@/components/PwaRegister";
import { NavPremiumBadge } from "@/components/NavPremiumBadge";
import { PremiumProvider } from "@/components/PremiumProvider";
import { ToolUpsellWrapper } from "@/components/ToolUpsellWrapper";

const geist = Geist({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox — Outils gratuits en ligne" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox — Outils gratuits en ligne",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
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
              "description": "Boîte à outils en ligne gratuite : PDF, IA, images, vidéo, texte. Sans installation, sans inscription forcée."
            })
          }}
        />
      </head>
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen transition-colors duration-300 pb-16 xl:pb-0`}>
        <ThemeProvider>
          <PremiumProvider>
          <PwaRegister />
          <ToolTracker />
          <nav aria-label="Navigation principale" className="tb-nav" style={{
            position: 'sticky', top: 0, zIndex: 50,
            backdropFilter: 'saturate(140%) blur(14px)',
            WebkitBackdropFilter: 'saturate(140%) blur(14px)',
          }}>
            <div style={{
              maxWidth: 1200, margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 28px',
            }}>
              {/* Brand + center links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--text)', textDecoration: 'none', marginRight: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(140deg, #8b5cf6 0%, #7c3aed 60%, #5b21b6 100%)',
                    display: 'grid', placeItems: 'center',
                    boxShadow: '0 6px 20px -6px rgba(124,58,237,0.65), inset 0 1px 0 rgba(255,255,255,0.18)',
                    flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z"/>
                    </svg>
                  </div>
                  ToolBox
                </Link>
                <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 4 }}>
                  <Link href="/contact" className="nav-link-new">
                    Contact
                  </Link>
                  <Link href="/premium" className="nav-link-premium">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.6l1.2-6.1L3.3 9.3l6.1-.7L12 3z"/></svg>
                    Premium
                  </Link>
                </div>
              </div>
              {/* Right side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ThemeToggle />
                <NavPremiumBadge />
                <NavAuth />
                <MobileMenu />
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
          <footer style={{
            marginTop: 80,
            borderTop: '1px solid var(--tb-border)',
            background: 'var(--bg-2)',
          }}>
            <div style={{
              maxWidth: 1200, margin: '0 auto',
              padding: '32px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 16,
            }}>
              {/* Left: brand + copyright */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-3)', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: 'linear-gradient(140deg, #8b5cf6 0%, #7c3aed 60%, #5b21b6 100%)',
                    display: 'grid', placeItems: 'center',
                    boxShadow: '0 6px 20px -6px rgba(124,58,237,0.65), inset 0 1px 0 rgba(255,255,255,0.18)',
                    flexShrink: 0,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z"/>
                    </svg>
                  </div>
                  ToolBox
                </div>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-3)', opacity: 0.6 }} />
                <span>© 2026 — Fait avec attention</span>
              </div>
              {/* Right: links */}
              <div style={{ display: 'flex', gap: 18, fontSize: 13 }}>
                <Link href="/confidentialite" className="footer-link-new">Confidentialité</Link>
                <Link href="/conditions" className="footer-link-new">CGU</Link>
                <Link href="/mentions-legales" className="footer-link-new">Mentions légales</Link>
                <Link href="/contact" className="footer-link-new">Contact</Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
