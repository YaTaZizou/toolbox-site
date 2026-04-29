/**
 * Server-side helpers for API route auth & premium checks.
 * Uses Supabase session cookies to verify premium status.
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { createServiceClient } from "./supabase";

export async function isPremiumRequest(req: NextRequest): Promise<boolean> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {}, // read-only in API routes
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const service = createServiceClient();
    const { data } = await service
      .from("profiles")
      .select("is_subscribed")
      .eq("id", user.id)
      .single();

    return data?.is_subscribed === true;
  } catch {
    return false;
  }
}
