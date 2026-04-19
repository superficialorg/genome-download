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

export type SavedOrder = { id: string };

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
  const { data, error } = await client
    .from("orders")
    .insert(order)
    .select("id")
    .single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, order: { id: String(data.id) } };
}
