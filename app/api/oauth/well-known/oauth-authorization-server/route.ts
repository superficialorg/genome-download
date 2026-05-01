import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ISSUER = "https://mcp.genome.computer";

export async function GET() {
  return NextResponse.json(
    {
      issuer: ISSUER,
      authorization_endpoint: `${ISSUER}/oauth/authorize`,
      token_endpoint: `${ISSUER}/oauth/token`,
      revocation_endpoint: `${ISSUER}/oauth/revoke`,
      registration_endpoint: `${ISSUER}/oauth/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      scopes_supported: ["genome:read", "genome:query", "genome:report"],
      token_endpoint_auth_methods_supported: ["none"],
      response_modes_supported: ["query"],
      service_documentation: "https://genome.computer/docs/mcp",
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
