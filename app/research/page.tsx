import Link from "next/link";
import { SiteShell, SiteHeader } from "@/components/site-shell";
import { POSTS } from "@/lib/posts";

export const metadata = {
  title: "Research — The Genome Computer Company",
};

export default function ResearchPage() {
  return (
    <SiteShell>
      <SiteHeader compact />
      <article className="mt-10 flex flex-col gap-10 sm:mt-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">
            Research
          </h1>
        </div>

        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {POSTS.map((post, i) => (
            <li key={post.slug} className="m-0 p-0">
              <Link
                href={`/research/${post.slug}`}
                className="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-background p-5 text-foreground no-underline transition-all hover:border-foreground/20 hover:shadow-[0_1px_3px_0_rgb(0_0_0/0.05)] sm:px-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                  <h2 className="m-0 text-[20px] font-semibold leading-[1.3] tracking-[-0.01em]">
                    {post.title}
                  </h2>
                  {i === 0 ? (
                    <span className="inline-flex items-center rounded-full bg-border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
                      New
                    </span>
                  ) : null}
                </div>
                <p className="m-0 text-[13px] text-muted-foreground">
                  {post.date}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </SiteShell>
  );
}
