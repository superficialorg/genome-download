import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { ApiAccessForm } from "@/components/api-access-form";

const PAGE_DESCRIPTION =
  "The first genome sequencing API. Order a kit programmatically, receive a .genome bundle and a VCF, and build genetic intelligence into anything. Now in private beta — request access.";
const PAGE_URL = "https://genome.computer/api";

export const metadata: Metadata = {
  title: "Genome API — The Genome Computer Company",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Genome API — The Genome Computer Company",
    description: PAGE_DESCRIPTION,
    siteName: "The Genome Computer Company",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Genome Computer Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@genomecomputer",
    creator: "@genomecomputer",
    title: "Genome API — The Genome Computer Company",
    description: PAGE_DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "The Genome Computer Company" }],
  },
};

export default function ApiPage() {
  return (
    <SiteShell>
      <SiteHeader compact />

      <article className="mt-6 flex flex-col gap-12 sm:mt-10">
        {/* Hero */}
        <section className="flex flex-col items-center gap-5 text-center">
          <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Private beta
          </span>
          <h1 className="m-0 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[40px]">
            It&rsquo;s time to build bio.
          </h1>
          <p className="m-0 max-w-[560px] text-[15px] leading-[1.65] text-muted-foreground sm:text-[17px]">
            The first genome sequencing API, built specifically for AI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href="#request-access"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Request access
            </a>
            <Link
              href="/blog/introducing-the-genome-api"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2 text-[14px] font-medium text-foreground transition-colors hover:border-foreground/30"
            >
              Read the launch post
            </Link>
          </div>
        </section>

        {/* What it is */}
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-[20px] font-semibold tracking-[-0.01em] text-foreground">
            One endpoint between your app and a person&rsquo;s genome
          </h2>
          <p className="m-0 text-[15px] leading-[1.7] text-muted-foreground">
            Until now, shipping a product that depends on an individual&rsquo;s
            genome meant scraping PDFs from a consumer DNA test, integrating a
            vendor SDK that traps the underlying data behind canned
            interpretations, or standing up your own lab. Each is a different
            flavour of <em>give up on the actual genome</em>.
          </p>
          <p className="m-0 text-[15px] leading-[1.7] text-muted-foreground">
            The Genome API makes the genome itself a primitive. Whole-genome
            30x, whole-genome 100x, SNP genotyping, and SNP with imputation
            are all orderable through one endpoint &mdash; the same vertical
            pipeline we run for our direct customers, available
            programmatically.
          </p>
          <p className="m-0 text-[15px] leading-[1.7] text-muted-foreground">
            The same API accepts existing VCFs. Users arriving with a file
            from a legacy provider, a clinical run, or a research dataset
            can be converted to a fully-annotated{" "}
            <code className="rounded bg-border px-1 py-0.5 font-mono text-[13px] text-foreground">
              .genome
            </code>{" "}
            bundle in hours &mdash; same output format, same downstream
            surface as a fresh sequencing order.
          </p>
        </section>

        {/* What you get */}
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-[20px] font-semibold tracking-[-0.01em] text-foreground">
            What you get
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <Bullet
              title="Programmatic orders, end-to-end fulfillment"
              body="POST an order with a customer and shipping address. We handle the kit, the lab, the sample, and the result. Status flows back through signed webhooks: processing, shipped, delivered, results.ready."
            />
            <Bullet
              title="Both .genome and VCF, every time"
              body=".genome/1.0 is AI-readable by construction — typed columns, deterministic interpretation, queryable in milliseconds. The VCF ships alongside as the sovereignty layer for existing pipelines."
            />
            <Bullet
              title="Bring your own VCF"
              body="Already have a file from a legacy provider, a clinical run, or a research dataset? POST it to the conversion endpoint and receive a fully-annotated .genome bundle in hours. Same format, same downstream surface as a fresh sequencing order — a fast on-ramp for users who don't need to be sequenced again."
            />
            <Bullet
              title="Clinical-grade infrastructure"
              body="Sequencing in CLIA-, CAP-, and NATA-accredited, ISO 15189-certified laboratories. HIPAA-aligned controls. Every bundle pins pipeline version, reference build (GRCh38), and guideline snapshots. Reproducibility is a property of the format."
            />
            <Bullet
              title="Built on a Public Benefit Corporation"
              body="Genome Computer ships under Humankind, a Delaware PBC. The charter binds us — legally, not aspirationally — to keep identifiable individual genetic data under individual control and out of commercial sale or licensing. A board authorising that sale would be violating its fiduciary duty, not satisfying it. The commitment survives leadership transitions, financial crises, and acquisitions — the moments at which privacy-policy promises have historically failed."
            />
          </ul>
        </section>

        {/* Form */}
        <section className="flex flex-col gap-4">
          <ApiAccessForm />
          <p className="m-0 text-center text-[13px] text-muted-foreground">
            Questions before you apply?{" "}
            <a
              href="mailto:api@genome.computer"
              className="text-foreground underline underline-offset-2"
            >
              api@genome.computer
            </a>
          </p>
        </section>
      </article>
    </SiteShell>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <li className="m-0 flex flex-col gap-1.5 rounded-[var(--radius-lg)] border border-border bg-background p-5">
      <p className="m-0 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
        {title}
      </p>
      <p className="m-0 text-[14px] leading-[1.65] text-muted-foreground">
        {body}
      </p>
    </li>
  );
}
