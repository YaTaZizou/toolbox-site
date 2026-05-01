import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur d'Unités en ligne — Distance, Poids, Température",
  description: "Convertissez des distances, poids, températures, vitesses, surfaces et volumes en ligne. Gratuit, instantané, toutes les unités du système métrique et impérial.",
  alternates: { canonical: "https://alltoolbox.fr/unites" },
  openGraph: {
    title: "Convertisseur d'Unités en ligne — ToolBox",
    description: "Convertissez distances, poids, températures et plus encore, gratuitement en ligne.",
    url: "https://alltoolbox.fr/unites",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur d'Unités — ToolBox", description: "Convertissez distances, poids, températures et plus encore, gratuitement en ligne." },
};

export default function UnitesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Convertisseur d'Unités en ligne — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/unites",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Convertissez des distances, poids, températures, vitesses, surfaces et volumes en ligne. Gratuit, instantané, toutes les unités du système métrique et impérial."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Convertisseur d'unités en ligne complet</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le convertisseur d'unités ToolBox couvre toutes les catégories de mesure : longueur (mètres, miles, pieds, pouces), masse (kilos, livres, onces), température (Celsius, Fahrenheit, Kelvin), vitesse (km/h, mph, nœuds), surface (m², acres, hectares) et volume (litres, gallons, pintes). Indispensable pour les voyages aux États-Unis, les recettes de cuisine américaines ou les projets internationaux.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment convertir des miles en kilomètres ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Sélectionnez la catégorie "Distance", entrez la valeur en miles et l'équivalent en kilomètres s'affiche immédiatement. 1 mile = 1,609 km. Toutes les conversions s'effectuent en temps réel.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le convertisseur fonctionne-t-il hors ligne ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Les calculs de conversion sont entièrement réalisés dans votre navigateur. Après le chargement initial de la page, l'outil fonctionne même sans connexion internet.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/compteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Compteur de mots</a>
            <a href="/convertir-texte" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertisseur de texte</a>
          </div>
        </div>
      </section>
    </>
  );
}
