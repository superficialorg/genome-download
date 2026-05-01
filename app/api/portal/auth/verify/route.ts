import { NextResponse } from "next/server";

import { verifyOtp } from "@/lib/oauth/otp";
import { createSession } from "@/lib/oauth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    console.error("[auth/verify] code lookup failed", err);
    return NextResponse.json({ ok: false, error: "Could not verify code." }, { status: 500 });
  }

  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid or expired code." }, { status: 403 });
  }
  await createSession(email);
  return NextResponse.json({ ok: true });
}
