import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isTierSlug } from "@/lib/products";
import { resolvePromotionCode } from "@/lib/coupons";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { tier?: unknown; code?: unknown };
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
  const code = body.code;
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json(
      { ok: false, error: "Enter a coupon code." },
      { status: 400 }
    );
  }

  const product = PRODUCTS[tier];

  try {
    const stripe = getStripe();
    const resolved = await resolvePromotionCode(
      stripe,
      code.trim(),
      product.priceCents
    );
    if (!resolved.ok) {
      return NextResponse.json(
        { ok: false, error: resolved.error },
        { status: 400 }
      );
    }
    return NextResponse.json({
      ok: true,
      code: resolved.code,
      discountCents: resolved.discountCents,
      finalAmountCents: resolved.finalAmountCents,
      description: resolved.description,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not validate coupon.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
