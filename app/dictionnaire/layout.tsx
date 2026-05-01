import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dictionnaire en ligne — Définitions, Synonymes, Antonymes",
  description: "Trouvez la définition, les synonymes et les antonymes de n'importe quel mot grâce à l'IA. Dictionnaire français et multilingue gratuit en ligne.",
  alternates: { canonical: "https://alltoolbox.fr/dictionnaire" },
  openGraph: {
    title: "Dictionnaire en ligne gratuit — ToolBox",
    description: "Définitions, synonymes et antonymes de n'importe quel mot, propulsés par l'IA.",
    url: "https://alltoolbox.fr/dictionnaire",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Dictionnaire en ligne — ToolBox", description: "Définitions, synonymes et antonymes de n'importe quel mot, propulsés par l'IA." },
};

export default function DictionnaireLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Dictionnaire en ligne gratuit IA",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/dictionnaire",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Définitions, synonymes et antonymes de n'importe quel mot, propulsés par l'IA."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Dictionnaire en ligne propulsé par l'IA</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le dictionnaire ToolBox vous fournit des définitions précises, des exemples d'utilisation en contexte, des synonymes pour enrichir votre vocabulaire et des antonymes pour nuancer votre expression. Grâce à l'IA, les résultats sont plus complets et contextuels qu'un dictionnaire traditionnel — parfait pour l'écriture, les révisions scolaires ou l'apprentissage du français.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je chercher des expressions et locutions ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Oui, l'IA comprend les expressions figées, les locutions verbales et les termes argotiques. Entrez l'expression complète pour obtenir sa définition et son usage courant.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le dictionnaire couvre-t-il d'autres langues ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Le dictionnaire fonctionne principalement en français, mais l'IA peut aussi définir des mots en anglais, espagnol, allemand et d'autres langues courantes.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/correcteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Correcteur</a>
            <a href="/traducteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Traducteur</a>
            <a href="/compteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Compteur de mots</a>
          </div>
        </div>
      </section>
    </>
  );
}
