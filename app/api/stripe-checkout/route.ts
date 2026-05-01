import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
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
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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
      await adminSupabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?canceled=true`,
      locale: "fr",
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
