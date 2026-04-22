import { SiteShell, SiteHeader } from "@/components/site-shell";

export const metadata = {
  title: "Privacy — The Genome Computer Company",
};

const EMAIL_CLASS =
  "text-foreground underline underline-offset-2";

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
            address, and payment method (processed by Stripe — we never see
            or store your card details). When you return a sample, our
            CLIA/CAP-accredited clinical laboratory partner generates
            genomic data from your sample, which is delivered to you as a
            .genome bundle (with a VCF file available on request) and
            retained by us for up to 12 months to support redelivery and
            customer service. The biological sample itself
            is handled separately — see{" "}
            <em className="italic">Data retention and deletion</em> below.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            What we don&apos;t do
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We do not sell your data. We do not share your data with
            researchers, pharmaceutical companies, insurers, or law
            enforcement except where compelled by valid legal process (see{" "}
            <em className="italic">Legal process</em>). We do not use your
            genomic data to train models. We do not create de-identified or
            aggregate datasets from your genomic data for any purpose
            beyond what is necessary to deliver your order. There is no
            &ldquo;optional research program.&rdquo;
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Consent and jurisdiction
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            By placing an order, you provide express consent for us to
            collect, process, and store your biological sample and the
            genomic data derived from it, solely for the purpose of
            delivering your results to you and supporting the services you
            have requested.
          </p>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Humankind Bio, Inc. is a Delaware corporation operating from
            San Francisco, California. This policy is governed by
            California law, including the California Genetic Information
            Privacy Act (GIPA). For customers resident in Australia, we
            also comply with the Australian Privacy Principles under the
            Privacy Act 1988 (Cth). For customers resident in the European
            Economic Area or United Kingdom, we rely on Standard
            Contractual Clauses for cross-border transfers to our US
            infrastructure.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Security
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Genomic data files are encrypted at rest and in transit. Access
            is restricted to authorised personnel on a least-privilege
            basis and audited. We maintain data processing agreements with
            every subprocessor. In the event of a confirmed breach
            affecting your data, we will notify you within 72 hours of
            confirmation, in line with GDPR Article 33 timelines regardless
            of your jurisdiction.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Data retention and deletion
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We retain your genomic data files for up to 12 months after
            delivery to support redelivery requests. Your biological sample
            is retained by our clinical laboratory partner for the minimum
            period required by their accreditation standards and then
            destroyed according to CLIA/CAP protocols; it is not retained
            indefinitely for any purpose.
          </p>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You may request earlier deletion at any time by emailing{" "}
            <a href="mailto:contact@genome.computer" className={EMAIL_CLASS}>
              contact@genome.computer
            </a>
            . We will:
          </p>
          <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-muted-foreground">
            <li className="m-0">
              Delete your genomic data files and associated order records
              within 14 days;
            </li>
            <li className="m-0">
              Confirm destruction of your biological sample, or confirm
              that it has already been destroyed under normal laboratory
              workflow; and
            </li>
            <li className="m-0">
              Retain only the minimum transaction records required by tax
              and accounting law, with no genomic content.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Your rights
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You may request access to the personal data we hold about you,
            correction of inaccurate data, a portable copy of your data, or
            deletion as described above. Email{" "}
            <a href="mailto:contact@genome.computer" className={EMAIL_CLASS}>
              contact@genome.computer
            </a>
            . We respond within 30 days.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Legal process
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We do not share your data with law enforcement except where
            compelled by valid legal process. Where legally permitted, we
            will notify you before any disclosure so that you have the
            opportunity to challenge the request. We construe all such
            requests narrowly and will resist overbroad demands. We do not
            voluntarily share genomic data with any government agency under
            any circumstance.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Minors
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Our service is available only to adults aged 18 and over. We do
            not knowingly collect data from minors. If you believe a minor
            has provided data to us, contact{" "}
            <a href="mailto:contact@genome.computer" className={EMAIL_CLASS}>
              contact@genome.computer
            </a>{" "}
            and we will delete it.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Subprocessors
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We rely on subprocessors in the following categories: clinical
            laboratory services (CLIA/CAP-accredited); payment processing;
            order records; email delivery; and hosting. Each is bound by a
            data processing agreement and cannot use your data for their
            own purposes. A current named list of subprocessors is
            available to enterprise partners under NDA and to individual
            customers on request to{" "}
            <a href="mailto:contact@genome.computer" className={EMAIL_CLASS}>
              contact@genome.computer
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Changes to this policy
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We will notify you by email of any material changes to this
            policy before they take effect. Non-material changes
            (typographical corrections, clarifications that do not alter
            your rights) will be reflected in the &ldquo;Last updated&rdquo;
            date above.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Contact
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Humankind Bio, Inc. Questions, deletion requests, or concerns:{" "}
            <a href="mailto:contact@genome.computer" className={EMAIL_CLASS}>
              contact@genome.computer
            </a>
            .
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
