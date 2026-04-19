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
    <header className={compact ? "mb-10" : "mb-12 sm:mb-16"}>
      <Link href="/" aria-label="genome.download home">
        <div className="text-3xl leading-none">🧬</div>
      </Link>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-col items-start gap-4 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
      </div>
      <div>Made in 🇺🇸 USA · © Humankind Bio, Inc.</div>
    </footer>
  );
}
