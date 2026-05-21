import {
  Hero,
  PlanWithUs,
  ToKnow,
  MostVisitedPlaces,
} from "@/components/features/landing";
import { lazy, Suspense } from "react";
import BlogCard from "../shared/BlogCard";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "../utils/blogPosts";
import DestinationFacts from "../shared/Destininationfacts";

const MapPage = lazy(() => import("@/components/pages/MapPage"));

export default function Home() {
  return (
    <>
      <Hero />
      <PlanWithUs />

      <ToKnow />
      <MostVisitedPlaces />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        }
      >
        <MapPage />
      </Suspense>

      <DestinationFacts />

      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-semibold tracking-tight text-primary-500">
                Travel Stories & Tips
              </h2>
              <p className="text-xl text-gray-600 mt-3">
                Insights from our community and AI travel experts
              </p>
            </div>
            <a
              href="/blog"
              className="text-primary-500 font-medium flex items-center gap-2 hover:gap-3 transition"
            >
              View all articles <ArrowRight />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
