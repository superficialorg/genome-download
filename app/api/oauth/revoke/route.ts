import { NextResponse } from "next/server";

import { hashToken } from "@/lib/oauth/codes";
import { supabaseAdmin } from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const params = await readParams(request);
  const token = params?.token;
  const hint = params?.token_type_hint;
  if (!token) return NextResponse.json({}, { status: 200 });

  const hashed = hashToken(token);
  if (hint === "refresh_token") {
    await supabaseAdmin()
      .from("oauth_access_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("refresh_token_hash", hashed);
  } else {
    await supabaseAdmin()
      .from("oauth_access_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", hashed);
    await supabaseAdmin()
      .from("oauth_access_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("refresh_token_hash", hashed);
  }
  return NextResponse.json({}, { status: 200 });
}

async function readParams(request: Request): Promise<Record<string, string> | null> {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Record<string, unknown>;
      return Object.fromEntries(
        Object.entries(body).filter(([, v]) => typeof v === "string") as [string, string][],
      );
    }
    return Object.fromEntries(new URLSearchParams(await request.text()).entries());
  } catch {
    return null;
  }
}
