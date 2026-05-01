export type Post = {
  slug: string;
  title: string;
  date: string;
};

export const POSTS: Post[] = [
  {
    slug: "introducing-genome-computer-for-codex",
    title: "Genome Computer for Codex",
    date: "May 2026",
  },
  {
    slug: "introducing-the-genome-api",
    title: "It's time to build bio: introducing the Genome API",
    date: "April 2026",
  },
  {
    slug: "introducing-dot-genome",
    title: "Introducing .genome, the genome file designed for AI",
    date: "April 2026",
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
