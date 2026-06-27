import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BlogHeader,
  BlogFooter,
  BlogCTA,
  formatDate,
  tokens,
} from "@/blog/blog-ui";
import { getPostBySlug, getAllPosts } from "@/blog/posts";

const { teal, tealDim, ink, inkSoft, inkFaint, bgSoft, line } = tokens;

export const Route = createFileRoute("/blog/$slug")({
  // 404 unknown slugs at the route level (SSR-correct status).
  loader: ({ params }) => {
    if (!getPostBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const post = getPostBySlug(params.slug)?.meta;
    const url = `https://labread.health/blog/${params.slug}`;
    if (!post) {
      return { links: [{ rel: "canonical", href: url }] };
    }
    return {
      meta: [
        { title: post.metaTitle ?? `${post.title} | labread` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.ogDescription ?? post.excerpt },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.date },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = getPostBySlug(slug);

  // The loader already 404s unknown slugs; this satisfies the type and guards
  // against any client-side edge case.
  if (!post) return null;

  const { meta, Content } = post;
  const others = getAllPosts().filter((p) => p.meta.slug !== slug);

  return (
    <div className="min-h-screen" style={{ background: tokens.bg }}>
      <BlogHeader />

      <article className="max-w-[720px] mx-auto px-7 pt-14 pb-10">
        {/* Breadcrumb */}
        <div
          className="text-xs uppercase tracking-[0.16em] mb-5"
          style={{ color: tealDim }}
        >
          <Link to="/blog" className="no-underline" style={{ color: tealDim }}>
            Blog
          </Link>{" "}
          &middot; {meta.category}
        </div>

        {/* Title */}
        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          {meta.title}
        </h1>

        {/* Byline / meta line */}
        <div
          className="text-sm pb-7 mb-10 border-b flex flex-wrap items-center gap-2"
          style={{ color: inkFaint, borderColor: line }}
        >
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          {meta.readingMinutes ? (
            <>
              <span>&middot;</span>
              <span>{meta.readingMinutes} min read</span>
            </>
          ) : null}
        </div>

        {/* Body */}
        <Content />

        {/* Sign-up CTA */}
        <BlogCTA />

        {/* More from the blog — only when other posts exist */}
        {others.length > 0 && (
          <div className="border-t pt-9 mt-12" style={{ borderColor: line }}>
            <h2
              className="font-serif tracking-tight mb-5"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
            >
              More from the blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {others.map(({ meta: m }) => (
                <Link
                  key={m.slug}
                  to="/blog/$slug"
                  params={{ slug: m.slug }}
                  className="no-underline rounded-xl p-5 block transition-colors"
                  style={{ background: bgSoft, border: `1px solid ${line}` }}
                >
                  <span
                    className="font-semibold block mb-1"
                    style={{ color: ink, fontSize: "1.02rem" }}
                  >
                    {m.title}
                  </span>
                  <span className="text-sm" style={{ color: inkFaint }}>
                    {m.excerpt}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to index */}
        <div className="mt-11">
          <Link
            to="/blog"
            className="text-sm font-semibold no-underline"
            style={{ color: teal }}
          >
            &larr; All posts
          </Link>
        </div>

        <BlogFooter />
      </article>
    </div>
  );
}
