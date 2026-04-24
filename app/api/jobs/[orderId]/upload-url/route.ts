import { NextResponse } from "next/server";
import {
  createSignedUploadUrl,
  loadJobByToken,
} from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    token?: unknown;
    filename?: unknown;
  };

  const token = typeof body.token === "string" ? body.token : null;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "missing token" },
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
    const signed = await createSignedUploadUrl(orderId);
    return NextResponse.json({
      ok: true,
      path: signed.path,
      token: signed.token,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
