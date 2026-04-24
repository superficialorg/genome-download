import { NextResponse } from "next/server";
import { retryJob } from "@/lib/conversion-jobs";

// Guarded by middleware.ts — Basic Auth against ADMIN_USER / ADMIN_PASSWORD.
// Only reachable if the caller has already authenticated against /admin.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await context.params;
  try {
    const job = await retryJob(jobId);
    return NextResponse.json({ ok: true, status: job.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /not found/i.test(msg)
      ? 404
      : /cannot retry/i.test(msg)
        ? 409
        : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
