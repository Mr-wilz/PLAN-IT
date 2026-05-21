import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { generateItinerary } from "@/components/services/ai";
import { useAuthStore } from "@/components/features/auth/store/authStore";
import { supabase } from "@/components/services/supabase";
import { MapPin, Calendar, DollarSign, Loader } from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import ItineraryDocument from "@/components/shared/ItineraryDocument";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

type ItineraryLocation = {
  lat: number;
  lng: number;
  label: string;
};

const defaultMapCenter: LatLngExpression = [20, 0];

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateOffset = (dateString: string, offsetDays: number) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + offsetDays);
  return toDateInputValue(date);
};

const geocodeDestination = async (destination: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
      destination,
    )}`,
  );

  if (!response.ok) {
    throw new Error("Could not load destination coordinates.");
  }

  const results: Array<{ lat: string; lon: string; display_name: string }> =
    await response.json();

  if (!results.length) {
    throw new Error("Destination not found on the map.");
  }

  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    label: results[0].display_name,
  } satisfies ItineraryLocation;
};

export default function Planner() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [destination, setDestination] = useState("");
  const [planningDate] = useState(getTodayDateString());
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [duration, setDuration] = useState("5");
  const [budget, setBudget] = useState("moderate");
  const [interests, setInterests] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<{
    title: string;
    summary: string;
    hotels?: Array<{
      name: string;
      type: string;
      priceRange: string;
      reason: string;
    }>;
    days?: Array<{ day: number; title: string; tips: string }>;
  } | null>(null);
  const [itineraryLocation, setItineraryLocation] =
    useState<ItineraryLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [formHeight, setFormHeight] = useState<number | null>(null);
  const endDate = startDate
    ? getDateOffset(startDate, Math.max(parseInt(duration || "1", 10) - 1, 0))
    : "";

  useEffect(() => {
    const updateFormHeight = () => {
      setFormHeight(formCardRef.current?.offsetHeight ?? null);
    };

    updateFormHeight();

    if (!formCardRef.current || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateFormHeight);
      return () => window.removeEventListener("resize", updateFormHeight);
    }

    const observer = new ResizeObserver(updateFormHeight);
    observer.observe(formCardRef.current);
    window.addEventListener("resize", updateFormHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFormHeight);
    };
  }, [itinerary]);

  const interestOptions = [
    "Adventure",
    "Culture",
    "Food",
    "Nature",
    "History",
    "Beach",
    "Mountains",
    "Shopping",
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handlePlanTrip = async () => {
    if (!destination || interests.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setItineraryLocation(null);
    setLocationLoading(false);
    try {
      const result = await generateItinerary({
        destination,
        budget,
        duration: parseInt(duration),
        interests,
      });
      setItinerary(result);

      const storageKey = user?.id ? `plan-it-itineraries-${user.id}` : null;
      const persistToLocalStorage = (item: {
        id: number;
        user_id: string;
        title: string;
        destination: string;
        planning_date: string;
        start_date: string;
        end_date: string;
        duration: number;
        budget: string;
        status: string;
        itinerary_json: typeof result;
        created_at: string;
      }) => {
        if (!storageKey) return;

        try {
          const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
          const nextItems = Array.isArray(existing)
            ? [
                ...existing.filter(
                  (trip: { id: number }) => trip.id !== item.id,
                ),
                item,
              ]
            : [item];
          localStorage.setItem(storageKey, JSON.stringify(nextItems));
        } catch (storageError) {
          console.error("Failed to cache itinerary locally:", storageError);
        }
      };

      if (user?.id) {
        const { data: savedRow, error: saveError } = await supabase
          .from("itineraries")
          .insert({
            user_id: user.id,
            destination,
            start_date: startDate,
            end_date: endDate,
            status: "Planned",
          })
          .select("id, user_id, destination, status, created_at")
          .single();

        if (saveError) {
          console.error("Failed to save itinerary:", saveError.message);
          persistToLocalStorage({
            id: Date.now(),
            user_id: user.id,
            title: result.title || `Trip to ${destination}`,
            destination,
            planning_date: planningDate,
            start_date: startDate,
            end_date: endDate,
            duration: parseInt(duration),
            budget,
            status: "Planned",
            itinerary_json: result,
            created_at: new Date().toISOString(),
          });
        } else {
          persistToLocalStorage({
            id: savedRow?.id || Date.now(),
            user_id: user.id,
            title: result.title || `Trip to ${destination}`,
            destination,
            planning_date: planningDate,
            start_date: startDate,
            end_date: endDate,
            duration: parseInt(duration),
            budget,
            status: savedRow?.status || "Planned",
            itinerary_json: result,
            created_at: savedRow?.created_at || new Date().toISOString(),
          });
        }
      }

      setLocationLoading(true);
      try {
        const location = await geocodeDestination(destination);
        setItineraryLocation(location);
      } catch {
        setItineraryLocation(null);
      } finally {
        setLocationLoading(false);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate itinerary. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
        isDark
          ? "bg-linear-to-br from-[#050505] via-[#101010] to-[#1a140d]"
          : "bg-linear-to-br from-primary-50 to-white"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <BreadcrumbHeader
          title="Trip Planner"
          subtitle="Build a trip, generate an itinerary, and pin the destination on the map."
          items={[{ label: "Home", to: "/" }, { label: "Planner" }]}
          dark={isDark}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Form */}
          <motion.div
            ref={formCardRef}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className={`rounded-2xl p-8 w-full shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-colors duration-300 ${
              isDark
                ? "border border-amber-200/20 bg-white/4"
                : "border border-white/40 bg-white"
            } ${
              itinerary
                ? "lg:col-span-1 lg:max-w-none"
                : "lg:col-span-2 lg:max-w-3xl lg:mx-auto"
            }`}
          >
            <h2 className="mb-6 text-2xl font-semibold text-primary-500">
              Plan Your Trip
            </h2>

            <div className="space-y-4">
              {error && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${isDark ? "bg-red-500/15 text-red-200" : "bg-red-50 text-red-700"}`}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                >
                  Destination
                </label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-3 h-5 w-5 ${isDark ? "text-white/45" : "text-gray-400"}`}
                  />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where do you want to go?"
                    className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? "border-amber-200/20 bg-white/6 text-white placeholder:text-white/40" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"}`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                >
                  Duration (days)
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-3 h-5 w-5 ${isDark ? "text-white/45" : "text-gray-400"}`}
                  />
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="30"
                    className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? "border-amber-200/20 bg-white/6 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                >
                  Travel start date
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-3 h-5 w-5 ${isDark ? "text-white/45" : "text-gray-400"}`}
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? "border-amber-200/20 bg-white/6 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                >
                  Budget
                </label>
                <div className="relative">
                  <DollarSign
                    className={`absolute left-3 top-3 h-5 w-5 ${isDark ? "text-white/45" : "text-gray-400"}`}
                  />
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? "border-amber-200/20 bg-white/6 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                  >
                    <option value="budget">Budget</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`mb-3 block text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                >
                  Interests
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`rounded-lg p-2 font-medium transition ${
                        interests.includes(interest)
                          ? "bg-primary-500 text-white"
                          : isDark
                            ? "border border-amber-200/20 bg-white/6 text-white hover:bg-white/10"
                            : "bg-primary-100 text-primary-900 hover:bg-primary-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePlanTrip}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-2 font-semibold text-white transition hover:bg-primary-600 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Planning...
                  </>
                ) : (
                  "Plan My Trip"
                )}
              </button>
            </div>
          </motion.div>

          {/* Itinerary Display */}
          {itinerary && (
            <motion.div
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              style={formHeight ? { height: formHeight } : undefined}
              className={`lg:col-span-1 flex h-full min-h-0 flex-col overflow-hidden rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-colors duration-300 ${
                isDark
                  ? "border border-amber-200/20 bg-white/4"
                  : "border border-white/40 bg-white"
              }`}
            >
              <div className="h-0 flex-1 min-h-0 overflow-y-auto pr-1">
                <ItineraryDocument
                  title={itinerary.title}
                  summary={itinerary.summary}
                  destination={destination}
                  budget={budget}
                  planningDate={planningDate}
                  startDate={startDate}
                  endDate={endDate}
                  duration={duration}
                  hotels={itinerary.hotels}
                  days={itinerary.days}
                />
              </div>
            </motion.div>
          )}
        </div>

        {itinerary && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className={`mt-8 overflow-hidden rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-colors duration-300 ${
              isDark
                ? "border border-amber-200/20 bg-white/4"
                : "border border-white/40 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-500">
                  Itinerary Location
                </h2>
                <p
                  className={`mt-1 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                >
                  {itineraryLocation?.label || destination}
                </p>
              </div>
              {locationLoading && (
                <div
                  className={`flex items-center gap-2 text-sm ${isDark ? "text-white" : "text-gray-500"}`}
                >
                  <Loader className="animate-spin" size={16} />
                  Loading map
                </div>
              )}
            </div>

            <div
              className={`h-96 w-full overflow-hidden rounded-xl border ${isDark ? "border-amber-200/20" : "border-gray-200"}`}
            >
              {itineraryLocation ? (
                <MapContainer
                  center={[itineraryLocation.lat, itineraryLocation.lng]}
                  zoom={10}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <CircleMarker
                    center={[itineraryLocation.lat, itineraryLocation.lng]}
                    radius={12}
                    pathOptions={{
                      color: "#b9914c",
                      fillColor: "#b9914c",
                      fillOpacity: 0.85,
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-semibold mb-1">
                          {itineraryLocation.label}
                        </h3>
                        <p
                          className={`text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                        >
                          Generated itinerary destination
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                </MapContainer>
              ) : (
                <div
                  className={`flex h-full items-center justify-center text-center px-6 ${isDark ? "bg-white/4" : "bg-gray-50"}`}
                >
                  <div>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                    >
                      {locationLoading
                        ? "Locating the destination on the map..."
                        : "Map location unavailable"}
                    </p>
                    <p
                      className={`mt-2 text-sm ${isDark ? "text-white/75" : "text-gray-500"}`}
                    >
                      {locationLoading
                        ? "Please wait while we place the itinerary destination."
                        : "The itinerary is ready, but we could not resolve the location."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
