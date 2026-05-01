import { NextResponse } from "next/server";

import { generateToken, hashToken, nowPlusSeconds, verifyState } from "@/lib/oauth/codes";
import { getOAuthClient, isRegisteredRedirect } from "@/lib/oauth/clients";
import { readSession } from "@/lib/oauth/session";
import { loadBundleForEmail } from "@/lib/genome/bundles";
import { supabaseAdmin } from "@/lib/conversion-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ConsentState = {
  v: 1;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
  code_challenge: string;
  code_challenge_method: "S256";
  iat: number;
};

export async function POST(request: Request) {
  const form = await request.formData();
  const signed = form.get("signed_state");
  const decision = form.get("decision");
  const defaultBundleId = form.get("default_bundle_id");
  const verified = verifyState<ConsentState>(typeof signed === "string" ? signed : null);
  if (!verified) return new NextResponse("Invalid consent state", { status: 400 });

  const client = await getOAuthClient(verified.client_id);
  if (!client || !isRegisteredRedirect(client, verified.redirect_uri)) {
    return redirectTo(verified.redirect_uri, { error: "invalid_request", state: verified.state });
  }
  if (decision !== "allow") {
    return redirectTo(verified.redirect_uri, { error: "access_denied", state: verified.state });
  }

  const session = await readSession();
  if (!session) {
    const url = new URL("/oauth/authorize", request.url);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", verified.client_id);
    url.searchParams.set("redirect_uri", verified.redirect_uri);
    url.searchParams.set("scope", verified.scope);
    url.searchParams.set("state", verified.state);
    url.searchParams.set("code_challenge", verified.code_challenge);
    url.searchParams.set("code_challenge_method", verified.code_challenge_method);
    return NextResponse.redirect(url, 302);
  }

  const bundle = await loadBundleForEmail(
    session.email,
    typeof defaultBundleId === "string" ? defaultBundleId : null,
  );
  if (!bundle) {
    return redirectTo(verified.redirect_uri, {
      error: "access_denied",
      error_description: "No ready .genome bundle found.",
      state: verified.state,
    });
  }

  const code = generateToken(24);
  const { error } = await supabaseAdmin().from("oauth_authorization_codes").insert({
    code_hash: hashToken(code),
    client_id: verified.client_id,
    email: session.email,
    default_bundle_id: bundle.bundle_id,
    scope: verified.scope,
    code_challenge: verified.code_challenge,
    code_challenge_method: verified.code_challenge_method,
    redirect_uri: verified.redirect_uri,
    expires_at: nowPlusSeconds(60).toISOString(),
  });
  if (error) {
    console.error("[oauth/consent] insert failed", error);
    return redirectTo(verified.redirect_uri, { error: "server_error", state: verified.state });
  }
  return redirectTo(verified.redirect_uri, { code, state: verified.state });
}

function redirectTo(redirectUri: string, params: Record<string, string | undefined>) {
  const url = new URL(redirectUri);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url, 302);
}
