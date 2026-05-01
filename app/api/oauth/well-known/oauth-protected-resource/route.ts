import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ISSUER = "https://mcp.genome.computer";

export async function GET() {
  return NextResponse.json(
    {
      resource: `${ISSUER}/mcp`,
      authorization_servers: [ISSUER],
      scopes_supported: ["genome:read", "genome:query", "genome:report"],
      bearer_methods_supported: ["header"],
      resource_documentation: "https://genome.computer/docs/mcp",
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
