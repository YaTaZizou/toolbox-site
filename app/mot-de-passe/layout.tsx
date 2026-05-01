import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Mot de Passe sécurisé en ligne — Gratuit",
  description: "Générez des mots de passe forts et sécurisés en ligne. Longueur, caractères spéciaux et chiffres personnalisables. Gratuit, aucune donnée stockée.",
  alternates: { canonical: "https://alltoolbox.fr/mot-de-passe" },
  openGraph: {
    title: "Générateur de Mot de Passe — ToolBox",
    description: "Générez des mots de passe forts et sécurisés, personnalisables, gratuitement.",
    url: "https://alltoolbox.fr/mot-de-passe",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Générateur de Mot de Passe — ToolBox", description: "Générez des mots de passe forts et sécurisés, personnalisables, gratuitement." },
};

export default function MotDePasseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Générateur de Mot de Passe — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/mot-de-passe",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Générez des mots de passe forts et sécurisés en ligne. Longueur, caractères spéciaux et chiffres personnalisables. Gratuit, aucune donnée stockée."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de mot de passe fort et sécurisé</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Un mot de passe fort est votre première ligne de défense contre les cyberattaques. Le générateur de mots de passe ToolBox crée des mots de passe aléatoires et cryptographiquement sécurisés, avec un contrôle total sur la longueur (8 à 64 caractères), l'inclusion de chiffres, de symboles et de lettres majuscules/minuscules. Aucun mot de passe n'est jamais stocké ou transmis.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quelle longueur pour un mot de passe sécurisé ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Les experts en cybersécurité recommandent au minimum 12 caractères, idéalement 16 à 20, avec un mélange de lettres, chiffres et symboles. Un mot de passe de 16 caractères aléatoires est pratiquement impossible à craquer par force brute.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le générateur est-il vraiment aléatoire ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, la génération utilise l'API cryptographique de votre navigateur (Web Crypto API), garantissant un aléa de qualité cryptographique. Aucun mot de passe généré n'est enregistré.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/hash" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de hash</a>
            <a href="/qrcode" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de QR Code</a>
          </div>
        </div>
      </section>
    </>
  );
}
