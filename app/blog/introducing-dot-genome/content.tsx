"use client";

import { useState } from "react";

type Tab = "overview" | "technical";

export function PostContent() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex flex-col">
      <TabToggle value={tab} onChange={setTab} />
      <div className="mt-14">
        {tab === "overview" ? <Overview /> : <Technical />}
      </div>
    </div>
  );
}

function TabToggle({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="mx-auto inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
      {(["overview", "technical"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-pressed={value === t}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors ${
            value === t
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t === "overview" ? "Overview" : "Technical"}
        </button>
      ))}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-muted-foreground [&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-foreground [&_h3]:mt-2 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-border [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ol]:m-0 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_p]:m-0 [&_li]:m-0 [&_blockquote]:m-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius-md)] [&_pre]:border [&_pre]:border-border [&_pre]:bg-background [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-[1.55] [&_pre]:text-foreground [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[inherit] [&_hr]:my-2 [&_hr]:border-border">
      {children}
    </div>
  );
}

function Overview() {
  return (
    <Prose>
      <p>Today we&rsquo;re releasing two things together.</p>
      <ul>
        <li>
          <strong>.genome/1.0</strong> — the first open specification for a
          consumer genome file designed to be read by an AI.
        </li>
        <li>
          <strong>readmygenome.md</strong> — a skill that lets any
          Claude instance read a <code>.genome</code> bundle correctly, with
          provenance, out of the box.
        </li>
      </ul>
      <p>
        Both are open-source, Apache-licensed, and at{" "}
        <a
          href="https://github.com/genome-computer/genome-spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/genome-computer/genome-spec
        </a>
        . One is the format. The other is how an AI actually uses it.
      </p>
      <p>
        A genome file designed for AI is not a small improvement on what
        exists. It is a different category. Here is why.
      </p>

      <h2>Why a new file was necessary</h2>
      <p>
        The file your genome currently lives in — VCF, Variant Call Format —
        was standardised in 2011 for sequencing pipelines. It was designed
        for tools written by specialists, operated by specialists,
        interpreted by specialists. The file did not need to explain itself.
        The specialist explained it.
      </p>
      <p>
        Fifteen years later, the specialist is increasingly an AI acting on
        your behalf. And the AI does not have the specialist&rsquo;s toolkit.
        It has the file and whatever it can reconstruct from it. Every place
        where VCF defers meaning to external context — which is most places
        — is a place where the AI guesses.
      </p>
      <ul>
        <li>
          A pipe-delimited string where meaning depends on a header the
          model no longer has.
        </li>
        <li>
          A ClinVar tag where pathogenicity and conflict are encoded in
          punctuation.
        </li>
        <li>
          An effect size without the allele it refers to — so risk flips
          depending on interpretation.
        </li>
        <li>
          A pharmacogenomic phenotype that requires haplotype logic the
          model will invent rather than execute.
        </li>
        <li>
          An &ldquo;actionable&rdquo; flag that depends on a guideline list
          the model is approximating from memory.
        </li>
      </ul>
      <p>
        None of these are bugs. They are features of a format designed for a
        different reader. The fix is not a better model. It is a file the
        model can actually read.
      </p>

      <h2>What makes .genome different</h2>
      <p>
        A <code>.genome</code> bundle separates three things that VCF
        entangles: the variant data, the interpretation of what each variant
        means, and the rules that decide what counts as important. All three
        are explicit, typed, versioned, and queryable. This is how
        databases, compilers, and financial systems are built. Consumer
        genomics had not yet made the move. <code>.genome</code> makes it.
      </p>
      <p>
        <strong>A formal correctness guarantee.</strong> For any question
        expressible as a query over the bundle&rsquo;s fields — actionable
        pathogenic variants, CYP2D6 metabolizer status, variants where the
        effect allele is present and OR &gt; 1.2, rare missense variants
        where multiple predictors agree — format-induced error is zero. Not
        approximately zero. Zero. The same way a type checker rules out type
        errors by construction.
      </p>
      <p>
        <strong>Deterministic answers.</strong> &ldquo;Is this variant
        actionable?&rdquo; is decided by a rule written in the manifest,
        computed once at pipeline time, against a hash-pinned copy of the
        relevant guideline list. No model imputes the rule. No answer
        depends on what the model remembered.
      </p>
      <p>
        That does put a set of opinionated decisions into the file. A rarity
        threshold. An actionability definition. A consensus-damaging rule.
        We take this trade deliberately: implicit disagreement at runtime is
        strictly worse than visible disagreement at design time. Every rule
        is declared in the manifest. Every rule is versioned. If we have
        made the wrong choice, the correct response is a public issue
        proposing a revision — not silent disagreement at every point of
        use.
      </p>
      <h3>A queryable state space.</h3>
      <blockquote>
        The schema converts genomic reasoning from reconstructing meaning to
        executing queries.
      </blockquote>
      <p>
        This is the real unlock for agents — not just fewer hallucinations,
        but a change in what kind of computation genomics reasoning is.
      </p>
      <p>
        <strong>Speed and size.</strong> Gene-scoped queries return in
        milliseconds instead of seconds. Bundles are a fraction the size of
        an annotated VCF. Any tool that reads Parquet reads{" "}
        <code>.genome</code> — Python, JavaScript, SQL, a browser.
      </p>
      <p>
        <strong>A dated snapshot, not a frozen truth.</strong> Clinical
        knowledge changes. ClinVar updates weekly. ACMG reclassifies genes.
        A <code>.genome</code> bundle is explicit about this: it is a
        snapshot of what was known when it was generated, with the source
        versions and rule definitions recorded in its manifest.
        Re-interpretation is a first-class operation — the same raw variant
        data regenerated against an updated rule set produces a new bundle.
        You choose between snapshot-consistent answers (auditable,
        reproducible) and latest-consistent answers (freshest). Both are
        supported.
      </p>

      <h2>What this enables</h2>
      <p>
        <strong>If you want to ask an AI about your genome:</strong> your AI
        can finally answer without silently getting the file wrong. Ask
        harder questions. Trust the answers more.
      </p>
      <p>
        <strong>If you are building an AI on top of genomic data:</strong>{" "}
        this removes an entire class of failure from your system. You stop
        writing defensive code around VCF quirks. You stop explaining to
        users why the answer changed between conversations. Correctness
        becomes a property of the data layer, not of every prompt.
      </p>
      <p>
        <strong>If you are a provider shipping genomic data:</strong> adding
        a <code>.genome</code> bundle alongside your existing VCF takes one
        conversion step and no pipeline rewrite. Your customers&rsquo; AI
        tools work better on your data. That is a product advantage, not a
        science project.
      </p>

      <h2>What we&rsquo;re releasing</h2>
      <p>
        Everything is at{" "}
        <a
          href="https://github.com/genome-computer/genome-spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/genome-computer/genome-spec
        </a>
        , Apache-licensed.
      </p>
      <p>
        <strong>The file format.</strong> The <code>.genome/1.0</code>{" "}
        schema and specification, a reference reader and validator, a
        synthetic example bundle anyone can inspect, and a benchmark suite.
      </p>
      <p>
        <strong>The converter.</strong> <code>genome-convert</code> — a
        single-command tool that turns any annotated VCF into a compliant{" "}
        <code>.genome</code> bundle in under five minutes. No pipeline
        rewrite, no custom infrastructure.
      </p>
      <p>
        <strong>The skill.</strong> <code>readmygenome.md</code> — a
        drop-in skill that teaches any Claude instance how to read a{" "}
        <code>.genome</code> bundle correctly, with provenance and without
        improvising. Install it once, upload a bundle, ask anything.
      </p>
      <p>
        Your original VCF is not replaced. It ships alongside as the
        sovereignty layer. The bundle is additive.
      </p>

      <h2>How to actually use this</h2>
      <p>Three steps:</p>
      <ol>
        <li>
          Convert your annotated VCF to a <code>.genome</code> bundle with{" "}
          <code>genome-convert</code>.
        </li>
        <li>
          Install <code>readmygenome.md</code> as a skill.
        </li>
        <li>
          Upload your bundle to a Claude conversation. Ask questions.
        </li>
      </ol>
      <p>
        Claude validates the bundle, reads the manifest, runs structured
        queries against the data, and answers with provenance. Every
        interpretive claim cites the rule used and the snapshot date.
        Out-of-scope questions are refused, not improvised.
      </p>
      <p>
        The skill is ~300 lines of open-source code. Anyone can adapt it for
        a different agent, a different model, or a different user interface.
        We are shipping it because a file format is only as useful as the
        tools that read it correctly, and we want the first agent that reads{" "}
        <code>.genome</code> bundles well to exist on day one.
      </p>
      <p>
        We&rsquo;ve also written a longer research post that walks through
        the full invariant-violation framework, the formal correctness
        claim, and the trade-offs in detail. It&rsquo;s linked from the
        repository.
      </p>
      <p>
        The consumer genomics file format is about to matter more than it
        has in fifteen years, because for the first time the primary reader
        is not a specialist. It&rsquo;s a machine.
      </p>

      <p className="pt-2 text-[13px]">
        <a
          href="https://github.com/genome-computer/genome-spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/genome-computer/genome-spec
        </a>{" "}
        ·{" "}
        <a href="mailto:research@genome.computer">research@genome.computer</a>
      </p>
    </Prose>
  );
}

