import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { loadJobByToken } from "@/lib/conversion-jobs";
import { UploadClient } from "./upload-client";

export const metadata: Metadata = {
  title: "Upload your DNA file — The Genome Computer Company",
};

// Always fetch fresh — tokens expire, status changes.
export const dynamic = "force-dynamic";

export default async function UploadPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { orderId } = await params;
  const { t } = await searchParams;

  if (!t) notFound();

  const job = await loadJobByToken(orderId, t);
  if (!job) notFound();

  // Different status → different UI. If they already uploaded, confirm that;
  // if the job already finished or failed, say so clearly.
  if (job.status === "awaiting_upload") {
    return (
      <SiteShell>
        <div className="pt-6 sm:pt-10">
          <SiteHeader compact />
        </div>
        <div className="mb-6 mt-8 flex flex-col items-center text-center sm:mt-10">
          <p className="m-0 font-mono text-[13px] text-muted-foreground">
            Order {orderId.slice(0, 8)}
          </p>
          <h1 className="m-0 mt-2 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[28px]">
            Upload your DNA file
          </h1>
          <p className="m-0 mt-3 max-w-[520px] text-[15px] text-muted-foreground">
            Your file is encrypted in transit and at rest. It goes directly
            from your browser to our storage — never touches our web server.
            Accepted: <span className="font-mono">.txt</span>,{" "}
            <span className="font-mono">.vcf</span>,{" "}
            <span className="font-mono">.vcf.gz</span>. Up to 25 GB.
          </p>
        </div>
        <UploadClient orderId={orderId} token={t} />
      </SiteShell>
    );
  }

  // All the non-upload states render a simple status card.
  type NonUploadStatus = Exclude<typeof job.status, "awaiting_upload">;
  const statusLabel: Record<NonUploadStatus, string> = {
    pending: "Upload received — waiting for the converter",
    imputing: "Imputing your genome",
    annotating: "Annotating variants",
    ready: "Your bundle is ready — check your email",
    failed: "Conversion failed — we'll reach out",
  };

  return (
    <SiteShell>
      <div className="pt-6 sm:pt-10">
        <SiteHeader compact />
      </div>
      <div className="mb-6 mt-8 flex flex-col items-center text-center sm:mt-10">
        <p className="m-0 font-mono text-[13px] text-muted-foreground">
          Order {orderId.slice(0, 8)}
        </p>
        <h1 className="m-0 mt-2 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[28px]">
          {statusLabel[job.status as NonUploadStatus]}
        </h1>
        <p className="m-0 mt-3 max-w-[520px] text-[15px] text-muted-foreground">
          {job.status === "ready"
            ? "Your .genome bundle and the readmygenome skill are in your inbox. If you don't see them, check your spam folder or reply to the confirmation email."
            : job.status === "failed"
            ? "A real person will get in touch about your conversion shortly."
            : "You'll get an email the moment your bundle is ready. No need to keep this page open."}
        </p>
      </div>
    </SiteShell>
  );
}
