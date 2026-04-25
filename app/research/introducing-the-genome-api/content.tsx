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
        Genome Computer is opening early access to the Genome API. Partners
        can place sequencing orders programmatically, track them through the
        lab, and receive a complete <code>.genome/1.0</code> bundle and VCF
        as soon as results are ready.
      </p>

      <p>
        A single HTTPS endpoint between your application and a person&rsquo;s
        genome.
      </p>

      <p>
        For the last decade, the genome has been locked behind apps, PDFs, and
        proprietary pipelines. Builders couldn&rsquo;t access it. They could
        only consume it.
      </p>

      <p>That model is over.</p>

      <p>
        It&rsquo;s time to build bio.
        <br />
        Not on reports. Not on SDKs. On the genome itself.
      </p>

      <h2>What&rsquo;s actually new</h2>
      <p>
        For the first time, the entire pipeline &mdash; wet lab, sequencing,
        annotation, interpretation, and packaging into an AI-native file
        format &mdash; happens behind a single API call.
      </p>
      <p>
        Kit ships to your customer. Sample comes back to our accredited labs.
        Sequencing, variant calling, annotation, and interpretation all
        happen under one roof. What lands in your application is a{" "}
        <code>.genome</code> bundle and a VCF &mdash; consumable genomic data,
        formatted for the readers that matter today: software, agents, and
        language models.
      </p>
      <p>
        Until now, building on genomic data meant choosing between three bad
        options: scraping reports from consumer tests, integrating vendor SDKs
        that abstract away the raw genome, or standing up your own lab. Each
        approach trades away access to the genome itself.
      </p>
      <p>
        The Genome API makes the genome a first-class primitive.
      </p>
      <p>
        Whole genome 30x, whole genome 100x, SNP genotyping, and imputed SNP
        panels are all orderable through a single endpoint. No lab
        negotiations. No bespoke integrations. The same vertically integrated
        pipeline we run for direct customers, exposed programmatically at
        wholesale pricing.
      </p>
      <p>
        You receive the data. You control the interpretation. The format
        outlives the contract.
      </p>

      <h2>Clinical-grade infrastructure</h2>
      <p>This is not a layer where corners can be cut.</p>
      <p>
        Sequencing is performed in <strong>CLIA-, CAP-, and NATA-accredited</strong>,{" "}
        <strong>ISO 15189-certified</strong> laboratories. Data handling
        aligns with HIPAA controls. Every bundle includes a manifest pinning
        the lab, pipeline version, reference build (GRCh38), and guideline
        snapshots used at interpretation time.
      </p>
      <p>
        Every result is auditable. Every claim is traceable. Reproducibility
        is not a feature. It is a property of the system.
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
        , a Delaware Public Benefit Corporation.
      </p>
      <p>This is structural, not rhetorical.</p>
      <p>
        Traditional corporations are obligated to maximise shareholder value.
        A PBC is required to balance shareholder interests with a defined
        public benefit and the interests of affected stakeholders.
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
        data sold to pharma. Databases accessed without consent. Privacy terms
        rewritten under financial pressure.
      </p>
      <p>
        When genomes are the most valuable asset on the balance sheet, the
        incentive to monetise them is inevitable under a standard structure.
      </p>
      <p>
        A PBC changes that constraint. Selling identifiable genetic data would
        violate fiduciary duty, not fulfil it.
      </p>
      <p>
        For an API that other companies build on, this matters. You are not
        depending on a layer that can quietly pivot into a data brokerage
        model.
      </p>
      <p>Two commitments follow:</p>
      <p>
        <strong>Open, durable formats.</strong> <code>.genome/1.0</code> is
        Apache-licensed and will remain so. The format is designed to outlive
        the company. What you ship today remains parseable and usable in the
        future.
      </p>
      <p>
        <strong>Transparent science.</strong> Interpretation logic is embedded
        in the bundle, not hidden behind an API. Results can be audited,
        recomputed, and challenged.
      </p>

      <h2>
        Why <code>.genome</code> matters
      </h2>
      <p>Every order returns two artifacts.</p>
      <p>
        The VCF provides compatibility.
        <br />
        The <code>.genome</code> bundle provides leverage.
      </p>
      <p>
        <code>.genome/1.0</code> is designed for AI and software systems, not
        human specialists. The gains are measurable.
      </p>
      <p>
        <strong>3&ndash;7&times; fewer tokens. 10&ndash;20&times; better
        interpretive accuracy.</strong> Compared to the equivalent annotated
        VCF, an LLM reading a <code>.genome</code> bundle uses a fraction of
        its context window and produces dramatically more reliable answers on
        standard genomic-reasoning evaluations. Cheaper and right, on both
        axes the agent cares about.
      </p>
      <p>The four properties below are why.</p>
      <p>
        <strong>AI-readable by construction.</strong> Variant data,
        interpretations, and rules are explicitly structured and versioned.
        No ambiguous encodings. No inference required.
      </p>
      <p>
        <strong>Deterministic outputs.</strong> PharmGKB metabolizer status,
        ClinVar pathogenicity, and ACMG actionability are computed at pipeline
        time against pinned guideline versions. No runtime guessing.
      </p>
      <p>
        <strong>Queryable in milliseconds.</strong> Gene-level queries reduce
        to simple columnar reads. No indexing complexity. No specialised
        tooling.
      </p>
      <p>
        <strong>Versioned end-to-end.</strong> Each bundle pins guideline
        versions and timestamps, enabling clean diffs across time as
        interpretations evolve.
      </p>
      <p>
        The VCF is sovereignty.
        <br />
        The <code>.genome</code> bundle is usability.
      </p>

      <h2>What you can build</h2>
      <p>
        An agent that blocks the wrong drug before it&rsquo;s prescribed.
        <br />
        A system that adjusts diet based on how a user actually metabolises
        food.
        <br />
        Cohorts that assemble themselves in minutes, not months.
        <br />
        An AI that doesn&rsquo;t just remember what you say, but how
        you&rsquo;re built.
      </p>
      <p>
        Software that knows you biologically. Not inferred. Not self-reported.
        Read directly from your genome.
      </p>
      <p>We will not build all of these.</p>
      <p>You should.</p>

      <h2>Request access</h2>
      <p>
        The Genome API is in private beta with a small group of partners.
      </p>
      <p>
        We are looking for teams shipping real products this year across
        clinical, consumer, research, or agent-based systems. The API is
        stable enough to build on and early enough that feedback shapes the
        roadmap.
      </p>
      <p>
        Request access at{" "}
        <a href="/api">genome.computer/api</a>
        <br />
        <a href="mailto:api@genome.computer">api@genome.computer</a>
      </p>

      <h2>The genome is a building block</h2>
      <p>It&rsquo;s time to build bio.</p>
    </Prose>
  );
}
