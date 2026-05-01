import { NextResponse } from "next/server";

import { verifyOtp } from "@/lib/oauth/otp";
import { createSession } from "@/lib/oauth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  let body: { email?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "Invalid code." }, { status: 400 });
  }
  let ok: boolean;
  try {
    ok = await verifyOtp(email, code);
  } catch (err) {
    const msg = formatError(err);
    console.error("[auth/verify] code lookup failed", msg, err);
    return NextResponse.json({ ok: false, error: `Could not verify code: ${msg}` }, { status: 500 });
  }

  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid or expired code." }, { status: 403 });
  }
  await createSession(email);
  return NextResponse.json({ ok: true });
}
