import type { ReactNode } from "react";

type FaqItem = {
  q: string;
  a: ReactNode;
};

const ITEMS: FaqItem[] = [
  {
    q: "What do I get?",
    a: "A VCF file — the standard format used in clinical genomics and bioinformatics. Yours to keep, use, or archive.",
  },
  {
    q: "What can I do with it?",
    a: "Whatever you want. We don't interpret your data and we don't tell you where to take it. VCF is a standard format accepted by most genomics tools and services.",
  },
  {
    q: "How is this different from 23andMe?",
    a: "They sell interpretation bundled with the sample, and your data stays inside their platform. We sell you the file.",
  },
  {
    q: "How long does it take?",
    a: "One week from when the lab receives your sample.",
  },
  {
    q: "Which reference genome?",
    a: "GRCh38. Liftover instructions to GRCh37 included in the delivery email.",
  },
  {
    q: "Is the lab real?",
    a: "Samples are processed through CLIA-accredited and CAP-accredited clinical laboratory infrastructure on Illumina platforms.",
  },
  {
    q: "What about privacy?",
    a: 'We don\'t sell your data, share it with researchers, or use it to train models. There is no "optional research program." You can request sample and data deletion after your file is delivered.',
  },
  {
    q: "Can I use this for medical decisions?",
    a: "No. This is raw data, not a medical test. For clinical interpretation, take the file to a physician or clinical genetics service.",
  },
  {
    q: "What if the sample fails QC?",
    a: "Free replacement kit. If the second sample fails, full refund.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently US only. International shipping coming soon.",
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
        , a genomic archetype platform. It's one place you can send your file.
        So is anywhere else.
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
