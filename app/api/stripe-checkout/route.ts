import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { userId, email, plan = "monthly" } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const priceId =
      plan === "annual"
        ? process.env.STRIPE_PRICE_ID_ANNUAL!
        : process.env.STRIPE_PRICE_ID!;

    if (!priceId) {
      return NextResponse.json({ error: "Plan non configuré" }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabaseId: userId },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .upsert({ id: userId, email, stripe_customer_id: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?canceled=true`,
      locale: "fr",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
