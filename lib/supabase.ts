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
 * Generate a human-readable order number. The `GC-` prefix scopes our rows
 * in the shared orders table (Humankind uses `HK-…`), and the 10-char tail
 * avoids confusable glyphs (no 0/O/1/I/L) for readable phone/email support.
 */
function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let tail = "";
  for (let i = 0; i < bytes.length; i++) {
    tail += alphabet[bytes[i] % alphabet.length];
  }
  return `GC-${tail}`;
}

function splitName(full: string): { first_name: string; last_name: string } {
  const trimmed = full.trim();
  const ix = trimmed.indexOf(" ");
  if (ix === -1) return { first_name: trimmed, last_name: "" };
  return {
    first_name: trimmed.slice(0, ix),
    last_name: trimmed.slice(ix + 1).trim(),
  };
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
  const { first_name, last_name } = splitName(order.name);

  // Populate both the Humankind-canonical columns (order_number, status,
  // amount, currency, first/last name, country_code, form_type,
  // stripe_payment_intent_id) and the genome-specific columns we added to
  // the table (tier + address + amount_cents + payment_intent_id). This
  // keeps rows readable by Humankind's existing tooling and satisfies any
  // NOT NULL constraint on the canonical columns.
  const row = {
    order_number,
    status: "paid" as const,
    currency: "usd" as const,
    country_code: "US" as const,
    form_type: "order_kit_form" as const,
    email: order.email,
    first_name,
    last_name,
    amount: order.amount_cents,
    stripe_payment_intent_id: order.payment_intent_id,
    // Genome-specific fields (columns we added to the table)
    tier: order.tier,
    name: order.name,
    address_line1: order.address_line1,
    address_line2: order.address_line2,
    city: order.city,
    state: order.state,
    postal_code: order.postal_code,
    amount_cents: order.amount_cents,
    payment_intent_id: order.payment_intent_id,
  };

  const { data, error } = await client
    .from("orders")
    .insert(row)
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
