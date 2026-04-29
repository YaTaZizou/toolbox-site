"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { value: "bug",         emoji: "🐛", label: "Bug ou problème technique",    desc: "Un outil ne fonctionne pas comme prévu" },
  { value: "suggestion",  emoji: "💡", label: "Suggestion d'outil",           desc: "Tu as une idée d'outil à ajouter" },
  { value: "abonnement",  emoji: "💳", label: "Question sur l'abonnement",    desc: "Remboursement, facturation, annulation..." },
  { value: "partenariat", emoji: "🤝", label: "Partenariat",                  desc: "Collaboration, affiliation, presse..." },
  { value: "autre",       emoji: "📩", label: "Autre",                        desc: "Toute autre question" },
];

export default function ContactPage() {
  const [category, setCategory]   = useState("");
  const [subject, setSubject]     = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) { setError("Sélectionne une catégorie."); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, email, message }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Erreur lors de l'envoi.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setLoading(false);
    }
  }

  // ── Succès ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-gray-900 border border-green-500/20 rounded-2xl p-10">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Message envoyé !</h2>
          <p className="text-gray-400 mb-6">
            On te répondra sous 24h à l&apos;adresse <strong className="text-white">{email}</strong>.
          </p>
          <Link
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // ── Formulaire ────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nous contacter</h1>
        <p className="text-gray-400 text-sm">Réponse sous 24h en semaine.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Étape 1 — Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Ça concerne quoi ?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => { setCategory(cat.value); setError(""); }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  category === cat.value
                    ? "bg-purple-600/15 border-purple-500/50 ring-1 ring-purple-500/30"
                    : "bg-gray-900 border-gray-800 hover:border-gray-700"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{cat.emoji}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${category === cat.value ? "text-purple-300" : "text-white"}`}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cat.desc}</p>
                </div>
                {category === cat.value && (
                  <span className="ml-auto text-purple-400 shrink-0">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Étape 2 — Champs (visibles dès qu'une catégorie est choisie) */}
        {category && (
          <>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ton email <span className="text-red-400">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ton@email.com"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">Pour qu&apos;on puisse te répondre.</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Sujet <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                maxLength={120}
                placeholder={
                  category === "bug"         ? "Ex : L'outil OCR plante sur les images PNG" :
                  category === "suggestion"  ? "Ex : Ajouter un compresseur de PDF" :
                  category === "abonnement"  ? "Ex : Je n'arrive pas à annuler mon abonnement" :
                  category === "partenariat" ? "Ex : Proposition de collaboration" :
                  "Résume ton message en une phrase"
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Message <span className="text-red-400">*</span>
                <span className="ml-2 text-gray-600 font-normal">({message.length}/5000)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                placeholder={
                  category === "bug"
                    ? "Décris le problème : que s'est-il passé ? Quel navigateur / appareil ? Des messages d'erreur ?"
                    : "Décris ta demande en détail..."
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Envoi en cours…
                </>
              ) : (
                <>📨 Envoyer le message</>
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
