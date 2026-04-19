import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { OrderForm } from "@/components/order-form";
import { PRODUCTS, isTierSlug } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier } = await params;
  if (!isTierSlug(tier)) return { title: "Order — The Genome Computer Company" };
  const product = PRODUCTS[tier];
  return { title: `Order ${product.name} — The Genome Computer Company` };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;
  if (!isTierSlug(tier)) notFound();
  const product = PRODUCTS[tier];

  return (
    <SiteShell>
      <div className="pt-6 sm:pt-10">
        <SiteHeader compact />
      </div>
      <div className="mb-8 mt-6 flex flex-col items-center text-center sm:mt-10">
        <p className="m-0 font-mono text-[13px] text-muted-foreground">
          Order
        </p>
        <h1 className="m-0 mt-2 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[28px]">
          {product.name}
        </h1>
        <p className="m-0 mt-2 max-w-[520px] text-[15px] text-muted-foreground">
          {product.description}
        </p>
        <p className="m-0 mt-3 font-mono text-[15px] text-foreground">
          {product.priceLabel}
        </p>
      </div>

      <OrderForm product={product} />

      <p className="mt-8 text-xs text-muted-foreground">
        Available in the United States only. By placing an order you
        agree to our{" "}
        <a href="/terms" className="underline underline-offset-2">
          Terms
        </a>
        .
      </p>
    </SiteShell>
  );
}
