import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email de réception des messages (configurer dans les variables d'env)
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "contact@alltoolbox.fr";

export async function POST(req: NextRequest) {
  try {
    const { subject, category, message, email } = await req.json();

    if (!subject || !message?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Message trop court" }, { status: 400 });
    }

    if (message.trim().length > 5000) {
      return NextResponse.json({ error: "Message trop long (max 5000 caractères)" }, { status: 400 });
    }

    const categoryLabels: Record<string, string> = {
      bug: "🐛 Bug ou problème technique",
      suggestion: "💡 Suggestion d'outil",
      abonnement: "💳 Question sur l'abonnement",
      partenariat: "🤝 Partenariat",
      autre: "📩 Autre",
    };

    const categoryLabel = categoryLabels[category] ?? category;

    const { error } = await resend.emails.send({
      from: "ToolBox Contact <contact@alltoolbox.fr>",
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `[ToolBox] ${categoryLabel} — ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
          <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #1e293b;">
            <h2 style="margin: 0; color: #a78bfa; font-size: 20px;">⚡ ToolBox — Nouveau message</h2>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 140px; vertical-align: top;">Catégorie</td>
              <td style="padding: 8px 0; color: #e2e8f0; font-weight: bold;">${categoryLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; vertical-align: top;">Sujet</td>
              <td style="padding: 8px 0; color: #e2e8f0;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; vertical-align: top;">Email de l'auteur</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #a78bfa;">${email}</a></td>
            </tr>
          </table>

          <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</p>
          </div>

          <p style="margin: 0; color: #475569; font-size: 12px;">
            Réponds directement à cet email pour répondre à ${email}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Erreur lors de l'envoi. Réessaie dans quelques minutes." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
