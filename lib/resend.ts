import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resendClient = new Resend(key);
  return resendClient;
}

export async function sendOrderConfirmation(params: {
  to: string;
  orderId: string;
  productName: string;
  amountLabel: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const client = getResend();
  if (!client) {
    return {
      ok: false,
      reason: "Resend not configured (RESEND_API_KEY missing).",
    };
  }
  const from = process.env.RESEND_FROM ?? "contact@genome.download";
  const { to, orderId, productName, amountLabel } = params;
  const { error } = await client.emails.send({
    from,
    to,
    subject: `genome.download order ${orderId} confirmed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <p style="font-size: 32px; margin: 0 0 16px;">🧬</p>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Order confirmed</h1>
        <p style="font-size: 15px; color: #737373; line-height: 1.55; margin: 0 0 8px;">Thanks for your order. Here's what's next:</p>
        <ul style="font-size: 15px; color: #171717; line-height: 1.6; padding-left: 20px; margin: 0 0 20px;">
          <li>Your sample kit ships within 1 business day.</li>
          <li>Return it in the prepaid envelope.</li>
          <li>We'll email your VCF file one week after the lab receives your sample.</li>
        </ul>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="font-size: 13px; color: #737373; margin: 0 0 4px;">Order <strong style="color: #171717; font-family: monospace;">${orderId}</strong></p>
        <p style="font-size: 13px; color: #737373; margin: 0 0 4px;">${productName} — ${amountLabel}</p>
        <p style="font-size: 13px; color: #737373; margin: 24px 0 0;">Questions: <a href="mailto:contact@genome.download" style="color: #171717;">contact@genome.download</a></p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
