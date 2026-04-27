"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  if (email) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-xs hidden md:block truncate max-w-[120px]">{email}</span>
        <button
          onClick={logout}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-xl transition-colors"
    >
      Connexion
    </Link>
  );
}
