import type { Metadata } from "next";
import Link from "next/link";
import {
  listRecentJobs,
  signBundleDownloadUrl,
  type ConversionJob,
} from "@/lib/conversion-jobs";
import { RetryButton } from "./retry-button";
import { ApproveButton } from "./approve-button";
import { UploadForm } from "./upload-form";
import { DeleteButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Admin · Conversions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_COLOURS: Record<ConversionJob["status"], string> = {
  awaiting_upload: "bg-neutral-200 text-neutral-800",
  pending: "bg-amber-100 text-amber-900",
  imputing: "bg-sky-100 text-sky-900",
  annotating: "bg-sky-100 text-sky-900",
  ready: "bg-emerald-100 text-emerald-900",
  failed: "bg-red-100 text-red-900",
};

function fmtTs(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function fmtSize(n: number | null): string {
  if (!n) return "—";
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default async function ConversionsAdmin() {
  const jobs = await listRecentJobs(200);
  const buckets: Record<ConversionJob["status"], number> = {
    awaiting_upload: 0,
    pending: 0,
    imputing: 0,
    annotating: 0,
    ready: 0,
    failed: 0,
  };
  for (const j of jobs) buckets[j.status]++;

  // Mint signed download URLs for ready jobs so the operator can grab the
  // bundle from the admin UI without opening Supabase.
  const bundleUrls = new Map<string, string>();
  for (const j of jobs) {
    if (j.status === "ready" && j.bundle_key) {
      const u = await signBundleDownloadUrl(j.bundle_key);
      if (u) bundleUrls.set(j.id, u);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-baseline justify-between gap-4">
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
        <p className="m-0 font-mono text-xs text-neutral-500">
          {jobs.length} most recent
        </p>
      </div>

      <UploadForm />

      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-6">
        {(Object.keys(buckets) as ConversionJob["status"][]).map((s) => (
          <div
            key={s}
            className="rounded-md border border-neutral-200 bg-white px-3 py-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-500">
              {s.replace("_", " ")}
            </div>
            <div className="mt-0.5 text-[18px] font-semibold tabular-nums">
              {buckets[s]}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-neutral-50 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-600">
            <tr>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Uploaded</th>
              <th className="px-3 py-2">Input size</th>
              <th className="px-3 py-2">Ready</th>
              <th className="px-3 py-2">Bundle</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-6 text-center text-neutral-500"
                >
                  No conversions yet.
                </td>
              </tr>
            ) : null}
            {jobs.map((j) => (
              <tr
                key={j.id}
                className="border-t border-neutral-200 align-top"
              >
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${STATUS_COLOURS[j.status]}`}
                  >
                    {j.status}
                  </span>
                  {j.error_message ? (
                    <p className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-red-700">
                      {j.error_message.slice(0, 400)}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-neutral-700">
                  {j.id.slice(0, 8)}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{j.customer_name ?? "—"}</div>
                  <a
                    href={`mailto:${j.email}`}
                    className="font-mono text-[11px] text-neutral-500 hover:text-neutral-800"
                  >
                    {j.email}
                  </a>
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-neutral-600">
                  {fmtTs(j.created_at)}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-neutral-600">
                  {fmtTs(j.uploaded_at)}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-neutral-600">
                  {fmtSize(j.input_size_bytes)}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-neutral-600">
                  {fmtTs(j.ready_at ?? j.failed_at)}
                </td>
                <td className="px-3 py-2 text-[12px]">
                  {bundleUrls.has(j.id) ? (
                    <Link
                      href={bundleUrls.get(j.id)!}
                      className="text-foreground underline underline-offset-2"
                      target="_blank"
                    >
                      download
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col items-start gap-1">
                    {j.status === "failed" && j.input_key ? (
                      <RetryButton jobId={j.id} />
                    ) : j.status === "pending" && j.input_key && !j.approved_at ? (
                      <ApproveButton jobId={j.id} />
                    ) : j.status === "pending" && j.approved_at ? (
                      <span className="font-mono text-[10px] text-neutral-500">
                        queued
                      </span>
                    ) : null}
                    <DeleteButton
                      jobId={j.id}
                      label={`${j.id.slice(0, 8)} (${j.email})`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-neutral-500">
        Manual-approval mode: pending jobs wait for you to click{" "}
        <strong>process</strong>. The annotator picks up approved jobs
        within ~15 seconds and runs imputation → VEP → PharmCAT → bundle
        → email. Failed jobs stay here for manual review with a{" "}
        <strong>retry</strong> button; no auto-refund is issued — refund
        from the Stripe Dashboard if appropriate. Bundle links are signed
        for 24 hours; refresh the page to mint a fresh one. If you need
        to skip the approval UI entirely, SSH into{" "}
        <code className="font-mono">humankind-pipeline</code> and run{" "}
        <code className="font-mono">python -m annotator.worker --once</code>.
      </p>
    </div>
  );
}
