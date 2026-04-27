function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-muted-foreground [&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-foreground [&_h3]:mt-2 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-border [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ol]:m-0 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_p]:m-0 [&_li]:m-0 [&_blockquote]:m-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius-lg)] [&_pre]:border [&_pre]:border-border [&_pre]:bg-background [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-[1.55] [&_pre]:text-foreground [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[inherit] [&_hr]:my-2 [&_hr]:border-border">
      {children}
    </div>
  );
}

export function PostContent() {
  return (
    <Prose>
      <p>
        For the last decade, the consumer genome has been locked behind apps,
        PDFs, and proprietary pipelines. Companies sequenced genomes, packaged
        the results into closed reports, and treated the underlying data as
        an asset to protect and monetise rather than a foundation to build on.
        Builders were left with whatever they were given.
      </p>

      <p>This was a choice, not a constraint. We can choose differently.</p>

      <p>
        Today, The Genome Computer Company is opening early access to the
        Genome API.
      </p>

      <p>
        With a single HTTPS endpoint, partners can order sequencing, track
        samples through the lab, and receive a complete{" "}
        <code>.genome/1.0</code> bundle and VCF as soon as results are ready.
      </p>

      <h2>What the API does</h2>
      <p>
        The Genome API exposes the full stack behind one call: collection,
        sequencing, variant calling, annotation, interpretation, and
        AI-native formatting. A kit ships to your customer. The sample
        returns to our accredited labs. The full pipeline runs. What lands
        in your application is the genome itself, not a report.
      </p>
      <p>
        Until now, building on genomic data meant choosing between three bad
        options:
      </p>
      <ul>
        <li>Scraping consumer reports.</li>
        <li>Integrating vendor SDKs that hide the raw genome.</li>
        <li>Standing up your own lab.</li>
      </ul>
      <p>All three trade away direct access to the underlying data.</p>
      <p>
        Whole genome 30x, whole genome 100x, SNP genotyping, and imputed SNP
        panels are all orderable through the same endpoint. The same
        vertically integrated pipeline we run for direct customers is now
        available programmatically, with no lab negotiations and no bespoke
        integrations. You receive the data, you
        control the interpretation, and the format you receive it in is open
        and durable.
      </p>
      <p>
        The same API also accepts existing VCFs. Partners whose users arrive
        with a file from a legacy provider, a clinical run, or a research
        dataset can submit it to a conversion endpoint and receive a
        fully-annotated <code>.genome</code> bundle in hours rather than
        weeks. Same output format, same downstream surface &mdash; fresh
        sequencing and existing files converge on a single primitive.
      </p>

      <h2>Clinical-grade infrastructure</h2>
      <p>
        Sequencing is performed in <strong>CLIA-, CAP-, and NATA-accredited</strong>,{" "}
        <strong>ISO 15189-certified</strong> laboratories. Data handling
        aligns with HIPAA controls.
      </p>
      <p>Every bundle includes a manifest that pins:</p>
      <ul>
        <li>Pipeline version.</li>
        <li>Reference build (GRCh38).</li>
        <li>Guideline snapshots used at interpretation time.</li>
      </ul>
      <p>
        Every result is auditable. Every claim traces back to a versioned
        source.
      </p>

      <h2>A Public Benefit Corporation</h2>
      <p>
        Genome Computer operates under{" "}
        <a
          href="https://www.humans.inc/blog/why-public-benefit-corporation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Humankind
        </a>
        , a Delaware Public Benefit Corporation. A PBC restructures corporate
        purpose: a traditional corporation is obligated to maximise
        shareholder value, while a PBC is required to balance shareholder
        interests with a defined public benefit and the interests of
        affected stakeholders.
      </p>
      <p>Humankind&rsquo;s charter is explicit:</p>
      <blockquote>
        To advance human understanding through the collective analysis of
        genomic and phenotypic data, while ensuring that identifiable
        individual data remains under individual control and is not sold or
        licensed for commercial use.
      </blockquote>
      <p>
        The genomics industry has repeatedly failed at this boundary. User
        data has been sold to pharmaceutical companies. Genetic databases
        have been handed to law enforcement without consent. Privacy terms
        have been rewritten retroactively when revenue ran short. When
        genomes are the most valuable asset on the balance sheet, monetising
        them becomes the default outcome.
      </p>
      <p>
        A PBC changes that constraint. Selling identifiable genetic data
        would violate fiduciary duty rather than fulfil it, and that
        commitment is embedded in legal documents that survive leadership
        transitions, financial crises, and acquisitions &mdash; the exact
        moments at which privacy promises have historically failed.
      </p>
      <p>
        For an API that other companies build on top of, this matters more
        than for a direct-to-consumer service. Two operating commitments
        follow from the charter:
      </p>
      <p>
        <strong>Open, durable formats.</strong> <code>.genome/1.0</code> is
        Apache-licensed and will remain so. The format is designed to
        outlive the company, and a bundle a partner ships today will still
        be parseable in 2030 regardless of what happens to us.
      </p>
      <p>
        <strong>Transparent science.</strong> Interpretation logic is
        embedded in the bundle, not hidden behind an API. Results can be
        audited, recomputed, and challenged.
      </p>

      <h2>
        Why <code>.genome</code> matters
      </h2>
      <p>
        Every order returns two artifacts: a VCF for compatibility with
        existing bioinformatics pipelines, and a <code>.genome</code> bundle
        for everything else.
      </p>
      <p>
        <code>.genome/1.0</code> is designed for AI and software systems
        rather than human specialists. The gains over reading the equivalent
        annotated VCF are measurable: an LLM uses{" "}
        <strong>3&ndash;7&times; fewer tokens</strong> of context, and
        produces <strong>10&ndash;20&times; better interpretive accuracy</strong>{" "}
        on standard genomic-reasoning evaluations. Four properties of the
        format account for this.
      </p>
      <p>
        <strong>It is AI-readable by construction.</strong> Variant data,
        interpretations, and rules are explicitly structured and versioned.
        There are no ambiguous encodings and no inferred meanings.
      </p>
      <p>
        <strong>It is deterministic.</strong> PharmGKB metabolizer status,
        ClinVar pathogenicity, and ACMG actionability are computed at
        pipeline time against pinned guideline versions, so there is no
        runtime guessing.
      </p>
      <p>
        <strong>It is queryable in milliseconds.</strong> Gene-level
        questions reduce to simple columnar reads, with no indexing
        complexity or specialised tooling required.
      </p>
      <p>
        <strong>It is versioned end-to-end.</strong> Each bundle pins
        guideline versions and timestamps, so a result re-interpreted next
        year produces a clean diff against the version generated this year.
      </p>

      <h2>What you can build</h2>
      <p>Things that should already exist:</p>
      <ul>
        <li>An agent that blocks the wrong drug before it is prescribed.</li>
        <li>
          A nutrition system that adjusts a user&rsquo;s diet based on how
          they actually metabolise food.
        </li>
        <li>
          A longevity coach grounded in the user&rsquo;s own genome rather
          than population averages.
        </li>
        <li>
          A research platform where consented genomes flow into cohorts in
          minutes instead of months.
        </li>
        <li>
          An assistant that grounds its advice in the user&rsquo;s biology,
          not in self-reported answers and survey data.
        </li>
      </ul>
      <p>
        Each of these requires direct application-layer access to genomic
        data formatted for a software reader. Each one is now possible.
      </p>
      <h2>Request access</h2>
      <p>
        The Genome API is in private beta with a small group of partners.
        We are looking for teams shipping real products this year &mdash;
        clinical, consumer, research, or agent-based &mdash; that want to
        ship faster and get feedback into the roadmap.
      </p>
      <p>
        Request access at <a href="/api">genome.computer/api</a> or write to{" "}
        <a href="mailto:api@genome.computer">api@genome.computer</a>.
      </p>
      <p>
        The genome is a building block. What are you going to build with it?
      </p>
    </Prose>
  );
}
