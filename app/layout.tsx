import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import { SidebarAd } from "@/components/AdBanner";

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
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
              ⚡ ToolBox
            </Link>
            <div className="flex items-center gap-5 text-sm text-gray-400">
              <Link href="/pseudo" className="hover:text-white transition-colors hidden md:block">Pseudo</Link>
              <Link href="/bio" className="hover:text-white transition-colors hidden md:block">Bio</Link>
              <Link href="/texte" className="hover:text-white transition-colors hidden md:block">Texte IA</Link>
              <Link href="/image" className="hover:text-white transition-colors hidden md:block">Images</Link>
              <Link href="/pdf" className="hover:text-white transition-colors hidden md:block">PDF</Link>
              <Link href="/premium" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
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
          <main className="flex-1 min-w-0 max-w-[900px]">{children}</main>

          {/* Pub droite — visible uniquement sur grands écrans */}
          <aside className="hidden xl:flex w-[180px] flex-shrink-0 sticky top-20 self-start h-[calc(100vh-80px)] justify-center overflow-hidden">
            <SidebarAd slot="right" />
          </aside>
        </div>
        <footer className="border-t border-gray-800 mt-20 py-10 text-center text-gray-600 text-sm">
          <div className="flex flex-wrap justify-center gap-6 mb-4 text-gray-500">
            <Link href="/mentions-legales" className="hover:text-gray-300 transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-gray-300 transition-colors">Politique de confidentialité</Link>
            <Link href="/conditions" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</Link>
          </div>
          <p>© 2026 ToolBox — Tous vos outils en un seul endroit</p>
        </footer>
      </body>
    </html>
  );
}
