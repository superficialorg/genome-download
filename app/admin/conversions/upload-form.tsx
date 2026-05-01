"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UploadForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/conversions/upload", {
        method: "POST",
        body: form,
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `upload failed (${res.status})`);
      }
      setMessage(`Created job ${String(body.jobId).slice(0, 8)}. Click process when ready.`);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mb-8 grid gap-3 rounded-md border border-neutral-200 bg-white p-4 sm:grid-cols-[1fr_1fr_1.5fr_auto]"
    >
      <input
        name="email"
        type="email"
        required
        placeholder="customer@email.com"
        className="h-10 rounded-md border border-neutral-300 px-3 text-[13px]"
      />
      <input
        name="customerName"
        type="text"
        placeholder="Customer name"
        className="h-10 rounded-md border border-neutral-300 px-3 text-[13px]"
      />
      <input
        name="file"
        type="file"
        accept=".txt,.gz,.vcf,.zip,text/plain,application/gzip"
        required
        className="h-10 rounded-md border border-neutral-300 px-3 py-2 text-[13px]"
      />
      <button
        type="submit"
        disabled={busy}
        className="h-10 rounded-md bg-foreground px-4 text-[12px] font-medium text-background disabled:opacity-60"
      >
        {busy ? "uploading..." : "Upload"}
      </button>
      {(error || message) && (
        <p
          className={`m-0 text-[12px] sm:col-span-4 ${
            error ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {error ?? message}
        </p>
      )}
    </form>
  );
}
