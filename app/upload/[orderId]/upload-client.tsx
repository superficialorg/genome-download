"use client";

import { useCallback, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const UPLOAD_BUCKET = "dotgenome-uploads";
const MAX_BYTES = 25 * 1024 * 1024 * 1024; // 25 GB
const ALLOWED = [".txt", ".txt.gz", ".vcf", ".vcf.gz", ".gz"];

type Phase =
  | "idle"
  | "minting"
  | "uploading"
  | "hashing"
  | "confirming"
  | "done"
  | "error";

function guessInputType(name: string): "txt" | "vcf" | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".txt") || lower.endsWith(".txt.gz")) return "txt";
  if (lower.endsWith(".vcf") || lower.endsWith(".vcf.gz") || lower.endsWith(".gz"))
    return "vcf";
  return null;
}

async function sha256Hex(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function browserSupabase() {
  // Anon key is safe in the browser; all our buckets are private and only the
  // signed upload URL flow works anonymously.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export function UploadClient({
  orderId,
  token,
}: {
  orderId: string;
  token: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState<string | null>(null);

  const onFile = useCallback(
    async (file: File) => {
      setError(null);
      setProgress(0);
      setFilename(file.name);

      if (!guessInputType(file.name)) {
        setError("Unsupported file type. Use .txt, .vcf, or .vcf.gz.");
        setPhase("error");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(`File is too large (max 25 GB).`);
        setPhase("error");
        return;
      }

      try {
        // 1. Ask our server for a fresh signed upload URL. Server validates
        //    the link token before minting, so only the intended customer
        //    can upload for this order.
        setPhase("minting");
        const mint = await fetch(
          `/api/jobs/${encodeURIComponent(orderId)}/upload-url`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, filename: file.name }),
          }
        );
        const mintBody = await mint.json();
        if (!mint.ok || !mintBody.ok) {
          throw new Error(mintBody.error ?? "Could not get upload URL");
        }
        const { path, token: storageToken } = mintBody as {
          ok: true;
          path: string;
          token: string;
        };

        // 2. Upload directly to Supabase Storage. The client library handles
        //    multipart for big files.
        setPhase("uploading");
        const sb = browserSupabase();
        if (!sb) throw new Error("Supabase client not configured");
        const { error: upErr } = await sb.storage
          .from(UPLOAD_BUCKET)
          .uploadToSignedUrl(path, storageToken, file, {
            contentType: "application/octet-stream",
          });
        if (upErr) throw new Error(upErr.message);
        setProgress(100);

        // 3. Hash locally for integrity, then tell our server the upload is
        //    ready. Server re-verifies the object exists before flipping
        //    the job to 'pending' for the worker.
        setPhase("hashing");
        const sha = await sha256Hex(file);

        setPhase("confirming");
        const ready = await fetch(
          `/api/jobs/${encodeURIComponent(orderId)}/ready`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              sha256: sha,
              size_bytes: file.size,
            }),
          }
        );
        const readyBody = await ready.json();
        if (!ready.ok || !readyBody.ok) {
          throw new Error(readyBody.error ?? "Could not confirm upload");
        }

        setPhase("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setPhase("error");
      }
    },
    [orderId, token]
  );

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-border bg-muted p-6 text-center sm:p-8">
        <p style={{ fontSize: 32, margin: "0 0 12px" }}>🧬</p>
        <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">
          Got it — thanks.
        </h2>
        <p className="m-0 mt-3 text-[14px] leading-[1.55] text-muted-foreground">
          Your file is uploaded and queued. You'll get an email within 48 hours
          with your <span className="font-mono">.genome</span> bundle and the{" "}
          <span className="font-mono">readmygenome</span> skill. No need to
          keep this page open.
        </p>
      </div>
    );
  }

  const busy = phase !== "idle" && phase !== "error";

  return (
    <div className="mx-auto max-w-lg">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed bg-background p-12 text-center text-sm transition-colors ${
          busy
            ? "border-border text-muted-foreground"
            : "border-foreground/20 text-foreground hover:border-foreground/40"
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept=".txt,.vcf,.vcf.gz,.gz"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <p className="m-0 text-[15px] font-medium">
          {phase === "idle" && "Click to select your DNA file"}
          {phase === "minting" && "Preparing secure upload…"}
          {phase === "uploading" && `Uploading ${filename}…`}
          {phase === "hashing" && "Computing checksum…"}
          {phase === "confirming" && "Confirming upload…"}
          {phase === "error" && "Try again"}
        </p>
        {phase !== "idle" && phase !== "error" ? (
          <p className="m-0 mt-2 font-mono text-[12px] text-muted-foreground">
            Don't close this tab until you see the confirmation.
          </p>
        ) : null}
      </label>

      {phase === "uploading" ? (
        <div className="mt-4 h-1 overflow-hidden rounded bg-border">
          <div
            className="h-full bg-foreground transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
