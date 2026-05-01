import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Correcteur d'Orthographe et Grammaire en ligne — IA gratuit",
  description: "Corrigez l'orthographe, la grammaire et le style de votre texte avec l'IA. Disponible en français, anglais et espagnol. Gratuit, sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/correcteur" },
  openGraph: {
    title: "Correcteur Orthographe et Grammaire — ToolBox",
    description: "Corrigez votre texte avec l'IA : orthographe, grammaire, style.",
    url: "https://alltoolbox.fr/correcteur",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Correcteur IA — ToolBox", description: "Corrigez votre texte avec l'IA : orthographe, grammaire, style." },
};

export default function CorrecteurLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Correcteur orthographe et grammaire IA — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/correcteur",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Correcteur d'orthographe et grammaire en ligne avec IA. Français, anglais, espagnol. Gratuit."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Correcteur de texte IA", "item": "https://alltoolbox.fr/correcteur" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Correcteur d'orthographe et de grammaire en ligne</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le correcteur ToolBox va au-delà de la simple vérification orthographique : il analyse votre texte pour détecter les fautes de grammaire, les erreurs de conjugaison, les anglicismes et les maladresses stylistiques. L'IA propose des corrections contextuelles adaptées au registre de votre texte, qu'il soit formel (rapport, lettre) ou informel (message, post).
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le correcteur fonctionne-t-il en français ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Oui, le français est la langue principale prise en charge. L'outil corrige aussi des textes en anglais, espagnol et d'autres langues européennes avec une grande précision.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Mes textes sont-ils conservés ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Non, vos textes ne sont pas stockés après correction. La confidentialité de vos données est notre priorité.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/traducteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Traducteur</Link>
            <Link href="/dictionnaire" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Dictionnaire</Link>
            <Link href="/compteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Compteur de mots</Link>
          </div>
        </div>
      </section>
    </>
  );
}
