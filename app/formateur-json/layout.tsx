import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formateur JSON en ligne — Valider et Indenter du JSON",
  description: "Formatez, minifiez et validez vos fichiers JSON en ligne gratuitement. Indentation automatique, détection d'erreurs, mise en forme colorée. Sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/formateur-json" },
  openGraph: {
    title: "Formateur JSON en ligne — ToolBox",
    description: "Formatez, validez et minifiez votre JSON en ligne. Gratuit et instantané.",
    url: "https://alltoolbox.fr/formateur-json",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Formateur JSON — ToolBox", description: "Formatez, validez et minifiez votre JSON en ligne. Gratuit et instantané." },
};

export default function FormateurJsonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Formateur JSON en ligne — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/formateur-json",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Formatez, minifiez et validez vos fichiers JSON en ligne gratuitement. Indentation automatique, détection d'erreurs, mise en forme colorée. Sans inscription."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Formateur et validateur JSON en ligne</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le formateur JSON de ToolBox est un outil indispensable pour les développeurs. Collez un JSON brut ou minifié et obtenez instantanément une version lisible avec indentation, coloration syntaxique et numéros de lignes. L'outil détecte et signale les erreurs de syntaxe JSON (virgules manquantes, guillemets incorrects, accolades non fermées) avec précision.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment formater un JSON en ligne de commande ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Sur terminal, utilisez <code className="bg-gray-800 px-1 rounded text-xs">cat fichier.json | python -m json.tool</code> ou <code className="bg-gray-800 px-1 rounded text-xs">jq . fichier.json</code>. Pour un usage rapide sans terminal, le formateur ToolBox est plus pratique et ne nécessite aucune installation.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Peut-on minifier un JSON avec cet outil ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, le mode "Minifier" supprime tous les espaces et retours à la ligne pour produire un JSON compact, idéal pour réduire la taille des fichiers de configuration ou des réponses API.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/hash" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de hash</a>
            <a href="/convertir-texte" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertisseur de texte</a>
            <a href="/compteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Compteur de mots</a>
          </div>
        </div>
      </section>
    </>
  );
}
