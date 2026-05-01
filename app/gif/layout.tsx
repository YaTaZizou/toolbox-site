import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créateur de GIF en ligne gratuit — Animer des Images",
  description: "Créez des GIFs animés depuis vos images JPG et PNG en ligne. Réglez la vitesse et l'ordre des images. Gratuit, rapide, dans le navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/gif" },
  openGraph: {
    title: "Créateur de GIF en ligne — ToolBox",
    description: "Créez des GIFs animés depuis vos images JPG et PNG en ligne.",
    url: "https://alltoolbox.fr/gif",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Créateur de GIF — ToolBox", description: "Créez des GIFs animés depuis vos images JPG et PNG en ligne." },
};

export default function GifLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Créateur de GIF en ligne gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/gif",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Créez des GIFs animés depuis vos images JPG et PNG en ligne. Gratuit."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Créer un GIF animé en ligne gratuitement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le créateur de GIF de ToolBox vous permet de transformer une série d'images statiques en une animation GIF en quelques clics. Importez vos images JPG ou PNG, organisez-les dans l'ordre souhaité, ajustez la vitesse d'animation et téléchargez votre GIF immédiatement. Parfait pour créer des mèmes, des animations pour les réseaux sociaux ou des illustrations interactives.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Combien d'images puis-je utiliser pour un GIF ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Vous pouvez importer autant d'images que nécessaire. Plus vous en ajoutez, plus l'animation sera fluide. La vitesse de chaque image est configurable individuellement ou globalement.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le GIF créé est-il de bonne qualité ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, l'outil génère des GIFs en haute qualité. La taille du fichier final dépend du nombre d'images et de la résolution — vous pouvez redimensionner les images au préalable pour alléger le GIF.
        </p>
      </section>
    </>
  );
}
