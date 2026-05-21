import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, RefreshCw, Search, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { generateDestinationAttractions } from "@/components/services/ai";
import GlassCard from "@/components/ui/GlassCard";
import { useTheme } from "@/components/context/ThemeContext";

interface Attraction {
  name: string;
  description: string;
  category: string;
  image_prompt: string;
}

interface Place {
  id: number;
  name: string;
  country: string;
  image: string;
  description: string;
}

const mostVisitedPlaces: Place[] = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=400&fit=crop",
    description:
      "The City of Light awaits with iconic landmarks and world-class cuisine.",
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=500&h=400&fit=crop",
    description:
      "Experience the perfect blend of ancient tradition and modern technology.",
  },
  {
    id: 3,
    name: "Barcelona",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=500&h=400&fit=crop",
    description:
      "Where Gaudí's architecture meets Mediterranean beaches and vibrant culture.",
  },
  {
    id: 4,
    name: "Dubai",
    country: "United Arab Emirates",
    image:
      "https://images.unsplash.com/photo-1512453333214-652ec28a7a0a?w=500&h=400&fit=crop",
    description:
      "Discover ultra-modern luxury and desert adventures in this desert oasis.",
  },
];

const buildImageUrl = (query: string) =>
  `https://source.unsplash.com/featured/900x700/?${encodeURIComponent(query)}`;

export default function MostVisitedPlaces() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    destination: string;
    summary: string;
    attractions: Attraction[];
  } | null>(null);
  const { theme } = useTheme();
  type DisplayPlace = Place | Attraction;

  const handleSearch = async () => {
    const destination = query.trim();

    if (!destination) {
      toast.error("Enter a destination to search");
      return;
    }

    setLoading(true);

    try {
      const result = await generateDestinationAttractions(destination);
      setSearchResults(result);
      toast.success(
        `Found ${result.attractions.length} attractions in ${result.destination}`,
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to generate attractions");
    } finally {
      setLoading(false);
    }
  };

  const displayedAttractions = searchResults?.attractions ?? mostVisitedPlaces;
  const isShowingSearchResults = Boolean(searchResults);

  const getImageCandidates = (query: string) => [
    buildImageUrl(`${query}`),
    `https://loremflickr.com/900/700/${encodeURIComponent(query)}`,
    `https://picsum.photos/seed/${encodeURIComponent(query)}//900/700`,
  ];

  return (
    <section
      className={`py-20 px-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#050505] text-white" : "bg-white text-slate-950"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h2
            className={`mb-4 text-5xl font-semibold tracking-tight ${
              theme === "dark" ? "text-white" : "text-primary-500"
            }`}
          >
            Most Visited Places
          </h2>
          <p
            className={`max-w-3xl text-xl ${
              theme === "dark" ? "text-white/75" : "text-gray-600"
            }`}
          >
            Where would you like to visit?
          </p>
          <p
            className={`max-w-3xl text-xl ${
              theme === "dark" ? "text-white/75" : "text-gray-600"
            }`}
          >
           Towns, cities, States, countries even continental regions
          </p>{" "}
        </motion.div>

        <div className="max-w-3xl mb-12">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                className={`absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  theme === "dark" ? "text-white/40" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void handleSearch();
                  }
                }}
                placeholder="Try Rome, Tokyo, Paris, Cape Town..."
                className={`w-full rounded-3xl border py-4 pl-14 pr-6 text-lg shadow-sm outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100 ${
                  theme === "dark"
                    ? "border-white/10 bg-white/5 text-white placeholder:text-white/35"
                    : "border-gray-200 bg-white text-slate-950 placeholder:text-gray-400"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSearch()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 rounded-3xl bg-primary-500 px-8 py-4 font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Search
            </button>
          </div>
        </div>

        {isShowingSearchResults && searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-10 rounded-3xl border p-6 shadow-sm backdrop-blur transition-colors duration-300 ${
              theme === "dark"
                ? "border-white/10 bg-white/5"
                : "border-primary-100 bg-white/80"
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p
                  className={`text-sm font-medium uppercase tracking-[0.2em] ${theme === "dark" ? "text-amber-200" : "text-primary-500"}`}
                >
                  Results for {searchResults.destination}
                </p>
                <h3
                  className={`mt-2 text-3xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {searchResults.destination}
                </h3>
                <p
                  className={`mt-3 max-w-3xl text-lg ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
                >
                  {searchResults.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchResults(null);
                  setQuery("");
                }}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  theme === "dark"
                    ? "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:text-primary-600"
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedAttractions.map((place: DisplayPlace, index) => {
            const imageUrl = isShowingSearchResults
              ? buildImageUrl(
                  `${(place as Attraction).image_prompt} travel landmark`,
                )
              : (place as Place).image;
            const title = place.name;

            return (
              <motion.div
                key={
                  isShowingSearchResults
                    ? `${title}-${index}`
                    : (place as Place).id
                }
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  className={`h-full flex flex-col overflow-hidden border transition-shadow duration-300 hover:shadow-2xl ${theme === "dark" ? "bg-white/5" : "bg-white"}`}
                >
                  <div className="mb-4 h-40 overflow-hidden rounded-xl">
                    <img
                      src={imageUrl}
                      alt={title}
                      data-fallbacks={JSON.stringify(
                        isShowingSearchResults
                          ? getImageCandidates(
                              (place as Attraction).image_prompt,
                            )
                          : [imageUrl, ...getImageCandidates(title)],
                      )}
                      data-fallback-idx={0}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                      onError={(event) => {
                        const el = event.currentTarget as HTMLImageElement & {
                          dataset: { [k: string]: string };
                        };
                        try {
                          const list = JSON.parse(
                            el.dataset.fallbacks || "[]",
                          ) as string[];
                          const idx = Number(el.dataset.fallbackIdx || "0");
                          const next = list[idx + 1];
                          if (next) {
                            el.dataset.fallbackIdx = String(idx + 1);
                            el.src = next;
                            return;
                          }
                        } catch (e) {
                          /* fall through */
                        }

                        el.src =
                          "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&h=700&fit=crop";
                      }}
                    />
                  </div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3
                      className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-primary-500"}`}
                    >
                      {title}
                    </h3>
                    {isShowingSearchResults && (
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600 capitalize">
                        {(place as Attraction).category}
                      </span>
                    )}
                  </div>
                  {isShowingSearchResults ? (
                    <p
                      className={`grow leading-relaxed ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
                    >
                      {(place as Attraction).description}
                    </p>
                  ) : (
                    <>
                      <div
                        className={`mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{(place as Place).country}</span>
                      </div>
                      <p
                        className={`grow ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
                      >
                        {(place as Place).description}
                      </p>
                    </>
                  )}
                  <a
                    href="/planner"
                    className="mt-4 inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
                  >
                    Plan this trip <span>→</span>
                  </a>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
