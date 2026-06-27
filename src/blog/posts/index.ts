// Blog post registry. To add a post: create a module under ./ exporting
// `meta: BlogPostMeta` + `Content: () => ReactNode`, then add it to the
// `posts` array below. Everything else (index listing, per-post routing, SEO
// meta) is derived from this registry.

import type { ReactNode } from "react";
import type { BlogPostMeta } from "./types";
import * as deterministicFlaggingBugs from "./deterministic-flagging-bugs";

export type BlogPost = {
  meta: BlogPostMeta;
  Content: () => ReactNode;
};

const posts: BlogPost[] = [
  { meta: deterministicFlaggingBugs.meta, Content: deterministicFlaggingBugs.Content },
];

/** All posts, newest first (ties broken by title for stability). */
export function getAllPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      b.meta.date.localeCompare(a.meta.date) ||
      a.meta.title.localeCompare(b.meta.title),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.meta.slug === slug);
}

export type { BlogPostMeta } from "./types";
