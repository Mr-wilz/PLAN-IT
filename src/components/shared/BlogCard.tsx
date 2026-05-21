import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  image_url?: string;
  image?: string;
  published_at?: string;
  date?: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const image = post.image_url ?? post.image ?? "";
  const publishedAt = post.published_at ?? post.date ?? "";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass rounded-3xl overflow-hidden group cursor-pointer"
    >
      <div
        className="h-52 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 px-3 py-1 text-xs font-medium bg-white/90 text-primary-500 rounded-full">
          {post.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          {new Date(publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>

        <h3 className="text-xl font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-primary-500 transition">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6">
          {post.excerpt}
        </p>

        <a
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:gap-3 transition"
        >
          Read more <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
