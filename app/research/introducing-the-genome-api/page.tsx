import type { Metadata } from "next";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { getPost } from "@/lib/posts";
import { PostContent } from "./content";

const SLUG = "introducing-the-genome-api";
const post = getPost(SLUG)!;

const POST_DESCRIPTION =
  "The first genome sequencing API. Order a kit programmatically, receive a .genome bundle and a VCF, and build genetic intelligence into anything. Now in private beta.";
const POST_URL = `https://genome.computer/research/${SLUG}`;

export const metadata: Metadata = {
  title: `${post.title} — The Genome Computer Company`,
  description: POST_DESCRIPTION,
  alternates: { canonical: POST_URL },
  openGraph: {
    type: "article",
    url: POST_URL,
    title: post.title,
    description: POST_DESCRIPTION,
    siteName: "The Genome Computer Company",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Genome Computer Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@genomecomputer",
    creator: "@genomecomputer",
    title: post.title,
    description: POST_DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "The Genome Computer Company" }],
  },
};

export default function IntroducingTheGenomeApiPage() {
  return (
    <SiteShell>
      <div className="pt-6 sm:pt-10">
        <SiteHeader compact />
      </div>
      <div className="mb-8 mt-6 flex flex-col items-center text-center sm:mt-10">
        <p className="m-0 font-mono text-[13px] text-muted-foreground">
          Research
        </p>
        <h1 className="m-0 mt-2 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[28px]">
          {post.title}
        </h1>
        <p className="m-0 mt-3 font-mono text-[15px] text-foreground">
          {post.date}
        </p>
      </div>

      <PostContent />
    </SiteShell>
  );
}
