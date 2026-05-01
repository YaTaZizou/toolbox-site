import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amélioration d'Image par IA — Upscaling Gratuit en ligne",
  description: "Augmentez la résolution de vos images jusqu'à 4x grâce à l'IA. Upscaling intelligent, nettoyage du bruit, photos floues restaurées. Outil Premium ToolBox.",
  alternates: { canonical: "https://alltoolbox.fr/amelioration-image" },
  openGraph: {
    title: "Amélioration d'Image par IA — ToolBox",
    description: "Augmentez la résolution de vos images jusqu'à 4x grâce à l'IA.",
    url: "https://alltoolbox.fr/amelioration-image",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Amélioration d'Image par IA — ToolBox", description: "Augmentez la résolution de vos images jusqu'à 4x grâce à l'IA." },
};

export default function AmeliorationImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Amélioration d'Image par IA — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/amelioration-image",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Augmentez la résolution de vos images jusqu'à 4x grâce à l'IA. Upscaling intelligent, nettoyage du bruit, photos floues restaurées."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Améliorer la qualité d'une image par IA</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          L'outil d'amélioration d'image de ToolBox utilise des algorithmes d'intelligence artificielle pour augmenter la résolution de vos photos jusqu'à 4x sans perte de netteté. Restaurez des photos floues, agrandissez des images basse résolution pour l'impression ou supprimez le bruit numérique. Idéal pour les photographes, graphistes et créateurs de contenu.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quel niveau d'agrandissement est possible ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          L'IA peut multiplier la résolution de l'image par 2x ou 4x. Une image de 500×500 pixels peut ainsi devenir une image nette de 2000×2000 pixels, adaptée à l'impression grand format.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Cet outil est-il réservé aux abonnés Premium ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          L'amélioration d'image par IA est une fonctionnalité Premium de ToolBox. Les abonnés bénéficient d'un nombre illimité de traitements et d'une résolution de sortie maximale.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/image" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertir une image</a>
            <a href="/modifier-image" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Modifier une image</a>
            <a href="/supprimer-fond" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Supprimer le fond</a>
          </div>
        </div>
      </section>
    </>
  );
}
