import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette de Couleurs en ligne — Générateur Harmonieux Gratuit",
  description: "Générez des palettes de couleurs harmonieuses : monochromatique, analogique, complémentaire, triadique. Codes HEX, RGB, HSL. Gratuit pour designers et développeurs.",
  alternates: { canonical: "https://alltoolbox.fr/couleurs" },
  openGraph: {
    title: "Palette de Couleurs — ToolBox",
    description: "Générez des palettes harmonieuses avec codes HEX, RGB et HSL. Gratuit.",
    url: "https://alltoolbox.fr/couleurs",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Palette de Couleurs — ToolBox", description: "Générez des palettes harmonieuses avec codes HEX, RGB et HSL. Gratuit." },
};

export default function CouleursLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Palette de Couleurs — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/couleurs",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Générez des palettes de couleurs harmonieuses : monochromatique, analogique, complémentaire, triadique. Codes HEX, RGB, HSL. Gratuit pour designers et développeurs."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de palette de couleurs pour designers</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Créez des palettes de couleurs cohérentes et esthétiques pour vos projets web, graphiques ou de branding. Le générateur ToolBox propose des harmonies monochromatiques, analogiques, complémentaires, triadiques et tétraédiques. Chaque couleur est disponible en code HEX, RGB et HSL — copiez en un clic pour l'utiliser dans votre CSS ou votre outil de design.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelle harmonie de couleurs choisir pour un site web ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          La palette analogique (couleurs voisines sur le cercle chromatique) crée une ambiance douce et cohérente. La palette complémentaire (couleurs opposées) apporte du contraste et de l'énergie, idéale pour les CTAs et les boutons d'action.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je partir d'une couleur existante ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, entrez un code HEX ou utilisez le sélecteur de couleur pour partir de votre couleur de marque, et l'outil génère automatiquement les teintes complémentaires adaptées.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/image" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertir une image</a>
            <a href="/qrcode" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de QR Code</a>
          </div>
        </div>
      </section>
    </>
  );
}
