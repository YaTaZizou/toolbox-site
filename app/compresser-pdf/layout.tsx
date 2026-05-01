import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compresser un PDF en ligne gratuit — Réduire la taille",
  description: "Réduisez la taille de vos fichiers PDF en ligne, gratuitement et sans inscription. Compression jusqu'à 80% sans perte visible de qualité.",
  alternates: { canonical: "https://alltoolbox.fr/compresser-pdf" },
  openGraph: {
    title: "Compresser un PDF gratuit — ToolBox",
    description: "Réduisez la taille de vos PDFs jusqu'à 80% sans perte visible de qualité.",
    url: "https://alltoolbox.fr/compresser-pdf",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Compresser un PDF — ToolBox", description: "Réduisez la taille de vos PDFs jusqu'à 80% sans perte visible de qualité." },
};

export default function CompresserPdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Compresser un PDF en ligne gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/compresser-pdf",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Réduisez la taille de vos PDFs jusqu'à 80% sans perte visible de qualité."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Compresser un PDF en ligne gratuitement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Un PDF trop volumineux pour être envoyé par email ou partagé en ligne ? ToolBox vous permet de réduire le poids de vos fichiers PDF en quelques secondes, sans installer de logiciel. La compression supprime les données redondantes et optimise les images intégrées, pour un fichier jusqu'à 80% plus léger avec une qualité visuelle préservée.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">La qualité du PDF est-elle dégradée ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          La compression est optimisée pour préserver la lisibilité du document. Les textes restent nets et les images gardent une qualité satisfaisante pour la plupart des usages professionnels et personnels.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelle taille maximale est acceptée ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          L'outil accepte les PDF jusqu'à plusieurs dizaines de mégaoctets. Le traitement est entièrement local — aucun fichier n'est transmis à nos serveurs.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/pdf" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Fusionner / Découper un PDF</a>
            <a href="/modifier-pdf" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Modifier un PDF</a>
            <a href="/pdf-images" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">PDF en images</a>
          </div>
        </div>
      </section>
    </>
  );
}
