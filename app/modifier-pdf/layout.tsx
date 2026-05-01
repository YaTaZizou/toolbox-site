import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier un PDF en ligne gratuitement — Texte, Pages, Rotation",
  description: "Ajoutez du texte, pivotez, supprimez ou réorganisez les pages d'un PDF directement en ligne. Gratuit, sans inscription, traitement dans le navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/modifier-pdf" },
  openGraph: {
    title: "Modifier un PDF en ligne — ToolBox",
    description: "Ajoutez du texte, pivotez ou supprimez des pages d'un PDF en ligne.",
    url: "https://alltoolbox.fr/modifier-pdf",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Modifier un PDF en ligne — ToolBox", description: "Ajoutez du texte, pivotez ou supprimez des pages d'un PDF en ligne." },
};

export default function ModifierPdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Modifier un PDF en ligne gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/modifier-pdf",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Ajoutez du texte, réorganisez ou supprimez des pages d'un PDF en ligne."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Modifier un PDF en ligne sans logiciel</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          ToolBox vous offre un éditeur PDF en ligne gratuit pour ajuster vos documents sans installer de logiciel. Ajoutez des annotations textuelles, réorganisez les pages par glisser-déposer, faites pivoter des pages mal orientées ou supprimez celles dont vous n'avez pas besoin. Le tout directement dans votre navigateur, sans que vos fichiers ne soient transmis à un tiers.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je réorganiser les pages d'un PDF ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Oui, un simple glisser-déposer suffit pour changer l'ordre des pages. Vous pouvez aussi supprimer des pages superflues en un clic avant de télécharger le PDF modifié.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Mes fichiers sont-ils en sécurité ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Totalement. Toutes les modifications sont réalisées localement dans votre navigateur. Aucun fichier n'est envoyé sur nos serveurs, garantissant une confidentialité totale de vos documents.
        </p>
      </section>
    </>
  );
}
