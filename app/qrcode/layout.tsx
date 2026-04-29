import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de QR Code gratuit en ligne — Personnalisable",
  description: "Créez un QR code personnalisé pour n'importe quel lien, texte ou contact. Téléchargement PNG gratuit, sans inscription, personnalisation couleur et logo.",
  alternates: { canonical: "https://alltoolbox.fr/qrcode" },
  openGraph: {
    title: "Générateur de QR Code — ToolBox",
    description: "Créez un QR code personnalisé pour n'importe quel lien. Téléchargement PNG gratuit.",
    url: "https://alltoolbox.fr/qrcode",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Générateur de QR Code — ToolBox", description: "Créez un QR code personnalisé pour n'importe quel lien. Téléchargement PNG gratuit." },
};

export default function QrcodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Générateur de QR Code gratuit et personnalisable</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Créez un QR code en quelques secondes pour n'importe quel lien URL, texte, adresse email, numéro de téléphone ou carte de contact vCard. ToolBox vous permet de personnaliser la couleur du QR code, d'ajouter un logo au centre et de télécharger le résultat en haute résolution au format PNG, prêt à l'impression ou à la publication en ligne.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">À quoi sert un QR code ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Les QR codes sont utilisés pour les menus de restaurants, les cartes de visite, les affiches publicitaires, les packagings produits, le partage de liens Wi-Fi ou les pages de téléchargement d'applications mobiles.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le QR code expire-t-il ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Non, les QR codes générés par ToolBox sont statiques et n'expirent jamais. Le lien codé reste actif tant que l'URL de destination existe.
        </p>
      </section>
    </>
  );
}
