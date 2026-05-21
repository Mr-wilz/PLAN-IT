import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useBlogStore } from "@/components/features/blog/store/blogStore";
import { useBlogGenerator } from "@/components/features/blog/hooks/useBlogGenerator";
import BlogCard from "../shared/BlogCard";
import { blogPosts as featuredBlogPosts } from "../utils/blogPosts";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { useTheme } from "@/components/context/ThemeContext";

type BlogPostCard = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url?: string;
  author?: string;
  published_at?: string;
};

export default function Blog() {
  const { posts, fetchPosts, loading } = useBlogStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { generatePost } = useBlogGenerator();
  const [generatedPosts, setGeneratedPosts] = useState<BlogPostCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const generatedPostsStorageKey = "plan-it-generated-blog-posts";

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    try {
      const savedPosts = window.localStorage.getItem(generatedPostsStorageKey);
      if (savedPosts) {
        setGeneratedPosts(JSON.parse(savedPosts));
      }
    } catch (storageError) {
      console.error("Failed to restore generated posts:", storageError);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        generatedPostsStorageKey,
        JSON.stringify(generatedPosts),
      );
    } catch (storageError) {
      console.error("Failed to save generated posts:", storageError);
    }
  }, [generatedPosts]);

  const visiblePosts = useMemo(() => {
    const combinedPosts: BlogPostCard[] = [
      ...generatedPosts,
      ...(posts as BlogPostCard[]),
      ...(featuredBlogPosts as BlogPostCard[]),
    ];

    return combinedPosts.reduce<BlogPostCard[]>((items, post) => {
      if (!items.some((existing) => existing.slug === post.slug)) {
        items.push(post);
      }

      return items;
    }, []);
  }, [generatedPosts, posts]);

  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / postsPerPage));
  const paginatedPosts = visiblePosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const handleGenerate = async () => {
    const topic = prompt(
      "What should the blog post be about? (e.g. 'Solo travel in Japan 2026')",
    ); // or use a nice modal
    if (!topic) return;
    const newPost = await generatePost(topic);
    if (!newPost) return;

    setGeneratedPosts((prev) => [
      {
        id: `generated-${Date.now()}`,
        slug: (newPost.title || topic)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        category: newPost.category,
        image_url: `https://source.unsplash.com/featured/1200x800/?travel,${encodeURIComponent(topic)}`,
        author: "Plan-It AI",
        published_at: new Date().toISOString(),
        ...prev,
      },
    ]);
    setCurrentPage(1);
  };

  return (
    <div
      className={`mx-auto max-w-7xl px-6 py-24 ${
        isDark ? "text-white" : "text-slate-950"
      }`}
    >
      <BreadcrumbHeader
        title="Travel Journal"
        subtitle="Stories, guides, and destination ideas curated for your next trip."
        items={[{ label: "Home", to: "/" }, { label: "Blog" }]}
        dark={isDark}
      />

      <section
        className={`mb-12 overflow-hidden rounded-4xl border p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl md:p-10 ${
          isDark
            ? "border-amber-200/20 bg-linear-to-br from-white/8 via-white/4 to-transparent"
            : "border-white/50 bg-linear-to-br from-white via-white to-primary-50"
        }`}
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-primary-500">
              Editorial travel notes
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">
              Travel stories designed like a premium magazine spread.
            </h1>
            <p
              className={`mt-5 max-w-2xl text-lg ${isDark ? "text-white/75" : "text-gray-600"}`}
            >
              Explore curated guides, route ideas, and generated travel pieces
              in a journal that feels distinct from the landing page.
            </p>
          </div>

          <div
            className={`rounded-3xl border p-5 ${isDark ? "border-amber-200/20 bg-[#0b0b0b]/70" : "border-white/60 bg-white/80"}`}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Curated", "Premium travel reads"],
                ["Generated", "AI-assisted posts"],
                ["Shortform", "Fast inspiration"],
                ["Guided", "Trip ideas and tips"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"}`}
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-primary-500">
                    {label}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20">Loading stories...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id ?? post.slug} post={post} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-10 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-primary-500 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
