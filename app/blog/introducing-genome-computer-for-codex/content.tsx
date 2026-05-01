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
      <p>Today we&rsquo;re launching Genome Computer for Codex.</p>

      <p>
        It&rsquo;s a remote MCP server that lets Codex, OpenAI&rsquo;s coding
        agent, work with your genome. Connect it once, sign in with your
        Genome Computer account, and Codex can inspect, query, validate,
        and build with your authorised genomic data.
      </p>

      <p>
        Anyone with a Genome Computer account can connect it today.
      </p>

      <h2>Why Codex</h2>

      <p>
        Most consumer genomics has stopped at the answer. You log into a
        portal, you read a PDF, the tab closes, and the next time you want
        to know something about your biology you start from zero.
      </p>

      <p>
        Codex changes the surface. In ChatGPT you can ask a question
        about your genome and get an answer. In Codex you can ask for a
        tool that answers that question today, keeps the logic visible,
        and can be adapted tomorrow when the question changes.
      </p>

      <p>
        Chat turns your genome into an answer. Codex turns it into
        personalisation you keep.
      </p>

      <p>
        This matters because a genome is not a one-time question. It&rsquo;s
        a context you carry for life, and the things you&rsquo;ll want to
        know about it change as your circumstances change and as the
        science moves. The right interface is one that lets you generate
        personalised tools and agents against your own biology, on demand
        &mdash; software that&rsquo;s grounded in your data, not a
        population average, and that keeps working long after the
        conversation ends.
      </p>

      <h2>What we&rsquo;re excited to see</h2>

      <p>
        The Codex surface is general. People will build things we
        haven&rsquo;t thought of, for themselves, against their own
        genomes.
      </p>

      <p>
        The shape we&rsquo;re most excited about is agents that watch a
        genome over time.
      </p>

      <p>
        A <strong>literature watcher</strong>{" "}polls PubMed, bioRxiv, and
        medRxiv, joins each new paper against your bundle, and surfaces
        only the rare paper that touches a variant you carry &mdash;{" "}
        <em>
          a new study proposes rs1234567 in MTHFR may modulate methotrexate
          response; you carry this variant.
        </em>{" "}
        Most weeks, nothing. That is the point.
      </p>

      <p>
        A <strong>trial matcher</strong> watches{" "}
        <a
          href="https://clinicaltrials.gov"
          target="_blank"
          rel="noopener noreferrer"
        >
          ClinicalTrials.gov
        </a>{" "}
        against your actionable variants and phenotypes. Especially
        valuable for rare-disease carriers and families, who today rely on
        advocacy networks and luck to know when a relevant trial opens.
      </p>

      <p>
        A <strong>variant watcher</strong> re-runs interpretation when
        ClinVar or CPIC ships a release and surfaces meaningful changes
        &mdash;{" "}
        <em>
          your BRCA2 variant moved from VUS to Likely Benign in ClinVar
          2026.06.
        </em>{" "}
        Today, when classifications change, most people are never told.
      </p>

      <p>
        These are tractable because of two things. The bundle is
        structured and versioned, so an agent can say exactly what changed
        and why. And access is scoped per agent, so you can grant a
        literature watcher read access to your variant table without
        giving it anything else, and revoke it with one click.
      </p>

      <h2>
        Why <code>.genome</code>
      </h2>

      <p>
        <code>.genome/1.0</code> is the format that makes the surface
        honest.
      </p>

      <p>
        Every interpretation is in the bundle. Every reference &mdash;
        ClinVar, CPIC, PharmGKB, ACMG &mdash; is pinned to a dated
        version. Every pharmacogenomic phenotype is computed against
        guideline versions, not inferred at query time. The agent
        doesn&rsquo;t have to guess the schema or hallucinate a rule. The
        schema is there. The provenance is there. The rules are there.
      </p>

      <p>
        An LLM uses <strong>3&ndash;7&times; fewer tokens</strong>{" "}
        reasoning about a <code>.genome</code> bundle than the equivalent
        annotated VCF, and produces{" "}
        <strong>10&ndash;20&times; better interpretive accuracy</strong>{" "}
        on standard genomic-reasoning evaluations.
      </p>

      <p>
        The bundle hosted under your account also keeps getting newer.
        When CPIC publishes new dosing guidance, when ClinVar reclassifies
        a variant, when ACMG adds an actionable gene, we re-run
        interpretation against the latest references and publish a new
        dated bundle. Previous versions stay archived. Anything connected
        to the MCP reads the current one.
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

      <h2>From saliva or an existing file</h2>

      <p>You don&rsquo;t need a genome to start.</p>

      <p>
        We sequence from saliva in our own wet lab &mdash; CLIA, CAP, and
        NATA accredited, ISO 15189 certified. The result is a{" "}
        <code>.genome</code> bundle hosted in your account.
      </p>

      <p>
        If you already have a 23andMe, Ancestry, or whole-genome
        sequencing file, we convert it. The output is the same{" "}
        <code>.genome</code> bundle, with the same structure Codex can
        work against.
      </p>

      <p>
        Either path lands you in the same place: a bundle that&rsquo;s
        queryable, current, and yours.
      </p>

      <h2>Privacy</h2>

      <p>Genomic data is not ordinary user data.</p>

      <p>
        Access is account-authorised, scoped, and revocable per agent.
        The default surface exposes structured context and tool results,
        not a blanket dump of raw genetic files to every connected client.
        You remain the permissioning layer.
      </p>

      <p>
        Genome Computer operates under{" "}
        <a
          href="https://www.humans.inc/blog/why-public-benefit-corporation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Humankind, a Delaware Public Benefit Corporation
        </a>
        . The full argument is in the{" "}
        <a href="/blog/introducing-the-genome-api">Genome API post</a>.
      </p>

      <h2>Get started</h2>

      <p>
        Connect Genome Computer to Codex at{" "}
        <a href="/">genome.computer</a>.
      </p>

      <p>
        Your genome is not a report. It is a substrate for personal
        software.
      </p>
    </Prose>
  );
}
