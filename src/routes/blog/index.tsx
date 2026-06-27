import { createFileRoute, Link } from "@tanstack/react-router";
import { BlogHeader, BlogFooter, formatDate, tokens } from "@/blog/blog-ui";
import { getAllPosts } from "@/blog/posts";

const { teal, tealDim, ink, inkSoft, inkFaint, bgSoft, line } = tokens;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The labread Blog — how we build, test, and think about your bloodwork | labread" },
      {
        name: "description",
        content:
          "Engineering deep-dives, testing methodology, and build-in-public notes from the team building labread — for clinicians and users evaluating how it works.",
      },
      { property: "og:title", content: "The labread Blog" },
      {
        property: "og:description",
        content:
          "How we build and test labread: engineering deep-dives, methodology, and build-in-public notes.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen" style={{ background: tokens.bg }}>
      <BlogHeader />

      <main className="max-w-[720px] mx-auto px-7 pt-14 pb-10">
        {/* Eyebrow */}
        <div
          className="text-xs uppercase tracking-[0.16em] mb-5"
          style={{ color: tealDim }}
        >
          Blog
        </div>

        {/* Title */}
        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          How we build labread
        </h1>

        <p
          className="text-lg leading-relaxed pb-7 mb-10 border-b"
          style={{ color: inkSoft, borderColor: line }}
        >
          Engineering deep-dives, testing methodology, and build-in-public notes
          from the team. If you're deciding whether to trust labread with your
          bloodwork, this is the work behind it.
        </p>

        {/* Post list */}
        <div className="flex flex-col gap-4">
          {posts.map(({ meta }) => (
            <Link
              key={meta.slug}
              to="/blog/$slug"
              params={{ slug: meta.slug }}
              className="no-underline rounded-2xl p-6 block transition-colors"
              style={{ background: bgSoft, border: `1px solid ${line}` }}
            >
              <div className="flex items-center gap-3 mb-3 text-xs uppercase tracking-[0.14em]">
                <span style={{ color: tealDim }}>{meta.category}</span>
                <span style={{ color: inkFaint }}>&middot;</span>
                <time dateTime={meta.date} style={{ color: inkFaint }}>
                  {formatDate(meta.date)}
                </time>
                {meta.readingMinutes ? (
                  <>
                    <span style={{ color: inkFaint }}>&middot;</span>
                    <span style={{ color: inkFaint }}>{meta.readingMinutes} min read</span>
                  </>
                ) : null}
              </div>

              <h2
                className="font-serif tracking-tight mb-2 leading-[1.18]"
                style={{ fontSize: "clamp(1.35rem, 3.6vw, 1.7rem)", color: ink }}
              >
                {meta.title}
              </h2>

              <p className="leading-relaxed mb-3" style={{ color: inkSoft, fontSize: "1.02rem" }}>
                {meta.excerpt}
              </p>

              <span className="text-sm font-semibold" style={{ color: teal }}>
                Read post &rarr;
              </span>
            </Link>
          ))}
        </div>

        <BlogFooter />
      </main>
    </div>
  );
}
