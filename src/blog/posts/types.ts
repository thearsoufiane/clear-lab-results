// Shared types for blog posts. Kept dependency-free so both post modules and
// the route files can import it without pulling in React.

export type BlogPostMeta = {
  /** URL segment: /blog/<slug> */
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD); drives <time> + newest-first sorting. */
  date: string;
  /** Content category shown as the breadcrumb/tag, e.g. "Engineering". */
  category: string;
  /** Short summary for the index card + meta description fallback. */
  excerpt: string;
  /** Optional estimated reading time, in minutes. */
  readingMinutes?: number;
  /** Optional SEO overrides; fall back to title/excerpt when absent. */
  metaTitle?: string;
  ogDescription?: string;
};
