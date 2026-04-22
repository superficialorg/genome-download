import Link from "next/link";
import { SiteShell, SiteHeader } from "@/components/site-shell";

export const metadata = {
  title: "Terms — The Genome Computer Company",
};

const LINK_CLASS = "text-foreground underline underline-offset-2";

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
            Acceptance
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            By placing an order, you agree to these terms and to our{" "}
            <Link href="/privacy" className={LINK_CLASS}>
              Privacy Policy
            </Link>
            . You accept these terms at checkout by confirming your order.
            The version of these terms in effect at the time you place
            your order governs that order.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            What you are buying
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            The Genome Computer Company sells a sequencing service and
            delivery of the resulting raw data as a VCF file. This is raw
            genomic data, not a medical test and not a diagnosis. No
            clinical interpretation is provided. For medical decisions,
            take your file to a physician or a clinical genetics service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Eligibility and shipping
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Service is available to customers in the United States only.
            You must be 18 years of age or older to purchase. Sample kits
            typically ship within 1 business day of your order. Turnaround
            is typically one week from when the laboratory receives your
            returned sample. These timings are estimates, not guarantees.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Your sample
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You warrant that any sample you submit:
          </p>
          <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-muted-foreground">
            <li className="m-0">is your own biological sample;</li>
            <li className="m-0">
              was collected by you or with your knowledge and consent;
            </li>
            <li className="m-0">is from a living person; and</li>
            <li className="m-0">
              is not submitted for the purpose of reselling the service,
              reverse-engineering the service, or building a competing
              database.
            </li>
          </ul>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You indemnify Humankind Bio, Inc. against any claim arising
            from a breach of this warranty, including any claim by a third
            party whose genetic information is contained in a sample you
            submitted without authority.
          </p>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We reserve the right to refuse or destroy any sample we
            reasonably suspect was not lawfully obtained, and to suspend
            or terminate service to any customer we reasonably believe has
            breached these terms.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Refunds
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Laboratory costs are incurred when your sample is received by
            our clinical laboratory partner. Our refund policy reflects
            this:
          </p>
          <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-muted-foreground">
            <li className="m-0">
              You may return an unused kit within 30 days of delivery for
              a full refund of the purchase price. &ldquo;Unused&rdquo;
              means the outer packaging and collection tube are unopened.
              Return shipping is at your expense, and the kit must reach
              us in resaleable condition.
            </li>
            <li className="m-0">
              Once your sample has been received by the laboratory, the
              order is non-refundable.
            </li>
            <li className="m-0">
              If your sample fails laboratory quality control, we do not
              provide a free replacement kit or a refund. You may purchase
              a new kit at the standard price.
            </li>
            <li className="m-0">
              We do not provide refunds after a valid VCF file has been
              delivered.
            </li>
          </ul>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            This clause does not limit any rights you have under
            applicable consumer protection law that cannot be waived by
            contract.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Kit return window
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You must return your sample to the laboratory within 180 days
            of receiving your kit. After this window, your order is
            forfeit and no sequencing will be performed. No refund is
            provided for unreturned kits.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Deletion before delivery
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            If you request deletion of your data under our Privacy Policy
            before your VCF file has been delivered, we will honour the
            request. Because laboratory costs have already been incurred,
            no refund is provided for deletion requests made after your
            sample has been received by the laboratory.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            No medical warranty
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            The data provided is research-grade. We make no representation
            or warranty about its fitness for any medical, diagnostic, or
            clinical purpose. To the maximum extent permitted by law,
            Humankind Bio, Inc. disclaims all warranties, express or
            implied, including the implied warranties of merchantability,
            fitness for a particular purpose, and non-infringement. Our
            total liability for any claim arising out of or related to
            these terms or the service is limited to the amount you paid
            for the order.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Use of your VCF file
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Once your VCF file is delivered, it is yours. You may use,
            upload, share, or analyse it however you wish. You are
            responsible for any subsequent use, upload, or sharing of your
            VCF file. Humankind Bio, Inc. has no control over, and
            accepts no liability for, actions you or any third party take
            with your data after delivery, including any identification,
            re-identification, or inference about you or your biological
            relatives that results from such use.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Intellectual property
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You own your biological sample and the genomic data derived
            from it. Humankind Bio, Inc. owns the Genome Computer Company
            brand, the website, the software used to deliver the service,
            and all associated intellectual property. If you send us
            feedback, suggestions, or bug reports, you grant us a
            perpetual, royalty-free, worldwide licence to use that
            feedback to improve the service, with no obligation to you.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Force majeure
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We are not liable for any delay or failure to perform caused
            by events beyond our reasonable control, including laboratory
            outages, shipping disruption, natural disasters,
            pandemic-related disruption, or acts of government. Where such
            events materially affect your order, we will work in good
            faith to deliver the service or, at our discretion, cancel
            the order.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Changes to these terms
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            We may update these terms from time to time. Material changes
            will be notified by email before they take effect and will
            apply only to orders placed after the effective date of the
            change. Non-material changes will be reflected in the
            &ldquo;Last updated&rdquo; date above.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Dispute resolution
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            These terms are governed by the laws of the State of Delaware,
            United States, without regard to its conflict of laws
            principles. Any dispute arising out of or related to these
            terms or the service shall be brought exclusively in the state
            or federal courts located in Delaware, and you consent to the
            personal jurisdiction of those courts.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Assignment
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            You may not assign or transfer your order or these terms
            without our written consent. We may assign these terms in
            connection with a merger, acquisition, reorganisation, or
            sale of assets without your consent.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            General
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            If any provision of these terms is found to be unenforceable,
            the remaining provisions remain in full force. Our failure to
            enforce any provision is not a waiver of that provision. These
            terms, together with our Privacy Policy, are the entire
            agreement between you and Humankind Bio, Inc. regarding the
            service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            About us
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            The Genome Computer Company is operated by Humankind Bio,
            Inc., a Delaware public benefit corporation.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Contact
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Questions:{" "}
            <a href="mailto:contact@genome.computer" className={LINK_CLASS}>
              contact@genome.computer
            </a>
            .
          </p>
        </section>
      </article>
    </SiteShell>
  );
}
