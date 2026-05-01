import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  generateToken,
  hashToken,
  nowPlusSeconds,
  verifyPkce,
} from "@/lib/oauth/codes";
import { getOAuthClient } from "@/lib/oauth/clients";
import { supabaseAdmin } from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const params = await readParams(request);
  if (!params) return errorResponse("invalid_request", "Malformed token request body.");
  if (params.grant_type === "authorization_code") return handleAuthorizationCode(params);
  if (params.grant_type === "refresh_token") return handleRefresh(params);
  return errorResponse("unsupported_grant_type", `grant_type "${params.grant_type}" is not supported.`);
}

async function handleAuthorizationCode(p: Record<string, string>) {
  const { code, redirect_uri, client_id, code_verifier } = p;
  if (!code || !redirect_uri || !client_id || !code_verifier) {
    return errorResponse("invalid_request", "Missing required parameter.");
  }
  const client = await getOAuthClient(client_id);
  if (!client) return errorResponse("invalid_client", "Unknown client.");

  const codeHash = hashToken(code);
  const { data: row } = await supabaseAdmin()
    .from("oauth_authorization_codes")
    .select("id, client_id, email, default_bundle_id, scope, code_challenge, redirect_uri, expires_at, used_at")
    .eq("code_hash", codeHash)
    .maybeSingle();
  if (!row) return errorResponse("invalid_grant", "Authorization code not found.");
  if (row.used_at) return errorResponse("invalid_grant", "Code has already been used.");
  if (Date.parse(String(row.expires_at)) <= Date.now()) return errorResponse("invalid_grant", "Code has expired.");
  if (row.client_id !== client_id) return errorResponse("invalid_grant", "Code/client mismatch.");
  if (row.redirect_uri !== redirect_uri) return errorResponse("invalid_grant", "redirect_uri mismatch.");
  if (!verifyPkce(String(row.code_challenge), code_verifier)) {
    return errorResponse("invalid_grant", "PKCE verification failed.");
  }

  await supabaseAdmin()
    .from("oauth_authorization_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id);

  const tokens = await mintTokenPair({
    clientId: String(row.client_id),
    email: String(row.email),
    defaultBundleId: (row.default_bundle_id as string | null) ?? null,
    scope: String(row.scope),
  });
  return NextResponse.json(tokens, { headers: noStoreHeaders() });
}

async function handleRefresh(p: Record<string, string>) {
  const { refresh_token, client_id } = p;
  if (!refresh_token || !client_id) return errorResponse("invalid_request", "Missing required parameter.");
  const client = await getOAuthClient(client_id);
  if (!client) return errorResponse("invalid_client", "Unknown client.");

  const { data: row } = await supabaseAdmin()
    .from("oauth_access_tokens")
    .select("id, client_id, email, default_bundle_id, scope, refresh_expires_at, revoked_at")
    .eq("refresh_token_hash", hashToken(refresh_token))
    .maybeSingle();
  if (!row) return errorResponse("invalid_grant", "Unknown refresh token.");
  if (row.revoked_at) return errorResponse("invalid_grant", "Refresh token revoked.");
  if (row.client_id !== client_id) return errorResponse("invalid_grant", "Token/client mismatch.");
  if (!row.refresh_expires_at || Date.parse(String(row.refresh_expires_at)) <= Date.now()) {
    return errorResponse("invalid_grant", "Refresh token expired.");
  }

  await supabaseAdmin()
    .from("oauth_access_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", row.id);

  const tokens = await mintTokenPair({
    clientId: String(row.client_id),
    email: String(row.email),
    defaultBundleId: (row.default_bundle_id as string | null) ?? null,
    scope: String(row.scope),
  });
  return NextResponse.json(tokens, { headers: noStoreHeaders() });
}

async function mintTokenPair(input: {
  clientId: string;
  email: string;
  defaultBundleId: string | null;
  scope: string;
}) {
  const accessToken = generateToken(32);
  const refreshToken = generateToken(32);
  const { error } = await supabaseAdmin().from("oauth_access_tokens").insert({
    token_hash: hashToken(accessToken),
    refresh_token_hash: hashToken(refreshToken),
    client_id: input.clientId,
    email: input.email,
    default_bundle_id: input.defaultBundleId,
    scope: input.scope,
    expires_at: nowPlusSeconds(ACCESS_TOKEN_TTL_SECONDS).toISOString(),
    refresh_expires_at: nowPlusSeconds(REFRESH_TOKEN_TTL_SECONDS).toISOString(),
  });
  if (error) throw error;
  return {
    access_token: accessToken,
    token_type: "Bearer" as const,
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
    scope: input.scope,
  };
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
    const form = new URLSearchParams(await request.text());
    return Object.fromEntries(form.entries());
  } catch {
    return null;
  }
}

function errorResponse(error: string, description?: string) {
  return NextResponse.json(
    { error, ...(description ? { error_description: description } : {}) },
    { status: 400, headers: noStoreHeaders() },
  );
}

function noStoreHeaders() {
  return { "Cache-Control": "no-store", Pragma: "no-cache" };
}
