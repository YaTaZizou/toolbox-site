import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convertisseur de Texte — Majuscules, Slug, CamelCase",
  description: "Convertissez votre texte en majuscules, minuscules, slug URL, camelCase, snake_case et plus. Gratuit et instantané, sans installation.",
  alternates: { canonical: "https://alltoolbox.fr/convertir-texte" },
  openGraph: {
    title: "Convertisseur de Texte en ligne — ToolBox",
    description: "Convertissez votre texte en majuscules, slug, camelCase et plus, instantanément.",
    url: "https://alltoolbox.fr/convertir-texte",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur de Texte — ToolBox", description: "Convertissez votre texte en majuscules, slug, camelCase et plus, instantanément." },
};

export default function ConvertirTexteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Convertisseur de Texte en ligne — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/convertir-texte",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Convertissez votre texte en majuscules, minuscules, slug URL, camelCase, snake_case et plus. Gratuit et instantané, sans installation."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Convertisseur de Texte", "item": "https://alltoolbox.fr/convertir-texte" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Convertisseur de texte en ligne gratuit</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Cet outil transforme votre texte en différents formats en un clic. Passez un titre en MAJUSCULES, créez un slug URL à partir d'une phrase (idéal pour les développeurs web), formatez du texte en camelCase pour la programmation ou en snake_case pour les bases de données. Indispensable pour les développeurs, rédacteurs et gestionnaires de contenu.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Qu'est-ce qu'un slug URL ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Un slug est une version simplifiée d'un texte, sans espaces ni caractères spéciaux, utilisée dans les URL. Par exemple "Mon Article de Blog" devient "mon-article-de-blog". L'outil supprime automatiquement les accents et ponctuation.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelles conversions sont disponibles ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          MAJUSCULES, minuscules, Première Lettre En Majuscule, camelCase, PascalCase, snake_case, kebab-case et slug URL. Copiez le résultat en un clic.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/compteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Compteur de mots</Link>
            <Link href="/correcteur" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Correcteur</Link>
            <Link href="/formateur-json" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Formateur JSON</Link>
          </div>
        </div>
      </section>
    </>
  );
}
