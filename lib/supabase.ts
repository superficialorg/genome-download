import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { TierSlug } from "./products";

let adminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export type OrderRecord = {
  tier: TierSlug;
  email: string;
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  amount_cents: number;
  payment_intent_id: string;
};

export type SavedOrder = { id: string; order_number: string };

/**
 * Generate a human-readable order number. Prefix distinguishes genome.computer
 * orders from any other brand sharing this `orders` table (e.g. Humankind).
 * 10 base32-ish chars at the end = ~10^15 combinations; collision risk is
 * negligible at any sane order volume.
 */
function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let tail = "";
  for (let i = 0; i < bytes.length; i++) {
    tail += alphabet[bytes[i] % alphabet.length];
  }
  return `GC-${tail}`;
}

export async function saveOrder(
  order: OrderRecord
): Promise<{ ok: true; order: SavedOrder } | { ok: false; reason: string }> {
  const client = getAdminClient();
  if (!client) {
    return {
      ok: false,
      reason:
        "Supabase not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing).",
    };
  }
  const order_number = generateOrderNumber();
  const { data, error } = await client
    .from("orders")
    .insert({ ...order, order_number })
    .select("id, order_number")
    .single();
  if (error) return { ok: false, reason: error.message };
  return {
    ok: true,
    order: {
      id: String(data.id),
      order_number: String(data.order_number ?? order_number),
    },
  };
}
