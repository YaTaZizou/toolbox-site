import Link from "next/link";

const tools = [
  {
    href: "/pseudo",
    emoji: "🎭",
    title: "Générateur de Pseudo",
    description: "Crée des pseudos uniques et originaux grâce à l'IA. Gaming, réseaux sociaux, streaming...",
    color: "from-purple-500 to-pink-500",
    badge: "IA",
  },
  {
    href: "/bio",
    emoji: "✍️",
    title: "Générateur de Bio",
    description: "Génère une bio percutante pour Instagram, Twitter, LinkedIn ou TikTok en quelques secondes.",
    color: "from-blue-500 to-cyan-500",
    badge: "IA",
  },
  {
    href: "/texte",
    emoji: "📝",
    title: "Générateur de Texte IA",
    description: "Rédige des posts, descriptions, emails, accroches ou tout autre contenu avec l'IA.",
    color: "from-green-500 to-emerald-500",
    badge: "IA",
  },
  {
    href: "/image",
    emoji: "🖼️",
    title: "Convertisseur d'Images",
    description: "Convertis et compresse tes images en JPG, PNG, WebP ou AVIF instantanément.",
    color: "from-orange-500 to-yellow-500",
    badge: "Nouveau",
  },
  {
    href: "/pdf",
    emoji: "📄",
    title: "Outils PDF",
    description: "Fusionne plusieurs PDFs en un seul ou convertis tes images JPG/PNG en PDF.",
    color: "from-red-500 to-orange-500",
    badge: "Nouveau",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* Hero */}
      <div className="text-center mb-20">
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

      {/* Outils disponibles */}
      <h2 className="text-2xl font-semibold mb-8 text-gray-200">🛠️ Outils disponibles</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 mb-20">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full hover:border-gray-600 transition-all hover:scale-[1.02]">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4`}>
                {tool.emoji}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white">{tool.title}</h3>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">{tool.badge}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bientôt disponible */}
      <h2 className="text-2xl font-semibold mb-8 text-gray-200">🚀 Bientôt disponible</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { emoji: "🎬", title: "Convertisseur Vidéo", desc: "MP4, GIF, compression vidéo" },
          { emoji: "✂️", title: "Découper un PDF", desc: "Extrait des pages spécifiques" },
          { emoji: "🔒", title: "Protéger un PDF", desc: "Ajoute un mot de passe" },
        ].map((item) => (
          <div key={item.title} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 opacity-60">
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl mb-4">
              {item.emoji}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-400">{item.title}</h3>
              <span className="text-xs bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">Bientôt</span>
            </div>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
