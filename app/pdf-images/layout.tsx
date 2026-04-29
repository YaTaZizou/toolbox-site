import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir PDF en Images JPG PNG en ligne — Gratuit",
  description: "Convertissez chaque page d'un PDF en image JPG ou PNG en ligne. Aucune installation, traitement local dans votre navigateur, 100% gratuit.",
  alternates: { canonical: "https://alltoolbox.fr/pdf-images" },
  openGraph: {
    title: "Convertir PDF en Images — ToolBox",
    description: "Convertissez chaque page d'un PDF en image JPG ou PNG en ligne.",
    url: "https://alltoolbox.fr/pdf-images",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertir PDF en Images — ToolBox", description: "Convertissez chaque page d'un PDF en image JPG ou PNG en ligne." },
};

export default function PdfImagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Convertir un PDF en images en ligne</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Cet outil gratuit vous permet de transformer chaque page d'un document PDF en une image distincte, au format JPG ou PNG. Idéal pour extraire des illustrations, partager une page spécifique sur les réseaux sociaux, ou intégrer des pages PDF dans une présentation. Tout le traitement s'effectue dans votre navigateur — vos fichiers restent privés et ne sont jamais envoyés sur un serveur.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelle qualité d'image obtient-on ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          La conversion produit des images haute résolution. Choisissez entre JPG (plus léger) et PNG (sans perte de qualité) selon votre usage. Chaque page du PDF devient un fichier image séparé, téléchargeable instantanément.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Faut-il créer un compte ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Non, aucun compte n'est nécessaire. L'outil est entièrement gratuit et accessible immédiatement depuis votre navigateur, sans limite de conversions.
        </p>
      </section>
    </>
  );
}
