import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogStore } from "@/components/features/blog/store/blogStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, User } from "lucide-react";
import { blogPosts } from "../utils/blogPosts";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

export default function BlogPost() {
  const { slug } = useParams();
  const { currentPost, fetchPostBySlug, loading } = useBlogStore();

  useEffect(() => {
    if (slug) fetchPostBySlug(slug);
  }, [fetchPostBySlug, slug]);

  const generatedFallback =
    typeof window !== "undefined" && slug
      ? (() => {
          try {
            const savedPosts = JSON.parse(
              window.localStorage.getItem("plan-it-generated-blog-posts") ||
                "[]",
            );
            return savedPosts.find(
              (post: { slug: string }) => post.slug === slug,
            );
          } catch {
            return undefined;
          }
        })()
      : undefined;

  const fallbackPost = slug
    ? blogPosts.find((post) => post.slug === slug)
    : undefined;
  const post = currentPost ?? generatedFallback ?? fallbackPost;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading article...
      </div>
    );
  if (!post) return <div>Article not found</div>;

  return (
    <article className="max-w-4xl mx-auto px-6 py-20">
      <BreadcrumbHeader
        title={post.title}
        subtitle={post.excerpt}
        items={[
          { label: "Home", to: "/" },
          { label: "Blog", to: "/blog" },
          { label: post.title },
        ]}
      />

      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-96 object-cover rounded-3xl mb-10"
      />

      <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> {post.author}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />{" "}
          {new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="px-4 py-1 bg-primary-100 text-primary-500 rounded-full text-xs font-medium">
          {post.category}
        </div>
      </div>

      <h1 className="text-5xl font-semibold leading-tight mb-10 text-primary-500">
        {post.title}
      </h1>

      <div className="prose prose-lg max-w-none prose-headings:text-primary-500 prose-a:text-accent">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
