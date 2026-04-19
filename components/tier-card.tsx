import Link from "next/link";
import type { Product } from "@/lib/products";

export function TierCard({ product }: { product: Product }) {
  return (
    <div
      className={`flex flex-col items-stretch gap-4 rounded-[var(--radius-lg)] border border-border bg-background p-5 transition-all hover:shadow-[0_1px_3px_0_rgb(0_0_0/0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 ${
        product.popular
          ? "ring-2 ring-foreground"
          : "hover:border-foreground/20"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
          <h3 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
            {product.name}
          </h3>
          <span className="font-mono text-[13px] font-medium text-muted-foreground">
            {product.priceLabel}
          </span>
          {product.popular ? (
            <span className="inline-flex items-center rounded-full bg-border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
              Most popular
            </span>
          ) : null}
        </div>
        <p className="m-0 text-sm leading-[1.45] text-muted-foreground">
          {product.description}
        </p>
      </div>
      <Link
        href={`/order/${product.slug}`}
        className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-[calc(var(--radius-lg)-2px)] bg-primary px-4 text-sm font-medium tracking-[-0.01em] text-primary-foreground transition-colors hover:bg-primary/90 sm:h-9"
      >
        Order now
      </Link>
    </div>
  );
}
