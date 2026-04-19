"use client";

import { useEffect, useState } from "react";

const MIN = 401;
const MAX = 1999;

// Deterministic per UTC day — same number for all visitors on a given
// day, rolls over at 00:00 UTC.
function dailyGenomeCount(): number {
  const now = new Date();
  const dayKey =
    now.getUTCFullYear() * 10000 +
    (now.getUTCMonth() + 1) * 100 +
    now.getUTCDate();
  // Knuth multiplicative hash, masked to unsigned 32-bit.
  const hash = (Math.imul(dayKey, 2654435761) >>> 0);
  return MIN + (hash % (MAX - MIN + 1));
}

export function GenomeCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(dailyGenomeCount());
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
