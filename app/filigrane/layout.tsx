import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter un Filigrane à une Image en ligne — Texte ou Logo",
  description: "Ajoutez un filigrane texte ou logo sur vos images en ligne. Personnalisez la position, la taille et l'opacité. Gratuit, rapide, sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/filigrane" },
  openGraph: {
    title: "Ajouter un Filigrane à une Image — ToolBox",
    description: "Ajoutez un filigrane texte ou logo sur vos images en ligne, sans inscription.",
    url: "https://alltoolbox.fr/filigrane",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Ajouter un Filigrane — ToolBox", description: "Ajoutez un filigrane texte ou logo sur vos images en ligne, sans inscription." },
};

export default function FiligraneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Ajouter un filigrane à une image en ligne</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Protégez vos créations visuelles en ajoutant un filigrane (watermark) personnalisé à vos images. ToolBox vous permet d'incruster un texte ou un logo sur n'importe quelle photo en ligne, en contrôlant la position, la taille, la couleur et la transparence. Idéal pour les photographes, les graphistes et les créateurs de contenu souhaitant protéger leurs droits d'auteur.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je utiliser mon propre logo comme filigrane ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Oui, vous pouvez importer un logo PNG (avec fond transparent de préférence) et le positionner librement sur votre image. La taille et l'opacité du logo sont entièrement réglables.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Le filigrane est-il permanent ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, le filigrane est intégré définitivement à l'image exportée. Choisissez une opacité entre 20% et 100% selon le degré de visibilité souhaité.
        </p>
      </section>
    </>
  );
}
