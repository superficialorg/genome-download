"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Product } from "@/lib/products";
import { SUPPORTED_COUNTRIES, getCountry } from "@/lib/shipping";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise() {
  if (!PUBLISHABLE_KEY) return null;
  if (!stripePromise) stripePromise = loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
}

type Shipping = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
};

const EMPTY_SHIPPING: Shipping = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "US",
};

function isShippingComplete(s: Shipping) {
  return (
    s.name.trim() &&
    s.email.trim() &&
    s.line1.trim() &&
    s.city.trim() &&
    s.state.trim() &&
    s.postalCode.trim() &&
    s.countryCode.trim()
  );
}

function isDigitalContactComplete(s: Shipping) {
  return Boolean(s.name.trim() && s.email.trim());
}

function DigitalContactForm({
  value,
  onChange,
}: {
  value: Shipping;
  onChange: (v: Shipping) => void;
}) {
  const set = <K extends keyof Shipping>(k: K, v: Shipping[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-background p-5">
      <p className="m-0 text-sm text-muted-foreground">
        Enter your name and email to get started.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Full name
          </span>
          <input
            type="text"
            autoComplete="name"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="h-10 rounded-[calc(var(--radius-lg)-4px)] border border-border bg-background px-3 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            required
            className="h-10 rounded-[calc(var(--radius-lg)-4px)] border border-border bg-background px-3 text-sm"
          />
        </label>
      </div>
    </div>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[13px] font-medium text-foreground"
    >
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-[calc(var(--radius-lg)-2px)] border border-input bg-background px-3 text-sm tracking-[-0.01em] text-foreground outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 disabled:opacity-50"
    />
  );
}

function ShippingForm({
  value,
  onChange,
}: {
  value: Shipping;
  onChange: (v: Shipping) => void;
}) {
  const set = <K extends keyof Shipping>(k: K, v: Shipping[K]) =>
    onChange({ ...value, [k]: v });
  const isUS = value.countryCode === "US";
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
          autoComplete="name"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone{isUS ? " (optional)" : ""}</Label>
        <Input
          id="phone"
          type="tel"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
          autoComplete="tel"
          placeholder={isUS ? "+1 (555) 555-5555" : "+country code"}
          required={!isUS}
        />
        {!isUS ? (
          <p className="mt-1 text-[12px] text-muted-foreground">
            Required by the courier for international customs clearance.
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="countryCode">Country</Label>
        <select
          id="countryCode"
          value={value.countryCode}
          onChange={(e) => set("countryCode", e.target.value)}
          autoComplete="country"
          required
          className="h-10 w-full rounded-[calc(var(--radius-lg)-2px)] border border-input bg-background px-3 text-sm tracking-[-0.01em] text-foreground outline-none ring-offset-background transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 disabled:opacity-50"
        >
          {SUPPORTED_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="line1">Address</Label>
        <Input
          id="line1"
          value={value.line1}
          onChange={(e) => set("line1", e.target.value)}
          autoComplete="address-line1"
          required
        />
      </div>
      <div>
        <Label htmlFor="line2">Address line 2 (optional)</Label>
        <Input
          id="line2"
          value={value.line2}
          onChange={(e) => set("line2", e.target.value)}
          autoComplete="address-line2"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px_140px]">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => set("city", e.target.value)}
            autoComplete="address-level2"
            required
          />
        </div>
        <div>
          <Label htmlFor="state">
            {isUS ? "State" : "State / Region"}
          </Label>
          <Input
            id="state"
            value={value.state}
            onChange={(e) => set("state", e.target.value)}
            autoComplete="address-level1"
            maxLength={isUS ? 2 : undefined}
            placeholder={isUS ? "CA" : undefined}
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">
            {isUS ? "ZIP" : "Postal code"}
          </Label>
          <Input
            id="postalCode"
            value={value.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            autoComplete="postal-code"
            required
          />
        </div>
      </div>
    </div>
  );
}

function PayAndSave({
  product,
  shipping,
  paymentIntentId,
  amountCents,
  onComplete,
}: {
  product: Product;
  shipping: Shipping;
  paymentIntentId: string;
  amountCents: number;
  onComplete: (orderId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      setError("Payment did not complete. Please try again.");
      setSubmitting(false);
      return;
    }

    const saveRes = await fetch("/api/save-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tier: product.slug,
        paymentIntentId,
        shipping,
      }),
    });
    const save = await saveRes.json();
    if (!save.ok) {
      setError(
        "Payment succeeded but we couldn't record your order. Please email contact@genome.computer with order reference: " +
          paymentIntentId
      );
      setSubmitting(false);
      return;
    }
    onComplete(save.orderId as string);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <PaymentElement />
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="inline-flex h-11 items-center justify-center rounded-[calc(var(--radius-lg)-2px)] bg-primary px-4 text-sm font-medium tracking-[-0.01em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting
          ? "Processing…"
          : `Pay ${
              amountCents === product.priceCents
                ? product.priceLabel
                : formatUsd(amountCents)
            }`}
      </button>
    </form>
  );
}

function formatUsd(amountCents: number): string {
  if (amountCents % 100 === 0) return `$${amountCents / 100}`;
  return `$${(amountCents / 100).toFixed(2)}`;
}

