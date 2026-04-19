import { SiteShell } from "@/components/site-shell";
import { TierCard } from "@/components/tier-card";
import { Faq } from "@/components/faq";
import { PRODUCT_LIST } from "@/lib/products";

export default function Home() {
  return (
    <SiteShell>
      <header className="mb-12 flex flex-col items-center text-center sm:mb-16">
        <div className="text-3xl leading-none">🧬</div>
        <h1 className="m-0 mt-3 font-mono text-[28px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[36px]">
          genome.download
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-base leading-[1.5] tracking-[-0.01em] text-muted-foreground sm:text-[18px]">
          The fastest, cheapest way to get your raw genome as a VCF file.
        </p>
      </header>

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
