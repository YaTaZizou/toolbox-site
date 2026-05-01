"use client";

import { useState, useEffect, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type Profile = {
  is_subscribed: boolean;
  subscription_end_date: string | null;
};

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdError, setPwdError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/connexion?redirect=/profil");
    }
  }, [loading, user, router]);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    let cancelled = false;

    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        if (cancelled) return;
        setUser(data.user ?? null);
        if (data.user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("is_subscribed, subscription_end_date")
            .eq("id", data.user.id)
            .single();
          if (!cancelled) {
            setProfile(prof ?? { is_subscribed: false, subscription_end_date: null });
          }
        }
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [supabase]);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères et 1 chiffre.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPwdLoading(true);
    setPwdError("");
    setPwdSuccess("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwdError(error.message);
    } else {
      setPwdSuccess("Mot de passe mis à jour !");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPwdLoading(false);
  }

  async function deleteAccount() {
    if (deleteConfirm !== "SUPPRIMER") return;
    setDeleteLoading(true);
    setDeleteError("");
    // Delete first — if signOut happens before the API call and the call fails,
    // the user would be logged out but their account would still exist.
    const res = await fetch("/api/delete-account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: "DELETE" }),
    });
    if (!res.ok) {
      const data = await res.json();
      setDeleteError(data.error || "Erreur lors de la suppression.");
      setDeleteLoading(false);
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // account already deleted, sign out failed — redirect anyway
    }
    router.push("/");
  }

  async function openStripePortal() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/stripe-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error || "Impossible d'ouvrir le portail Stripe");
      }
    } catch {
      setPortalError("Erreur réseau");
    } finally {
      setPortalLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!loading && !user) return null;

  const currentUser = user!;
  const initials = currentUser.email?.slice(0, 2).toUpperCase() ?? "??";
  const memberSince = new Date(currentUser.created_at).toLocaleDateString("fr-FR", {
    year: "numeric", month: "long", day: "numeric",
  });

  // Guard against race condition: if is_subscribed is still true in DB but
  // subscription_end_date is already in the past, treat the user as non-premium
  // on the client side. The webhook will eventually correct the DB.
  const subscriptionEndDateObj = profile?.subscription_end_date
    ? new Date(profile.subscription_end_date)
    : null;
  const isExpiredLocally =
    subscriptionEndDateObj !== null &&
    !profile?.subscription_end_date?.startsWith("2099") &&
    subscriptionEndDateObj < new Date();
  const isPremium = profile?.is_subscribed === true && !isExpiredLocally;

  const endDate = subscriptionEndDateObj
    ? subscriptionEndDateObj.toLocaleDateString("fr-FR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;
  const isLifetime = profile?.subscription_end_date?.startsWith("2099");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      {/* Header profil */}
      <div className="flex items-center gap-5 mb-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 ${isPremium ? "bg-yellow-500" : "bg-purple-600"}`}>
          {isPremium ? "⭐" : initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{currentUser.email}</h1>
            {isPremium && (
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-yellow-500/30">
                PREMIUM
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-0.5">Membre depuis le {memberSince}</p>
        </div>
      </div>

      {/* Statut abonnement */}
      <div className={`rounded-2xl p-5 mb-4 flex flex-wrap items-center justify-between gap-2 border ${
        isPremium
          ? "bg-yellow-500/5 border-yellow-500/20"
          : "bg-gray-900 border-gray-800"
      }`}>
        <div>
          <p className="font-semibold text-white">Abonnement</p>
          {isPremium ? (
            <p className="text-sm text-yellow-400 mt-0.5">
              {isLifetime ? "⭐ Premium à vie — Merci !" : `Prochain renouvellement : ${endDate}`}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-0.5">Accès à tous les outils gratuits</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isPremium ? (
            <>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full font-bold border border-yellow-500/30">
                  ⭐ Premium
                </span>
                <button
                  onClick={openStripePortal}
                  disabled={portalLoading}
                  className="text-xs text-gray-400 hover:text-white underline transition-colors disabled:opacity-40"
                >
                  {portalLoading ? "Chargement..." : "Gérer l'abonnement →"}
                </button>
              </div>
              {portalError && (
                <p className="text-red-400 text-xs mt-2 w-full">{portalError}</p>
              )}
            </>
          ) : (
            <>
              <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full font-medium">
                Gratuit
              </span>
              <Link
                href="/premium"
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full transition-colors"
              >
                ⭐ Passer Premium
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Changer mot de passe */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
        <h2 className="font-bold text-white mb-4">🔑 Changer le mot de passe</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
            />
          </div>
          {pwdError && <p className="text-red-400 text-sm">{pwdError}</p>}
          {pwdSuccess && <p className="text-green-400 text-sm">✓ {pwdSuccess}</p>}
          <button
            type="submit"
            disabled={pwdLoading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            {pwdLoading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>

      {/* Déconnexion */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
        <h2 className="font-bold text-white mb-2">👋 Déconnexion</h2>
        <p className="text-gray-500 text-sm mb-4">Tu seras redirigé vers la page de connexion.</p>
        <button
          onClick={logout}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Se déconnecter
        </button>
      </div>

      {/* Zone danger */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h2 className="font-bold text-red-400 mb-2">⚠️ Zone dangereuse</h2>
        <p className="text-gray-500 text-sm mb-4">
          La suppression est <strong className="text-gray-300">irréversible</strong>. Tape{" "}
          <code className="text-red-400 bg-red-500/10 px-1 rounded">SUPPRIMER</code> pour confirmer.
        </p>
        <input
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="SUPPRIMER"
          className="w-full bg-gray-900 border border-red-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors text-sm mb-3"
        />
        {deleteError && <p className="text-red-400 text-sm mb-3">{deleteError}</p>}
        <button
          onClick={deleteAccount}
          disabled={deleteConfirm !== "SUPPRIMER" || deleteLoading}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {deleteLoading ? "Suppression..." : "Supprimer mon compte"}
        </button>
      </div>
    </div>
  );
}
