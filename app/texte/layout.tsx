import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Texte IA en ligne — Posts, Emails, Descriptions",
  description: "Générez des posts réseaux sociaux, emails, descriptions produit et accroches publicitaires avec l'IA. Rédaction professionnelle en quelques secondes. Gratuit.",
  alternates: { canonical: "https://alltoolbox.fr/texte" },
  openGraph: {
    title: "Générateur de Texte IA — ToolBox",
    description: "Générez des posts, emails et descriptions professionnels avec l'IA en secondes.",
    url: "https://alltoolbox.fr/texte",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Générateur de Texte IA — ToolBox", description: "Générez des posts, emails et descriptions professionnels avec l'IA en secondes." },
};

export default function TexteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Générateur de texte IA gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/texte",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Générez posts, emails et descriptions produit en quelques secondes grâce à l'IA."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de texte IA pour tous vos besoins</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le générateur de texte IA de ToolBox vous aide à rédiger rapidement du contenu de qualité : posts Instagram et LinkedIn, emails professionnels, fiches produits pour e-commerce, accroches publicitaires, slogans, articles de blog et bien plus. Décrivez simplement ce dont vous avez besoin et l'IA produit un texte structuré et prêt à l'emploi.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quels types de contenus peut-on générer ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Posts réseaux sociaux, emails de prospection, descriptions de produits, biographies, communiqués de presse, scripts vidéo, titres SEO, meta descriptions et textes publicitaires. Précisez le ton (formel, décontracté, persuasif) pour des résultats adaptés.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le texte généré est-il unique ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, chaque génération produit un texte original. Vous pouvez relancer la génération autant de fois que nécessaire pour obtenir des variantes différentes.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/bio" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de bio</a>
            <a href="/pseudo" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de pseudo</a>
            <a href="/correcteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Correcteur</a>
          </div>
        </div>
      </section>
    </>
  );
}
