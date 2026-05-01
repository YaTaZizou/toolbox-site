import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compteur de Mots et Caractères en ligne — Gratuit",
  description: "Comptez les mots, caractères, phrases et estimez le temps de lecture de votre texte. Gratuit, instantané, idéal pour les rédacteurs et étudiants.",
  alternates: { canonical: "https://alltoolbox.fr/compteur" },
  openGraph: {
    title: "Compteur de Mots en ligne — ToolBox",
    description: "Comptez les mots, caractères et estimez le temps de lecture de votre texte.",
    url: "https://alltoolbox.fr/compteur",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Compteur de Mots — ToolBox", description: "Comptez les mots, caractères et estimez le temps de lecture de votre texte." },
};

export default function CompteurLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Compteur de Mots et Caractères — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/compteur",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Comptez les mots, caractères, phrases et estimez le temps de lecture de votre texte. Gratuit, instantané, idéal pour les rédacteurs et étudiants."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Compteur de mots et caractères en ligne</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le compteur de mots ToolBox analyse votre texte en temps réel et affiche le nombre de mots, caractères (avec et sans espaces), paragraphes et phrases. Il estime également le temps de lecture moyen, utile pour calibrer des articles de blog, des dissertations ou des posts sur les réseaux sociaux avec une limite de caractères.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">À quoi sert de compter les mots ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Les rédacteurs web vérifient la longueur de leurs articles pour le SEO (800-1500 mots recommandés). Les étudiants contrôlent leurs dissertations. Les réseaux sociaux imposent des limites : Twitter/X (280 caractères), Instagram (2200 caractères), LinkedIn (3000 caractères).
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le compteur fonctionne-t-il en temps réel ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, les statistiques se mettent à jour instantanément à chaque frappe de clavier. Collez ou saisissez votre texte et les résultats s'affichent immédiatement.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/correcteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Correcteur</a>
            <a href="/convertir-texte" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertisseur de texte</a>
          </div>
        </div>
      </section>
    </>
  );
}
