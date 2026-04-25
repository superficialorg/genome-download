import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col px-5 pb-20 pt-12 sm:px-6 sm:pb-[120px] sm:pt-20">
      {children}
      <SiteFooter />
    </main>
  );
}

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header
      className={`flex items-center justify-between ${compact ? "mb-10" : "mb-12 sm:mb-16"}`}
    >
      <Link
        href="/"
        aria-label="The Genome Computer Company home"
        className="inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
      >
        <span className="text-[20px] leading-none sm:text-2xl">🧬</span>
        <span className="text-[13px] font-normal leading-[1.2] tracking-[-0.01em] sm:text-[16px]">
          The Genome
          <br />
          Computer Company
        </span>
      </Link>
      <nav className="flex items-center gap-5">
        <Link
          href="/research"
          className="text-[14px] font-medium tracking-[-0.01em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Research
        </Link>
        <a
          href="mailto:contact@genome.computer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium tracking-[-0.01em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 flex flex-col items-center gap-4 text-center text-[13px] text-muted-foreground sm:mt-24 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6">
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        <a
          href="mailto:contact@genome.computer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          contact@genome.computer
        </a>
        <Link
          href="/api"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          API
        </Link>
        <Link
          href="/research"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Research
        </Link>
        <Link
          href="/privacy"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Terms
        </Link>
        <a
          href="https://x.com/genomecomputer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          @genomecomputer
        </a>
      </div>
      <div>
        <div>CLIA, CAP, and NATA accredited. ISO 15189 certified.</div>
        <div>San Francisco, CA 🇺🇸 · © Humankind Bio, Inc.</div>
      </div>
    </footer>
  );
}
