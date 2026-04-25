"use client";

import { useState } from "react";

type UseCase =
  | "clinical"
  | "consumer"
  | "research"
  | "agentic"
  | "pharma"
  | "other";

type Volume =
  | "lt_100"
  | "100_to_1000"
  | "1000_to_10000"
  | "gt_10000"
  | "unsure";

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "clinical", label: "Clinical / diagnostic" },
  { value: "consumer", label: "Consumer app" },
  { value: "research", label: "Research platform" },
  { value: "agentic", label: "Agent / AI tool" },
  { value: "pharma", label: "Pharma / pharmacogenomics" },
  { value: "other", label: "Other" },
];

const VOLUMES: { value: Volume; label: string }[] = [
  { value: "lt_100", label: "Under 100 / year" },
  { value: "100_to_1000", label: "100 – 1,000 / year" },
  { value: "1000_to_10000", label: "1,000 – 10,000 / year" },
  { value: "gt_10000", label: "10,000+ / year" },
  { value: "unsure", label: "Not sure yet" },
];

type FormState = {
  name: string;
  email: string;
  company: string;
  website: string;
  useCase: UseCase | "";
  volume: Volume | "";
  description: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  useCase: "",
  volume: "",
  description: "",
};

function isComplete(s: FormState) {
  return Boolean(
    s.name.trim() &&
      s.email.trim() &&
      s.company.trim() &&
      s.useCase &&
      s.volume &&
      s.description.trim()
  );
}

export function ApiAccessForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!isComplete(form)) {
      setError("Please complete all required fields.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div
        id="request-access"
        className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-background p-6 text-center"
      >
        <p className="m-0 text-[15px] font-semibold text-foreground">
          Request received.
        </p>
        <p className="m-0 text-[14px] text-muted-foreground">
          We&rsquo;ll be in touch within a few business days. In the meantime,
          questions can go to{" "}
          <a
            href="mailto:api@genome.computer"
            className="text-foreground underline underline-offset-2"
          >
            api@genome.computer
          </a>
          .
        </p>
      </div>
    );
  }

  const disabled = status === "submitting";

  return (
    <form
      id="request-access"
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-background p-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em] text-foreground">
          Request access
        </h3>
        <p className="m-0 text-[13px] text-muted-foreground">
          Private beta. We review every request personally and reply within a
          few business days.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            type="text"
            required
            disabled={disabled}
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground/40"
          />
        </Field>
        <Field label="Work email" required>
          <input
            type="email"
            required
            disabled={disabled}
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground/40"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Company" required>
          <input
            type="text"
            required
            disabled={disabled}
            autoComplete="organization"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className="rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground/40"
          />
        </Field>
        <Field label="Website (optional)">
          <input
            type="url"
            disabled={disabled}
            inputMode="url"
            placeholder="https://"
            autoComplete="url"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className="rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground/40"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Use case" required>
          <select
            required
            disabled={disabled}
            value={form.useCase}
            onChange={(e) => set("useCase", e.target.value as UseCase)}
            className="rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground/40"
          >
            <option value="" disabled>
              Select…
            </option>
            {USE_CASES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Expected volume" required>
          <select
            required
            disabled={disabled}
            value={form.volume}
            onChange={(e) => set("volume", e.target.value as Volume)}
            className="rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground/40"
          >
            <option value="" disabled>
              Select…
            </option>
            {VOLUMES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="What are you building?" required>
        <textarea
          required
          disabled={disabled}
          rows={4}
          maxLength={2000}
          placeholder="A few sentences on the product, the user, and why genome data is the right primitive."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="resize-y rounded-[calc(var(--radius-lg)-2px)] border border-border bg-background px-3 py-2 text-[14px] leading-[1.5] text-foreground outline-none focus:border-foreground/40"
        />
      </Field>

      {error ? (
        <p className="m-0 text-[13px] text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-[12px] text-muted-foreground">
          By requesting access you agree to our{" "}
          <a
            href="/terms"
            className="text-foreground underline underline-offset-2"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-foreground underline underline-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {disabled ? "Sending…" : "Request access"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
        {required ? <span className="text-foreground"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
