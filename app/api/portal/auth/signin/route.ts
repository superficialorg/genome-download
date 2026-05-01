import { NextResponse } from "next/server";

import { createOtp } from "@/lib/oauth/otp";
import { sendOAuthSigninCode } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatError(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const parts = ["message", "details", "hint", "code", "name"]
      .map((key) => (typeof record[key] === "string" ? `${key}: ${record[key]}` : null))
      .filter(Boolean);
    if (parts.length > 0) return parts.join("; ");
    try {
      return JSON.stringify(value);
    } catch {
      return "Unknown error";
    }
  }
  return value == null ? "Unknown error" : String(value);
}

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const { data } = await supabaseAdmin()
    .from("conversion_jobs")
    .select("id")
    .eq("email", email)
    .limit(1);

  // Avoid account enumeration. If no order exists, still return ok without emailing.
  if (!data || data.length === 0) return NextResponse.json({ ok: true });

  let code: string;
  try {
    code = await createOtp(email);
  } catch (err) {
    const msg = formatError(err);
    console.error("[auth/signin] code insert failed", msg, err);
    return NextResponse.json({ ok: false, error: `Could not create sign-in code: ${msg}` }, { status: 500 });
  }

  const sent = await sendOAuthSigninCode({ email, code });
  if (!sent.ok) {
    console.error("[auth/signin] send failed", sent.reason);
    return NextResponse.json({ ok: false, error: "Could not send code." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
