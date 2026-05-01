import { hashToken } from "@/lib/oauth/codes";
import { supabaseAdmin } from "@/lib/conversion-jobs";

export type McpAuthContext = {
  email: string;
  clientId: string;
  tokenId: string;
  defaultBundleId: string | null;
  scope: string;
};

export type McpAuthResult =
  | { ok: true; ctx: McpAuthContext }
  | { ok: false; status: 401; wwwAuthenticate: string }
  | { ok: false; status: 503; reason: string };

const ISSUER = "https://mcp.genome.computer";

export async function authenticateBearer(request: Request): Promise<McpAuthResult> {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return unauthorized("invalid_token");
  }
  const token = header.slice(7).trim();
  if (!token) return unauthorized("invalid_token");

  const { data } = await supabaseAdmin()
    .from("oauth_access_tokens")
    .select("id, client_id, email, default_bundle_id, scope, expires_at, revoked_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();
  if (!data) return unauthorized("invalid_token");
  if (data.revoked_at) return unauthorized("invalid_token");
  if (Date.parse(String(data.expires_at)) <= Date.now()) return unauthorized("invalid_token");

  void supabaseAdmin()
    .from("oauth_access_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    ok: true,
    ctx: {
      email: String(data.email),
      clientId: String(data.client_id),
      tokenId: String(data.id),
      defaultBundleId: (data.default_bundle_id as string | null) ?? null,
      scope: String(data.scope),
    },
  };
}

function unauthorized(error: "invalid_token" | "insufficient_scope"): McpAuthResult {
  return {
    ok: false,
    status: 401,
    wwwAuthenticate: [
      `Bearer realm="mcp.genome.computer"`,
      `error="${error}"`,
      `resource_metadata="${ISSUER}/.well-known/oauth-protected-resource"`,
    ].join(", "),
  };
}
