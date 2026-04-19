import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isTierSlug } from "@/lib/products";
import { saveOrder } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/resend";

export const runtime = "nodejs";

type ShippingPayload = {
  name?: unknown;
  email?: unknown;
  line1?: unknown;
  line2?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
};

function parseShipping(raw: unknown): {
  ok: true;
  value: {
    name: string;
    email: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
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
  for (const [k, v] of [
    ["name", s.name],
    ["email", s.email],
    ["line1", s.line1],
    ["city", s.city],
    ["state", s.state],
    ["postalCode", s.postalCode],
  ] as const) {
    const err = requiredStr(v, k);
    if (err) return { ok: false, reason: err };
  }
  return {
    ok: true,
    value: {
      name: (s.name as string).trim(),
      email: (s.email as string).trim(),
      line1: (s.line1 as string).trim(),
      line2: typeof s.line2 === "string" && s.line2.trim() ? (s.line2 as string).trim() : null,
      city: (s.city as string).trim(),
      state: (s.state as string).trim(),
      postalCode: (s.postalCode as string).trim(),
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
  const shipping = parseShipping(body.shipping);
  if (!shipping.ok) {
    return NextResponse.json(
      { ok: false, error: shipping.reason },
      { status: 400 }
    );
  }

  const product = PRODUCTS[tier];

  // Verify payment actually succeeded on Stripe — never trust client.
  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { ok: false, error: `Payment status is ${intent.status}, not succeeded.` },
        { status: 402 }
      );
    }
    if (intent.amount !== product.priceCents) {
      return NextResponse.json(
        { ok: false, error: "Payment amount does not match product price." },
        { status: 400 }
      );
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
    address_line1: shipping.value.line1,
    address_line2: shipping.value.line2,
    city: shipping.value.city,
    state: shipping.value.state,
    postal_code: shipping.value.postalCode,
    amount_cents: product.priceCents,
    payment_intent_id: paymentIntentId,
  });

  let orderId: string;
  if (save.ok) {
    orderId = save.order.id;
  } else {
    // Supabase not configured or insert failed — fall back to payment intent id
    // so the user still gets a confirmation number; log the reason for the
    // operator.
    console.error("saveOrder failed:", save.reason);
    orderId = paymentIntentId;
  }

  // Best-effort confirmation email. Don't block on failure.
  try {
    const result = await sendOrderConfirmation({
      to: shipping.value.email,
      orderId,
      productName: product.name,
      amountLabel: product.priceLabel,
    });
    if (!result.ok) console.warn("sendOrderConfirmation:", result.reason);
  } catch (err) {
    console.warn("sendOrderConfirmation error:", err);
  }

  return NextResponse.json({ ok: true, orderId });
}
