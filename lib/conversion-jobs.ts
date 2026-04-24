import { randomBytes } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const UPLOAD_BUCKET = "dotgenome-uploads";
export const BUNDLE_BUCKET = "dotgenome-bundles";
export const UPLOAD_TOKEN_TTL_DAYS = 7;
export const DOWNLOAD_URL_TTL_SECONDS = 60 * 60 * 24; // 24h

export type ConversionJobStatus =
  | "awaiting_upload"
  | "pending"
  | "imputing"
  | "annotating"
  | "ready"
  | "failed";

export type ConversionJob = {
  id: string;
  payment_intent_id: string;
  email: string;
  customer_name: string | null;
  upload_token: string;
  upload_token_expires_at: string;
  input_key: string | null;
  input_sha256: string | null;
  input_size_bytes: number | null;
  bundle_key: string | null;
  bundle_sha256: string | null;
  status: ConversionJobStatus;
  error_message: string | null;
  worker_id: string | null;
  claimed_at: string | null;
  started_at: string | null;
  created_at: string;
  uploaded_at: string | null;
  approved_at: string | null;
  ready_at: string | null;
  failed_at: string | null;
  delivered_at: string | null;
};

let _admin: SupabaseClient | null = null;

/**
 * Supabase admin client with the service-role key. Every touchpoint of
 * conversion_jobs or the dotgenome-* buckets goes through this.
 */
export function supabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin credentials not configured (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required)."
    );
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

/**
 * Cryptographically-random per-order token. 32 bytes of urandom, base64url.
 * Used both as the opaque link token AND as the Supabase storage upload token.
 * Stored on the job row so the upload handler can verify.
 */
export function mintUploadToken(): string {
  return randomBytes(32).toString("base64url");
}

export function uploadTokenExpiry(): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + UPLOAD_TOKEN_TTL_DAYS);
  return d;
}

export function uploadObjectKey(orderId: string): string {
  return `orders/${orderId}/input`;
}

export function bundleObjectKey(orderId: string, sampleId: string): string {
  return `orders/${orderId}/${sampleId}.genome.tar.gz`;
}

/**
 * Create a new conversion_jobs row. Called from the Stripe webhook after
 * `payment_intent.succeeded`. Caller supplies the PaymentIntent id, which
 * is globally unique so we can use it as the idempotency key.
 */
