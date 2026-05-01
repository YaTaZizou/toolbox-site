import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Pseudo — Gaming, Discord, Instagram",
  description: "Créez des pseudos uniques et originaux pour le gaming, Twitch, Discord, Instagram grâce à l'IA. Gratuit et sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/pseudo" },
  openGraph: {
    title: "Générateur de Pseudo — ToolBox",
    description: "Créez des pseudos uniques pour le gaming, Discord et Instagram grâce à l'IA.",
    url: "https://alltoolbox.fr/pseudo",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Générateur de Pseudo — ToolBox", description: "Créez des pseudos uniques pour le gaming, Discord et Instagram grâce à l'IA." },
};

export default function PseudoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Générateur de pseudo IA gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/pseudo",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Créez des pseudos uniques pour le gaming, Discord ou Instagram grâce à l'IA."
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://alltoolbox.fr" },
          { "@type": "ListItem", "position": 2, "name": "Générateur de Pseudo", "item": "https://alltoolbox.fr/pseudo" }
        ]
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de pseudo gratuit pour gamers et réseaux sociaux</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Trouvez le pseudo parfait pour votre identité en ligne grâce au générateur IA de ToolBox. Décrivez votre style, vos centres d'intérêt ou votre univers, et l'IA génère des dizaines de pseudos originaux, mémorables et disponibles. Idéal pour les gamers cherchant un pseudo sur Fortnite, Valorant, Minecraft, ou pour créer un compte Twitch, Discord ou Instagram qui se démarque.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment obtenir un bon pseudo de gamer ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Précisez le type de jeu, votre style de jeu (agressif, stratège, support…) et vos préférences (court, avec chiffres, en anglais…). L'IA adapte ses suggestions à votre profil.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Les pseudos générés sont-ils uniques ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          L'IA génère des pseudos originaux à chaque requête. Il vous revient de vérifier la disponibilité sur la plateforme de votre choix avant de l'adopter.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/bio" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de bio</a>
            <a href="/texte" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de texte</a>
          </div>
        </div>
      </section>
    </>
  );
}
