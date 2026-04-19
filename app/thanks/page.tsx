import Link from "next/link";
import { SiteShell, SiteHeader } from "@/components/site-shell";

export const metadata = {
  title: "Thanks — The Personal Genome Company",
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <SiteShell>
      <SiteHeader compact />
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="m-0 text-3xl leading-none">✓</p>
        <h1 className="m-0 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[32px]">
          Order confirmed.
        </h1>
        <p className="m-0 max-w-[520px] text-[15px] leading-[1.55] text-muted-foreground">
          We&apos;ll email you shipping details within 1 business day. Your VCF
          file will be delivered one week after the lab receives your sample.
        </p>
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