function CouponField({
  product,
  applied,
  onApply,
  disabled,
}: {
  product: Product;
  applied: AppliedCoupon | null;
  onApply: (c: AppliedCoupon | null) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  async function apply() {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter a coupon code.");
      return;
    }
    setValidating(true);
    setError(null);
    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: product.slug, code: trimmed }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Could not validate coupon.");
      }
      onApply({
        code: body.code as string,
        discountCents: body.discountCents as number,
        finalAmountCents: body.finalAmountCents as number,
        description: body.description as string,
      });
      setCode("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not validate coupon."
      );
    } finally {
      setValidating(false);
    }
  }

  function remove() {
    onApply(null);
    setError(null);
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[calc(var(--radius-lg)-2px)] border border-border bg-muted px-3 py-2">
        <div className="min-w-0 text-sm">
          <span className="font-medium text-foreground">{applied.code}</span>{" "}
          <span className="text-muted-foreground">
            — {applied.description}
          </span>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={disabled}
          className="shrink-0 text-[13px] font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-[13px] font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
      >
        Have a coupon?
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="coupon">Coupon code</Label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. GENOME20"
          className="h-10 w-full rounded-[calc(var(--radius-lg)-2px)] border border-input bg-background px-3 text-sm tracking-[-0.01em] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
        />
        <button
          type="button"
          onClick={apply}
          disabled={validating || disabled || !code.trim()}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-4 text-sm font-medium tracking-[-0.01em] text-foreground transition-colors hover:border-foreground/20 disabled:opacity-60"
        >
          {validating ? "Checking…" : "Apply"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function OrderTotal({
  product,
  coupon,
  shippingFeeCents,
}: {
  product: Product;
  coupon: AppliedCoupon | null;
  shippingFeeCents: number;
}) {
  const hasDiscount = !!coupon;
  const hasShipping = shippingFeeCents > 0;
  if (!hasDiscount && !hasShipping) return null;
  const productAfterDiscount = coupon
    ? coupon.finalAmountCents
    : product.priceCents;
  const total = productAfterDiscount + shippingFeeCents;
  return (
    <dl className="flex flex-col gap-1 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-mono text-foreground">{product.priceLabel}</dd>
      </div>
      {hasDiscount ? (
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">
            Discount ({coupon.description})
          </dt>
          <dd className="font-mono text-foreground">
            −{formatUsd(coupon.discountCents)}
          </dd>
        </div>
      ) : null}
      {hasShipping ? (
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">International shipping</dt>
          <dd className="font-mono text-foreground">
            {formatUsd(shippingFeeCents)}
          </dd>
        </div>
      ) : null}
      <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
        <dt className="font-medium text-foreground">Total</dt>
        <dd className="font-mono font-medium text-foreground">
          {formatUsd(total)}
        </dd>
      </div>
    </dl>
  );
}

type AppliedCoupon = {
  code: string;
  discountCents: number;
  finalAmountCents: number;
  description: string;
};

export function OrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const stripeP = useMemo(() => getStripePromise(), []);
  const [shipping, setShipping] = useState<Shipping>(EMPTY_SHIPPING);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  const isDigital = product.kind === "digital";
  const shippingFeeCents = isDigital
    ? 0
    : getCountry(shipping.countryCode)?.shippingFeeCents ?? 0;

  async function startPayment() {
    setIntentLoading(true);
    setIntentError(null);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: product.slug,
          couponCode: coupon?.code ?? null,
          countryCode: shipping.countryCode,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.clientSecret) {
        throw new Error(body.error ?? "Could not initialize payment.");
      }
      setClientSecret(body.clientSecret);
      setPaymentIntentId(body.paymentIntentId);
    } catch (err) {
      setIntentError(
        err instanceof Error ? err.message : "Could not initialize payment."
      );
    } finally {
      setIntentLoading(false);
    }
  }

  useEffect(() => {
    // Reset payment intent if shipping contact identity changes materially.
    if (clientSecret) return;
  }, [clientSecret]);

  const canStartPayment = isDigital
    ? isDigitalContactComplete(shipping)
    : isShippingComplete(shipping);

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-muted p-5 text-sm text-muted-foreground">
        <p className="m-0 font-medium text-foreground">Payments not configured</p>
        <p className="m-0 mt-1">
          <code className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
          is not set. Configure the Stripe environment variables in Vercel to
          enable checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {isDigital ? (
        <DigitalContactForm value={shipping} onChange={setShipping} />
      ) : (
        <ShippingForm value={shipping} onChange={setShipping} />
      )}

      {!clientSecret ? (
        <div className="flex flex-col gap-4">
          <CouponField
            product={product}
            applied={coupon}
            onApply={setCoupon}
            disabled={intentLoading}
          />
          <OrderTotal
            product={product}
            coupon={coupon}
            shippingFeeCents={shippingFeeCents}
          />
          <button
            type="button"
            onClick={startPayment}
            disabled={!canStartPayment || intentLoading}
            className="inline-flex h-11 items-center justify-center rounded-[calc(var(--radius-lg)-2px)] bg-primary px-4 text-sm font-medium tracking-[-0.01em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {intentLoading ? "Preparing checkout…" : "Continue to payment"}
          </button>
          {intentError ? (
            <p role="alert" className="text-sm text-red-600">
              {intentError}
            </p>
          ) : null}
          {!canStartPayment && !isDigital ? (
            <p className="text-xs text-muted-foreground">
              Fill in the shipping fields above to continue.
            </p>
          ) : null}
        </div>
      ) : (
        <Elements
          stripe={stripeP}
          options={{ clientSecret, appearance: { theme: "stripe" } }}
        >
          <PayAndSave
            product={product}
            shipping={shipping}
            paymentIntentId={paymentIntentId!}
            amountCents={
              (coupon?.finalAmountCents ?? product.priceCents) +
              shippingFeeCents
            }
            onComplete={(orderId) =>
              router.push(`/thanks?order=${encodeURIComponent(orderId)}`)
            }
          />
        </Elements>
      )}
    </div>
  );
}
