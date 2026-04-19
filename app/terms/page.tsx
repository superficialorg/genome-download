import { SiteShell, SiteHeader } from "@/components/site-shell";

export const metadata = {
  title: "Terms — The Personal Genome Company",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <SiteHeader compact />
      <article className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">
            Terms of service
          </h1>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Last updated: April 2026.
          </p>
        </div>

<section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            What you are buying
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            The Personal Genome Company sells a sequencing service and delivery of the
            resulting raw data as a VCF file. This is raw genomic data, not a
            medical test and not a diagnosis. No clinical interpretation is
            provided. For medical decisions, take your file to a physician or a
            clinical genetics service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Eligibility and shipping
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Service is currently available to customers in the United States
            only. You must be 18 years of age or older to purchase. Sample kits
            ship within 1 business day of your order. Turnaround is one week
            from when the laboratory receives your returned sample.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            QC failure and refunds
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            If your sample fails laboratory quality control, we will ship a
            replacement kit at no charge. If the second sample also fails, you
            will receive a full refund of the purchase price. Refunds are not
            available once a valid VCF file has been delivered.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            No medical warranty
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            The data provided is research-grade. We make no representation or
            warranty about its fitness for any medical, diagnostic, or clinical
            purpose. To the maximum extent permitted by law, Humankind Bio, Inc.
            disclaims all implied warranties and limits its total liability to
            the amount you paid for the order.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Governing law
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            These terms are governed by the laws of the State of Delaware,
            United States. The Personal Genome Company is operated by Humankind Bio, Inc., a
            Delaware public benefit corporation.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Contact
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Questions:{" "}
            <a href="mailto:contact@genome.download" className="text-foreground underline underline-offset-2">
              contact@genome.download
            </a>
            .
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
