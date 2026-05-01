import { NextResponse } from "next/server";

import {
  createManualConversionJob,
  createSignedUploadUrl,
} from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    email?: unknown;
    customerName?: unknown;
  };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const customerName =
    typeof body.customerName === "string" && body.customerName.trim()
      ? body.customerName.trim()
      : null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
  }

  try {
    const job = await createManualConversionJob({ email, customerName });
    const upload = await createSignedUploadUrl(job.id);

    return NextResponse.json({
      ok: true,
      jobId: job.id,
      path: upload.path,
      token: upload.token,
    });
  } catch (err) {
    const msg = formatError(err);
    console.error("[admin/conversions/upload] failed", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
