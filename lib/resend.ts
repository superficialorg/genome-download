import { Resend } from "resend";
import { getCountry } from "./shipping";

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
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
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
  shippingFeeCents: number;
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
  const country = getCountry(s.countryCode);
  const countryName = country?.name ?? s.countryCode;
  const lines = [
    s.name,
    s.line1,
    ...(s.line2 ? [s.line2] : []),
    `${s.city}, ${s.state} ${s.postalCode}`,
    countryName,
    ...(s.phone ? [s.phone] : []),
  ];
  return lines.map((l) => escapeHtml(l)).join("<br />");
}

function renderOrderSummaryTable(params: OrderEmailParams): string {
  const {
    productName,
    listPriceCents,
    amountPaidCents,
    shippingFeeCents,
    coupon,
  } = params;
  const hasDiscount = coupon && coupon.discountCents > 0;
  const hasShipping = shippingFeeCents > 0;
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
      ${
        hasShipping
          ? `<tr>
              <td style="padding: 6px 0; color: #737373;">International shipping</td>
              <td style="padding: 6px 0; text-align: right; font-family: monospace;">${formatUsd(shippingFeeCents)}</td>
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
  const from = (
    process.env.RESEND_FROM ?? "Genome Computer <contact@genome.computer>"
  ).trim();
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
          <li>We'll email your .genome bundle and the readmygenome.md skill one week after the lab receives your sample (4–6 weeks for whole genome sequencing). VCF available on request.</li>
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

  const from = (
    process.env.RESEND_FROM ?? "Genome Computer <contact@genome.computer>"
  ).trim();
  const { orderId, productName, amountPaidCents, coupon, shipping, paymentIntentId } =
    params;
  const stripeUrl = `https://dashboard.stripe.com/payments/${encodeURIComponent(paymentIntentId)}`;
  const couponLine = coupon
    ? `${escapeHtml(coupon.code)} — −${formatUsd(coupon.discountCents)}${coupon.description ? ` (${escapeHtml(coupon.description)})` : ""}`
    : "—";

  const subject = `🧬 New order · ${productName} · ${formatUsd(amountPaidCents)} · ${shipping.name} · ${shipping.countryCode}`;
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


// ---------- .genome conversion service ----------

function getResendFrom(): string {
  return (
    process.env.RESEND_FROM ?? "Genome Computer <contact@genome.computer>"
  ).trim();
}

function getConvertBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://genome.computer"
  ).replace(/\/$/, "");
}

