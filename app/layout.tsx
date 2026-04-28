import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import { SidebarAd, StickyBottomAd } from "@/components/AdBanner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolBox — Tous vos outils en un seul endroit",
  description: "Générateurs IA, convertisseurs de fichiers et bien plus encore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9277300744556228"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen`}>
        <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl group-hover:scale-110 transition-transform inline-block">⚡</span>
              <span className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">ToolBox</span>
            </Link>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Link href="/premium" className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 font-semibold px-3 py-1.5 rounded-lg transition-all text-xs">
                ⭐ Premium
              </Link>
              <NavAuth />
            </div>
          </div>
        </nav>
        <div className="flex justify-center">
          {/* Pub gauche — visible uniquement sur grands écrans */}
          <aside className="hidden xl:flex w-[180px] flex-shrink-0 sticky top-20 self-start h-[calc(100vh-80px)] justify-center overflow-hidden">
            <SidebarAd slot="left" />
          </aside>

          {/* Contenu principal */}
          <main className="flex-1 min-w-0 max-w-[900px] pb-16">{children}</main>

          {/* Pub droite — visible uniquement sur grands écrans */}
          <aside className="hidden xl:flex w-[180px] flex-shrink-0 sticky top-20 self-start h-[calc(100vh-80px)] justify-center overflow-hidden">
            <SidebarAd slot="right" />
          </aside>
        </div>
        <StickyBottomAd />
        <footer className="border-t border-gray-800/60 mt-24 py-12 text-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <span>⚡</span>
                <span className="font-bold text-white">ToolBox</span>
                <span className="text-gray-600">— Tous vos outils en un seul endroit</span>
              </div>
              <div className="flex flex-wrap justify-center gap-5 text-gray-600">
                <Link href="/mentions-legales" className="hover:text-gray-300 transition-colors">Mentions légales</Link>
                <Link href="/confidentialite" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
                <Link href="/conditions" className="hover:text-gray-300 transition-colors">CGU</Link>
              </div>
              <p className="text-gray-700">© 2026 ToolBox</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
