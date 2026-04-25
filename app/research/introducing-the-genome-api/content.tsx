import Link from "next/link";

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-muted-foreground [&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-foreground [&_h3]:mt-2 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-border [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ol]:m-0 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_p]:m-0 [&_li]:m-0 [&_blockquote]:m-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius-md)] [&_pre]:border [&_pre]:border-border [&_pre]:bg-background [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-[1.55] [&_pre]:text-foreground [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[inherit] [&_hr]:my-2 [&_hr]:border-border">
      {children}
    </div>
  );
}

export function PostContent() {
  return (
    <Prose>
      <p>
        <strong>
          The first genome sequencing API. Order a kit, get back a{" "}
          <code>.genome</code> bundle and a VCF, and start building genetic
          intelligence into anything.
        </strong>
      </p>

      <p>
        The Genome Computer Company is opening early access to the Genome API
        in April 2026. Partners can place sequencing orders programmatically,
        track them through the lab, and receive a complete{" "}
        <code>.genome/1.0</code> bundle and VCF as soon as results are ready.
        It is the first API of its kind: a single HTTPS endpoint between your
        application and a person&rsquo;s genome.
      </p>

      <p>
        For most of the last decade, consumer genetics has been a walled
        garden. Results lived inside one company&rsquo;s app, locked behind one
        company&rsquo;s UI, returned through one company&rsquo;s interpretation
        pipeline. Builders were spectators. That is the wrong shape for a
        primitive this important.
      </p>

      <p>It&rsquo;s time to build bio.</p>

      <h2>What&rsquo;s actually new</h2>
      <p>
        For the first time, full-depth sequencing happens behind an API call.
      </p>
      <p>
        Until now, shipping a product that depends on an individual&rsquo;s
        genome meant picking among three bad options: scrape PDFs out of a
        consumer DNA test, integrate a vendor SDK that traps the underlying
        data behind canned interpretations, or stand up your own lab. Each is
        a different flavour of <em>give up on the actual genome</em>.
      </p>
      <p>
        The Genome API makes the genome itself a primitive.{" "}
        <strong>
          Whole-genome 30x, whole-genome 100x, SNP genotyping, and SNP with
          imputation
        </strong>{" "}
        are all orderable through one endpoint. No MSAs, no per-deal lab
        integrations, no negotiated SDKs &mdash; the same vertical pipeline we
        run for our direct customers, wholesale-priced and programmatically
        accessible.
      </p>
      <p>
        The output is yours. The interpretation logic is open. The format
        outlives the contract.
      </p>

      <h2>Clinical-grade infrastructure</h2>
      <p>
        Building on a genome is not the place to cut accreditation corners.
      </p>
      <p>
        Sequencing runs in <strong>CLIA-, CAP-, and NATA-accredited</strong>,{" "}
        <strong>ISO 15189-certified</strong> laboratories. Customer data is
        handled under HIPAA-aligned controls. Every bundle ships with a
        manifest pinning the lab, the pipeline version, the reference build
        (GRCh38), and the guideline snapshots used at interpretation time
        &mdash; every claim about a genome traces back to an auditable source.
        Reproducibility is not a roadmap item; it is a property of the format.
      </p>

      <h2>A Public Benefit Corporation</h2>
      <p>
        Genome Computer ships under{" "}
        <a
          href="https://www.humans.inc/blog/why-public-benefit-corporation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Humankind
        </a>
        , a <strong>Delaware Public Benefit Corporation</strong>. That
        structure is not a marketing line; it is a legal restructuring of
        corporate purpose. In a traditional corporation, directors are
        obligated to maximise shareholder value. In a PBC, directors are
        required to balance shareholder interests against a stated public
        benefit and the interests of those affected by the company&rsquo;s
        actions.
      </p>
      <p>Humankind&rsquo;s charter states it plainly:</p>
      <blockquote>
        To advance human understanding through the collective analysis of
        genomic and phenotypic data, while ensuring that identifiable
        individual data remains under individual control and is not sold or
        licensed for commercial use.
      </blockquote>
      <p>
        The genomics industry&rsquo;s recent history makes the case for why
        this matters. Companies have transferred user data to pharma. Genetic
        databases have been handed to law enforcement without consent. Privacy
        terms have been altered retroactively when revenue ran thin. When
        financial strain hit one of the largest consumer genomics companies in
        the world, decades of reassurance about data protection suddenly
        seemed unreliable. Under a conventional structure, the math eventually
        wins: when shareholder return is the legal mandate and genomes are the
        most monetisable asset on the balance sheet, the next sale becomes a
        question of <em>when</em>, not <em>whether</em>.
      </p>
      <p>
        A PBC moves the prohibition from a promise to a structural commitment.
        A board authorising the sale or licensing of identifiable genetic data
        would be <em>violating</em> its fiduciary obligations rather than
        satisfying them. That commitment is embedded in legal documents that
        survive leadership transitions, financial crises, and acquisitions
        &mdash; the exact moments at which privacy-policy promises have
        historically failed.
      </p>
      <p>
        For an API that sits at the foundation of other companies&rsquo;
        products, this matters more than for a direct-to-consumer service. You
        are not building on a layer that can be quietly acquired, repriced, or
        pivoted into a data-broker business. The PBC charter is the Schelling
        point &mdash; the public, legal commitment that anchors every other
        promise we make about safety and alignment.
      </p>
      <p>
        Two operating commitments follow from the charter and matter to anyone
        building on this API:
      </p>
      <p>
        <strong>Open, durable formats.</strong> <code>.genome/1.0</code> is
        Apache-licensed and will remain so. The format is designed to outlive
        the company that authored it &mdash; the bundle a partner ships today
        is still a parseable, queryable artifact in 2030 regardless of what
        happens to us.
      </p>
      <p>
        <strong>Transparent science.</strong> Interpretation rules ship inside
        the bundle, not behind a black-box service. Anyone can audit how a
        result was produced, recompute it against newer guidelines, and
        disagree in public.
      </p>

      <h2>
        Why <code>.genome</code> matters
      </h2>
      <p>
        Every order returns two artifacts. The VCF is there for compatibility
        &mdash; the lingua franca of bioinformatics since 2011, and what your
        existing pipelines expect. The <code>.genome</code> bundle is what
        makes this API different.
      </p>
      <p>
        <strong>AI-readable by construction.</strong> <code>.genome/1.0</code>{" "}
        separates variant data, interpretation, and importance rules into
        explicit, typed, versioned components. An LLM reading the bundle does
        not have to guess what a pipe-delimited string means or which allele a
        risk score refers to. Format-induced errors go to zero.
      </p>
      <p>
        <strong>Deterministic.</strong> PharmGKB metabolizer status, ClinVar
        pathogenicity, ACMG actionability &mdash; all computed once at
        pipeline time against pinned guideline versions, with every decision
        visible in the manifest. The agent doesn&rsquo;t infer; it reads.
      </p>
      <p>
        <strong>Queryable in milliseconds.</strong> Gene-scoped queries are a
        Parquet read away &mdash; Python, JavaScript, SQL, anything that
        speaks columnar. No tabix gymnastics.
      </p>
      <p>
        <strong>Versioned end-to-end.</strong> Each bundle pins its source
        guideline versions and snapshot dates, so a result re-interpreted in
        2027 produces a clean diff against its 2026 self.
      </p>
      <p>
        The VCF is sovereignty. The <code>.genome</code> is leverage. The full
        specification is documented in our{" "}
        <Link href="/research/introducing-dot-genome">earlier research post</Link>
        .
      </p>

      <h2>What you can build</h2>
      <p>
        A pharmacogenomic agent that warns a clinician before a prescription
        is written. A nutrition app that personalizes against actual metabolic
        variants instead of survey data. A longevity coach that grounds its
        advice in the user&rsquo;s own genome rather than population averages.
        A research platform where consented genomes flow into cohorts in
        minutes, not quarters. An agent that knows you &mdash; biologically,
        durably, on your own terms.
      </p>
      <p>We are not going to build all of these. You should.</p>

      <h2>Request access</h2>
      <p>
        The API is in private beta with a small group of launch partners. We
        are looking for teams who want to ship a real product this year
        &mdash; clinical, consumer, agentic, or research &mdash; and who are
        comfortable with the shape of an early API: stable enough to build on,
        narrow enough that feedback still moves the roadmap.
      </p>
      <p>
        <strong>
          Request access at{" "}
          <Link href="/api">genome.computer/api</Link>.
        </strong>
      </p>
      <p>The genome is a building block. It&rsquo;s time to start building.</p>

      <p className="pt-2 text-[13px]">
        <Link href="/api">genome.computer/api</Link> &middot;{" "}
        <a href="mailto:api@genome.computer">api@genome.computer</a>
      </p>
    </Prose>
  );
}
