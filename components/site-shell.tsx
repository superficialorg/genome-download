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
        aria-label="The Human Genome Company home"
        className="inline-flex items-center text-foreground transition-opacity hover:opacity-80"
      >
        <span className="text-[15px] font-medium tracking-[-0.01em] sm:text-[16px]">
          The Human Genome Company
        </span>
      </Link>
      <a
        href="mailto:contact@genome.download"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[14px] font-medium tracking-[-0.01em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Contact
      </a>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 flex flex-col items-start gap-4 border-t border-border pt-6 text-[13px] text-muted-foreground sm:mt-24 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex gap-5">
        <a
          href="mailto:contact@genome.download"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          contact@genome.download
        </a>
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
          href="https://x.com/genomedownload"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          @genome.download
        </a>
      </div>
      <div>🇺🇸 Made &amp; Sequenced in the USA · © Humankind Bio, Inc.</div>
    </footer>
  );
}
