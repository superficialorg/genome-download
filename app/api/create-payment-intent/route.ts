import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isTierSlug } from "@/lib/products";
import { resolvePromotionCode } from "@/lib/coupons";

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
  const couponCodeRaw = (body as { couponCode?: unknown })?.couponCode;
  const couponCode =
    typeof couponCodeRaw === "string" && couponCodeRaw.trim()
      ? couponCodeRaw.trim()
      : null;

  const product = PRODUCTS[tier];

  try {
    const stripe = getStripe();

    // Re-validate the coupon at intent-creation time; never trust the client
    // to have told us the correct discount.
    let amount = product.priceCents;
    let couponMeta: {
      coupon_code: string;
      coupon_id: string;
      promotion_code_id: string;
      discount_cents: string;
    } | null = null;
    let couponDescription: string | null = null;
    if (couponCode) {
      const resolved = await resolvePromotionCode(
        stripe,
        couponCode,
        product.priceCents
      );
      if (!resolved.ok) {
        return NextResponse.json(
          { error: resolved.error },
          { status: 400 }
        );
      }
      amount = resolved.finalAmountCents;
      couponMeta = {
        coupon_code: resolved.code,
        coupon_id: resolved.couponId,
        promotion_code_id: resolved.promotionCodeId,
        discount_cents: String(resolved.discountCents),
      };
      couponDescription = resolved.description;
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        tier: product.slug,
        product_name: product.name,
        list_price_cents: String(product.priceCents),
        ...(product.stripeProductId
          ? { stripe_product_id: product.stripeProductId }
          : {}),
        ...(couponMeta ?? {}),
      },
    });
    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount,
      originalAmount: product.priceCents,
      discountCents: couponMeta ? Number(couponMeta.discount_cents) : 0,
      couponCode: couponMeta?.coupon_code ?? null,
      couponDescription,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown payment error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
