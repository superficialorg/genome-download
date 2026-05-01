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
        For the last decade, the consumer genome has been treated as
        something to look at.
      </p>

      <p>
        You logged into a portal. You downloaded a PDF. You saw a list of
        traits, a set of risk reports, and a handful of variants with
        cautious explanations. If you were technical, you might also have
        received a VCF &mdash; the raw material of your genome, stored in
        a format built for sequencing pipelines rather than software
        agents.
      </p>

      <p>The genome became a result.</p>

      <p>It should have become a workspace.</p>

      <p>
        Last month we opened the{" "}
        <a href="/blog/introducing-the-genome-api">Genome API</a>: the
        pipeline that produces a <code>.genome/1.0</code> bundle for any
        partner that wants to build on real genomic data. Today we&rsquo;re
        opening the surface that turns that bundle into something a builder
        can actually work in.
      </p>

      <p>
        Genome Computer for Codex is a remote MCP server that lets Codex
        (OpenAI&rsquo;s coding agent) work with authorised genomic context
        from a user&rsquo;s Genome Computer account.
      </p>

      <p>
        Connect once. Authenticate once. Then ask Codex to inspect, query,
        validate, transform, summarise, and build with genomic data.
      </p>

      <h2>Why Codex</h2>

      <p>Chat is the right surface for answers.</p>

      <p>Codex is the right surface for work.</p>

      <p>
        When a user asks ChatGPT a question through an MCP connector, the
        model can call a tool and return a personalised response. That is
        useful. A person can ask what their biology says about caffeine,
        sleep, training, or a variant they have heard about, and receive
        an explanation grounded in their own data.
      </p>

      <p>
        The same MCP endpoint serves both ChatGPT and Codex. This post is
        about Codex because Codex is where genomes become workflows.
      </p>

      <p>
        Ask ChatGPT{" "}
        <em>&ldquo;what&rsquo;s my CYP2C19 status?&rdquo;</em> and you get
        an answer in the chat. The chat ends, the answer is gone, and the
        next time you want to know whether a new prescription clashes
        with your genome you start from zero.
      </p>

      <p>
        Ask Codex{" "}
        <em>
          &ldquo;build me a tool that takes any drug name and tells me
          whether my genome flags it, with the SQL behind every
          flag&rdquo;
        </em>{" "}
        and Codex returns a working CLI, the SQL is in the file, you
        re-run it tomorrow against a new prescription, and a clinician
        can audit every claim. Same MCP. Same <code>.genome</code>{" "}
        bundle. Different output.
      </p>

      <p>
        Chat turns genome data into an answer. Codex turns genome data
        into a reproducible workflow.
      </p>

      <h2>What it does</h2>

      <p>
        Genome Computer for Codex exposes a remote MCP endpoint:
      </p>

      <pre>
        <code>https://mcp.genome.computer/mcp</code>
      </pre>

      <p>
        Users add it to Codex, sign in with their Genome Computer account,
        choose the profile to use by default, and approve access. From
        that point on, Codex can use Genome Computer when a task needs
        genomic context.
      </p>

      <p>A user can ask:</p>

      <ul>
        <li>What does my biology say about caffeine timing?</li>
        <li>
          Validate this <code>.genome</code> bundle and tell me what
          failed.
        </li>
        <li>Build a local report generator from my genome.</li>
        <li>Create a small dashboard for variant and trait lookup.</li>
      </ul>

      <p>
        The interaction stays conversational, but the output does not have
        to stay in the conversation. Codex can leave behind files: SQL
        queries, validation reports, Markdown summaries, scripts,
        notebooks, and working applications.
      </p>

      <h2>
        Why <code>.genome</code> matters
      </h2>

      <p>
        The MCP is the surface. <code>.genome/1.0</code> is what makes the
        surface honest.
      </p>

      <p>
        If the MCP exposed VCFs, Codex could read them &mdash; but every
        interpretation would still require ClinVar, CPIC, and PharmGKB
        lookups at query time. Annotations would arrive as pipe-delimited
        strings. Pharmacogenomic phenotypes would have to be inferred from
        variant rows. The agent would either guess or stall.
      </p>

      <p>
        <code>.genome/1.0</code> collapses that. Every rule is in the
        bundle. Every reference is adjacent. Every phenotype is computed
        at pipeline time against pinned guideline versions. An LLM uses{" "}
        <strong>3&ndash;7&times; fewer tokens</strong> to reason about a{" "}
        <code>.genome</code> bundle than the equivalent annotated VCF, and
        produces{" "}
        <strong>10&ndash;20&times; better interpretive accuracy</strong>{" "}
        on standard genomic-reasoning evaluations.
      </p>

      <p>
        That means Codex can move from question to computation without
        leaving the bundle:
      </p>

      <pre>
        <code>{`SELECT gene, diplotype, phenotype, cpic_level, drugs
FROM pharmacogenomics
WHERE cpic_level IN ('A', 'B');`}</code>
      </pre>

      <p>
        The model does not need to hallucinate the schema. The schema is
        there. The provenance is there. The rules are there.
      </p>

      <p>
        There is no separate &ldquo;inspector&rdquo; needed. The agent is
        the inspector. Ask Codex why a claim was made, and it walks the
        manifest, the rule, and the underlying variants &mdash; every step
        traceable, in plain language.
      </p>

      <p>
        <strong>Hosted bundles keep getting newer.</strong> Each{" "}
        <code>.genome</code> bundle is a frozen snapshot &mdash; its
        manifest is pinned, its rules are pinned, its provenance is
        signed. But the bundle hosted under your account at{" "}
        <a href="https://genome.computer">genome.computer</a> does not sit
        still. When CPIC publishes new dosing guidance, when ClinVar
        reclassifies a variant, when ACMG adds a new actionable gene, we
        re-run interpretation against the latest references and publish a
        new dated bundle to your account. The previous version stays
        archived &mdash; versioning is end-to-end &mdash; and any agent or
        app connected to the MCP reads the current one without ceremony.
      </p>

      <p>
        A downloaded <code>.genome</code> is a snapshot. A hosted{" "}
        <code>.genome</code> is a snapshot that keeps getting newer.
      </p>

      <p>
        The full case for the format is in{" "}
        <a href="/blog/introducing-dot-genome">
          introducing <code>.genome</code>
        </a>
        .
      </p>

      <h2>What builders can make</h2>

      <p>Things that should be ordinary:</p>

      <ul>
        <li>
          A pharmacogenomics report generator that preserves the SQL
          behind every claim.
        </li>
        <li>
          A clinician-facing summary with confidence levels and source
          versions.
        </li>
        <li>
          A research notebook that filters rare, high-confidence variants
          by gene set.
        </li>
        <li>
          An MCP adapter that turns a <code>.genome</code> bundle into a
          private, queryable agent tool.
        </li>
        <li>
          A personal health app that grounds advice in a user&rsquo;s
          actual genomic architecture.
        </li>
      </ul>

      <p>Or, more concretely:</p>

      <ul>
        <li>
          <strong>A pharmacy firewall</strong> &mdash; paste a
          prescription, get CPIC-graded warnings against your genome with
          the rule, the CPIC version, and the diplotype behind every
          flag.
        </li>
        <li>
          <strong>A peptide pre-flight check</strong> &mdash; a
          genome-grounded review before an elective peptide, with explicit
          confidence levels (often &ldquo;no validated PGx evidence&rdquo;,
          because that is the honest answer).
        </li>
        <li>
          <strong>A variant watcher</strong> &mdash; re-runs interpretation
          when ClinVar or CPIC ships a new release and surfaces meaningful
          changes (
          <em>
            your BRCA2 variant moved from VUS to Likely Benign in ClinVar
            2026.06
          </em>
          ).
        </li>
      </ul>

      <p>
        Each of these used to require a small bioinformatics team and
        weeks of integration work.
      </p>

      <p>Now the interface can be a prompt:</p>

      <blockquote>
        Audit this bundle, generate a clinician-facing report, and save
        the SQL behind every claim.
      </blockquote>

      <p>
        Codex does the mechanical work. The bundle provides the
        structure. Genome Computer provides the authorised context.
      </p>

      <h2>Agents that watch your genome</h2>

      <p>
        Codex builds the thing that answers a question once. The same
        substrate &mdash; <code>.genome</code> + MCP + scoped, revocable
        access &mdash; supports a different surface: agents that subscribe
        to a question and answer it forever.
      </p>

      <p>
        A <strong>literature watcher</strong> polls PubMed, bioRxiv, and
        medRxiv. For each new paper it extracts the variants and genes
        mentioned, joins against your bundle, and surfaces only the rare
        paper that touches something you carry &mdash;{" "}
        <em>
          a new study proposes rs1234567 in MTHFR may modulate methotrexate
          response; you carry this variant
        </em>
        . Most weeks, nothing. That is the point.
      </p>

      <p>
        A <strong>trial-matcher</strong> watches ClinicalTrials.gov against
        your actionable variants and phenotypes. Especially valuable for
        rare-disease carriers, who today have no realistic way to know
        when a new trial opens.
      </p>

      <p>
        Both are tractable on <code>.genome/1.0</code> and unworkable on
        raw VCF. Versioned manifests let an alert say exactly what changed
        and why &mdash; data, guideline, or new evidence &mdash; without
        blurring into &ldquo;something changed somewhere.&rdquo; Permission
        scopes mean each agent gets least-privilege access; revocation is
        one click per agent.
      </p>

      <p>
        These will be a separate launch. Today&rsquo;s launch is Codex.
        But the surface is the same, and it is worth knowing what it
        grows into.
      </p>

      <h2>The privacy boundary</h2>

      <p>Genomic data is not ordinary user data.</p>

      <p>
        Genome Computer operates under{" "}
        <a
          href="https://www.humans.inc/blog/why-public-benefit-corporation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Humankind, a Delaware Public Benefit Corporation
        </a>
        . The full PBC argument is in the{" "}
        <a href="/blog/introducing-the-genome-api">Genome API post</a>; it
        applies here unchanged.
      </p>

      <p>
        What is specific to the MCP: access is account-authorised, scoped,
        and revocable. The default surface exposes structured context and
        tool results, not a blanket dump of raw genetic files to every
        connected client. The user remains the permissioning layer.
      </p>

      <h2>What this unlocks</h2>

      <p>
        The first era of consumer genomics answered a narrow question:{" "}
        <em>what does my DNA say about me?</em>
      </p>

      <p>
        The next era asks a more useful one:{" "}
        <em>what can I build with my genome?</em>
      </p>

      <p>
        For individuals, that means tools they can inspect, rerun, and
        adapt. For clinicians, it means clearer handoff documents and
        auditable provenance. For researchers, it means consented data
        moving into computable workflows faster. For developers, it means
        genomics becomes an application primitive instead of a specialist
        dependency.
      </p>

      <p>The genome is not just a report.</p>

      <p>It is a workspace.</p>

      <h2>Request access</h2>

      <p>
        Genome Computer for Codex is in early access. We are looking for
        builders working on clinical, consumer, research, and agent-based
        products that need direct, auditable access to genomic context.
      </p>

      <p>
        Request access at <a href="/api">genome.computer/api</a> or write
        to <a href="mailto:api@genome.computer">api@genome.computer</a>.
      </p>

      <p>Your genome should not sit behind a PDF.</p>

      <p>
        It should be something you can build with &mdash; and something
        that builds for you.
      </p>
    </Prose>
  );
}
