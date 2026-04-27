import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const customerId = session.customer as string;

    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const supabaseId = customer.metadata?.supabaseId;

    if (supabaseId) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      await supabase
        .from("profiles")
        .update({ is_subscribed: true, subscription_end_date: endDate.toISOString() })
        .eq("id", supabaseId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const supabaseId = customer.metadata?.supabaseId;

    if (supabaseId) {
      await supabase
        .from("profiles")
        .update({ is_subscribed: false, subscription_end_date: null })
        .eq("id", supabaseId);
    }
  }

  return NextResponse.json({ received: true });
}
