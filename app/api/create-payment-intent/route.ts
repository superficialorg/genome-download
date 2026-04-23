import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isTierSlug } from "@/lib/products";
import { resolvePromotionCode } from "@/lib/coupons";
import { getCountry, isSupportedCountry } from "@/lib/shipping";

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
  const isDigital = product.kind === "digital";

  const countryRaw = (body as { countryCode?: unknown })?.countryCode;
  const countryCode =
    typeof countryRaw === "string" ? countryRaw.trim().toUpperCase() : "";

  // Digital products have no shipping; physical kits require a supported country.
  if (!isDigital && (!countryCode || !isSupportedCountry(countryCode))) {
    return NextResponse.json(
      {
        error:
          "Sorry, we don't ship to that country yet. Email contact@genome.computer to be added to the waitlist.",
      },
      { status: 400 }
    );
  }

  const shippingFeeCents = isDigital
    ? 0
    : getCountry(countryCode)!.shippingFeeCents;

  try {
    const stripe = getStripe();

    // Coupon discounts the product price. Shipping is added on top —
    // never discounted by coupons.
    let productAmount = product.priceCents;
    let discountCents = 0;
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
      productAmount = resolved.finalAmountCents;
      discountCents = resolved.discountCents;
      couponMeta = {
        coupon_code: resolved.code,
        coupon_id: resolved.couponId,
        promotion_code_id: resolved.promotionCodeId,
        discount_cents: String(resolved.discountCents),
      };
      couponDescription = resolved.description;
    }

    const amount = productAmount + shippingFeeCents;

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        tier: product.slug,
        product_name: product.name,
        list_price_cents: String(product.priceCents),
        shipping_country: isDigital ? "N/A" : countryCode,
        shipping_fee_cents: String(shippingFeeCents),
        ...(isDigital ? { deliverable: "digital" } : {}),
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
      discountCents,
      shippingFeeCents,
      couponCode: couponMeta?.coupon_code ?? null,
      couponDescription,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown payment error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
