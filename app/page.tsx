import { SiteShell, SiteHeader } from "@/components/site-shell";
import { TierCard } from "@/components/tier-card";
import { Faq } from "@/components/faq";
import { PRODUCT_LIST } from "@/lib/products";

export default function Home() {
  return (
    <SiteShell>
      <SiteHeader />
      <div className="mb-12 sm:mb-16">
        <h1 className="m-0 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
          Download your genome file.
        </h1>
        <p className="mt-3 max-w-[560px] text-base leading-[1.5] tracking-[-0.01em] text-muted-foreground sm:text-[18px]">
          The fastest, cheapest way to get your raw genome as a VCF file.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        {PRODUCT_LIST.map((product) => (
          <TierCard key={product.slug} product={product} />
        ))}
      </section>

      <section className="mt-16">
        <Faq />
      </section>
    </SiteShell>
  );
}
