import { NextResponse } from "next/server";

import { authenticateBearer } from "@/lib/mcp/auth";
import { dispatchMcpMessage, MCP_PROTOCOL_VERSION } from "@/lib/mcp/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HEADERS = "Authorization, Content-Type, MCP-Protocol-Version";

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  return new NextResponse("Method Not Allowed. Use POST with a JSON-RPC body.", {
    status: 405,
    headers: { Allow: "POST, OPTIONS", ...corsHeaders() },
  });
}

export async function POST(request: Request) {
  const auth = await authenticateBearer(request);
  if (!auth.ok) {
    if (auth.status === 401) {
      return new NextResponse(JSON.stringify({ error: "invalid_token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": auth.wwwAuthenticate,
          ...corsHeaders(),
        },
      });
    }
    return new NextResponse(JSON.stringify({ error: auth.reason }), {
      status: auth.status,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const { response } = await dispatchMcpMessage(body, auth.ctx);
  if (response === null) {
    return new NextResponse(null, { status: 202, headers: corsHeaders() });
  }

  return new NextResponse(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
      ...corsHeaders(),
    },
  });
}
