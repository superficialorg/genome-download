import { redirect } from "next/navigation";

import { getOAuthClient, isRegisteredRedirect } from "@/lib/oauth/clients";
import { isValidCodeChallenge, signState } from "@/lib/oauth/codes";
import { readSession } from "@/lib/oauth/session";
import { listReadyBundlesForEmail } from "@/lib/genome/bundles";
import { SigninClient } from "./signin-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORTED_SCOPES = new Set(["genome:read", "genome:query", "genome:report"]);

type RawQuery = {
  response_type?: string;
  client_id?: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
};

export default async function OAuthAuthorizePage({
  searchParams,
}: {
  searchParams: Promise<RawQuery>;
}) {
  const params = await searchParams;
  const clientId = typeof params.client_id === "string" ? params.client_id : "";
  const redirectUri = typeof params.redirect_uri === "string" ? params.redirect_uri : "";
  if (!clientId || !redirectUri) return <FatalError reason="Missing client_id or redirect_uri." />;

  const client = await getOAuthClient(clientId);
  if (!client) return <FatalError reason={`Unknown client_id "${clientId}".`} />;
  if (!isRegisteredRedirect(client, redirectUri)) {
    return <FatalError reason="redirect_uri is not registered for this client." />;
  }

  const state = typeof params.state === "string" ? params.state : "";
  if (params.response_type !== "code") redirect(redirectError(redirectUri, "unsupported_response_type", state));
  const scope = normalizeScope(params.scope);
  if (!scope.ok) redirect(redirectError(redirectUri, "invalid_scope", state));
  const codeChallenge = typeof params.code_challenge === "string" ? params.code_challenge : "";
  if (params.code_challenge_method !== "S256") {
    redirect(redirectError(redirectUri, "invalid_request", state, "code_challenge_method must be S256"));
  }
  if (!isValidCodeChallenge(codeChallenge)) {
    redirect(redirectError(redirectUri, "invalid_request", state, "code_challenge malformed"));
  }

  const signedState = signState({
    v: 1,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope.value,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    iat: Math.floor(Date.now() / 1000),
  });

  const session = await readSession();
  const bundles = session ? await listReadyBundlesForEmail(session.email) : [];
  const defaultBundleId = bundles[0]?.bundle_id ?? "";

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[420px] flex-col justify-center">
        <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
          Genome Computer
        </p>
        {session ? (
          <form method="POST" action="/oauth/consent" className="flex flex-col gap-6">
            <input type="hidden" name="signed_state" value={signedState} />
            <div className="flex flex-col gap-2">
              <h1 className="m-0 text-[28px] font-semibold leading-tight tracking-[-0.02em]">
                Connect Genome Computer to {client.name}
              </h1>
              <p className="m-0 text-[14px] leading-6 text-muted-foreground">
                Signed in as <span className="text-foreground">{session.email}</span>
              </p>
            </div>
            <label className="flex flex-col gap-2 text-[14px]">
              Default .genome bundle
              <select
                name="default_bundle_id"
                defaultValue={defaultBundleId}
                className="h-11 rounded-full border border-border bg-background px-4 text-[14px]"
                required
              >
                {bundles.map((bundle) => (
                  <option key={bundle.bundle_id} value={bundle.bundle_id}>
                    {bundle.label} · {bundle.ready_at ? new Date(bundle.ready_at).toLocaleDateString() : "ready"}
                    {!bundle.has_mcp_index ? " · index pending" : ""}
                  </option>
                ))}
              </select>
            </label>
            {bundles.length === 0 && (
              <p className="rounded-lg border border-border p-4 text-[14px] leading-6 text-muted-foreground">
                This email does not have a ready .genome bundle yet. Finish a conversion first, then connect again.
              </p>
            )}
            <div className="rounded-lg border border-border p-4 text-[14px] leading-6 text-muted-foreground">
              <p className="m-0 text-foreground">This allows {client.name} to read:</p>
              <ul className="mb-0 mt-2 pl-5">
                <li>Your ready .genome bundle list</li>
                <li>Manifest and validation metadata</li>
                <li>Indexed PGx, PRS, and gene-summary rows</li>
              </ul>
            </div>
            <button
              type="submit"
              name="decision"
              value="allow"
              disabled={bundles.length === 0}
              className="rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground disabled:opacity-40"
            >
              Allow
            </button>
            <button
              type="submit"
              name="decision"
              value="deny"
              className="rounded-full border border-border px-5 py-3 text-[14px] font-medium"
            >
              Deny
            </button>
          </form>
        ) : (
          <SigninForm />
        )}
      </div>
    </main>
  );
}

function SigninForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[28px] font-semibold leading-tight tracking-[-0.02em]">
          Sign in to connect your genome
        </h1>
        <p className="m-0 text-[14px] leading-6 text-muted-foreground">
          Enter the email used for your Genome Computer order. We will send a six digit code.
        </p>
      </div>
      <SigninClient />
    </div>
  );
}

function normalizeScope(raw: unknown): { ok: true; value: string } | { ok: false } {
  const requested = typeof raw === "string" ? raw.split(/\s+/).filter(Boolean) : [];
  const scopes = requested.length ? requested : Array.from(SUPPORTED_SCOPES);
  if (scopes.some((s) => !SUPPORTED_SCOPES.has(s))) return { ok: false };
  return { ok: true, value: scopes.join(" ") };
}

function redirectError(redirectUri: string, error: string, state: string, description?: string): string {
  const url = new URL(redirectUri);
  url.searchParams.set("error", error);
  if (description) url.searchParams.set("error_description", description);
  if (state) url.searchParams.set("state", state);
  return url.toString();
}

function FatalError({ reason }: { reason: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
      <div className="max-w-[360px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Could not connect</h1>
        <p className="text-[14px] leading-6 text-muted-foreground">{reason}</p>
      </div>
    </main>
  );
}
