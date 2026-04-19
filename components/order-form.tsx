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
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
};

const EMPTY_SHIPPING: Shipping = {
  name: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
};

function isShippingComplete(s: Shipping) {
  return (
    s.name.trim() &&
    s.email.trim() &&
    s.line1.trim() &&
    s.city.trim() &&
    s.state.trim() &&
    s.postalCode.trim()
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
      <div className="grid gap-4 sm:grid-cols-[1fr_120px_140px]">
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
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={value.state}
            onChange={(e) => set("state", e.target.value)}
            autoComplete="address-level1"
            maxLength={2}
            placeholder="CA"
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">ZIP</Label>
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
  onComplete,
}: {
  product: Product;
  shipping: Shipping;
  paymentIntentId: string;
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
        "Payment succeeded but we couldn't record your order. Please email contact@genome.download with order reference: " +
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
        {submitting ? "Processing…" : `Pay ${product.priceLabel}`}
      </button>
    </form>
  );
}

export function OrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const stripeP = useMemo(() => getStripePromise(), []);
  const [shipping, setShipping] = useState<Shipping>(EMPTY_SHIPPING);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);

  async function startPayment() {
    setIntentLoading(true);
    setIntentError(null);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: product.slug }),
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

  const canStartPayment = isShippingComplete(shipping);

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
      <ShippingForm value={shipping} onChange={setShipping} />

      {!clientSecret ? (
        <div className="flex flex-col gap-2">
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
          {!canStartPayment ? (
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
            onComplete={(orderId) =>
              router.push(`/thanks?order=${encodeURIComponent(orderId)}`)
            }
          />
        </Elements>
      )}
    </div>
  );
}
