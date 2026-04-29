import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte l'équipe ToolBox pour toute question, suggestion ou problème.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Nous contacter</h1>
        <p className="text-gray-400">
          Une question, un bug, une suggestion ? On te répond rapidement.
        </p>
      </div>

      {/* Email principal */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-4 text-center">
        <p className="text-4xl mb-4">📧</p>
        <h2 className="text-xl font-bold mb-2">Email</h2>
        <p className="text-gray-400 text-sm mb-4">
          C&apos;est le moyen le plus rapide pour nous joindre.
        </p>
        <a
          href="mailto:contact@alltoolbox.fr"
          className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          contact@alltoolbox.fr
        </a>
      </div>

      {/* Sujets courants */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {[
          {
            emoji: "🐛",
            title: "Bug ou problème technique",
            desc: "Un outil ne fonctionne pas comme prévu ?",
            subject: "Bug — ",
          },
          {
            emoji: "💡",
            title: "Suggestion d'outil",
            desc: "Tu as une idée d'outil à ajouter ?",
            subject: "Suggestion — ",
          },
          {
            emoji: "💳",
            title: "Question sur l'abonnement",
            desc: "Remboursement, facturation, annulation...",
            subject: "Abonnement — ",
          },
          {
            emoji: "🤝",
            title: "Partenariat",
            desc: "Collaboration, affiliation, presse...",
            subject: "Partenariat — ",
          },
        ].map((item) => (
          <a
            key={item.title}
            href={`mailto:contact@alltoolbox.fr?subject=${encodeURIComponent(item.subject)}`}
            className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors group"
          >
            <p className="text-2xl mb-2">{item.emoji}</p>
            <p className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">
              {item.title}
            </p>
            <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
          </a>
        ))}
      </div>

      {/* Garantie remboursement */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">🛡️</p>
        <h3 className="font-bold text-white mb-1">Garantie satisfait ou remboursé</h3>
        <p className="text-gray-400 text-sm">
          Si tu es abonné Premium et insatisfait dans les 7 jours, contacte-nous —
          nous te remboursons intégralement, sans question.
        </p>
      </div>

      {/* Temps de réponse */}
      <p className="text-center text-xs text-gray-600 mt-8">
        Délai de réponse habituel : moins de 24h en semaine.
      </p>
    </div>
  );
}
