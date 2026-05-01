import { NextResponse } from "next/server";

import { generateToken } from "@/lib/oauth/codes";
import { supabaseAdmin } from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_REDIRECT_HOSTS = new Set(["chatgpt.com", "chat.openai.com", "claude.ai"]);
const ALLOWED_DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);
const SUPPORTED_SCOPES = new Set(["genome:read", "genome:query", "genome:report"]);

export async function POST(request: Request) {
  let body: {
    client_name?: unknown;
    redirect_uris?: unknown;
    scope?: unknown;
    grant_types?: unknown;
    response_types?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid_client_metadata", "Body must be JSON.");
  }

  if (!Array.isArray(body.redirect_uris) || body.redirect_uris.length === 0) {
    return errorResponse("invalid_redirect_uri", "redirect_uris must be a non-empty array.");
  }
  const redirectUris: string[] = [];
  for (const uri of body.redirect_uris) {
    if (typeof uri !== "string") return errorResponse("invalid_redirect_uri", "redirect_uri must be a string.");
    const valid = validateRedirectUri(uri);
    if (!valid.ok) return errorResponse("invalid_redirect_uri", `${valid.reason}: ${uri}`);
    redirectUris.push(uri);
  }

  const scope = normalizeScope(typeof body.scope === "string" ? body.scope : "");
  if (!scope.ok) return errorResponse("invalid_client_metadata", scope.reason);

  const clientName = inferClientName(body.client_name, redirectUris[0]);
  const clientId = `dcr-${generateToken(16)}`;
  const { error } = await supabaseAdmin().from("oauth_clients").insert({
    client_id: clientId,
    client_secret_hash: null,
    name: clientName,
    redirect_uris: redirectUris,
    is_public: true,
  });
  if (error) {
    console.error("[oauth/register] insert failed", error);
    return errorResponse("server_error", "Could not register client.");
  }

  return NextResponse.json(
    {
      client_id: clientId,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: clientName,
      redirect_uris: redirectUris,
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      scope: scope.value,
    },
    { status: 201, headers: { "Cache-Control": "no-store", Pragma: "no-cache" } },
  );
}

function normalizeScope(raw: string): { ok: true; value: string } | { ok: false; reason: string } {
  const requested = raw.split(/\s+/).filter(Boolean);
  const scopes = requested.length ? requested : Array.from(SUPPORTED_SCOPES);
  for (const scope of scopes) {
    if (!SUPPORTED_SCOPES.has(scope)) return { ok: false, reason: `Unsupported scope: ${scope}` };
  }
  return { ok: true, value: scopes.join(" ") };
}

function validateRedirectUri(uri: string): { ok: true } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }
  if (ALLOWED_REDIRECT_HOSTS.has(url.hostname)) {
    return url.protocol === "https:" ? { ok: true } : { ok: false, reason: "https_required" };
  }
  if (ALLOWED_DEV_HOSTS.has(url.hostname)) return { ok: true };
  return { ok: false, reason: "host_not_allowed" };
}

function inferClientName(provided: unknown, firstRedirect: string): string {
  if (typeof provided === "string" && provided.trim()) return provided.trim().slice(0, 64);
  try {
    const url = new URL(firstRedirect);
    if (url.hostname.endsWith("chatgpt.com") || url.hostname.endsWith("openai.com")) return "ChatGPT";
    if (url.hostname.endsWith("claude.ai")) return "Claude";
  } catch {}
  return "MCP Client";
}

function errorResponse(error: string, description: string) {
  return NextResponse.json(
    { error, error_description: description },
    { status: 400, headers: { "Cache-Control": "no-store", Pragma: "no-cache" } },
  );
}
