"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function InscriptionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth-callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            {/* Icône animée */}
            <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📧</span>
            </div>

            <h2 className="text-2xl font-bold mb-2">Vérifie ton email !</h2>
            <p className="text-gray-400 mb-6">
              Un lien de confirmation a été envoyé à{" "}
              <span className="text-white font-semibold">{email}</span>
            </p>

            {/* Étapes */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-left space-y-3 mb-6">
              {[
                { step: "1", text: "Ouvre ta boîte mail" },
                { step: "2", text: "Trouve l'email de ToolBox (vérifie les spams)" },
                { step: "3", text: "Clique sur le lien de confirmation" },
                { step: "4", text: "Ton compte est activé — connecte-toi !" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {step}
                  </span>
                  <span className="text-gray-300 text-sm">{text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600 mb-5">
              ⚠️ Sans confirmation, tu ne pourras pas te connecter.
            </p>

            <Link
              href="/connexion"
              className="block w-full text-center bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Aller à la connexion →
            </Link>

            <p className="text-xs text-gray-600 mt-4">
              Email non reçu ?{" "}
              <button
                onClick={() => setSuccess(false)}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Ressayer avec une autre adresse
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
          <p className="text-gray-400">Gratuit et sans carte bancaire</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={signup} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ton@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 caractères"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
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
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>

            <p className="text-center text-xs text-gray-600 mt-3 flex items-center justify-center gap-1.5">
              <span>📧</span>
              Un email de vérification sera envoyé à ton adresse
            </p>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
