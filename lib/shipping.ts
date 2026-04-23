/**
 * International shipping config.
 *
 * The supported list is deliberately conservative — English-speaking
 * primary markets plus developed Europe and developed Asia-Pacific.
 * Adding a country here is the only step required to accept orders
 * from it; the server validates against this list before creating
 * any PaymentIntent.
 *
 * Fee model (v1):
 * - US (home market, ships from US lab) — free
 * - AU (separate AU lab) — free
 * - Everything else — flat $40 international shipping
 *
 * Change the per-country fee here if we ever want to zone it by
 * distance or courier rate; nothing else needs to move.
 */
export type SupportedCountry = {
  /** ISO 3166-1 alpha-2 code, uppercase */
  code: string;
  /** Display name shown in the country dropdown */
  name: string;
  /** Shipping fee in cents, added to the PaymentIntent amount */
  shippingFeeCents: number;
};

const INTERNATIONAL_FEE_CENTS = 4000;

// Order: US first, AU second (both zero fee), then alphabetical by name.
export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: "US", name: "United States", shippingFeeCents: 0 },
  { code: "AU", name: "Australia", shippingFeeCents: 0 },
  { code: "AT", name: "Austria", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "BE", name: "Belgium", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "CA", name: "Canada", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "DK", name: "Denmark", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "FI", name: "Finland", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "FR", name: "France", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "DE", name: "Germany", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "HK", name: "Hong Kong", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "IS", name: "Iceland", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "IE", name: "Ireland", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "IT", name: "Italy", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "JP", name: "Japan", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "LU", name: "Luxembourg", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "NL", name: "Netherlands", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "NZ", name: "New Zealand", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "NO", name: "Norway", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "PT", name: "Portugal", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "SG", name: "Singapore", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "ES", name: "Spain", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "SE", name: "Sweden", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "CH", name: "Switzerland", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
  { code: "GB", name: "United Kingdom", shippingFeeCents: INTERNATIONAL_FEE_CENTS },
];

const byCode: Record<string, SupportedCountry> = Object.fromEntries(
  SUPPORTED_COUNTRIES.map((c) => [c.code, c])
);

export function isSupportedCountry(code: string): boolean {
  return code.toUpperCase() in byCode;
}

export function getCountry(code: string): SupportedCountry | null {
  return byCode[code.toUpperCase()] ?? null;
}

export function getShippingFeeCents(code: string): number {
  const c = getCountry(code);
  if (!c) {
    throw new Error(`Unsupported shipping country: ${code}`);
  }
  return c.shippingFeeCents;
}
