import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-purple-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page introuvable</h1>
        <p className="text-gray-400 mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block mb-8"
        >
          ← Retour à l&apos;accueil
        </Link>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-gray-500 text-sm mb-4">Outils populaires :</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pdf" className="text-sm text-purple-400 hover:text-purple-300">
              Outils PDF
            </Link>
            <Link href="/image" className="text-sm text-purple-400 hover:text-purple-300">
              Convertir image
            </Link>
            <Link href="/ocr" className="text-sm text-purple-400 hover:text-purple-300">
              OCR
            </Link>
            <Link href="/correcteur" className="text-sm text-purple-400 hover:text-purple-300">
              Correcteur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
