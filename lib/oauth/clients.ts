import { supabaseAdmin } from "@/lib/conversion-jobs";

export type OAuthClient = {
  id: string;
  client_id: string;
  client_secret_hash: string | null;
  name: string;
  redirect_uris: string[];
  is_public: boolean;
};

export async function getOAuthClient(clientId: string): Promise<OAuthClient | null> {
  const { data } = await supabaseAdmin()
    .from("oauth_clients")
    .select("id, client_id, client_secret_hash, name, redirect_uris, is_public")
    .eq("client_id", clientId)
    .maybeSingle();
  if (!data) return null;
  return data as OAuthClient;
}

export function isRegisteredRedirect(
  client: Pick<OAuthClient, "redirect_uris">,
  redirectUri: string,
): boolean {
  return client.redirect_uris.includes(redirectUri);
}
