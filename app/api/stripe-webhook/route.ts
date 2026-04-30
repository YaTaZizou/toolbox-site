import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getSupabaseId(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return (customer as Stripe.Customer).metadata?.supabaseId ?? null;
  } catch {
    return null;
  }
}

async function setPremium(supabaseId: string, active: boolean, periodEnd?: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await supabase
    .from("profiles")
    .update({
      is_subscribed: active,
      subscription_end_date: active && periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    })
    .eq("id", supabaseId);

  // Si Supabase plante, on throw pour forcer le retry Stripe
  if (error) throw new Error(`Supabase update failed: ${error.message}`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    // ── Premier paiement (checkout complété) ──────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const supabaseId = await getSupabaseId(customerId);

      if (supabaseId) {
        let periodEnd: number | undefined;
        if (typeof session.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
        }
        await setPremium(supabaseId, true, periodEnd);
      }
    }

    // ── Renouvellement automatique ────────────────────────────────────────
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      // billing_reason = "subscription_cycle" => renouvellement
      const billingReason = (invoice as unknown as { billing_reason: string }).billing_reason;
      const subscriptionId = (invoice as unknown as { subscription?: string }).subscription;

      if (billingReason === "subscription_cycle" && subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const supabaseId = await getSupabaseId(customerId);
        if (supabaseId) await setPremium(supabaseId, true, periodEnd);
      }
    }

    // ── Abonnement mis à jour (changement de plan, etc.) ─────────────────
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
      const isActive = sub.status === "active" || sub.status === "trialing";
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const supabaseId = await getSupabaseId(customerId);
      if (supabaseId) await setPremium(supabaseId, isActive, isActive ? periodEnd : undefined);
    }

    // ── Annulation / paiement échoué ─────────────────────────────────────
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const supabaseId = await getSupabaseId(customerId);
      if (supabaseId) await setPremium(supabaseId, false);
    }

    // ── Échec de paiement : on NE révoque PAS immédiatement ─────────────────
    // Stripe réessaie automatiquement (dunning). L'accès sera coupé seulement
    // si customer.subscription.updated passe en "canceled" ou "unpaid".
    // invoice.payment_failed est loggué uniquement pour debug.
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? "";
      console.warn(`Paiement échoué pour customer ${customerId} — Stripe va réessayer automatiquement.`);
    }
  } catch (err) {
    console.error("Erreur traitement webhook:", err);
    // On retourne 500 pour que Stripe réessaie l'événement (ex: si Supabase plante)
    return NextResponse.json({ error: "Erreur interne, retry requis" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
