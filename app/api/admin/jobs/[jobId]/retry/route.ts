import { NextResponse } from "next/server";
import { retryJob } from "@/lib/conversion-jobs";

// Guarded by middleware.ts — Basic Auth against ADMIN_USER / ADMIN_PASSWORD.
// Only reachable if the caller has already authenticated against /admin.

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

export async function POST(
  _request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await context.params;
  try {
    const job = await retryJob(jobId);
    return NextResponse.json({ ok: true, status: job.status });
  } catch (err) {
    const msg = formatError(err);
    const status = /not found/i.test(msg)
      ? 404
      : /cannot retry/i.test(msg)
        ? 409
        : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
