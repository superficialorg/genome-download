-- `.genome conversion` service: schema for the paid conversion flow.
-- Run this in the same Supabase project that holds `orders`.
--
-- One conversion_jobs row per paid conversion. Lifecycle:
--   awaiting_upload  (webhook mint the signed URL, emailed customer)
--   pending          (customer uploaded the file, worker can claim)
--   imputing         (worker claimed, running imputation if needed)
--   annotating       (VEP + PharmCAT + bundle build)
--   ready            (bundle uploaded, customer emailed the download link)
--   failed           (operator reviews; manual retry or refund)

CREATE TABLE IF NOT EXISTS conversion_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_intent_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  customer_name TEXT,

  -- opaque per-order token we include in the upload email link
  upload_token TEXT NOT NULL UNIQUE,
  upload_token_expires_at TIMESTAMPTZ NOT NULL,

  -- bucket keys (service role reads/writes; clients never touch these)
  input_key TEXT,
  input_sha256 TEXT,
  input_size_bytes BIGINT,
  bundle_key TEXT,
  bundle_sha256 TEXT,

  status TEXT NOT NULL DEFAULT 'awaiting_upload',
  error_message TEXT,

  -- denormalised for ops dashboard
  worker_id TEXT,
  claimed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  uploaded_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conversion_jobs_status
  ON conversion_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_jobs_email
  ON conversion_jobs(email);

ALTER TABLE conversion_jobs ENABLE ROW LEVEL SECURITY;

-- service role only. No end-user reads/writes.
DROP POLICY IF EXISTS "service role manages conversion_jobs"
  ON conversion_jobs;
CREATE POLICY "service role manages conversion_jobs"
  ON conversion_jobs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- Storage buckets. Both private; service role signs URLs on demand.
-- dotgenome-uploads: customer-provided inputs. Deleted immediately on
--   successful bundle generation (cost minimisation per operator decision).
-- dotgenome-bundles: generated .genome.tar.gz. 90-day retention; after that
--   customer must re-request via email.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES
  ('dotgenome-uploads', 'dotgenome-uploads', false, 26843545600),
  ('dotgenome-bundles', 'dotgenome-bundles', false, 5368709120)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "service role manages dotgenome-uploads"
  ON storage.objects;
CREATE POLICY "service role manages dotgenome-uploads"
  ON storage.objects FOR ALL
  USING (bucket_id = 'dotgenome-uploads' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'dotgenome-uploads' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "service role manages dotgenome-bundles"
  ON storage.objects;
CREATE POLICY "service role manages dotgenome-bundles"
  ON storage.objects FOR ALL
  USING (bucket_id = 'dotgenome-bundles' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'dotgenome-bundles' AND auth.role() = 'service_role');
