import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Outils PDF en ligne gratuits — Fusionner, Découper, Protéger",
  description: "Fusionner, découper, protéger et convertir des PDFs en ligne. 100% gratuit, sans inscription, traitement local dans le navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/pdf" },
  openGraph: {
    title: "Outils PDF gratuits — ToolBox",
    description: "Fusionner, découper, protéger des PDFs en ligne.",
    url: "https://alltoolbox.fr/pdf",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Outils PDF gratuits — ToolBox", description: "Fusionner, découper, protéger des PDFs en ligne." },
};

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Outils PDF en ligne gratuits — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/pdf",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Fusionner, découper, protéger et convertir des PDFs en ligne. Gratuit, sans inscription."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Outils PDF", "item": "https://alltoolbox.fr/pdf" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Outils PDF en ligne gratuits</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          ToolBox propose plusieurs outils PDF directement dans votre navigateur, sans installation et sans inscription. Fusionnez plusieurs fichiers PDF en un seul document, découpez un PDF en pages individuelles, protégez vos fichiers par mot de passe ou convertissez un PDF en images. Vos fichiers ne quittent jamais votre appareil — la confidentialité est garantie.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment fusionner des PDFs en ligne ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Sélectionnez vos fichiers PDF, ordonnez-les par glisser-déposer, puis cliquez sur "Fusionner". Le PDF combiné est téléchargeable immédiatement, sans passer par un serveur distant.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Est-ce vraiment gratuit ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, tous les outils PDF de ToolBox sont gratuits et sans limite d'utilisation. Aucune création de compte n'est requise. Le traitement se fait entièrement dans votre navigateur.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/compresser-pdf" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Compresser un PDF</Link>
            <Link href="/modifier-pdf" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Modifier un PDF</Link>
            <Link href="/pdf-images" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">PDF en images</Link>
          </div>
        </div>
      </section>
    </>
  );
}
