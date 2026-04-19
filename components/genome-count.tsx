"use client";

import { useEffect, useState } from "react";

export function GenomeCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(Math.floor(Math.random() * (1999 - 401 + 1)) + 401);
  }, []);

  return (
    <div
      className="inline-flex min-h-5 items-center gap-2 text-[13px] text-muted-foreground sm:text-[14px]"
      aria-live="polite"
    >
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      {count === null ? (
        <span className="opacity-0">Currently sequencing 1,000 genomes</span>
      ) : (
        <span>
          Currently sequencing{" "}
          <span className="font-mono text-foreground">
            {count.toLocaleString()}
          </span>{" "}
          genomes
        </span>
      )}
    </div>
  );
}
