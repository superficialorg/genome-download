import { BUNDLE_BUCKET, type ConversionJob, supabaseAdmin } from "@/lib/conversion-jobs";

export type GenomeBundleSummary = {
  bundle_id: string;
  label: string;
  status: "ready";
  created_at: string;
  ready_at: string | null;
  bundle_sha256: string | null;
  bundle_key: string;
  has_mcp_index: boolean;
};

export type GenomeMcpIndex = {
  schema_version: "1.0";
  bundle_id: string;
  bundle_key?: string;
  generated_at: string;
  manifest?: Record<string, unknown>;
  validation?: Record<string, unknown>;
  pharmacogenomics?: unknown[];
  polygenic_scores?: unknown[];
  gene_index?: unknown[];
  reports?: {
    clinician_summary_markdown?: string;
    user_summary_markdown?: string;
  };
};

export function mcpIndexKey(bundleKey: string): string {
  if (bundleKey.endsWith(".genome.tar.gz")) {
    return bundleKey.replace(/\.genome\.tar\.gz$/, ".mcp-index.json");
  }
  return `${bundleKey}.mcp-index.json`;
}

export async function listReadyBundlesForEmail(email: string): Promise<GenomeBundleSummary[]> {
  const { data, error } = await supabaseAdmin()
    .from("conversion_jobs")
    .select("id, customer_name, bundle_key, bundle_sha256, created_at, ready_at, status")
    .eq("email", email)
    .eq("status", "ready")
    .not("bundle_key", "is", null)
    .order("ready_at", { ascending: false });
  if (error) throw error;

  const jobs = (data ?? []) as Array<
    Pick<ConversionJob, "id" | "customer_name" | "bundle_key" | "bundle_sha256" | "created_at" | "ready_at" | "status">
  >;

  return Promise.all(
    jobs.map(async (job) => {
      const indexExists = await objectExists(mcpIndexKey(job.bundle_key!));
      return {
        bundle_id: job.id,
        label: job.customer_name ? `${job.customer_name}'s .genome` : ".genome bundle",
        status: "ready" as const,
        created_at: job.created_at,
        ready_at: job.ready_at,
        bundle_sha256: job.bundle_sha256,
        bundle_key: job.bundle_key!,
        has_mcp_index: indexExists,
      };
    }),
  );
}

export async function loadBundleForEmail(
  email: string,
  bundleId?: string | null,
): Promise<GenomeBundleSummary | null> {
  const bundles = await listReadyBundlesForEmail(email);
  if (bundleId) return bundles.find((b) => b.bundle_id === bundleId) ?? null;
  return bundles[0] ?? null;
}

export async function loadMcpIndex(bundle: GenomeBundleSummary): Promise<GenomeMcpIndex | null> {
  const { data, error } = await supabaseAdmin()
    .storage.from(BUNDLE_BUCKET)
    .download(mcpIndexKey(bundle.bundle_key));
  if (error || !data) return null;
  const text = await data.text();
  return JSON.parse(text) as GenomeMcpIndex;
}

export async function signBundleDownloadUrl(
  bundle: GenomeBundleSummary,
  ttlSeconds = 60 * 15,
): Promise<string | null> {
  const { data, error } = await supabaseAdmin()
    .storage.from(BUNDLE_BUCKET)
    .createSignedUrl(bundle.bundle_key, ttlSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}

async function objectExists(key: string): Promise<boolean> {
  const slash = key.lastIndexOf("/");
  const prefix = slash >= 0 ? key.slice(0, slash) : "";
  const name = slash >= 0 ? key.slice(slash + 1) : key;
  const { data, error } = await supabaseAdmin()
    .storage.from(BUNDLE_BUCKET)
    .list(prefix, { limit: 100, search: name });
  if (error) return false;
  return Boolean(data?.some((item) => item.name === name));
}
