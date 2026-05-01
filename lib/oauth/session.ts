import { cookies } from "next/headers";

import { generateToken, hashToken, nowPlusSeconds } from "./codes";
import { supabaseAdmin } from "@/lib/conversion-jobs";

const COOKIE_NAME = "gc_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

export type GenomeSession = {
  id: string;
  email: string;
};

export async function createSession(email: string): Promise<string> {
  const raw = generateToken(32);
  const { data, error } = await supabaseAdmin()
    .from("oauth_sessions")
    .insert({
      session_hash: hashToken(raw),
      email,
      expires_at: nowPlusSeconds(SESSION_TTL_SECONDS).toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;

  const store = await cookies();
  store.set(COOKIE_NAME, raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return String(data.id);
}

export async function readSession(): Promise<GenomeSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const { data } = await supabaseAdmin()
    .from("oauth_sessions")
    .select("id, email, expires_at, revoked_at")
    .eq("session_hash", hashToken(raw))
    .maybeSingle();
  if (!data || data.revoked_at) return null;
  if (Date.parse(String(data.expires_at)) <= Date.now()) return null;
  return { id: String(data.id), email: String(data.email) };
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  store.delete(COOKIE_NAME);
  if (!raw) return;
  await supabaseAdmin()
    .from("oauth_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("session_hash", hashToken(raw));
}
