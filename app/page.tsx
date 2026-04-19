import Image from "next/image";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { TierCard } from "@/components/tier-card";
import { Faq } from "@/components/faq";
import { PRODUCT_LIST } from "@/lib/products";

export default function Home() {
  return (
    <SiteShell>
      <SiteHeader />
      <div className="my-16 flex flex-col items-center text-center sm:my-24">
        <h1 className="m-0 mb-14 text-[28px] font-normal italic leading-[1.1] tracking-[-0.03em] sm:mb-20 sm:text-[36px]">
          The fastest and cheapest way to get your raw genome file
        </h1>
        <div className="w-full">
          <Image
            src="/Hero.png"
            alt=""
            width={1000}
            height={679}
            priority
            className="h-auto w-full"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
              WebkitMaskComposite: "source-in",
            }}
          />
        </div>
      </div>

      <section>
        <h2 className="m-0 mb-6 text-center text-[22px] font-semibold tracking-[-0.02em] sm:text-[24px]">
          Order your kit
        </h2>
        <div className="flex flex-col gap-3">
          {PRODUCT_LIST.map((product) => (
            <TierCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <div className="rounded-[var(--radius-lg)] border border-border bg-muted px-6 py-6 text-center sm:px-8 sm:py-8">
          <p className="m-0 text-[17px] font-medium tracking-[-0.01em] text-foreground sm:text-[18px]">
            Your DNA stays private and remains in your full control.
          </p>
          <p className="m-0 mt-3 text-[15px] leading-[1.55] text-muted-foreground sm:text-[16px]">
            We&apos;re a Public Benefit Corporation. We&apos;re legally bound
            to never sell or license your individual genetic data. It&apos;s
            your data and always will be.
          </p>
        </div>
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
