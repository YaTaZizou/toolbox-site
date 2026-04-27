import Link from "next/link";

const categories = [
  {
    id: "ia",
    title: "🤖 Générateurs IA",
    color: "border-purple-500/30 bg-purple-500/5",
    titleColor: "text-purple-400",
    tools: [
      { href: "/pseudo", emoji: "🎭", title: "Générateur de Pseudo", description: "Pseudos uniques pour gaming, réseaux sociaux, streaming...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/bio", emoji: "✍️", title: "Générateur de Bio", description: "Bio percutante pour Instagram, TikTok, LinkedIn...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/texte", emoji: "📝", title: "Générateur de Texte", description: "Posts, emails, descriptions, accroches...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/logo", emoji: "🎨", title: "Générateur de Logo", description: "Crée un logo unique avec l'IA en quelques secondes.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
  {
    id: "pdf",
    title: "📄 Outils PDF",
    color: "border-red-500/30 bg-red-500/5",
    titleColor: "text-red-400",
    tools: [
      { href: "/pdf", emoji: "🔗", title: "Fusionner des PDFs", description: "Combine plusieurs PDFs en un seul fichier.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf", emoji: "🖼️", title: "Images → PDF", description: "Convertis tes JPG/PNG en fichier PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf", emoji: "✂️", title: "Découper un PDF", description: "Extrait des pages spécifiques d'un PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf", emoji: "🔒", title: "Protéger un PDF", description: "Ajoute un mot de passe à ton PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf-images", emoji: "📸", title: "PDF → Images", description: "Convertis chaque page d'un PDF en image.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
  {
    id: "media",
    title: "🖼️ Images & Vidéo",
    color: "border-orange-500/30 bg-orange-500/5",
    titleColor: "text-orange-400",
    tools: [
      { href: "/image", emoji: "🔄", title: "Convertisseur d'Images", description: "JPG, PNG, WebP, AVIF + compression.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/video", emoji: "🎬", title: "Compresseur Vidéo", description: "Réduis le poids de tes vidéos MP4.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
      { href: "/gif", emoji: "🎞️", title: "Créateur de GIF", description: "Crée des GIFs depuis une vidéo ou des images.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
  {
    id: "utils",
    title: "⚡ Outils Rapides",
    color: "border-blue-500/30 bg-blue-500/5",
    titleColor: "text-blue-400",
    tools: [
      { href: "/qrcode", emoji: "📱", title: "Générateur de QR Code", description: "Crée un QR code pour n'importe quel lien ou texte.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/mot-de-passe", emoji: "🔑", title: "Générateur de Mot de Passe", description: "Génère des mots de passe sécurisés.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/lien", emoji: "🔗", title: "Raccourcisseur de Lien", description: "Raccourcis tes URLs en un clic.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm mb-6">
          ⚡ Tous vos outils en un seul endroit
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          ToolBox
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Générateurs IA, convertisseurs de fichiers et bien plus encore.
          Gratuit, rapide et sans inscription.
        </p>
      </div>

      {/* Catégories */}
      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.id}>
            <h2 className={`text-xl font-bold mb-5 ${cat.titleColor}`}>{cat.title}</h2>
            <div className={`border rounded-2xl p-6 ${cat.color}`}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.tools.map((tool) =>
                  tool.available ? (
                    <Link key={tool.href + tool.title} href={tool.href}>
                      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 h-full hover:border-gray-500 transition-all hover:scale-[1.02] cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1">{tool.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{tool.description}</p>
                      </div>
                    </Link>
                  ) : (
                    <div key={tool.href + tool.title} className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 h-full opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{tool.emoji}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                      </div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-1">{tool.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{tool.description}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
