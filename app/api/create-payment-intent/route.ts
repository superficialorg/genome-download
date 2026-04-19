import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isTierSlug } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const tier = (body as { tier?: unknown })?.tier;
  if (typeof tier !== "string" || !isTierSlug(tier)) {
    return NextResponse.json(
      { error: "Unknown tier." },
      { status: 400 }
    );
  }

  const product = PRODUCTS[tier];

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: product.priceCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        tier: product.slug,
        product_name: product.name,
        ...(product.stripeProductId
          ? { stripe_product_id: product.stripeProductId }
          : {}),
      },
    });
    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: product.priceCents,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown payment error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
