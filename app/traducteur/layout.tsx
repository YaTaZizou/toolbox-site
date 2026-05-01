import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Traducteur en ligne gratuit — Traduction IA instantanée",
  description: "Traduisez du texte dans plus de 12 langues grâce à l'IA. Traduction automatique en temps réel, gratuite, sans inscription. Français, anglais, espagnol et plus.",
  alternates: { canonical: "https://alltoolbox.fr/traducteur" },
  openGraph: {
    title: "Traducteur en ligne gratuit — ToolBox",
    description: "Traduisez du texte dans plus de 12 langues grâce à l'IA, en temps réel.",
    url: "https://alltoolbox.fr/traducteur",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Traducteur en ligne — ToolBox", description: "Traduisez du texte dans plus de 12 langues grâce à l'IA, en temps réel." },
};

export default function TraducteurLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Traducteur en ligne gratuit IA — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/traducteur",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Traduisez du texte dans plus de 12 langues grâce à l'IA. Gratuit, sans inscription."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Traducteur IA", "item": "https://alltoolbox.fr/traducteur" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Traducteur en ligne gratuit propulsé par l'IA</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le traducteur ToolBox utilise l'intelligence artificielle pour produire des traductions naturelles et contextuelles dans plus de 12 langues. Contrairement aux traducteurs mot à mot, notre IA comprend le sens des phrases pour rendre des traductions fluides en français, anglais, espagnol, allemand, italien, portugais, japonais, chinois et plus encore.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelles langues sont disponibles ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Le traducteur prend en charge le français, l'anglais, l'espagnol, l'allemand, l'italien, le portugais, le néerlandais, le japonais, le chinois (simplifié), l'arabe, le russe et le coréen. D'autres langues seront ajoutées prochainement.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Y a-t-il une limite de caractères ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Le traducteur gratuit accepte des textes de plusieurs centaines de mots. Pour des documents longs, la version Premium de ToolBox offre des limites étendues.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/correcteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Correcteur</Link>
            <Link href="/dictionnaire" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Dictionnaire</Link>
            <Link href="/ocr" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">OCR — Image en texte</Link>
          </div>
        </div>
      </section>
    </>
  );
}
