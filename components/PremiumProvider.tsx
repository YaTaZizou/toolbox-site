"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

type PremiumCtx = {
  isPremium: boolean;
  loading: boolean;
};

const PremiumContext = createContext<PremiumCtx>({ isPremium: false, loading: true });

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

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

    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) { setIsPremium(false); setLoading(false); }
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_subscribed")
          .eq("id", user.id)
          .single();
        if (!cancelled) {
          setIsPremium(profile?.is_subscribed === true);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setIsPremium(false); setLoading(false); }
      }
    }

    check();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      setLoading(true);
      check();
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <PremiumContext.Provider value={{ isPremium, loading }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremiumStatus() {
  return useContext(PremiumContext);
}