export async function createConversionJob(params: {
  paymentIntentId: string;
  email: string;
  customerName?: string | null;
}): Promise<ConversionJob> {
  const token = mintUploadToken();
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .insert({
      payment_intent_id: params.paymentIntentId,
      email: params.email,
      customer_name: params.customerName ?? null,
      upload_token: token,
      upload_token_expires_at: uploadTokenExpiry().toISOString(),
      status: "awaiting_upload",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as ConversionJob;
}

/**
 * Load a job by id AND upload_token — the upload page uses this to gate
 * anonymous access. Wrong token or expired token → null → 404.
 */
export async function loadJobByToken(
  orderId: string,
  token: string
): Promise<ConversionJob | null> {
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .select("*")
    .eq("id", orderId)
    .eq("upload_token", token)
    .single();
  if (error || !data) return null;
  const job = data as ConversionJob;
  if (new Date(job.upload_token_expires_at) < new Date()) return null;
  return job;
}

export async function loadJob(orderId: string): Promise<ConversionJob | null> {
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error || !data) return null;
  return data as ConversionJob;
}

/**
 * Ask Supabase to mint a signed upload URL for exactly one object key.
 * The customer's browser PUTs directly to it — never through our server.
 */
export async function createSignedUploadUrl(
  orderId: string
): Promise<{ path: string; token: string; signedUrl: string }> {
  const key = uploadObjectKey(orderId);
  const { data, error } = await supabaseAdmin()
    .storage.from(UPLOAD_BUCKET)
    .createSignedUploadUrl(key);
  if (error || !data) {
    throw new Error(
      `failed to mint signed upload URL: ${error?.message ?? "unknown"}`
    );
  }
  return { path: key, token: data.token, signedUrl: data.signedUrl };
}

/**
 * After the customer's browser confirms the upload succeeded we call this
 * to flip the job to `pending`. We re-stat the bucket to verify the object
 * actually exists at the expected key — can't trust the client blindly.
 */
export async function markJobPending(params: {
  orderId: string;
  sha256: string;
  sizeBytes: number;
}): Promise<ConversionJob> {
  const expectedKey = uploadObjectKey(params.orderId);
  const { data: exists, error: statError } = await supabaseAdmin()
    .storage.from(UPLOAD_BUCKET)
    .list(`orders/${params.orderId}`, { limit: 1 });
  if (statError) {
    throw new Error(`could not stat upload: ${statError.message}`);
  }
  if (!exists?.some((o) => `orders/${params.orderId}/${o.name}` === expectedKey)) {
    throw new Error(`upload not found at ${expectedKey}`);
  }

  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .update({
      input_key: expectedKey,
      input_sha256: params.sha256,
      input_size_bytes: params.sizeBytes,
      status: "pending",
      uploaded_at: new Date().toISOString(),
    })
    .eq("id", params.orderId)
    .eq("status", "awaiting_upload")
    .select("*")
    .single();
  if (error) throw error;
  return data as ConversionJob;
}

/**
 * Approve a pending job for the annotator poller to process. Operator
 * clicks "Process" in /admin/conversions — this marks approved_at and
 * the background poller (on Render) picks it up within ~15 seconds.
 *
 * Only valid on jobs in 'pending' status with a real input_key. Refuses
 * duplicate approvals (if already approved, returns the existing row
 * without changing anything).
 */
export async function approveJob(orderId: string): Promise<ConversionJob> {
  const job = await loadJob(orderId);
  if (!job) throw new Error("job not found");
  if (!job.input_key) {
    throw new Error("cannot approve — customer hasn't uploaded yet");
  }
  if (job.status !== "pending") {
    throw new Error(
      `cannot approve — job status is '${job.status}', must be 'pending'`
    );
  }
  if (job.approved_at) {
    return job; // already approved; idempotent
  }
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .update({ approved_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("*")
    .single();
  if (error) throw error;
  return data as ConversionJob;
}

/**
 * Flip a failed (or stuck) job back to `pending` so the annotator worker
 * picks it up on the next poll cycle. Clears the worker-claim fields and
 * the previous error so the audit trail is clean.
 *
 * Only works when `input_key` is populated (i.e. the customer actually
 * uploaded). Won't touch `ready` jobs — regenerating a bundle the
 * customer already has is a separate, costlier operation.
 */
export async function retryJob(orderId: string): Promise<ConversionJob> {
  const job = await loadJob(orderId);
  if (!job) throw new Error("job not found");
  if (!job.input_key) {
    throw new Error("cannot retry — customer hasn't uploaded yet");
  }
  if (job.status === "ready") {
    throw new Error("cannot retry — job already completed");
  }

  // Retry counts as re-approval — operator explicitly asked for this run,
  // no reason to require another "Process" click.
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .update({
      status: "pending",
      worker_id: null,
      claimed_at: null,
      started_at: null,
      error_message: null,
      failed_at: null,
      approved_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("*")
    .single();
  if (error) throw error;
  return data as ConversionJob;
}

export async function listRecentJobs(limit = 100): Promise<ConversionJob[]> {
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ConversionJob[];
}

/**
 * Signed URL so the operator can download a bundle from the admin page.
 * Short TTL; regenerated per click.
 */
export async function signBundleDownloadUrl(
  key: string,
  ttlSeconds = DOWNLOAD_URL_TTL_SECONDS
): Promise<string | null> {
  const { data, error } = await supabaseAdmin()
    .storage.from(BUNDLE_BUCKET)
    .createSignedUrl(key, ttlSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}
