export type Post = {
  slug: string;
  title: string;
  date: string;
};

export const POSTS: Post[] = [
  {
    slug: "introducing-dot-genome",
    title: "Introducing .genome, the genome file designed for AI.",
    date: "April 2026",
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
