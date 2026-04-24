import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS } from "@/lib/products";
import { createConversionJob } from "@/lib/conversion-jobs";
import {
  sendConversionUploadLink,
  sendConversionOperatorAlert,
} from "@/lib/resend";

// Stripe requires the raw body to verify the signature — disable Next.js
// body parsing and read the buffer ourselves.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 500 }
    );
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { ok: false, error: "missing stripe-signature header" },
      { status: 400 }
    );
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: `signature verification failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 400 }
    );
  }

  // We only care about `payment_intent.succeeded` for convert-tier orders.
  // Everything else (kits) is handled by save-order from the client side.
  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const tier = intent.metadata?.tier;
  if (tier !== "convert") {
    return NextResponse.json({ ok: true, ignored: "not convert tier" });
  }

  // Idempotency: if we've already created a job for this intent, the unique
  // constraint on payment_intent_id prevents duplicates. We swallow that
  // specific error and return 200 so Stripe doesn't retry.
  const email =
    intent.receipt_email ??
    intent.metadata?.email ??
    intent.shipping?.name ?? // fallback safety net
    null;
  if (!email) {
    // Shouldn't happen — checkout collected email — but we guard anyway.
    return NextResponse.json(
      { ok: false, error: "no email on PaymentIntent" },
      { status: 400 }
    );
  }

  try {
    const job = await createConversionJob({
      paymentIntentId: intent.id,
      email,
      customerName: intent.shipping?.name ?? intent.metadata?.customer_name ?? null,
    });

    // Email the customer the upload link. Parallelise with the operator alert.
    await Promise.all([
      sendConversionUploadLink({
        orderId: job.id,
        email: job.email,
        uploadToken: job.upload_token,
        expiresAt: job.upload_token_expires_at,
        customerName: job.customer_name,
      }),
      sendConversionOperatorAlert({
        orderId: job.id,
        email: job.email,
        reason: "new_job",
      }),
    ]);

    return NextResponse.json({ ok: true, jobId: job.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Duplicate — already processed. Stripe should not retry.
    if (msg.includes("duplicate key") || msg.includes("unique")) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("stripe webhook handler failed", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// Quick placeholder so the surface is discoverable in a browser without
// manually crafting a webhook call.
export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      "Stripe webhook endpoint. POST with a valid Stripe signature to handle events.",
  });
}

// PRODUCTS import guards against tree-shaking in case the import is unused.
void PRODUCTS;
