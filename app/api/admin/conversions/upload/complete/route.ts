import { NextResponse } from "next/server";

import { markJobPending } from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatError(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["message", "error", "error_description", "details", "hint", "code"]) {
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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    jobId?: unknown;
    sha256?: unknown;
    sizeBytes?: unknown;
  };

  const jobId = typeof body.jobId === "string" ? body.jobId : null;
  const sha256 =
    typeof body.sha256 === "string" && /^[0-9a-f]{64}$/.test(body.sha256)
      ? body.sha256
      : null;
  const sizeBytes =
    typeof body.sizeBytes === "number" && body.sizeBytes > 0
      ? body.sizeBytes
      : null;

  if (!jobId || !sha256 || !sizeBytes) {
    return NextResponse.json(
      { ok: false, error: "missing jobId / sha256 / sizeBytes" },
      { status: 400 }
    );
  }

  try {
    const job = await markJobPending({ orderId: jobId, sha256, sizeBytes });
    return NextResponse.json({
      ok: true,
      jobId: job.id,
      status: job.status,
      inputSizeBytes: job.input_size_bytes,
    });
  } catch (err) {
    const msg = formatError(err);
    console.error("[admin/conversions/upload/complete] failed", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
