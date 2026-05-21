import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, MapPinned, Sparkles } from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { blogPosts } from "@/components/utils/blogPosts";

const ideas = [
  [
    "Weekend City Break",
    "Build a short premium itinerary around two anchor experiences.",
  ],
  [
    "Food Trail",
    "Map local neighborhoods by cuisine, lunch spots, and evening tastings.",
  ],
  [
    "Scenic Loop",
    "Plan a route that balances viewpoints, rest stops, and hidden gems.",
  ],
];

export default function TravelIdeasPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <div
      className={`min-h-screen px-4 py-12 ${
        isDark
          ? "bg-linear-to-br from-[#050505] via-[#0d0d0d] to-[#1b140e]"
          : "bg-linear-to-br from-primary-50 to-white"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <BreadcrumbHeader
          title="Travel Ideas"
          subtitle="Fresh ways to structure a trip before you commit to dates or destinations."
          items={[{ label: "Home", to: "/" }, { label: "Travel Ideas" }]}
          dark={isDark}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {ideas.map(([title, text], index) => {
            const icon = [Sparkles, Flame, MapPinned][index] ?? Sparkles;
            const Icon = icon;

            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-3xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
                  isDark
                    ? "border-amber-200/20 bg-white/4"
                    : "border-white/50 bg-white"
                }`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
                  <Icon size={22} />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-primary-500">
                  {title}
                </h2>
                <p className={isDark ? "text-white" : "text-gray-600"}>
                  {text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className={`mt-8 rounded-3xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-8 ${
            isDark
              ? "border-amber-200/20 bg-white/4"
              : "border-white/50 bg-white"
          }`}
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
                From the Journal
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-primary-500">
                Travel posts that can shape a trip idea
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.06 }}
                className={`overflow-hidden rounded-2xl border ${
                  isDark
                    ? "border-white/10 bg-white/5"
                    : "border-gray-100 bg-white"
                }`}
              >
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary-500">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-primary-500">
                    {post.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                  >
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-medium text-primary-500 hover:underline"
                  >
                    Read article
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
