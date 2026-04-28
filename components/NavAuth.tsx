"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  if (loading) return null;

  if (email) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profil"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-gray-400 text-xs hidden md:block truncate max-w-[100px]">{email}</span>
        </Link>
        <button
          onClick={logout}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors"
        >
          ↪
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
