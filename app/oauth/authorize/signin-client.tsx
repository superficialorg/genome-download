"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SigninClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    const trimmed = email.trim().toLowerCase();
    try {
      const res = await fetch("/api/portal/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const body = await readJson(res);
      if (!res.ok || body.ok === false) {
        throw new Error(typeof body.error === "string" ? body.error : "Could not send code.");
      }
      setEmail(trimmed);
      setStep("code");
      setMessage("If that email has a Genome Computer order, a code is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const body = await readJson(res);
      if (!res.ok || body.ok === false) {
        throw new Error(typeof body.error === "string" ? body.error : "Invalid or expired code.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "h-11 rounded-full border border-border bg-background px-4 text-[14px] text-foreground outline-none focus:border-foreground/40";
  const buttonClass =
    "rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground disabled:opacity-40";

  return (
    <div className="flex flex-col gap-4">
      {step === "email" ? (
        <form onSubmit={requestCode} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            required
          />
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Sending..." : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="flex flex-col gap-3">
          <input
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className={`${inputClass} font-mono tracking-[0.2em]`}
            required
          />
          <button type="submit" disabled={busy || code.length !== 6} className={buttonClass}>
            {busy ? "Verifying..." : "Continue"}
          </button>
        </form>
      )}
      {message && <p className="m-0 text-center text-[13px] leading-5 text-muted-foreground">{message}</p>}
      {error && <p className="m-0 text-center text-[13px] leading-5 text-red-600">{error}</p>}
    </div>
  );
}

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}
