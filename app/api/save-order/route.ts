import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isTierSlug } from "@/lib/products";
import { saveOrder } from "@/lib/supabase";
import {
  sendOrderConfirmation,
  sendOrderNotification,
  type AppliedCouponSummary,
} from "@/lib/resend";
import { isSupportedCountry } from "@/lib/shipping";

export const runtime = "nodejs";

type ShippingPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  line1?: unknown;
  line2?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
  countryCode?: unknown;
};

function parseShipping(
  raw: unknown,
  opts: { digital: boolean } = { digital: false }
): {
  ok: true;
  value: {
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
} | { ok: false; reason: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, reason: "Missing shipping object." };
  }
  const s = raw as ShippingPayload;
  const requiredStr = (v: unknown, k: string) => {
    if (typeof v !== "string" || !v.trim()) {
      return `Missing ${k}.`;
    }
    return null;
  };

  // Digital products: only name + email are required. Return stub strings
  // for the physical-address fields so downstream storage stays compatible.
  if (opts.digital) {
    for (const [k, v] of [
      ["name", s.name],
      ["email", s.email],
    ] as const) {
      const err = requiredStr(v, k);
      if (err) return { ok: false, reason: err };
    }
    return {
      ok: true,
      value: {
        name: (s.name as string).trim(),
        email: (s.email as string).trim(),
        phone: null,
        line1: "N/A (digital delivery)",
        line2: null,
        city: "N/A",
        state: "N/A",
        postalCode: "N/A",
        countryCode: "US",
      },
    };
  }

  for (const [k, v] of [
    ["name", s.name],
    ["email", s.email],
    ["line1", s.line1],
    ["city", s.city],
    ["state", s.state],
    ["postalCode", s.postalCode],
    ["countryCode", s.countryCode],
  ] as const) {
    const err = requiredStr(v, k);
    if (err) return { ok: false, reason: err };
  }
  const countryCode = (s.countryCode as string).trim().toUpperCase();
  if (!isSupportedCountry(countryCode)) {
    return {
      ok: false,
      reason: `We don't ship to ${countryCode} yet.`,
    };
  }
  return {
    ok: true,
    value: {
      name: (s.name as string).trim(),
      email: (s.email as string).trim(),
      phone:
        typeof s.phone === "string" && s.phone.trim()
          ? (s.phone as string).trim()
          : null,
      line1: (s.line1 as string).trim(),
      line2:
        typeof s.line2 === "string" && s.line2.trim()
          ? (s.line2 as string).trim()
          : null,
      city: (s.city as string).trim(),
      state: (s.state as string).trim(),
      postalCode: (s.postalCode as string).trim(),
      countryCode,
    },
  };
}

export async function POST(request: Request) {
  let body: {
    tier?: unknown;
    paymentIntentId?: unknown;
    shipping?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const tier = body.tier;
  if (typeof tier !== "string" || !isTierSlug(tier)) {
    return NextResponse.json(
      { ok: false, error: "Unknown tier." },
      { status: 400 }
    );
  }
  const paymentIntentId = body.paymentIntentId;
  if (typeof paymentIntentId !== "string" || !paymentIntentId.startsWith("pi_")) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid paymentIntentId." },
      { status: 400 }
    );
  }
  const productForShipping = PRODUCTS[tier];
  const shipping = parseShipping(body.shipping, {
    digital: productForShipping.kind === "digital",
  });
  if (!shipping.ok) {
    return NextResponse.json(
      { ok: false, error: shipping.reason },
      { status: 400 }
    );
  }

  const product = PRODUCTS[tier];

  // Verify payment actually succeeded on Stripe — never trust client.
  // Compute the expected max amount = list price + shipping fee as recorded
  // on the PaymentIntent at creation time (server-authoritative).
  let chargedAmount = product.priceCents;
  let shippingFeeCents = 0;
  let coupon: AppliedCouponSummary | null = null;
  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { ok: false, error: `Payment status is ${intent.status}, not succeeded.` },
        { status: 402 }
      );
    }
    const md = intent.metadata ?? {};
    const metaShipping =
      typeof md.shipping_fee_cents === "string"
        ? Number(md.shipping_fee_cents)
        : 0;
    shippingFeeCents = Number.isFinite(metaShipping) ? metaShipping : 0;
    const maxAllowed = product.priceCents + shippingFeeCents;
    if (intent.amount > maxAllowed) {
      return NextResponse.json(
        { ok: false, error: "Payment amount exceeds expected total." },
        { status: 400 }
      );
    }
    chargedAmount = intent.amount;
    const metaCode = typeof md.coupon_code === "string" ? md.coupon_code : null;
    const metaDiscount =
      typeof md.discount_cents === "string" ? Number(md.discount_cents) : NaN;
    if (metaCode && Number.isFinite(metaDiscount) && metaDiscount > 0) {
      coupon = { code: metaCode, discountCents: metaDiscount };
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not verify payment.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  // Persist order.
  const save = await saveOrder({
    tier,
    email: shipping.value.email,
    name: shipping.value.name,
    phone: shipping.value.phone,
    address_line1: shipping.value.line1,
    address_line2: shipping.value.line2,
    city: shipping.value.city,
    state: shipping.value.state,
    postal_code: shipping.value.postalCode,
    country_code: shipping.value.countryCode,
    amount_cents: chargedAmount,
    shipping_fee_cents: shippingFeeCents,
    payment_intent_id: paymentIntentId,
  });

  // Prefer the friendly `order_number` (e.g. GC-ABC123…) for customer-facing
  // display; fall back to the Supabase UUID, and finally to the Stripe
  // PaymentIntent id if the DB insert failed entirely.
  let orderId: string;
  if (save.ok) {
    orderId = save.order.order_number || save.order.id;
  } else {
    console.error("saveOrder failed:", save.reason);
    orderId = paymentIntentId;
  }

  // Best-effort emails. Don't block on failure.
  const emailPayload = {
    orderId,
    productName: product.name,
    listPriceCents: product.priceCents,
    amountPaidCents: chargedAmount,
    shippingFeeCents,
    coupon,
    shipping: {
      name: shipping.value.name,
      email: shipping.value.email,
      phone: shipping.value.phone,
      line1: shipping.value.line1,
      line2: shipping.value.line2,
      city: shipping.value.city,
      state: shipping.value.state,
      postalCode: shipping.value.postalCode,
      countryCode: shipping.value.countryCode,
    },
    paymentIntentId,
  };

  // Kit-oriented confirmation + operator-notification emails.
  // DIGITAL (.genome conversion) orders are emailed separately by the
  // Stripe webhook handler (sendConversionUploadLink +
  // sendConversionOperatorAlert) — those emails include the upload link.
  // Firing the kit templates here would send a second, confusingly-wrong
  // "your kit ships in 1 business day" email to conversion customers.
  if (product.kind !== "digital") {
    try {
      const result = await sendOrderConfirmation(emailPayload);
      if (!result.ok) console.warn("sendOrderConfirmation:", result.reason);
    } catch (err) {
      console.warn("sendOrderConfirmation error:", err);
    }

    try {
      const result = await sendOrderNotification(emailPayload);
      if (!result.ok) console.info("sendOrderNotification:", result.reason);
    } catch (err) {
      console.warn("sendOrderNotification error:", err);
    }
  }

  return NextResponse.json({ ok: true, orderId });
}
