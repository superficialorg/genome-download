"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatError(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["message", "error", "error_description", "details"]) {
      if (typeof record[key] === "string") return record[key];
    }
    try {
      return JSON.stringify(value);
    } catch {
      return "Unknown error";
    }
  }
  return value == null ? "Unknown error" : String(value);
}

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed (${res.status})`);
  }
}

export function DeleteButton({
  jobId,
  label,
}: {
  jobId: string;
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteConversion() {
    const ok = confirm(
      `Delete ${label}? This removes the job row plus uploaded input and bundle files. This cannot be undone.`
    );
    if (!ok) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/jobs/${encodeURIComponent(jobId)}/delete`,
        { method: "DELETE" }
      );
      const body = await readJson(res);
      if (!res.ok || !body.ok) {
        throw new Error(body.error ? formatError(body.error) : `delete failed (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(formatError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={deleteConversion}
        disabled={busy}
        className="rounded-[calc(var(--radius-lg)-4px)] border border-red-300 bg-background px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white disabled:opacity-60"
      >
        {busy ? "deleting..." : "delete"}
      </button>
      {error ? (
        <p className="m-0 font-mono text-[10px] text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
