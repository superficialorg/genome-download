"use client";

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UPLOAD_BUCKET = "dotgenome-uploads";
const MAX_BYTES = 25 * 1024 * 1024 * 1024; // 25 GB

type Phase =
  | "idle"
  | "creating"
  | "uploading"
  | "hashing"
  | "confirming"
  | "done";

async function sha256Hex(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function browserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed (${res.status})`);
  }
}

export function UploadForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setPhase("creating");
    setError(null);
    setMessage(null);
    const form = new FormData(formEl);
    const email = String(form.get("email") ?? "").trim();
    const customerName = String(form.get("customerName") ?? "").trim();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setError("File required.");
      setPhase("idle");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large (max 25 GB).");
      setPhase("idle");
      return;
    }

    try {
      const res = await fetch("/api/admin/conversions/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, customerName }),
      });
      const body = await readJson(res);
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `Could not create upload (${res.status})`);
      }

      const { jobId, path, token } = body as {
        ok: true;
        jobId: string;
        path: string;
        token: string;
      };

      setPhase("uploading");
      const sb = browserSupabase();
      if (!sb) throw new Error("Supabase client not configured");
      const { error: upErr } = await sb.storage
        .from(UPLOAD_BUCKET)
        .uploadToSignedUrl(path, token, file, {
          contentType: "application/octet-stream",
        });
      if (upErr) throw new Error(upErr.message);

      setPhase("hashing");
      const sha = await sha256Hex(file);

      setPhase("confirming");
      const complete = await fetch("/api/admin/conversions/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, sha256: sha, sizeBytes: file.size }),
      });
      const completeBody = await readJson(complete);
      if (!complete.ok || !completeBody.ok) {
        throw new Error(completeBody.error ?? `Could not confirm upload (${complete.status})`);
      }
      setMessage(`Created job ${jobId.slice(0, 8)}. Click process when ready.`);
      formEl.reset();
      setPhase("done");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("idle");
    }
  }

  const busy = phase !== "idle" && phase !== "done";
  const label =
    phase === "creating"
      ? "preparing..."
      : phase === "uploading"
        ? "uploading..."
        : phase === "hashing"
          ? "hashing..."
          : phase === "confirming"
            ? "confirming..."
            : "Upload";

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
        {label}
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
