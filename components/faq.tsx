import type { ReactNode } from "react";

type FaqItem = {
  q: string;
  a: ReactNode;
};

const ITEMS: FaqItem[] = [
  {
    q: "What do I get?",
    a: "A .genome bundle — the open, AI-ready format we developed for consumer genome files. Your VCF is available on request. Yours to keep, use, or archive.",
  },
  {
    q: "Can I get my VCF?",
    a: "Yes. Every genome.computer download ships as a .genome bundle because it's what works best with AI tools — but your VCF is yours and available on request.",
  },
  {
    q: "What is a .genome file?",
    a: (
      <div className="flex flex-col gap-3">
        <p className="m-0">
          .genome is an open specification we developed for consumer genome
          files that are designed to be read by an AI. Your .genome bundle
          contains the same underlying variant data as a VCF, but structured
          so that an AI assistant can actually answer questions about it
          correctly, with provenance, without guessing, and without the
          errors that happen when a language model tries to parse a file
          format designed for bioinformaticians.
        </p>
        <p className="m-0">
          We&apos;ve open-sourced the standard and the Claude skill that
          reads it. Anyone can implement them.
        </p>
      </div>
    ),
  },
  {
    q: "What can I do with it?",
    a: "Whatever you want. We don't interpret your data and we don't tell you where to take it.",
  },
  {
    q: "How long does it take?",
    a: "Raw SNP genotype and SNP + imputed genome take one week from when the lab receives your sample. Whole genome sequencing (30x, 100x) takes 4–6 weeks. For international orders, allow 1–2 weeks of shipping in each direction on top of the lab turnaround.",
  },
  {
    q: "Which reference genome?",
    a: "GRCh38. Liftover instructions to GRCh37 included in the delivery email.",
  },
  {
    q: "Is the lab real?",
    a: "Samples are processed through CLIA-accredited and CAP-accredited clinical laboratory infrastructure based inside the USA.",
  },
  {
    q: "What about privacy?",
    a: 'We don\'t sell your data, share it with researchers, or use it to train models. There is no "optional research program." You can request sample and data deletion after your file is delivered. All samples are deleted by our lab within 30 days. Our lab never holds PII.',
  },
  {
    q: "Can I use this for medical decisions?",
    a: "No. This is raw data, not a medical test. For clinical interpretation, take the file to a physician or clinical genetics service.",
  },
  {
    q: "Do you ship internationally?",
    a: (
      <>
        Yes. We currently ship to the United States, Australia, Canada, the
        United Kingdom, Ireland, New Zealand, Singapore, Hong Kong, Japan,
        and most of Western Europe (Austria, Belgium, Denmark, Finland,
        France, Germany, Iceland, Italy, Luxembourg, Netherlands, Norway,
        Portugal, Spain, Sweden, Switzerland). Shipping is free within the
        United States and Australia (we have a lab in each). For all other
        countries there is a flat $40 international shipping fee covering
        round-trip courier from our lab. Any customs duties or local
        VAT/GST charged on receipt by the courier are the customer&apos;s
        responsibility. If you don&apos;t see your country listed, email{" "}
        <a
          href="mailto:contact@genome.computer"
          className="text-foreground underline underline-offset-[3px] decoration-1 hover:decoration-2"
        >
          contact@genome.computer
        </a>{" "}
        to join the waitlist.
      </>
    ),
  },
  {
    q: "Who built this?",
    a: (
      <>
        Humankind Bio, Inc. — a Delaware public benefit corporation. Humankind
        also runs{" "}
        <a
          href="https://humans.inc"
          className="text-foreground underline underline-offset-[3px] decoration-1 hover:decoration-2"
        >
          humans.inc
        </a>
        , the biological context layer for artificial intelligence.
      </>
    ),
  },
];

function Chevron() {
  return (
    <svg
      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function Faq() {
  return (
    <div className="flex flex-col">
      {ITEMS.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          className="group border-b border-border first:border-t"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-[18px] text-[15px] font-medium tracking-[-0.01em] text-foreground transition-colors hover:text-foreground/70 [&::-webkit-details-marker]:hidden">
            {item.q}
            <Chevron />
          </summary>
          <div className="pb-5 text-[15px] leading-[1.55] text-muted-foreground">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
