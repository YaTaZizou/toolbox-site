import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur d'Images en ligne — JPG PNG WebP AVIF Gratuit",
  description: "Convertissez vos images en JPG, PNG, WebP ou AVIF en ligne. Compressez et optimisez vos images gratuitement, sans inscription, dans votre navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/image" },
  openGraph: {
    title: "Convertisseur d'Images en ligne — ToolBox",
    description: "Convertissez vos images en JPG, PNG, WebP ou AVIF gratuitement.",
    url: "https://alltoolbox.fr/image",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur d'Images — ToolBox", description: "Convertissez vos images en JPG, PNG, WebP ou AVIF gratuitement." },
};

export default function ImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Convertir des images en ligne gratuitement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          ToolBox propose un convertisseur d'images rapide et gratuit directement dans votre navigateur. Transformez vos photos et illustrations en JPG, PNG, WebP ou AVIF en quelques secondes. Le format WebP est idéal pour les sites web (jusqu'à 30% plus léger que le JPG), tandis que PNG convient aux images avec transparence. Aucune donnée n'est envoyée sur internet — tout se passe localement.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quel format choisir pour mon image ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          JPG est idéal pour les photos, PNG pour les images avec fond transparent, WebP pour un usage web optimisé et AVIF pour la meilleure compression moderne. L'outil vous permet aussi de régler le niveau de qualité avant conversion.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je convertir plusieurs images à la fois ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, la conversion en lot est prise en charge. Glissez-déposez plusieurs fichiers simultanément et téléchargez tous les résultats en une seule fois.
        </p>
      </section>
    </>
  );
}
