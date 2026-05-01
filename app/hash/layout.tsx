import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Générateur de Hash MD5 SHA-256 en ligne — Gratuit",
  description: "Générez des empreintes MD5, SHA-256 et SHA-512 de n'importe quel texte en ligne. Outil de hachage gratuit, instantané, traitement local dans le navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/hash" },
  openGraph: {
    title: "Générateur de Hash MD5 SHA-256 — ToolBox",
    description: "Générez des empreintes MD5, SHA-256 et SHA-512 de n'importe quel texte, gratuitement.",
    url: "https://alltoolbox.fr/hash",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Générateur de Hash — ToolBox", description: "Générez des empreintes MD5, SHA-256 et SHA-512 de n'importe quel texte, gratuitement." },
};

export default function HashLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Générateur de Hash MD5 SHA-256 — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/hash",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Générez des empreintes MD5, SHA-256 et SHA-512 de n'importe quel texte en ligne. Outil de hachage gratuit, instantané, traitement local dans le navigateur."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Générateur de Hash", "item": "https://alltoolbox.fr/hash" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de hash en ligne — MD5, SHA-256, SHA-512</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le générateur de hash ToolBox calcule instantanément l'empreinte cryptographique (hash) de n'importe quel texte selon les algorithmes MD5, SHA-1, SHA-256 et SHA-512. Utile pour vérifier l'intégrité de fichiers, stocker des mots de passe hashés, ou simplement tester des fonctions de hachage. Le calcul s'effectue entièrement dans votre navigateur.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelle différence entre MD5 et SHA-256 ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          MD5 produit un hash de 128 bits, rapide mais vulnérable aux collisions. SHA-256 (partie de SHA-2) génère un hash de 256 bits, beaucoup plus sûr et recommandé pour la cryptographie moderne et la vérification d'intégrité de fichiers.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Peut-on décoder un hash ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Non, le hachage est une fonction à sens unique — il est mathématiquement impossible de retrouver le texte original à partir du hash. C'est pourquoi il est utilisé pour stocker des mots de passe de manière sécurisée.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/mot-de-passe" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de mot de passe</Link>
            <Link href="/formateur-json" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Formateur JSON</Link>
            <Link href="/convertir-texte" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertisseur de texte</Link>
          </div>
        </div>
      </section>
    </>
  );
}
