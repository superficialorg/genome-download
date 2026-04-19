import Image from "next/image";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { TierCard } from "@/components/tier-card";
import { Faq } from "@/components/faq";
import { PRODUCT_LIST } from "@/lib/products";

export default function Home() {
  return (
    <SiteShell>
      <SiteHeader />
      <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
        <div className="mb-8 w-full overflow-hidden rounded-[var(--radius-lg)]">
          <Image
            src="/Hero.jpg"
            alt=""
            width={1000}
            height={679}
            priority
            className="h-auto w-full"
          />
        </div>
        <h1 className="m-0 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
          The fastest, cheapest way to get your raw genome as a VCF file.
        </h1>
      </div>

      <section className="flex flex-col gap-3">
        {PRODUCT_LIST.map((product) => (
          <TierCard key={product.slug} product={product} />
        ))}
      </section>

      <section className="mt-24 sm:mt-28">
        <h2 className="m-0 mb-6 text-center text-[22px] font-semibold tracking-[-0.02em] sm:text-[24px]">
          FAQ
        </h2>
        <Faq />
      </section>
    </SiteShell>
  );
}
