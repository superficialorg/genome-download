"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    if (!confirm("Approve this job? The annotator will start processing within ~15 seconds.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/jobs/${encodeURIComponent(jobId)}/approve`,
        { method: "POST" }
      );
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `approve failed (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={approve}
        disabled={busy}
        className="rounded-[calc(var(--radius-lg)-4px)] bg-foreground px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
      >
        {busy ? "approving…" : "process"}
      </button>
      {error ? (
        <p className="m-0 font-mono text-[10px] text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
