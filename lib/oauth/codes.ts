import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

const TOKEN_BYTES = 32;
const STATE_SECRET = process.env.OAUTH_STATE_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-only-state-secret";
const TOKEN_PEPPER = process.env.OAUTH_TOKEN_PEPPER ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-only-token-pepper";

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
export const AUTH_CODE_TTL_SECONDS = 60;

export function generateToken(bytes = TOKEN_BYTES): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return createHmac("sha256", TOKEN_PEPPER).update(token).digest("hex");
}

export function nowPlusSeconds(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

export function isValidCodeChallenge(value: string): boolean {
  return /^[A-Za-z0-9_-]{43,128}$/.test(value);
}

export function verifyPkce(codeChallenge: string, codeVerifier: string): boolean {
  const digest = createHash("sha256").update(codeVerifier).digest("base64url");
  return digest === codeChallenge;
}

export function signState<T>(payload: T): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", STATE_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyState<T = unknown>(token: string | null | undefined): T | null {
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = createHmac("sha256", STATE_SECRET).update(encoded).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString()) as T;
  } catch {
    return null;
  }
}
