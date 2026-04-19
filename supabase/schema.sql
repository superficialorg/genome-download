-- Run this against your Supabase project to create the orders table
-- used by app/api/save-order/route.ts.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tier text not null,
  email text not null,
  name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  amount_cents integer not null,
  payment_intent_id text not null unique
);

create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- RLS: disable public access; service role bypasses RLS so inserts from the
-- /api/save-order route work without additional policies.
alter table public.orders enable row level security;
