"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Instance stable — ne recrée pas le client à chaque render
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
      .then(({ data }) => {
        if (!cancelled) {
          setEmail(data.user?.email ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!cancelled) {
        setEmail(session?.user?.email ?? null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  // Squelette pendant le chargement (évite le saut de mise en page)
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-800 animate-pulse" />
    );
  }

  if (email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profil"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title={email}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-gray-400 text-xs hidden md:block truncate max-w-[100px]">
            {email}
          </span>
        </Link>
        <button
          onClick={logout}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
          title="Se déconnecter"
          aria-label="Se déconnecter"
        >
          Quitter
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/connexion"
      className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 py-2 rounded-xl transition-colors"
    >
      Connexion
    </Link>
  );
}
