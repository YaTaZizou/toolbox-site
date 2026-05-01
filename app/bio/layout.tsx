import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Bio en ligne — Instagram, TikTok, LinkedIn",
  description: "Générez une bio percutante pour Instagram, TikTok, LinkedIn ou Twitter en quelques secondes grâce à l'IA. Gratuit, personnalisé, sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/bio" },
  openGraph: {
    title: "Générateur de Bio — ToolBox",
    description: "Créez une bio percutante pour Instagram, TikTok ou LinkedIn avec l'IA.",
    url: "https://alltoolbox.fr/bio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Générateur de Bio — ToolBox", description: "Créez une bio percutante pour Instagram, TikTok ou LinkedIn avec l'IA." },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Générateur de bio IA gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/bio",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Générez une bio percutante pour Instagram, TikTok ou LinkedIn grâce à l'IA."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de bio pour les réseaux sociaux</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Votre bio est la première impression que vous donnez sur les réseaux sociaux. Le générateur de bio ToolBox utilise l'IA pour rédiger une présentation concise, percutante et adaptée à chaque plateforme. Que ce soit pour une bio Instagram créative, un profil LinkedIn professionnel, une bio TikTok engageante ou une description Twitter accrocheuse, l'IA s'adapte au ton et au format requis.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment personnaliser ma bio générée ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Renseignez votre prénom, votre activité ou passion, votre ton souhaité (sérieux, humoristique, inspirant) et la plateforme cible. L'IA génère plusieurs variantes que vous pouvez affiner.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">La bio respecte-t-elle les limites de caractères ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, l'outil tient compte des contraintes de chaque plateforme : 150 caractères pour Instagram, 160 pour Twitter, 220 pour LinkedIn, etc.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/pseudo" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de pseudo</a>
            <a href="/texte" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Générateur de texte</a>
          </div>
        </div>
      </section>
    </>
  );
}
