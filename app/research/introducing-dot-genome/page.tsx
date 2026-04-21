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
      <SiteHeader compact />
      <article className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <p className="m-0 text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
            Research
          </p>
          <h1 className="m-0 text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[32px]">
            {post.title}
          </h1>
          <p className="m-0 text-[13px] text-muted-foreground">{post.date}</p>
        </header>

        <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-muted-foreground">
          {/* Body content TK — will be supplied by author. */}
          <p className="m-0">
            Content coming soon.
          </p>
        </div>
      </article>
    </SiteShell>
  );
}
