import { SiteShell, SiteHeader } from "@/components/site-shell";
import { getPost } from "@/lib/posts";

const SLUG = "introducing-dot-genome";
const post = getPost(SLUG)!;

export const metadata = {
  title: `${post.title} — The Genome Computer Company`,
};

export default function IntroducingDotGenomePage() {
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

      <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-muted-foreground">
        {/* Body content TK — will be supplied by author. */}
        <p className="m-0">Content coming soon.</p>
      </div>
    </SiteShell>
  );
}
