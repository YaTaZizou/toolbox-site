"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const DAILY_LIMIT = 5;
const LOGIN_THRESHOLD = 3;
const storageKey = () => `toolbox_ai_${new Date().toISOString().slice(0, 10)}`;

export type AiLimitStatus = "ok" | "login_required" | "limit_reached";

export function useAiLimit() {
  const [count, setCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(storageKey()) ?? "0");
    setCount(stored);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
        const { data: prof } = await supabase
          .from("profiles").select("is_subscribed").eq("id", data.user.id).single();
        setIsPremium(prof?.is_subscribed === true);
      }
      setReady(true);
    });
  }, []);

  const remaining = isPremium ? Infinity : Math.max(0, DAILY_LIMIT - count);

  const status: AiLimitStatus = (() => {
    if (isPremium) return "ok";
    if (!isLoggedIn && count >= LOGIN_THRESHOLD) return "login_required";
    if (count >= DAILY_LIMIT) return "limit_reached";
    return "ok";
  })();

  const canUse = status === "ok";

  function increment() {
    if (isPremium) return;
    const next = count + 1;
    setCount(next);
    localStorage.setItem(storageKey(), String(next));
  }

  return { canUse, increment, remaining, count, isPremium, isLoggedIn, status, ready, limit: DAILY_LIMIT };
}
