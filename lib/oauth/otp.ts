import { generateToken, hashToken, nowPlusSeconds } from "./codes";
import { supabaseAdmin } from "@/lib/conversion-jobs";

const OTP_TTL_SECONDS = 10 * 60;

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createOtp(email: string): Promise<string> {
  const code = generateOtpCode();
  await supabaseAdmin()
    .from("oauth_email_codes")
    .insert({
      email,
      code_hash: hashToken(code),
      nonce: generateToken(8),
      expires_at: nowPlusSeconds(OTP_TTL_SECONDS).toISOString(),
    });
  return code;
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const { data } = await supabaseAdmin()
    .from("oauth_email_codes")
    .select("id, code_hash, expires_at, used_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(5);
  const rows = (data ?? []) as Array<{
    id: string;
    code_hash: string;
    expires_at: string;
    used_at: string | null;
  }>;
  const expected = hashToken(code);
  const row = rows.find((r) => !r.used_at && r.code_hash === expected);
  if (!row) return false;
  if (Date.parse(row.expires_at) <= Date.now()) return false;
  await supabaseAdmin()
    .from("oauth_email_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id);
  return true;
}
