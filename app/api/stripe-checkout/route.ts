import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Rate limiting : 10 tentatives par jour par IP
    const ip = getClientIp(req);
    const { allowed } = await checkRateLimitAsync(`stripe-checkout:${ip}`, 10);
    if (!allowed) {
      return NextResponse.json({ error: "Trop de requêtes. Réessaie plus tard." }, { status: 429 });
    }

    // ── Vérification de session côté serveur (JAMAIS faire confiance au body) ──
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // userId et email viennent de la session vérifiée, pas du body
    const userId = user.id;
    const email = user.email ?? "";

    // ── Plan (monthly | annual) depuis le body ────────────────────────────
    const body = await req.json().catch(() => ({}));
    const plan = body.plan === "annual" ? "annual" : "monthly";

    const priceId =
      plan === "annual"
        ? process.env.STRIPE_PRICE_ID_ANNUAL!
        : process.env.STRIPE_PRICE_ID!;

    if (!priceId) {
      return NextResponse.json({ error: "Plan non configuré" }, { status: 500 });
    }

    // ── Récupérer ou créer le customer Stripe ────────────────────────────
    const adminSupabase = createServiceClient();

    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("stripe_customer_id, is_subscribed")
      .eq("id", userId)
      .single();

    // Bloquer si déjà abonné
    if (profile?.is_subscribed) {
      return NextResponse.json(
        { error: "Tu es déjà abonné Premium" },
        { status: 409 }
      );
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabaseId: userId },
      });
      customerId = customer.id;
      const { error: updateErr } = await adminSupabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
      if (updateErr) {
        console.error("Failed to save stripe_customer_id:", updateErr.message);
        // Non-fatal: metadata on the Stripe customer still links to supabaseId
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?canceled=true`,
      locale: "fr",
      subscription_data: {
        trial_period_days: 7,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
