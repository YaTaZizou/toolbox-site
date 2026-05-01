import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type SubWithPeriod = Stripe.Subscription & { current_period_end: number };

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
          periodEnd = (sub as unknown as SubWithPeriod).current_period_end;
        }
        await setPremium(supabaseId, true, periodEnd);
      }

      // Email de confirmation Premium
      const customerEmail = session.customer_email || session.customer_details?.email;
      if (customerEmail) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "ToolBox <contact@alltoolbox.fr>",
          to: customerEmail,
          subject: "Ton abonnement Premium est actif ! ⭐",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
              <h1 style="color: #eab308; font-size: 24px; margin-bottom: 16px;">⭐ Bienvenue dans ToolBox Premium !</h1>
              <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 16px;">Ton abonnement Premium est maintenant actif. Tu bénéficies de :</p>
              <ul style="color: #94a3b8; line-height: 2; padding-left: 16px; margin-bottom: 24px;">
                <li>✅ IA illimitée (correcteur, traducteur, OCR, amélioration d'image...)</li>
                <li>✅ Zéro publicité sur tous les outils</li>
                <li>✅ Accès à tous les outils Premium</li>
                <li>✅ Support prioritaire</li>
              </ul>
              <a href="https://alltoolbox.fr" style="display: inline-block; background: #a78bfa; color: #fff; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">Accéder aux outils →</a>
              <p style="color: #475569; font-size: 12px;">Gère ton abonnement depuis ton <a href="https://alltoolbox.fr/profil" style="color: #a78bfa;">espace membre</a>. Annulable à tout moment.</p>
            </div>
          `,
        }).catch(() => {}); // Silencieux
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
        const periodEnd = (sub as unknown as SubWithPeriod).current_period_end;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const supabaseId = await getSupabaseId(customerId);
        if (supabaseId) await setPremium(supabaseId, true, periodEnd);
      }
    }

    // ── Abonnement mis à jour (changement de plan, etc.) ─────────────────
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const periodEnd = (sub as SubWithPeriod).current_period_end;
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
    // On envoie un email d'avertissement pour que l'utilisateur mette à jour
    // ses infos de paiement avant que l'abonnement soit annulé.
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? "";
      console.warn(`Paiement échoué pour customer ${customerId} — Stripe va réessayer automatiquement.`);

      // Récupérer l'email du customer pour envoyer une notification
      try {
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = !customer.deleted
          ? (customer as Stripe.Customer).email
          : null;

        if (customerEmail) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "ToolBox <contact@alltoolbox.fr>",
            to: customerEmail,
            subject: "Problème de paiement sur ton abonnement Premium",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
                <h1 style="color: #f87171; font-size: 22px; margin-bottom: 16px;">⚠️ Problème avec ton paiement</h1>
                <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 16px;">
                  Nous n'avons pas pu débiter ta carte pour ton abonnement ToolBox Premium.
                  Stripe va réessayer automatiquement dans quelques jours.
                </p>
                <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 24px;">
                  Pour éviter une interruption de service, merci de vérifier tes informations de paiement dès maintenant.
                </p>
                <a href="https://alltoolbox.fr/profil" style="display: inline-block; background: #a78bfa; color: #fff; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
                  Mettre à jour mes infos de paiement →
                </a>
                <p style="color: #475569; font-size: 12px;">
                  Si tu as des questions, réponds à cet email. Ton accès Premium reste actif pendant la période de réessai.
                </p>
              </div>
            `,
          }).catch((emailErr: unknown) => {
            console.error("Échec envoi email payment_failed:", emailErr);
          });
        }
      } catch (emailFetchErr) {
        console.error("Erreur récupération customer pour email payment_failed:", emailFetchErr);
      }
    }
  } catch (err) {
    console.error("Erreur traitement webhook:", err);
    // On retourne 500 pour que Stripe réessaie l'événement (ex: si Supabase plante)
    return NextResponse.json({ error: "Erreur interne, retry requis" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
