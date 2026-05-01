import Link from "next/link";
import { SiteHeader, SiteShell } from "@/components/site-shell";

export const metadata = {
  title: "Genome Computer MCP — The Genome Computer Company",
  description: "Connect Genome Computer to Codex and work with .genome bundles through MCP.",
};

export default function McpDocsPage() {
  return (
    <SiteShell>
      <SiteHeader compact />
      <article className="mt-10 flex flex-col gap-8 sm:mt-16">
        <div className="flex flex-col gap-3 text-center">
          <p className="m-0 font-mono text-[13px] text-muted-foreground">
            MCP
          </p>
          <h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">
            Use your genome inside Codex
          </h1>
          <p className="mx-auto m-0 max-w-[560px] text-[15px] leading-[1.7] text-muted-foreground">
            Genome Computer exposes a remote MCP server for authorised .genome
            bundles. Connect once, then ask Codex to inspect, validate,
            summarise, and build with your genome.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Connect
          </h2>
          <pre className="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-background p-4 font-mono text-[13px] leading-6">
            <code>{`codex mcp add genomeComputer --url https://mcp.genome.computer/mcp
codex mcp list`}</code>
          </pre>
          <p className="m-0 text-[14px] leading-6 text-muted-foreground">
            The first protected tool call opens the Genome Computer OAuth flow.
            Sign in with the email used for your order, choose a default ready
            .genome bundle, and approve access.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Try asking
          </h2>
          <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-6 text-muted-foreground">
            <li>List my ready .genome bundles.</li>
            <li>Validate my genome bundle and explain any warnings.</li>
            <li>Summarise my pharmacogenomics profile.</li>
            <li>Generate a clinician-facing genome report.</li>
            <li>Show my polygenic score table.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
            Privacy boundary
          </h2>
          <p className="m-0 text-[14px] leading-6 text-muted-foreground">
            The MCP server returns bounded, indexed results from authorised
            bundles. It does not stream the full raw genome into a client by
            default. You can revoke OAuth access at any time.
          </p>
        </section>

        <div>
          <Link
            href="/api"
            className="inline-flex rounded-full bg-primary px-5 py-2 text-[14px] font-medium text-primary-foreground"
          >
            Request API access
          </Link>
        </div>
      </article>
    </SiteShell>
  );
}
