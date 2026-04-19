import { SiteShell, SiteHeader } from "@/components/site-shell";

export const metadata = {
  title: "Privacy — The Genome Computer Company",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <SiteHeader compact />
      <article className="prose-like flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">
            Privacy
          </h1>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Last updated: April 2026.
          </p>
        </div>

<section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            What we collect
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            When you place an order we collect your name, email, shipping
            address, and payment method (processed by Stripe — we never see or
            store your card details). When you return a sample, our clinical
            laboratory partner generates genomic data from your sample, which is
            delivered to you as a VCF file and temporarily retained by us to
            support redelivery and customer service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            What we don&apos;t do
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We do not sell your data. We do not share your data with
            researchers, pharmaceutical companies, insurers, or law enforcement
            except where compelled by valid legal process. We do not use your
            genomic data to train models. There is no &ldquo;optional research
            program.&rdquo;
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Data retention and deletion
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We retain your genomic data files and the biological sample for up
            to 12 months after delivery to support redelivery requests. You may
            request earlier deletion at any time by emailing{" "}
            <a href="mailto:contact@genome.computer" className="text-foreground underline underline-offset-2">
              contact@genome.computer
            </a>
            . We will confirm destruction of your sample and delete your files
            within 14 days.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Subprocessors
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            To deliver the service we rely on: a CLIA/CAP-accredited clinical
            laboratory partner (for sample processing and sequencing); Stripe
            (payment processing); Supabase (order records); Resend (email
            delivery); and Vercel (hosting). Each is bound by a data processing
            agreement and cannot use your data for their own purposes.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Contact
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Humankind Bio, Inc. Questions, deletion requests, or concerns:{" "}
            <a href="mailto:contact@genome.computer" className="text-foreground underline underline-offset-2">
              contact@genome.computer
            </a>
            .
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
