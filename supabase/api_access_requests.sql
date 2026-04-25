-- Run this against your Supabase project to create the table backing
-- POST /api/request-access (Genome API partner-access form on /api).

create extension if not exists "pgcrypto";

create table if not exists public.api_access_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Triage state for the operator inbox. The form does not write this.
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'approved', 'declined')),
  -- Submitted fields.
  name text not null,
  email text not null,
  company text not null,
  website text,
  -- Constrained vocabularies — keep in sync with /components/api-access-form.tsx
  -- and /app/api/request-access/route.ts.
  use_case text not null
    check (use_case in (
      'clinical', 'consumer', 'research', 'agentic', 'pharma', 'other'
    )),
  volume text not null
    check (volume in (
      'lt_100', '100_to_1000', '1000_to_10000', 'gt_10000', 'unsure'
    )),
  description text not null,
  -- Light request metadata, captured for triage / abuse review only.
  source_ip text,
  user_agent text
);

create index if not exists api_access_requests_created_at_idx
  on public.api_access_requests (created_at desc);
create index if not exists api_access_requests_email_idx
  on public.api_access_requests (email);
create index if not exists api_access_requests_status_idx
  on public.api_access_requests (status)
  where status in ('new', 'reviewing');

-- RLS: service role bypasses; the form route uses the service role key.
alter table public.api_access_requests enable row level security;
