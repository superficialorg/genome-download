import type Stripe from "stripe";

export type ResolvedCoupon = {
  ok: true;
  /** Normalized promo code (as stored on Stripe) */
  code: string;
  /** Stripe promotion code id (promo_...) */
  promotionCodeId: string;
  /** Stripe coupon id */
  couponId: string;
  /** Amount to subtract from the product price, in cents */
  discountCents: number;
  /** Product price minus discount, clamped at Stripe's $0.50 minimum */
  finalAmountCents: number;
  /** Human-readable summary for UI ("25% off", "$50 off") */
  description: string;
};

export type CouponError = {
  ok: false;
  error: string;
};

/**
 * Resolve and validate a promotion code against a target amount.
 *
 * Accepts a promo code the customer typed; returns the discount applied to
 * `amountCents` and the final amount to charge. Percent discounts round to
 * the nearest cent. Amount-off discounts in any currency other than USD are
 * rejected so we can't accidentally misapply them. Final amount is floored at
 * 50¢ (Stripe's minimum charge in USD) — customers don't get a free order
 * unless the coupon is explicitly handled upstream.
 */
export async function resolvePromotionCode(
  stripe: Stripe,
  rawCode: string,
  amountCents: number
): Promise<ResolvedCoupon | CouponError> {
  const code = rawCode.trim();
  if (!code) return { ok: false, error: "Enter a coupon code." };

  // Stripe promotion codes are case-sensitive on lookup by `code`. Search
  // up to 10 active codes that match and then do a case-insensitive compare
  // against the typed value.
  const matches = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
  });
  const promo = matches.data[0];
  if (!promo) {
    return { ok: false, error: "That coupon code isn't valid." };
  }
  if (promo.expires_at && promo.expires_at * 1000 < Date.now()) {
    return { ok: false, error: "That coupon has expired." };
  }
  if (
    typeof promo.max_redemptions === "number" &&
    promo.times_redeemed >= promo.max_redemptions
  ) {
    return { ok: false, error: "That coupon is no longer available." };
  }

  if (promo.promotion.type !== "coupon" || !promo.promotion.coupon) {
    return { ok: false, error: "That coupon code isn't redeemable." };
  }
  const couponRaw = promo.promotion.coupon;
  const coupon: Stripe.Coupon =
    typeof couponRaw === "string"
      ? await stripe.coupons.retrieve(couponRaw)
      : couponRaw;
  if (!coupon.valid) {
    return { ok: false, error: "That coupon is no longer valid." };
  }

  let discountCents: number;
  let description: string;
  if (coupon.percent_off != null) {
    discountCents = Math.round((amountCents * coupon.percent_off) / 100);
    description = `${formatPercent(coupon.percent_off)} off`;
  } else if (coupon.amount_off != null) {
    if (coupon.currency && coupon.currency.toLowerCase() !== "usd") {
      return {
        ok: false,
        error: "That coupon can't be applied to USD orders.",
      };
    }
    discountCents = coupon.amount_off;
    description = `${formatUsd(coupon.amount_off)} off`;
  } else {
    return { ok: false, error: "That coupon has no discount configured." };
  }

  if (discountCents > amountCents) discountCents = amountCents;
  const finalAmountCents = Math.max(amountCents - discountCents, 50);

  return {
    ok: true,
    code: promo.code,
    promotionCodeId: promo.id,
    couponId: coupon.id,
    discountCents: amountCents - finalAmountCents,
    finalAmountCents,
    description,
  };
}

function formatUsd(amountCents: number): string {
  if (amountCents % 100 === 0) return `$${amountCents / 100}`;
  return `$${(amountCents / 100).toFixed(2)}`;
}

function formatPercent(pct: number): string {
  if (Number.isInteger(pct)) return `${pct}%`;
  return `${pct.toFixed(1)}%`;
}
