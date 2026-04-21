"use client";

import { useState } from "react";

type Tab = "overview" | "technical";

export function PostContent() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex flex-col gap-10">
      <TabToggle value={tab} onChange={setTab} />
      {tab === "overview" ? <Overview /> : <Technical />}
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
    <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-muted-foreground [&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-foreground [&_h3]:mt-2 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-border [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ol]:m-0 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_p]:m-0 [&_li]:m-0 [&_blockquote]:m-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground">
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
          <strong>readmygenome.md</strong> — a Claude skill that lets any
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

      <h2>What you can do with it</h2>
      <p>
        You upload your <code>.genome</code> bundle to an AI assistant. You
        ask: am I a slow caffeine metaboliser? do I carry anything I should
        tell my doctor about? how should I think about this medication my GP
        just prescribed?
      </p>
      <p>
        The AI gives you an answer. And for the questions the bundle is
        designed to answer, the answer cannot be silently wrong in the ways
        it used to be. The AI is not parsing a file it was never designed to
        read. It is reading a file designed for it.
      </p>
      <p>
        The hard part of AI genomics stops being whether the AI parsed the
        file correctly. It starts being whether it reasoned about your life
        correctly — which is a solvable problem, not a hidden one.
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

      <h2>What this means, concretely</h2>
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
        <strong>The Claude skill.</strong> <code>readmygenome.md</code> — a
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
          Install <code>readmygenome.md</code> as a Claude skill.
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
        is not a specialist. We have designed the file that reader needs. We
        have released it publicly because a file format is only useful if
        others can read and write it. And we are inviting the critique that
        turns a proposal into a standard.
      </p>
      <p>
        Your genome will be read by an AI in your lifetime. It should be in
        a file designed for that.
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
      <p>Technical deep-dive coming soon.</p>
    </Prose>
  );
}
