import { NextResponse } from "next/server";
import {
  loadJobByToken,
  markJobPending,
} from "@/lib/conversion-jobs";
import { sendConversionOperatorAlert } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    token?: unknown;
    sha256?: unknown;
    size_bytes?: unknown;
  };

  const token = typeof body.token === "string" ? body.token : null;
  const sha256 =
    typeof body.sha256 === "string" && /^[0-9a-f]{64}$/.test(body.sha256)
      ? body.sha256
      : null;
  const sizeBytes =
    typeof body.size_bytes === "number" && body.size_bytes > 0
      ? body.size_bytes
      : null;

  if (!token || !sha256 || !sizeBytes) {
    return NextResponse.json(
      { ok: false, error: "missing token / sha256 / size_bytes" },
      { status: 400 }
    );
  }

  const job = await loadJobByToken(orderId, token);
  if (!job) {
    return NextResponse.json(
      { ok: false, error: "invalid or expired link" },
      { status: 404 }
    );
  }
  if (job.status !== "awaiting_upload") {
    return NextResponse.json(
      {
        ok: false,
        error: `this order is no longer accepting uploads (status: ${job.status})`,
      },
      { status: 409 }
    );
  }

  try {
    const updated = await markJobPending({ orderId, sha256, sizeBytes });
    // Fire-and-forget operator notification.
    void sendConversionOperatorAlert({
      orderId: updated.id,
      email: updated.email,
      reason: "upload_ready",
    });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
