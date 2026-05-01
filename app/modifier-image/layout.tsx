import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier une Image en ligne — Redimensionner, Recadrer, Pivoter",
  description: "Redimensionnez, recadrez, pivotez ou retournez vos images gratuitement en ligne. Aucun logiciel requis, traitement local dans le navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/modifier-image" },
  openGraph: {
    title: "Modifier une Image en ligne — ToolBox",
    description: "Redimensionnez, recadrez ou pivotez vos images gratuitement en ligne.",
    url: "https://alltoolbox.fr/modifier-image",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Modifier une Image — ToolBox", description: "Redimensionnez, recadrez ou pivotez vos images gratuitement en ligne." },
};

export default function ModifierImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Modifier une image en ligne gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/modifier-image",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Redimensionnez, recadrez ou pivotez vos images gratuitement sans logiciel."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Modifier une image en ligne sans logiciel</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Besoin de redimensionner une image pour un réseau social, recadrer une photo ou corriger l'orientation ? ToolBox met à votre disposition un éditeur d'images simple et gratuit, accessible depuis n'importe quel navigateur. Ajustez les dimensions, faites pivoter ou retournez vos images en miroir sans installer le moindre logiciel.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment redimensionner une image en gardant les proportions ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Entrez la largeur ou la hauteur souhaitée — l'outil calcule automatiquement l'autre dimension pour conserver le ratio d'origine. Vous pouvez aussi déverrouiller les proportions pour un redimensionnement libre.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quels formats d'images sont supportés ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          L'outil accepte les formats JPG, PNG, WebP et GIF. Le fichier modifié est exporté dans le format de votre choix, immédiatement téléchargeable.
        </p>
      </section>
    </>
  );
}
