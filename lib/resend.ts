import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resendClient = new Resend(key);
  return resendClient;
}

export type ShippingAddress = {
  name: string;
  email: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
};

export type AppliedCouponSummary = {
  code: string;
  discountCents: number;
  description?: string;
};

export type OrderEmailParams = {
  orderId: string;
  productName: string;
  listPriceCents: number;
  amountPaidCents: number;
  coupon: AppliedCouponSummary | null;
  shipping: ShippingAddress;
  paymentIntentId: string;
};

function formatUsd(amountCents: number): string {
  if (amountCents % 100 === 0) return `$${amountCents / 100}`;
  return `$${(amountCents / 100).toFixed(2)}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderAddressLines(s: ShippingAddress): string {
  const lines = [
    s.name,
    s.line1,
    ...(s.line2 ? [s.line2] : []),
    `${s.city}, ${s.state} ${s.postalCode}`,
  ];
  return lines.map((l) => escapeHtml(l)).join("<br />");
}

function renderOrderSummaryTable(params: OrderEmailParams): string {
  const { productName, listPriceCents, amountPaidCents, coupon } = params;
  const hasDiscount = coupon && coupon.discountCents > 0;
  const discountLabel = coupon?.description
    ? `Discount (${escapeHtml(coupon.code)} — ${escapeHtml(coupon.description)})`
    : `Discount (${escapeHtml(coupon?.code ?? "")})`;
  return `
    <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; font-size: 14px; color: #171717;">
      <tr>
        <td style="padding: 6px 0; color: #737373;">${escapeHtml(productName)}</td>
        <td style="padding: 6px 0; text-align: right; font-family: monospace;">${formatUsd(listPriceCents)}</td>
      </tr>
      ${
        hasDiscount
          ? `<tr>
              <td style="padding: 6px 0; color: #737373;">${discountLabel}</td>
              <td style="padding: 6px 0; text-align: right; font-family: monospace;">−${formatUsd(coupon.discountCents)}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="padding: 10px 0 0; border-top: 1px solid #e5e5e5; font-weight: 600;">Total</td>
        <td style="padding: 10px 0 0; border-top: 1px solid #e5e5e5; text-align: right; font-family: monospace; font-weight: 600;">${formatUsd(amountPaidCents)}</td>
      </tr>
    </table>
  `;
}

export async function sendOrderConfirmation(
  params: OrderEmailParams
): Promise<{ ok: boolean; reason?: string }> {
  const client = getResend();
  if (!client) {
    return {
      ok: false,
      reason: "Resend not configured (RESEND_API_KEY missing).",
    };
  }
  const from = (process.env.RESEND_FROM ?? "contact@genome.computer").trim();
  const { orderId, shipping } = params;
  const { error } = await client.emails.send({
    from,
    to: shipping.email,
    subject: `The Genome Computer Company — order ${orderId} confirmed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <p style="font-size: 32px; margin: 0 0 16px;">🧬</p>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Order confirmed</h1>
        <p style="font-size: 15px; color: #737373; line-height: 1.55; margin: 0 0 8px;">Thanks for your order. Here's what's next:</p>
        <ul style="font-size: 15px; color: #171717; line-height: 1.6; padding-left: 20px; margin: 0 0 24px;">
          <li>Your sample kit ships within 1 business day.</li>
          <li>Return it in the prepaid envelope.</li>
          <li>We'll email your .genome bundle and the readmygenome.md Claude skill one week after the lab receives your sample (4–6 weeks for whole genome sequencing). VCF available on request.</li>
        </ul>

        <h2 style="font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 0 0 8px;">Order summary</h2>
        ${renderOrderSummaryTable(params)}

        <h2 style="font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 24px 0 8px;">Shipping to</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #171717; margin: 0;">${renderAddressLines(shipping)}</p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="font-size: 13px; color: #737373; margin: 0 0 4px;">Order <strong style="color: #171717; font-family: monospace;">${escapeHtml(orderId)}</strong></p>
        <p style="font-size: 13px; color: #737373; margin: 24px 0 0;">Questions: <a href="mailto:contact@genome.computer" style="color: #171717;">contact@genome.computer</a></p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function sendOrderNotification(
  params: OrderEmailParams
): Promise<{ ok: boolean; reason?: string }> {
  const notify = process.env.ORDER_NOTIFY_EMAIL;
  if (!notify) {
    return {
      ok: false,
      reason: "ORDER_NOTIFY_EMAIL not set — operator notification skipped.",
    };
  }
  const client = getResend();
  if (!client) {
    return {
      ok: false,
      reason: "Resend not configured (RESEND_API_KEY missing).",
    };
  }
  const to = notify
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) {
    return { ok: false, reason: "ORDER_NOTIFY_EMAIL is empty." };
  }

  const from = (process.env.RESEND_FROM ?? "contact@genome.computer").trim();
  const { orderId, productName, amountPaidCents, coupon, shipping, paymentIntentId } =
    params;
  const stripeUrl = `https://dashboard.stripe.com/payments/${encodeURIComponent(paymentIntentId)}`;
  const couponLine = coupon
    ? `${escapeHtml(coupon.code)} — −${formatUsd(coupon.discountCents)}${coupon.description ? ` (${escapeHtml(coupon.description)})` : ""}`
    : "—";

  const subject = `🧬 New order · ${productName} · ${formatUsd(amountPaidCents)} · ${shipping.name}`;
  const { error } = await client.emails.send({
    from,
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 16px;">🧬 New order</h1>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 0 0 8px;">Order</h2>
        ${renderOrderSummaryTable(params)}
        <p style="font-size: 13px; color: #737373; margin: 8px 0 0;">Order <strong style="color: #171717; font-family: monospace;">${escapeHtml(orderId)}</strong></p>
        <p style="font-size: 13px; color: #737373; margin: 4px 0 0;">Coupon: ${couponLine}</p>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 24px 0 8px;">Customer</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #171717; margin: 0;">
          ${escapeHtml(shipping.name)}<br />
          <a href="mailto:${escapeHtml(shipping.email)}" style="color: #171717;">${escapeHtml(shipping.email)}</a>
        </p>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 24px 0 8px;">Ship to</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #171717; margin: 0;">${renderAddressLines(shipping)}</p>

        <p style="margin: 24px 0 0;">
          <a href="${stripeUrl}" style="display: inline-block; padding: 8px 14px; border-radius: 8px; background: #171717; color: #fff; text-decoration: none; font-size: 13px; font-weight: 500;">View in Stripe →</a>
        </p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
