"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

type Mode = "login" | "signup" | "forgot";

function ConnexionForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
    setSuccess("");
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/api/auth/callback",
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email ou mot de passe incorrect.");
      } else {
        window.location.href = redirect;
      }

    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth-callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.");
        switchMode("login");
      }

    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });
      if (error) {
        setError("Impossible d'envoyer l'email. Vérifie l'adresse saisie.");
      } else {
        setSuccess("Email envoyé ! Clique sur le lien dans ta boîte mail pour réinitialiser ton mot de passe.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      {/* Header */}
      <div className="text-center mb-10">
        <Link href="/" className="text-4xl block mb-4 hover:scale-110 transition-transform inline-block">
          ⚡
        </Link>
        <h1 className="text-3xl font-bold gradient-text">ToolBox</h1>
        <p className="text-gray-400 mt-2">
          {mode === "login"
            ? "Connecte-toi pour accéder aux outils"
            : mode === "signup"
            ? "Crée ton compte gratuit"
            : "Réinitialise ton mot de passe"}
        </p>
      </div>

      {/* Tabs login / signup (cachés en mode forgot) */}
      {mode !== "forgot" && (
        <div className="grid grid-cols-2 gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => switchMode("login")}
            className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "login" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "signup" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Créer un compte
          </button>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bouton Google */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>

            {/* Séparateur */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ton@email.com"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {mode !== "forgot" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Mot de passe</label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {mode === "signup" && (
              <p className="text-xs text-gray-600 mt-1">Minimum 6 caractères</p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">
            ✓ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading
            ? "Chargement..."
            : mode === "login"
            ? "Se connecter"
            : mode === "signup"
            ? "Créer mon compte"
            : "Envoyer le lien de réinitialisation"}
        </button>

        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => switchMode("login")}
            className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors py-2"
          >
            ← Retour à la connexion
          </button>
        )}
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        En continuant, tu acceptes nos{" "}
        <Link href="/conditions" className="text-gray-400 hover:text-white underline">
          conditions d&apos;utilisation
        </Link>
      </p>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
