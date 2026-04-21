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
      <article className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">
            Research
          </h1>
        </div>

        <ul className="m-0 flex list-none flex-col gap-6 p-0">
          {POSTS.map((post) => (
            <li key={post.slug} className="m-0 p-0">
              <Link
                href={`/research/${post.slug}`}
                className="group flex flex-col gap-2 text-foreground no-underline"
              >
                <h2 className="m-0 text-[20px] font-semibold leading-[1.3] tracking-[-0.01em] transition-opacity group-hover:opacity-70">
                  {post.title}
                </h2>
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