function Technical() {
  return (
    <Prose>
      <p>
        Variant Call Format (VCF) was standardised in 2011 for sequencing
        pipelines. Fifteen years later, a primary consumer of a consumer
        genomics deliverable is a language model or agent. VCF is not
        structured for this reader, and the mismatch is not a matter of
        taste — it produces a class of errors that is enumerable,
        structural, and unavoidable under the format&rsquo;s design.
      </p>
      <p>
        This post makes four claims.{" "}
        <strong>First</strong>, the errors arising from LLM-on-VCF workflows
        reduce to three underlying invariant violations: detached schema,
        external dependency leakage, and reference-frame ambiguity.{" "}
        <strong>Second</strong>, for any query expressible as a predicate
        over pre-computed fields, format-induced error is provably zero — a
        property of the system, not a measurement of behaviour.{" "}
        <strong>Third</strong>, the format that achieves this is not a new
        file type but an opinionated schema over columnar storage, bundled
        with a typed manifest and versioned against a public specification.{" "}
        <strong>Fourth</strong>, the deeper contribution is architectural:
        genomics becomes a queryable state space with stable predicates,
        which is what enables deterministic agent reasoning.
      </p>
      <p>
        We release two artifacts today, both Apache-licensed, at{" "}
        <a
          href="https://github.com/genome-computer/genome-spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/genome-computer/genome-spec
        </a>
        .
      </p>
      <ul>
        <li>
          <strong>.genome/1.0</strong> — the binding specification, a
          reference reader, a synthetic example bundle, a benchmark suite,
          and a conversion tool that produces a bundle from an existing
          annotated VCF in under five minutes with no pipeline rewrite.
        </li>
        <li>
          <strong>readmygenome.md</strong> — a skill that
          operationalises the spec. It lets any Claude instance read a{" "}
          <code>.genome</code> bundle correctly, enforcing the spec&rsquo;s
          structural guarantees at the agent layer. The skill is a single
          markdown file plus three small Python scripts, ~300 lines total,
          designed to be adapted for other agent systems.
        </li>
      </ul>
      <p>
        Shipping both together closes the loop: a provider produces a
        bundle with <code>genome-convert</code>; a user reads it with{" "}
        <code>readmygenome.md</code>. The path from &ldquo;I have a
        VCF&rdquo; to &ldquo;an AI can tell me what&rsquo;s in my genome
        correctly&rdquo; is two commands and a file drop.
      </p>

      <h2>1. What consumer genomics has actually built</h2>
      <p>
        Consumer genomics ships variants, annotations, and interpretation
        as three physically entangled objects. The VCF is the variant
        record. Annotations are bolted on as pipe-delimited strings inside
        INFO fields. Interpretation — &ldquo;is this pathogenic?&rdquo;,
        &ldquo;is this actionable?&rdquo;, &ldquo;what does this effect
        size mean?&rdquo; — lives partly in external knowledge bases,
        partly in the reader&rsquo;s head, partly in whatever tools sit
        downstream of the file.
      </p>
      <p>
        For a bioinformatician this arrangement is workable. The skill of
        a bioinformatician is precisely the ability to bridge these three
        objects using the toolkit that has accreted around VCF over
        fifteen years. The reader supplies the missing structure.
      </p>
      <p>
        For an agent, the arrangement is broken. The agent has no toolkit
        accretion. It has the file and whatever it can reconstruct from
        context. Every piece of missing structure becomes a place where
        probabilistic reasoning lands, and the format provides no anchor
        for the reasoning to settle on.
      </p>
      <p>
        With sufficient tooling, these properties can be reconstructed
        around VCF — that is what fifteen years of bioinformatics has
        produced. The claim here is that they should be properties of the
        format itself, not properties of the surrounding toolchain. When
        the consumer of the file is no longer the toolchain but a
        general-purpose agent, the toolchain cannot be assumed.
      </p>
      <p>
        The fix is not better prompting or bigger context windows. It is
        to stop shipping entangled objects. Separate the data, the
        interpretation, and the rules. Make all three explicit, typed,
        versioned, and queryable. This is how databases, compilers, and
        financial systems are built. Genomics has not caught up.
      </p>

      <h2>2. Three invariant violations</h2>
      <p>
        We catalogued six recurring error classes from LLM-on-VCF
        workflows and found they collapse into three deeper failure
        modes. Each is an invariant violation — a property a format must
        satisfy to be readable without external scaffolding, which VCF
        does not satisfy.
      </p>

      <h3>2.1 Detached schema</h3>
      <p>
        <strong>Invariant violated:</strong> Without row-level
        self-description, partial reads are undefined.
      </p>
      <p>
        VEP annotations arrive as a pipe-delimited CSQ string whose field
        order is declared once in the file header. A row-level reader —
        any agent working through chunks of variants, any RAG pipeline
        that retrieves individual rows, any tool-use loop that fetches
        variants by region — loses the header binding. It guesses at
        field positions. It returns the transcript biotype when asked
        for impact.
      </p>
      <p>
        ClinVar clinical significance is a further case. The values{" "}
        <code>Pathogenic</code>,{" "}
        <code>Pathogenic/Likely_pathogenic,_other</code>, and{" "}
        <code>Conflicting_interpretations_of_pathogenicity,_Pathogenic</code>{" "}
        encode distinct interpretations through punctuation. A reader
        matching on substrings cannot distinguish them. The significance
        field does not describe its own uncertainty.
      </p>
      <p>
        Under this invariant, a typed column with a defined value set is
        correct; a pipe-delimited string with header-indexed fields is
        not.
      </p>

      <h3>2.2 External dependency leakage</h3>
      <p>
        <strong>Invariant violated:</strong> If correctness depends on
        out-of-band state, answers are non-deterministic.
      </p>
      <p>
        &ldquo;Is this variant actionable?&rdquo; requires knowledge of
        the current ACMG Secondary Findings gene list (v3.2, 78 genes).
        &ldquo;Is this variant rare?&rdquo; requires a declared
        allele-frequency threshold. Neither is in any VCF row. A model
        answering either question is either retrieving the criteria from
        outside the file — in which case the answer depends on what
        external context happens to be available — or approximating,
        which is to say hallucinating.
      </p>
      <p>
        Under this invariant, a pre-computed boolean with a
        manifest-declared rule is correct; deferring the criterion to
        inference-time knowledge is not.
      </p>

      <h3>2.3 Reference-frame ambiguity</h3>
      <p>
        <strong>Invariant violated:</strong> Unbound reference frames
        invert meaning under transformation.
      </p>
      <p>
        A GWAS effect size is meaningless without the allele it is
        measured against. A &ldquo;protective&rdquo; variant with OR
        0.72 relative to the minor allele is a &ldquo;risk&rdquo;
        variant with OR 1.39 relative to the major allele, and VCF
        historically records neither. A pharmacogenomic star allele is a
        haplotype — a combination of variants on a shared chromosome,
        sometimes involving copy-number variation — not a single
        variant, and a model reading individual variant rows cannot
        resolve haplotype-level calls from variant-level presence.
      </p>
      <p>
        Under this invariant, an effect size must co-occur with{" "}
        <code>effect_allele</code> and <code>effect_type</code>; a star
        allele must live at the gene level, not the variant level.
      </p>

      <h3>2.4 The synthesis</h3>
      <p>
        These three invariants describe a format that an agent can read
        correctly using only the format itself. VCF satisfies none of
        them cleanly. That is not a criticism of VCF&rsquo;s original
        design — its original design was correct for sequencing
        pipelines — but it is the architectural reason why agent-on-VCF
        workflows fail in predictable, enumerable ways.
      </p>

      <h2>3. The principle</h2>
      <blockquote>
        Separate data, interpretation, and rules. Make all three
        explicit, typed, versioned, and queryable.
      </blockquote>
      <p>Three consequences follow.</p>
      <p>
        <strong>Interpretation moves upstream.</strong> Semantic
        decisions — rarity, actionability, consensus damaging status,
        clinical grade — are pre-computed at pipeline time against
        versioned rules, not reconstructed at inference time from
        whatever the model imputes. This converts stochastic reasoning
        into deterministic predicate evaluation.
      </p>
      <p>
        <strong>Rules become first-class artifacts.</strong> The rule
        that defines <code>is_actionable</code> is not implicit. It is
        written in the manifest with a hash of the ACMG list it was
        computed against. Anyone can audit it, reproduce it, or disagree
        with it. Disagreement moves from &ldquo;the model got it
        wrong&rdquo; to &ldquo;we should change the rule&rdquo; — a
        tractable engineering conversation instead of an intractable
        behavioural one.
      </p>
      <p>
        <strong>The schema becomes a query surface.</strong> Typed,
        dictionary-encoded, nested-where-semantics-demand-it. An agent
        reads <code>schema.json</code> and knows what predicates it can
        evaluate, what values each field can take, and what nulls to
        expect. Reasoning becomes query planning.
      </p>
      <p>
        This last point is the deeper shift.
      </p>
      <blockquote>
        The schema converts genomic reasoning from reconstructing
        meaning to executing queries.
      </blockquote>
      <p>
        That is the real unlock for agents — not just fewer
        hallucinations, but a change in what kind of computation
        genomics reasoning is.
      </p>

      <h2>4. The .genome bundle</h2>
      <h3>4.1 Layout</h3>
      <pre>
        <code>{`/genome/
  manifest.json              # reproducibility anchor
  schema.json                # binding contract, v1.0.0
  report.pdf                 # human-readable report
  findings.json              # resolved, partner-facing
  variants.parquet/          # partitioned by chromosome
    chrom=chr1/part-0000.parquet
    ...
  pharmacogenomics.parquet   # gene/diplotype-level PGx
  gene_index.parquet         # query planning helper
  prs.parquet                # PRS values + contributing variants
  reads.cram                 # optional raw layer`}</code>
      </pre>
      <p>
        Each artifact has one intended consumer. The original VCF ships
        alongside as the sovereignty layer; the bundle does not replace
        it.
      </p>

      <h3>4.2 The formal correctness claim</h3>
      <p>
        Under the three-invariant framework, the <code>.genome</code>{" "}
        bundle satisfies what VCF does not:
      </p>
      <ul>
        <li>
          <strong>Self-describing fields.</strong> Every VEP annotation
          is a typed column with a named path (
          <code>consequence.impact</code>,{" "}
          <code>consequence.hgvsp</code>). Every ClinVar value lives in
          a dictionary-encoded column with a defined value set.
          Conflicts are a separate boolean (
          <code>pathogenicity.clinvar_has_conflicts</code>); uncertainty
          is a separate integer (
          <code>pathogenicity.clinvar_review_stars</code>). There is no
          substring to mismatch.
        </li>
        <li>
          <strong>Self-contained correctness.</strong>{" "}
          <code>is_actionable</code>, <code>is_rare</code>,{" "}
          <code>consensus_damaging</code>, and{" "}
          <code>clinical_grade</code> are pre-computed. Their rules,
          along with hashes of the authoritative lists they reference
          (ACMG SF v3.2, CPIC gene list, population frequency source),
          are written to{" "}
          <code>manifest.json.consensus_definitions</code>. A query
          needs nothing outside the bundle.
        </li>
        <li>
          <strong>Explicit reference frames.</strong> Every{" "}
          <code>trait_associations</code> row mandates{" "}
          <code>effect_size</code>, <code>effect_type</code>, and{" "}
          <code>effect_allele</code> — the row cannot be written
          without all three, and the pipeline refuses to emit a bundle
          that violates this. Star alleles, phenotypes, and CPIC
          guidance live at the gene level in{" "}
          <code>pharmacogenomics.parquet</code>, one row per diplotype.
          Variant-level rows carry only <code>is_pgx</code> and{" "}
          <code>contributes_to_gene</code>; haplotype ambiguity cannot
          arise at the variant level because haplotype information is
          not represented at the variant level.
        </li>
      </ul>
      <p>From this follows the formal claim:</p>
      <blockquote>
        For any query expressible as a predicate over the pre-computed
        fields defined in <code>schema.json</code> v1.0.0,
        format-induced error is zero.
      </blockquote>
      <p>
        Queries that require composing new semantics — &ldquo;aggregate
        lifetime cancer risk across pathways,&rdquo; &ldquo;synthesise a
        narrative explanation of this variant cluster&rdquo; — fall
        outside this boundary. Queries that reduce to filtering,
        joining, and projecting existing fields fall inside it. The
        claim is precise: the bundle provides structural correctness for
        the former class and nothing for the latter, which is why §4.3
        is explicit about what remains stochastic.
      </p>
      <p>
        This is a property of the system, not an empirical observation.
        It is the analogue of a type-checker&rsquo;s soundness
        guarantee: the set of errors it rules out is the set of errors
        it rules out by construction, and the guarantee holds for any
        query that respects the schema.
      </p>

      <h3>4.3 What remains stochastic</h3>
      <p>
        The bundle makes a bounded claim. It eliminates errors of format
        ambiguity. It does not eliminate:
      </p>
      <ul>
        <li>
          <strong>Reasoning errors over correct data.</strong> A model
          that retrieves the right variants and then misinterprets their
          clinical meaning is still possible.
        </li>
        <li>
          <strong>Scope errors.</strong> A user asks about breast cancer
          risk; the agent answers only about BRCA1/2. This is a
          retrieval-strategy problem, not a format problem.
        </li>
        <li>
          <strong>Out-of-distribution queries.</strong> If a query asks
          for something the schema does not cover, no structural
          guarantee applies.
        </li>
        <li>
          <strong>Interpretation of polygenic scores.</strong> The
          bundle records PRS values and training sources correctly. What
          they mean for an individual is interpretive, and the bundle
          takes no position.
        </li>
      </ul>
      <p>
        Pushing error below the bundle&rsquo;s floor requires better
        prompting, better agent architecture, and better evaluation. The
        bundle is not sufficient for correctness; it is necessary for
        the structural class of correctness it provides.
      </p>

      <h2>5. The snapshot problem, and the recomputability boundary</h2>
      <p>
        The most credible objection to pre-computed interpretation is
        that interpretation changes.
      </p>
      <p>
        ClinVar is updated weekly. ACMG reclassifies genes. GWAS summary
        statistics are revised. A CPIC guideline published in 2024 can
        be superseded in 2026. A bundle generated on a Tuesday encodes
        interpretive decisions that may be wrong by the following
        Monday. Freezing those decisions into a file risks shipping
        stale clinical meaning forward under the imprimatur of a
        versioned artifact.
      </p>
      <p>We address this with an explicit concept.</p>
      <blockquote>
        The bundle is a snapshot of interpretation under a declared rule
        set. It is not the final truth. Re-interpretation is a
        first-class operation, not an implicit expectation.
      </blockquote>
      <p>Three design consequences:</p>
      <p>
        <strong>Every interpretive field declares its provenance.</strong>{" "}
        The manifest records: the ClinVar version used, the ACMG list
        version and SHA256, the population frequency source and date,
        the PRS training summary statistics and date, the CPIC guideline
        version, and the pipeline code version. A consumer reading the
        bundle in 2028 can see exactly what was believed in 2026.
      </p>
      <p>
        <strong>Re-interpretation is a defined operation.</strong>{" "}
        Running the pipeline over the same underlying VCF with an
        updated rule set produces a new bundle with bumped
        interpretation-version identifiers and the same variant-level
        data. The raw variant content and the interpretive layer are
        separable; interpretive updates do not require re-sequencing.
      </p>
      <p>
        <strong>The bundle is content-addressable.</strong> SHA256
        hashes in the manifest mean a bundle generated today is a
        durable, verifiable artifact. A bundle generated next year with
        updated interpretations is a different artifact; they can
        coexist and be compared.
      </p>
      <p>
        This defines what we call the{" "}
        <em>recomputability boundary</em>. Inside it — the variant calls
        themselves, the genotype, the sovereign VCF — the bundle is a
        durable record. Outside it — the interpretive layer — the
        bundle is a dated snapshot, with provenance sufficient to
        recompute against any future rule set.
      </p>
      <p>
        The operational consequence matters. Consumers can choose
        between <em>snapshot-consistent</em> answers (use the bundle
        as-is) and <em>latest-consistent</em> answers (recompute against
        current rule sets), depending on their use case. Clinical and
        audit contexts want snapshot consistency — the answer should be
        what was true when the bundle was signed, traceable and
        reproducible. Exploratory and research contexts often want
        latest consistency — what does current knowledge say about
        these variants today. The bundle supports both; the choice is
        the consumer&rsquo;s.
      </p>
      <p>
        Critics who worry about frozen clinical meaning are right to
        raise the concern; our response is not to freeze it but to make
        re-interpretation a normal, cheap, traceable operation. This is
        how every serious system that commits interpretive decisions to
        storage handles the problem — from compiler ASTs to financial
        ledger close-outs to scientific data products. Genomics has not
        yet standardised the pattern. The <code>.genome</code> bundle
        proposes one.
      </p>

      <h2>6. The failure mode we introduce</h2>
      <p>
        Honest critique of the proposal must include the failure mode
        the proposal itself introduces.
      </p>
      <h3>E7. Schema overreach</h3>
      <p>
        When a schema pre-computes interpretation, the schema&rsquo;s
        author chooses thresholds, ontologies, and collapsing rules.
        These choices can:
      </p>
      <ul>
        <li>
          <strong>Erase nuance.</strong> Collapsing significance into a
          dictionary value loses the textual commentary that sometimes
          accompanies a ClinVar submission.
        </li>
        <li>
          <strong>Encode contestable assumptions.</strong>{" "}
          <code>is_rare</code> at 1% produces different results from{" "}
          <code>is_rare</code> at 0.1%. Both are defensible in different
          contexts; the schema picks one.
        </li>
        <li>
          <strong>Bias downstream interpretation.</strong> Once{" "}
          <code>is_actionable</code> is a field, agents will filter on
          it. The specific rule used will shape what users ever see.
        </li>
      </ul>
      <p>
        This is a real trade. We accept it deliberately. We trade
        interpretive flexibility for determinism, and the cost is that
        disagreements move from runtime to schema design. This cost is
        the price of the structural correctness guarantee in §4.2.
      </p>
      <p>Three mitigations are in the current spec:</p>
      <ul>
        <li>
          Every pre-computed field declares its rule in the manifest, so
          the choice is visible and contestable.
        </li>
        <li>
          Raw underlying fields (unthresholded frequencies, full ClinVar
          significance strings, per-tool prediction scores) are
          preserved alongside the pre-computed booleans, so an agent or
          analyst who wants to apply a different rule can.
        </li>
        <li>
          The schema is versioned and governed in public; if a
          pre-computed rule is wrong, the correct response is a public
          issue proposing a revision, not silent disagreement.
        </li>
      </ul>
      <p>
        In practice, large-scale systems converge on making these
        choices explicitly because implicit disagreement at runtime does
        not scale. This is the pattern databases, compilers, and
        financial systems have adopted — not because the choices are
        easy, but because opaque disagreement at the point of use is
        strictly worse than visible disagreement at the point of design.
        The former compounds; the latter converges.
      </p>

      <h2>7. Adoption: an operational wedge</h2>
      <p>
        A specification that requires a pipeline rewrite to adopt will
        not be adopted. We have built the wedge accordingly.
      </p>

      <h3>7.1 Five-minute conversion from existing VCF</h3>
      <p>
        The repository ships <code>genome-convert</code> — a single
        Python CLI that takes an annotated VCF (VEP, ClinVar, gnomAD,
        CADD, REVEL, AlphaMissense, SpliceAI) and produces a{" "}
        <code>.genome/1.0</code> bundle.
      </p>
      <pre>
        <code>{`genome-convert input.vcf.gz --reference GRCh38.fa --out /genome/`}</code>
      </pre>
      <p>
        For a typical whole-genome VCF the conversion completes in
        under five minutes on a single machine. It uses{" "}
        <code>bcftools</code> for normalization, <code>cyvcf2</code> for
        parsing, and the vendored PharmCAT CLI for PGx gene-level calls.
        No pipeline rewrite is required. Drop-in from any existing
        VEP/CPIC-aware workflow.
      </p>
      <p>
        Immediately after conversion, the bundle supports deterministic
        queries such as:
      </p>
      <ul>
        <li>
          &ldquo;All actionable pathogenic variants in this
          genome.&rdquo; — one predicate:{" "}
          <code>pathogenicity.is_actionable AND clinical_grade</code>.
        </li>
        <li>
          &ldquo;All PGx phenotypes and their affected drugs.&rdquo; —
          one join: <code>pharmacogenomics.parquet</code> →{" "}
          <code>phenotype</code>, <code>affected_drugs</code>.
        </li>
        <li>
          &ldquo;All GWAS hits with OR &gt; 1.2 where the effect allele
          is present in this genotype.&rdquo; — one predicate:{" "}
          <code>
            trait_associations.effect_type = &apos;odds_ratio&apos; AND
            trait_associations.effect_size &gt; 1.2 AND effect_allele ∈
            genotype.alleles
          </code>
          .
        </li>
        <li>
          &ldquo;All rare missense variants where at least two
          pathogenicity predictors agree.&rdquo; — one predicate:{" "}
          <code>
            is_rare AND consequence.impact = &apos;MODERATE&apos; AND
            predictions.consensus_damaging
          </code>
          .
        </li>
      </ul>
      <p>
        Each of these requires no additional tooling, no external
        knowledge base lookup, and no parsing logic. The conversion is
        not a format change; it is a capability unlock.
      </p>

      <h3>7.2 readmygenome.md — the skill</h3>
      <p>
        Producing a bundle is half the problem. The other half is
        making sure an agent reading the bundle actually respects the
        structural guarantees the bundle was designed to provide. A
        well-formed bundle read by an agent that treats it like a VCF
        still re-introduces the failure modes the spec was built to
        prevent.
      </p>
      <p>
        We ship <code>readmygenome.md</code>: a skill released
        under the same Apache 2.0 license, in the same repository, that
        instructs any Claude instance how to read a{" "}
        <code>.genome/1.0</code> bundle correctly. It is a single
        markdown file plus three small Python scripts (
        <code>validate_bundle.py</code>, <code>orient.py</code>,{" "}
        <code>query.py</code>) and a reference catalog of canonical
        queries mapped to user intents.
      </p>
      <p>
        The skill enforces six behaviours that map directly to the
        spec&rsquo;s structural guarantees:
      </p>
      <ol>
        <li>
          <strong>Always query, never recall.</strong> The bundle is the
          source of truth for every question about its contents. The
          skill runs SQL against the bundle rather than letting the
          model answer from prior knowledge of variants, ClinVar
          classifications, or pharmacogenomic guidelines.
        </li>
        <li>
          <strong>Validate before reading.</strong> Every interaction
          starts with manifest and hash verification. A non-conformant
          bundle triggers an explicit failure, not a best-effort parse.
        </li>
        <li>
          <strong>Cite the rule for every interpretive claim.</strong>{" "}
          Any surfacing of <code>is_actionable</code>,{" "}
          <code>is_rare</code>, <code>consensus_damaging</code>, or{" "}
          <code>clinical_grade</code> includes the rule definition from
          the manifest and the source version it was computed against.
        </li>
        <li>
          <strong>
            Default to <code>clinical_grade = true</code> for
            clinical-context questions.
          </strong>{" "}
          Exploratory PRS- and GWAS-derived signals require the user
          to broaden scope explicitly.
        </li>
        <li>
          <strong>Report the snapshot date.</strong> Every interpretive
          answer surfaces the bundle&rsquo;s <code>generated_at</code>{" "}
          timestamp. Bundles materially older than ~6 months trigger a
          recomputation prompt.
        </li>
        <li>
          <strong>Refuse out-of-scope questions.</strong> Questions the
          bundle cannot answer trigger explicit refusals, not
          improvisation. The skill ships with a catalogue of canonical
          out-of-scope patterns (clinical recommendations, drug dosing
          decisions, predictions of future disease, multi-bundle
          comparison) that are routed to appropriate out-of-band
          resources.
        </li>
      </ol>
      <p>
        The skill is an existence proof, not a platform lock-in. It is
        deliberately narrow — ~300 lines of Python — so that
        implementers can adapt it for their own agents, their own
        models, or their own interfaces. Equivalent skills for GPT-class
        models, open-weight models, and custom agent frameworks are
        welcome contributions. What matters is that{" "}
        <code>.genome</code> bundles are read correctly somewhere on
        day one; Claude happens to be where we started.
      </p>

      <h3>7.3 Who adopts first</h3>
      <p>We expect three specific beachheads:</p>
      <p>
        <strong>AI-native consumer genomics platforms.</strong> The ones
        building LLM-fronted interpretation today have the highest pain
        from the error taxonomy and the lowest legacy-pipeline cost to
        switch. This includes our own stack at{" "}
        <code>genome.computer</code>; it also includes several
        early-stage entrants we would be happy to work with directly on
        v1.0 adoption.
      </p>
      <p>
        <strong>Pharmacogenomics providers.</strong> PGx suffers the
        most from reference-frame ambiguity (§2.3). A PGx provider
        adopting the bundle moves star-allele calling to an
        authoritative gene-level representation and resolves the single
        biggest source of variant-level PGx error. The PGx sub-schema
        is usable independently of the full bundle.
      </p>
      <p>
        <strong>API-first genomics platforms.</strong> Companies
        exposing variant data to downstream developers through APIs
        benefit most from a schema-versioned, type-safe output surface.
        Parquet + <code>schema.json</code> is strictly easier to build
        against than a custom VCF dialect.
      </p>
      <p>
        We are explicitly not targeting: large clinical labs with
        accredited VCF-based pipelines, regulated diagnostic workflows
        with fixed output formats, or academic consortia with
        investment in legacy tooling. Those adopt later, if at all, and
        the case for them depends on evidence we have not yet gathered.
      </p>

      <h2>8. Open problems</h2>
      <p>v1.0 does not address, and we are explicit about this:</p>
      <ul>
        <li>
          <strong>Structural variants.</strong> The schema handles SNVs
          and small indels cleanly. Inversions, translocations, large
          deletions, and repeat expansions need a canonical
          representation we have not yet committed to. v1.1.
        </li>
        <li>
          <strong>Multi-sample bundles.</strong> Single-individual only
          in v1.0. Trios, cohorts, and clinical comparison workflows
          require a multi-sample partition strategy that is anticipated
          in the schema but not specified.
        </li>
        <li>
          <strong>Polygenic-score versioning.</strong> PRS computed
          from different summary statistics are not comparable. We
          record training sources per score but have not formalised
          multi-version coexistence.
        </li>
        <li>
          <strong>Phasing.</strong> <code>genotype.phased</code> is a
          boolean; how phase serialises across <code>genotype.gt</code>{" "}
          is implementation-dependent and will be specified.
        </li>
        <li>
          <strong>
            Primary-findings vs. secondary-findings context.
          </strong>{" "}
          The <code>is_actionable</code> rule targets secondary
          findings. Rare-disease diagnostic contexts need a different
          rule. We have not yet decided whether this is a config option
          or a second flag.
        </li>
        <li>
          <strong>Governance.</strong> <code>genome.computer</code>{" "}
          stewards v1.0 on GitHub. If adoption warrants a neutral home
          — a GA4GH working group, a dedicated consortium, an RFC
          process — we are open to that conversation. It starts when
          external adoption makes it necessary.
        </li>
      </ul>

      <h2>9. What this actually is</h2>
      <p>
        We have described the <code>.genome</code> bundle as a better
        format for agents. The deeper description is this:
      </p>
      <blockquote>
        It separates data, interpretation, and rules — and makes all
        three explicit, versioned, and queryable.
      </blockquote>
      <p>
        That is not a novel move in computing. It is how databases
        store and query structured data. It is how compilers represent
        ASTs and apply versioned transformation passes. It is how
        financial systems commit a ledger while keeping re-valuation as
        a first-class operation. These systems converged on this
        pattern because it is the only one that scales to large numbers
        of consumers with different needs over long time horizons.
      </p>
      <p>
        Consumer genomics has not yet made this move. VCF ships
        entangled objects. Every downstream consumer untangles them
        privately, in their own tools, in their own heads. That
        arrangement survives for a bioinformatician with toolkit
        accretion; it fails for an agent, and it will increasingly fail
        for the long-lived data infrastructure that consumer genomics
        needs to become if it is to be more than a one-shot report.
      </p>
      <p>
        The <code>.genome</code> bundle is one specific proposal for
        what the disentangled version looks like. It is the best
        version we know how to build today. We are releasing it
        publicly because a proposal that lives only inside one company
        is not a standard — it is a dialect. We would rather be
        publicly wrong about <code>.genome/1.0</code> than privately
        right about a worse alternative.
      </p>
      <p>
        Everything is at{" "}
        <a
          href="https://github.com/genome-computer/genome-spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/genome-computer/genome-spec
        </a>{" "}
        — spec, schema, reference reader, synthetic example, benchmark
        suite, conversion CLI, and a question set for the follow-on
        evaluation. Apache 2.0. Issues and pull requests are open.
      </p>
      <p>We are particularly interested in hearing from:</p>
      <ul>
        <li>
          Researchers who can identify invariant violations we missed.
        </li>
        <li>
          Groups with mature structural-variant and multi-sample
          pipelines who can shape v1.1.
        </li>
        <li>
          Agent developers whose query patterns the schema does not
          anticipate.
        </li>
        <li>
          Pharmacogenomics providers willing to prototype the PGx
          sub-schema independently.
        </li>
        <li>
          Reviewers who believe our design decisions are wrong, and can
          explain why.
        </li>
      </ul>
      <p>
        A genomic file format for an AI era should treat an agent as a
        first-class reader. This is our proposal for what that looks
        like.
      </p>

      <p className="pt-2 text-[13px]">
        The <code>.genome</code> specification, reference
        implementation, conversion tool, and example bundles are
        published at{" "}
        <a
          href="https://github.com/genome-computer/genome-spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/genome-computer/genome-spec
        </a>{" "}
        under the Apache 2.0 license. Correspondence:{" "}
        <a href="mailto:research@genome.computer">
          research@genome.computer
        </a>
        .
      </p>
    </Prose>
  );
}
