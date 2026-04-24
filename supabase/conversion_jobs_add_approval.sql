-- Run this ONCE in Supabase SQL editor if your conversion_jobs table was
-- created before the manual-approval workflow existed. New tables from
-- conversion_jobs.sql already have the column.

ALTER TABLE conversion_jobs
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Any jobs currently in 'pending' that the operator wants auto-processed
-- immediately can be approved in one shot:
--   UPDATE conversion_jobs SET approved_at = now() WHERE status = 'pending';
-- (Don't run that unless you actually want every pending job to fire —
-- normally you approve one at a time via the admin dashboard.)
