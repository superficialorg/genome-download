import { NextResponse } from "next/server";
import { saveApiAccessRequest } from "@/lib/supabase";
import { sendApiAccessRequestNotification } from "@/lib/resend";

export const runtime = "nodejs";

const USE_CASES = new Set([
  "clinical",
  "consumer",
  "research",
  "agentic",
  "pharma",
  "other",
]);

const VOLUMES = new Set([
  "lt_100",
  "100_to_1000",
  "1000_to_10000",
  "gt_10000",
  "unsure",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = {
  name: 200,
  email: 320,
  company: 200,
  website: 500,
  description: 2000,
};

function clip(v: string, max: number): string {
  return v.trim().slice(0, max);
}

function isValidUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: {
    name?: unknown;
    email?: unknown;
    company?: unknown;
    website?: unknown;
    useCase?: unknown;
    volume?: unknown;
    description?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const requireStr = (v: unknown, k: string, max: number) => {
    if (typeof v !== "string" || !v.trim()) return `Missing ${k}.`;
    if (v.length > max * 2) return `${k} is too long.`;
    return null;
  };

  for (const [k, v, max] of [
    ["name", body.name, MAX_LEN.name],
    ["email", body.email, MAX_LEN.email],
    ["company", body.company, MAX_LEN.company],
    ["description", body.description, MAX_LEN.description],
  ] as const) {
    const err = requireStr(v, k, max);
    if (err) {
      return NextResponse.json({ ok: false, error: err }, { status: 400 });
    }
  }

  const name = clip(body.name as string, MAX_LEN.name);
  const email = clip(body.email as string, MAX_LEN.email).toLowerCase();
  const company = clip(body.company as string, MAX_LEN.company);
  const description = clip(body.description as string, MAX_LEN.description);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 }
    );
  }

  let website: string | null = null;
  if (typeof body.website === "string" && body.website.trim()) {
    const w = clip(body.website, MAX_LEN.website);
    if (!isValidUrl(w)) {
      return NextResponse.json(
        { ok: false, error: "Website must be a valid URL." },
        { status: 400 }
      );
    }
    website = w;
  }

  const useCase = body.useCase;
  if (typeof useCase !== "string" || !USE_CASES.has(useCase)) {
    return NextResponse.json(
      { ok: false, error: "Pick a use case." },
      { status: 400 }
    );
  }
  const volume = body.volume;
  if (typeof volume !== "string" || !VOLUMES.has(volume)) {
    return NextResponse.json(
      { ok: false, error: "Pick an expected volume." },
      { status: 400 }
    );
  }

  // Capture light request metadata for triage / abuse review only.
  const fwd = request.headers.get("x-forwarded-for");
  const sourceIp = fwd ? fwd.split(",")[0]?.trim() ?? null : null;
  const userAgent = (request.headers.get("user-agent") || "").slice(0, 500);

  const saved = await saveApiAccessRequest({
    name,
    email,
    company,
    website,
    use_case: useCase,
    volume,
    description,
    source_ip: sourceIp,
    user_agent: userAgent || null,
  });

  if (!saved.ok) {
    console.error("saveApiAccessRequest failed:", saved.reason);
    return NextResponse.json(
      { ok: false, error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }

  // Best-effort operator notification.
  try {
    const result = await sendApiAccessRequestNotification({
      requestId: saved.id,
      name,
      email,
      company,
      website,
      useCase,
      volume,
      description,
    });
    if (!result.ok) {
      console.warn("sendApiAccessRequestNotification:", result.reason);
    }
  } catch (err) {
    console.warn("sendApiAccessRequestNotification error:", err);
  }

  return NextResponse.json({ ok: true, requestId: saved.id });
}