export async function sendConversionUploadLink(params: {
  orderId: string;
  email: string;
  uploadToken: string;
  expiresAt: string;
  customerName?: string | null;
}): Promise<{ ok: boolean; reason?: string }> {
  const client = getResend();
  if (!client) {
    return { ok: false, reason: "Resend not configured (RESEND_API_KEY missing)." };
  }
  const url = `${getConvertBaseUrl()}/upload/${encodeURIComponent(
    params.orderId
  )}?t=${encodeURIComponent(params.uploadToken)}`;
  const greeting = params.customerName
    ? `Hi ${escapeHtml(params.customerName.split(" ")[0] ?? "")},`
    : "Hi,";
  const { error } = await client.emails.send({
    from: getResendFrom(),
    to: params.email,
    subject: "Upload your DNA file for .genome conversion",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <p style="font-size: 32px; margin: 0 0 16px;">🧬</p>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">You're in the queue.</h1>
        <p style="font-size: 15px; line-height: 1.55; margin: 0 0 16px;">${greeting}</p>
        <p style="font-size: 15px; line-height: 1.55; margin: 0 0 16px;">Thanks for your order. Upload your DNA file using the link below. It's encrypted in transit and at rest; nobody sees it but you and us.</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #171717; color: #fff; text-decoration: none; font-size: 14px; font-weight: 500;">Upload your file →</a>
        </p>
        <p style="font-size: 13px; color: #737373; line-height: 1.55; margin: 0 0 12px;">The link expires ${new Date(params.expiresAt).toUTCString()}. If it expires, reply to this email and we'll send a fresh one.</p>
        <p style="font-size: 13px; color: #737373; line-height: 1.55; margin: 0 0 8px;">Accepted formats: <code style="font-family: monospace;">.txt</code> (23andMe, Ancestry, MyHeritage), <code style="font-family: monospace;">.vcf</code>, <code style="font-family: monospace;">.vcf.gz</code>. Up to 25 GB.</p>
        <p style="font-size: 13px; color: #737373; line-height: 1.55; margin: 0;">You'll hear back within 48 hours with your .genome bundle and the <code style="font-family: monospace;">readmygenome.md</code> skill.</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="font-size: 12px; color: #a3a3a3; margin: 0;">Order <strong style="color: #737373; font-family: monospace;">${escapeHtml(params.orderId)}</strong></p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function sendConversionReady(params: {
  orderId: string;
  email: string;
  bundleUrl: string;
  customerName?: string | null;
  counts?: {
    totalVariants?: number;
    actionable?: number;
    consensusDamaging?: number;
    pgsTraits?: number;
  };
}): Promise<{ ok: boolean; reason?: string }> {
  const client = getResend();
  if (!client) {
    return { ok: false, reason: "Resend not configured." };
  }
  const greeting = params.customerName
    ? `Hi ${escapeHtml(params.customerName.split(" ")[0] ?? "")},`
    : "Hi,";
  const counts = params.counts;
  const countsBlock = counts
    ? `
      <h2 style="font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 24px 0 8px;">What's in your bundle</h2>
      <ul style="font-size: 14px; color: #171717; line-height: 1.7; padding-left: 20px; margin: 0 0 16px;">
        ${typeof counts.totalVariants === "number" ? `<li>${counts.totalVariants.toLocaleString()} variant calls</li>` : ""}
        ${typeof counts.actionable === "number" ? `<li>${counts.actionable} ACMG-SF actionable variant${counts.actionable === 1 ? "" : "s"}</li>` : ""}
        ${typeof counts.consensusDamaging === "number" ? `<li>${counts.consensusDamaging} consensus-damaging missense</li>` : ""}
        ${typeof counts.pgsTraits === "number" ? `<li>${counts.pgsTraits} polygenic scores across traits</li>` : ""}
      </ul>
    `
    : "";
  const { error } = await client.emails.send({
    from: getResendFrom(),
    to: params.email,
    subject: "Your .genome bundle is ready",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <p style="font-size: 32px; margin: 0 0 16px;">🧬</p>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Your .genome bundle is ready.</h1>
        <p style="font-size: 15px; line-height: 1.55; margin: 0 0 16px;">${greeting}</p>
        <p style="font-size: 15px; line-height: 1.55; margin: 0 0 16px;">Your conversion is done. The link below opens a signed download of your <code style="font-family: monospace;">.genome.tar.gz</code> bundle. It includes the <code style="font-family: monospace;">readmygenome.md</code> skill and a <code style="font-family: monospace;">README.md</code> with DuckDB queries you can run right away.</p>
        <p style="margin: 24px 0;">
          <a href="${params.bundleUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #171717; color: #fff; text-decoration: none; font-size: 14px; font-weight: 500;">Download your bundle →</a>
        </p>
        <p style="font-size: 13px; color: #737373; line-height: 1.55; margin: 0 0 16px;">This link expires in 24 hours. If it expires, reply to this email and we'll send a fresh one.</p>
        ${countsBlock}
        <p style="font-size: 13px; color: #737373; line-height: 1.55; margin: 16px 0 0;">Everything in the bundle is data, not a diagnosis. Statistical flags like <code style="font-family: monospace;">is_actionable</code> or <code style="font-family: monospace;">consensus_damaging</code> warrant confirmation with a clinician before acting.</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="font-size: 12px; color: #a3a3a3; margin: 0;">Order <strong style="color: #737373; font-family: monospace;">${escapeHtml(params.orderId)}</strong></p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

// ---------- Genome API: partner access requests ----------

export type ApiAccessRequestEmailParams = {
  requestId: string;
  name: string;
  email: string;
  company: string;
  website: string | null;
  useCase: string;
  volume: string;
  description: string;
};

export async function sendApiAccessRequestNotification(
  params: ApiAccessRequestEmailParams
): Promise<{ ok: boolean; reason?: string }> {
  const notify = process.env.API_ACCESS_NOTIFY_EMAIL ?? process.env.ORDER_NOTIFY_EMAIL;
  if (!notify) {
    return {
      ok: false,
      reason: "Neither API_ACCESS_NOTIFY_EMAIL nor ORDER_NOTIFY_EMAIL set.",
    };
  }
  const client = getResend();
  if (!client) {
    return { ok: false, reason: "Resend not configured (RESEND_API_KEY missing)." };
  }
  const to = notify
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const { error } = await client.emails.send({
    from: getResendFrom(),
    to,
    replyTo: params.email,
    subject: `🧬 Genome API access request · ${params.company}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 16px;">🧬 New API access request</h1>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 0 0 8px;">Contact</h2>
        <p style="font-size: 14px; line-height: 1.55; color: #171717; margin: 0 0 16px;">
          <strong>${escapeHtml(params.name)}</strong><br />
          <a href="mailto:${escapeHtml(params.email)}" style="color: #171717;">${escapeHtml(params.email)}</a>
        </p>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 0 0 8px;">Company</h2>
        <p style="font-size: 14px; line-height: 1.55; color: #171717; margin: 0 0 16px;">
          <strong>${escapeHtml(params.company)}</strong>${
            params.website
              ? `<br /><a href="${escapeHtml(params.website)}" style="color: #171717;">${escapeHtml(params.website)}</a>`
              : ""
          }
        </p>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 0 0 8px;">Use case</h2>
        <p style="font-size: 14px; line-height: 1.55; color: #171717; margin: 0 0 4px;">
          ${escapeHtml(params.useCase)}
        </p>
        <p style="font-size: 13px; color: #737373; margin: 0 0 16px;">
          Expected volume: ${escapeHtml(params.volume)}
        </p>

        <h2 style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #737373; margin: 0 0 8px;">What they're building</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #171717; margin: 0 0 16px; white-space: pre-wrap;">${escapeHtml(params.description)}</p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="font-size: 12px; color: #a3a3a3; margin: 0;">Request <strong style="color: #737373; font-family: monospace;">${escapeHtml(params.requestId)}</strong></p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function sendConversionOperatorAlert(params: {
  orderId: string;
  email: string;
  reason: "new_job" | "upload_ready" | "failed";
  error?: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const notify = process.env.ORDER_NOTIFY_EMAIL;
  if (!notify) {
    return { ok: false, reason: "ORDER_NOTIFY_EMAIL not set." };
  }
  const client = getResend();
  if (!client) {
    return { ok: false, reason: "Resend not configured." };
  }
  const subjects = {
    new_job: `🧬 .genome conversion paid · ${params.email}`,
    upload_ready: `🧬 .genome conversion ready to process · ${params.email}`,
    failed: `⚠️ .genome conversion failed · ${params.email}`,
  };
  const adminUrl = `${getConvertBaseUrl()}/admin/conversions`;
  const body = {
    new_job: "Customer paid; upload link emailed. No action needed yet.",
    upload_ready:
      `Customer finished their upload. Go to <a href="${adminUrl}" style="color: #171717;">the admin dashboard</a> and click <strong>Process</strong> on the pending row to approve the conversion. The annotator picks it up within ~15 seconds.`,
    failed: `Conversion failed. Review in <a href="${adminUrl}" style="color: #171717;">admin</a>; click <strong>retry</strong> or refund via Stripe.${
      params.error ? `<br /><br /><pre style="font-size: 12px; background: #f5f5f5; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(params.error.slice(0, 1500))}</pre>` : ""
    }`,
  };
  const to = notify
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const { error } = await client.emails.send({
    from: getResendFrom(),
    to,
    subject: subjects[params.reason],
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <p style="margin: 0 0 12px;">${body[params.reason]}</p>
        <p style="font-size: 13px; color: #737373; margin: 0;">Order <strong style="color: #171717; font-family: monospace;">${escapeHtml(params.orderId)}</strong><br />Customer: <a href="mailto:${escapeHtml(params.email)}" style="color: #171717;">${escapeHtml(params.email)}</a></p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function sendOAuthSigninCode(params: {
  email: string;
  code: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const client = getResend();
  if (!client) {
    return { ok: false, reason: "Resend not configured." };
  }
  const { error } = await client.emails.send({
    from: getResendFrom(),
    to: params.email,
    subject: "Your Genome Computer sign-in code",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <p style="font-size: 32px; margin: 0 0 16px;">🧬</p>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Sign in to Genome Computer</h1>
        <p style="font-size: 15px; color: #737373; line-height: 1.55; margin: 0 0 16px;">Use this code to connect your genome to Codex or another MCP client.</p>
        <p style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 28px; letter-spacing: 0.12em; margin: 24px 0; color: #171717;">${escapeHtml(params.code)}</p>
        <p style="font-size: 13px; color: #737373; line-height: 1.55; margin: 0;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
      </div>
    `,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
