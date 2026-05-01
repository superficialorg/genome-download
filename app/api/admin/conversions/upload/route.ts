import { NextResponse } from "next/server";
import { createHash } from "crypto";

import {
  UPLOAD_BUCKET,
  createManualConversionJob,
  markJobPending,
  uploadObjectKey,
  supabaseAdmin,
} from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const customerName = String(form.get("customerName") ?? "").trim() || null;
  const file = form.get("file");

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "File required." }, { status: 400 });
  }

  try {
    const job = await createManualConversionJob({ email, customerName });
    const key = uploadObjectKey(job.id);
    const bytes = Buffer.from(await file.arrayBuffer());
    const sha256 = createHash("sha256").update(bytes).digest("hex");

    const { error: uploadError } = await supabaseAdmin()
      .storage.from(UPLOAD_BUCKET)
      .upload(key, bytes, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });
    if (uploadError) throw uploadError;

    const pending = await markJobPending({
      orderId: job.id,
      sha256,
      sizeBytes: file.size,
    });

    return NextResponse.json({
      ok: true,
      jobId: pending.id,
      status: pending.status,
      inputSizeBytes: pending.input_size_bytes,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/conversions/upload] failed", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
