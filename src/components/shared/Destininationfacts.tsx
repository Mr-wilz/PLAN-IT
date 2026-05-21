import { useState } from "react";
import { generateDestinationFacts } from "@/components/services/ai";
import GlassCard from "@/components/ui/GlassCard";
import { MapPin, Loader2, Sparkles, RefreshCw, ImageOff } from "lucide-react";
import toast from "react-hot-toast";

export default function DestinationFacts() {
  const [destination, setDestination] = useState("");
  const [factsData, setFactsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleGetFacts = async () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    setLoading(true);
    setFactsData(null);
    setImageError(false);

    try {
      const result = await generateDestinationFacts(destination.trim());
      setFactsData(result);
      toast.success(`Found ${result.facts.length} facts about ${destination}!`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate facts");
    } finally {
      setLoading(false);
    }
  };

  // Multiple fallback image strategies
  const getImageUrl = () => {
    if (!factsData?.iconicImageQuery) return null;

    const query = encodeURIComponent(factsData.iconicImageQuery);

    return [
      `https://source.unsplash.com/featured/1200x600/?${query},landmark`,
      `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 10}/1200/600`,
      `https://source.unsplash.com/featured/1200x600/?${destination},travel`,
    ];
  };

  const imageUrl = getImageUrl()?.[0];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          
          <h2 className="text-5xl font-semibold text-primary-500 tracking-tight">
            Discover Hidden Facts + Iconic Views
          </h2>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-5 top-4 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGetFacts()}
                placeholder="e.g. Paris, Tokyo, New York, Machu Picchu..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-3xl text-lg focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleGetFacts}
              disabled={loading}
              className="px-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-3xl font-medium flex items-center gap-3 transition"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Get Facts"
              )}
            </button>
          </div>
        </div>

        {/* Results Card */}
        {factsData && (
          <GlassCard className="overflow-hidden">
            {/* Iconic Image Section */}
            <div className="relative h-80 md:h-96 w-full bg-gray-100">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={`Iconic view of ${destination}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-primary-100 to-gray-100">
                  <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">Beautiful image unavailable</p>
                  <p className="text-sm text-gray-400 mt-1">{destination}</p>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-white text-4xl font-semibold tracking-tight">
                  {destination}
                </h3>
              </div>
            </div>

            {/* Facts */}
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold flex items-center gap-3">
                  <Sparkles className="text-accent" />
                  Fascinating Facts
                </h3>
                <button
                  onClick={() => {
                    setFactsData(null);
                    setDestination("");
                  }}
                  className="text-sm flex items-center gap-2 text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="w-4 h-4" /> Try Another
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {factsData.facts.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/70 p-6 rounded-2xl border border-white/60 hover:border-primary-200 transition-all"
                  >
                    <span className="inline-block px-4 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-4">
                      {item.category}
                    </span>
                    <p className="text-gray-700 leading-relaxed text-[17px]">
                      {item.fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </section>
  );
}
