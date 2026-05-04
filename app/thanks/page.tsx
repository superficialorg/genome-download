import Link from "next/link";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { PRODUCTS, isTierSlug } from "@/lib/products";

export const metadata = {
  title: "Thanks — The Genome Computer Company",
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; tier?: string }>;
}) {
  const { order, tier } = await searchParams;
  const product = tier && isTierSlug(tier) ? PRODUCTS[tier] : null;
  const isDigital = product?.kind === "digital";

  return (
    <SiteShell>
      <SiteHeader compact />
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="m-0 text-3xl leading-none">✓</p>
        <h1 className="m-0 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[32px]">
          {isDigital ? "You're in the queue." : "Order confirmed."}
        </h1>
        {isDigital ? (
          <p className="m-0 max-w-[520px] text-[15px] leading-[1.55] text-muted-foreground">
            Check your email in the next couple of minutes for a secure
            upload link. Send us your DNA file there and we&apos;ll email
            your <span className="font-mono">.genome</span> bundle and{" "}
            <span className="font-mono">readmygenome.md</span> skill
            within 48 hours. Every conversion is hand-processed.
          </p>
        ) : (
          <p className="m-0 max-w-[520px] text-[15px] leading-[1.55] text-muted-foreground">
            We&apos;ll email you shipping details within 1 business day. Your{" "}
            <span className="font-mono">.genome</span> bundle and the{" "}
            <span className="font-mono">readmygenome.md</span> skill
            will be delivered one week after the lab receives your sample
            (4–6 weeks for whole genome sequencing). VCF available on
            request.
          </p>
        )}
        {order ? (
          <p className="m-0 text-[13px] text-muted-foreground">
            Order{" "}
            <span className="font-mono text-foreground">{order}</span>
          </p>
        ) : null}
        <div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-4 text-sm font-medium tracking-[-0.01em] text-foreground transition-colors hover:bg-muted"
          >
            Back home
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
