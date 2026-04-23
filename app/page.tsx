import Image from "next/image";
import Link from "next/link";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { TierCard } from "@/components/tier-card";
import { Faq } from "@/components/faq";
import { GenomeCount } from "@/components/genome-count";
import { PRODUCT_LIST } from "@/lib/products";
import { POSTS } from "@/lib/posts";

export default function Home() {
  const featuredPost = POSTS[0];
  return (
    <SiteShell>
      <SiteHeader />
      <div className="mb-16 mt-6 flex flex-col items-center text-center sm:mb-24 sm:mt-10">
        <Link
          href={`/research/${featuredPost.slug}`}
          className="mb-10 inline-flex max-w-full flex-col items-center gap-1.5 rounded-[20px] border border-border bg-background px-4 py-2 text-center text-[12px] leading-[1.35] text-muted-foreground no-underline transition-colors hover:border-foreground/20 hover:text-foreground sm:mb-12 sm:flex-row sm:gap-2 sm:rounded-full sm:py-1 sm:pl-1 sm:pr-3 sm:text-left sm:text-[13px]"
        >
          <span className="inline-flex shrink-0 items-center rounded-full bg-border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
            New
          </span>
          <span className="min-w-0 sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap">
            {featuredPost.title}
          </span>
        </Link>
        <h1 className="m-0 mb-6 text-[28px] font-normal italic leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
          The fastest, safest way to download and read your genome.
        </h1>
        <GenomeCount />
        <div className="mt-4 w-full sm:mt-6">
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

      <section className="mt-10 sm:mt-12">
        <div className="rounded-[var(--radius-lg)] bg-foreground p-6 text-background sm:p-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em] sm:text-[18px]">
              Already have a DNA file? Convert it to{" "}
              <span className="font-mono">.genome</span>.
            </h3>
            <span className="font-mono text-[13px] font-medium text-background/70">
              $59
            </span>
          </div>

          <p className="m-0 mt-3 max-w-2xl text-[14px] leading-[1.55] text-background/80 sm:text-[15px]">
            Send us your VCF file from any legacy sequencing provider and
            we&apos;ll return a fully-annotated{" "}
            <span className="font-mono text-background">.genome</span> bundle
            within 48 hours. Imputed, VEP-annotated, PharmCAT-called,
            PGS-scored.
          </p>

          <p className="m-0 mt-3 max-w-2xl text-[14px] leading-[1.55] text-background/80 sm:text-[15px]">
            <span className="font-mono text-background">.genome</span> files
            use 3–10× fewer tokens and are 10–20× more accurate when
            interpreted by AI, compared with VCF.
          </p>

          <div className="mt-6">
            <Link
              href="/order/convert"
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[calc(var(--radius-lg)-2px)] bg-background px-5 text-sm font-medium tracking-[-0.01em] text-foreground transition-colors hover:bg-background/90 sm:h-9"
            >
              Convert my file →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <div className="rounded-[var(--radius-lg)] border border-border bg-muted px-6 py-6 text-center sm:px-8 sm:py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 size-6 text-foreground sm:size-7"
            aria-hidden="true"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <p className="m-0 text-[17px] font-medium tracking-[-0.01em] text-foreground sm:text-[18px]">
            Your DNA stays private and remains in your full control.
          </p>
          <p className="m-0 mt-3 text-[15px] leading-[1.55] text-muted-foreground sm:text-[16px]">
            We&apos;re a Public Benefit Corporation legally bound to never
            sell or license your individual genetic data. It&apos;s your data
            and always will be.
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
