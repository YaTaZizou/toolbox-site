import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Supprimer le Fond d'une Image — PNG Transparent",
  description: "Supprimez automatiquement l'arrière-plan de vos images grâce à l'IA. Résultat PNG transparent en quelques secondes. Gratuit et sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/supprimer-fond" },
  openGraph: {
    title: "Supprimer le Fond d'une Image — ToolBox",
    description: "Supprimez l'arrière-plan de vos images avec l'IA. Résultat PNG transparent.",
    url: "https://alltoolbox.fr/supprimer-fond",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Supprimer le Fond d'une Image — ToolBox", description: "Supprimez l'arrière-plan de vos images avec l'IA. Résultat PNG transparent." },
};

export default function SupprimerFondLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Supprimer le Fond d'une Image — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/supprimer-fond",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Supprimez automatiquement l'arrière-plan de vos images grâce à l'IA. Résultat PNG transparent en quelques secondes. Gratuit et sans inscription."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Supprimer le fond", "item": "https://alltoolbox.fr/supprimer-fond" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Supprimer le fond d'une image automatiquement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Grâce à l'intelligence artificielle, ToolBox détecte et supprime le fond de vos photos en quelques secondes. Obtenez une image PNG avec arrière-plan transparent, prête à être utilisée sur un site web, une présentation ou un montage. L'outil fonctionne sur les portraits, les objets et les logos avec une précision remarquable.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quels types d'images fonctionnent le mieux ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          L'IA donne de meilleurs résultats sur les images avec un sujet bien défini (portrait, produit, animal). Les fonds complexes ou très similaires au sujet peuvent nécessiter un recadrage manuel léger après traitement.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le résultat est-il téléchargeable gratuitement ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, l'image avec fond supprimé est téléchargeable immédiatement en PNG transparent, sans filigrane et sans inscription.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/image" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertir une image</Link>
            <Link href="/modifier-image" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Modifier une image</Link>
            <Link href="/filigrane" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Ajouter un filigrane</Link>
          </div>
        </div>
      </section>
    </>
  );
}
