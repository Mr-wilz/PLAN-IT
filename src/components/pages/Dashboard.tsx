import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/components/features/auth/store/authStore";
import { Calendar, MapPin, DollarSign, Trash2 } from "lucide-react";
import { supabase } from "@/components/services/supabase";
import ItineraryDocument from "@/components/shared/ItineraryDocument";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

type StoredItinerary = {
  id: number;
  user_id: string;
  title: string;
  destination: string;
  planning_date?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  budget?: string;
  status?: string;
  itinerary_json?: {
    title?: string;
    summary?: string;
    hotels?: Array<{
      name: string;
      type: string;
      priceRange: string;
      reason: string;
    }>;
    days?: Array<{
      day: number;
      title: string;
      tips?: string;
      activities?: string[];
      meals?: string[];
    }>;
  };
  created_at?: string;
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [itineraries, setItineraries] = useState<StoredItinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<StoredItinerary | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clearAllError, setClearAllError] = useState("");
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    const fetchItineraries = async () => {
      if (!user?.id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load itineraries:", error.message);
      }

      const storageKey = `plan-it-itineraries-${user.id}`;
      let cachedItineraries: StoredItinerary[] = [];

      try {
        cachedItineraries = JSON.parse(
          localStorage.getItem(storageKey) || "[]",
        );
      } catch (storageError) {
        console.error("Failed to read cached itineraries:", storageError);
      }

      const combined = [...(data || []), ...cachedItineraries].reduce(
        (items: Map<number, StoredItinerary>, trip: StoredItinerary) => {
          const existing = items.get(trip.id) || { id: trip.id };
          items.set(trip.id, { ...existing, ...trip });
          return items;
        },
        new Map<number, StoredItinerary>(),
      );

      setItineraries(Array.from(combined.values()));
      setLoading(false);
    };

    fetchItineraries();
  }, [user]);

  const handleDeleteTrip = async (id: number) => {
    setItineraries((previous) => previous.filter((trip) => trip.id !== id));

    const { error } = await supabase.from("itineraries").delete().eq("id", id);
    if (error) console.error("Failed to delete itinerary:", error.message);

    if (user?.id) {
      try {
        const storageKey = `plan-it-itineraries-${user.id}`;
        const cachedItineraries = JSON.parse(
          localStorage.getItem(storageKey) || "[]",
        );
        const nextItems = Array.isArray(cachedItineraries)
          ? cachedItineraries.filter((trip: StoredItinerary) => trip.id !== id)
          : [];
        localStorage.setItem(storageKey, JSON.stringify(nextItems));
      } catch (storageError) {
        console.error("Failed to update cached itineraries:", storageError);
      }
    }
  };

  const handleConfirmClearAllTrips = async () => {
    if (!user?.id) return;

    const email = user.email;
    if (!email) {
      setClearAllError("Unable to verify account email. Please sign in again.");
      return;
    }

    if (!confirmPassword.trim()) {
      setClearAllError("Please enter your password to continue.");
      return;
    }

    setClearingAll(true);
    setClearAllError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: confirmPassword,
    });

    if (authError) {
      setClearAllError("Password is incorrect. Please try again.");
      setClearingAll(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("itineraries")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      setClearAllError("Failed to clear trips. Please try again.");
      setClearingAll(false);
      return;
    }

    setItineraries([]);
    setSelected(null);

    try {
      const storageKey = `plan-it-itineraries-${user.id}`;
      localStorage.removeItem(storageKey);
    } catch (storageError) {
      console.error("Failed to clear cached itineraries:", storageError);
    }

    setConfirmPassword("");
    setShowClearAllModal(false);
    setClearingAll(false);
  };

  const formatItineraryText = (it: StoredItinerary) => {
    const data = it.itinerary_json || {};
    const lines: string[] = [];
    lines.push(
      (data.title as string) || it.title || it.destination || "Itinerary",
    );
    if (data.summary) {
      lines.push("\nSummary:");
      lines.push(data.summary as string);
    }

    if (data.hotels && data.hotels.length) {
      lines.push("\nHotels:");
      data.hotels.forEach((h) => {
        lines.push(`- ${h.name} (${h.type}) — ${h.priceRange}`);
        if (h.reason) lines.push(`  Reason: ${h.reason}`);
      });
    }

    if (data.days && data.days.length) {
      lines.push("\nDays:");
      data.days.forEach((d) => {
        lines.push(`\nDay ${d.day}: ${d.title}`);
        if (d.tips) lines.push(`  Tips: ${d.tips}`);
        if (d.activities && d.activities.length)
          lines.push(`  Activities: ${d.activities.join(", ")}`);
        if (d.meals && d.meals.length)
          lines.push(`  Meals: ${d.meals.join(", ")}`);
      });
    }

    lines.push("\nGenerated by Plan-It");
    return lines.join("\n");
  };

  const formatItineraryHTML = (it: StoredItinerary) => {
    const data = it.itinerary_json || {};
    const title =
      (data.title as string) || it.title || it.destination || "Itinerary";
    let html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>${title}</title></head><body>`;
    html += `<h1>${title}</h1>`;
    if (data.summary) html += `<h2>Summary</h2><p>${data.summary}</p>`;
    if (data.hotels && data.hotels.length) {
      html += `<h2>Hotels</h2><ul>`;
      data.hotels.forEach((h) => {
        html += `<li><strong>${h.name}</strong> (${h.type}) — ${h.priceRange}`;
        if (h.reason) html += `<div>Reason: ${h.reason}</div>`;
        html += `</li>`;
      });
      html += `</ul>`;
    }
    if (data.days && data.days.length) {
      html += `<h2>Days</h2>`;
      data.days.forEach((d) => {
        html += `<h3>Day ${d.day}: ${d.title}</h3>`;
        if (d.tips) html += `<p><strong>Tips:</strong> ${d.tips}</p>`;
        if (d.activities && d.activities.length)
          html += `<p><strong>Activities:</strong> ${d.activities.join(", ")}</p>`;
        if (d.meals && d.meals.length)
          html += `<p><strong>Meals:</strong> ${d.meals.join(", ")}</p>`;
      });
    }
    html += `<footer><p>Generated by Plan-It</p></footer></body></html>`;
    return html;
  };

  const downloadBlob = (content: BlobPart, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = (it: StoredItinerary) => {
    const filename = `${(it.title || it.destination || "itinerary").replace(/[^a-zA-Z0-9-_\.]/g, "_").slice(0, 60)}.txt`;
    const text = formatItineraryText(it);
    downloadBlob(text, "text/plain;charset=utf-8", filename);
  };

  const handleDownloadDoc = (it: StoredItinerary) => {
    const filename = `${(it.title || it.destination || "itinerary").replace(/[^a-zA-Z0-9-_\.]/g, "_").slice(0, 60)}.doc`;
    const html = formatItineraryHTML(it);
    // Many word processors accept HTML saved with .doc
    downloadBlob(html, "application/msword;charset=utf-8", filename);
  };

  return (
    <div
      className={`dashboard-page min-h-screen px-4 py-12 ${
        isDark
          ? "bg-linear-to-br from-[#030303] via-[#0b0b0b] to-[#1a140d]"
          : "bg-linear-to-br from-primary-50 to-white"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <BreadcrumbHeader
          title="Dashboard"
          subtitle="Review your trips, manage saved itineraries, and clear everything with confirmation when needed."
          items={[{ label: "Home", to: "/" }, { label: "Dashboard" }]}
          dark={isDark}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-bold text-primary-500">
            Dashboard
          </h1>
          <p className={`mb-8 ${isDark ? "text-white" : "text-gray-600"}`}>
            Welcome back,{" "}
            {(user?.user_metadata?.full_name as string) || "Traveler"}!
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: "Total Trips", value: itineraries.length },
            {
              label: "Planned",
              value: itineraries.filter((trip) => trip.status === "Planned")
                .length,
            },
            {
              label: "In Progress",
              value: itineraries.filter((trip) => trip.status === "In Progress")
                .length,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-3xl border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl ${
                isDark
                  ? "border-amber-200/20 bg-white/4"
                  : "border-white/30 bg-white/75"
              }`}
            >
              <p
                className={`mb-2 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
              >
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-primary-500">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`dashboard-trips-shell rounded-3xl border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl ${
            isDark
              ? "border-amber-200/20 bg-white/4"
              : "border-white/30 bg-white/70"
          }`}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-primary-500">
                Your Trips
              </h2>
              <p
                className={`mt-1 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
              >
                Square, glassy cards for each itinerary.
              </p>
            </div>
            <button
              onClick={() => {
                setClearAllError("");
                setConfirmPassword("");
                setShowClearAllModal(true);
              }}
              disabled={itineraries.length === 0}
              className={`inline-flex items-center rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                itineraries.length === 0
                  ? "cursor-not-allowed border-gray-300/60 bg-gray-200/70 text-gray-500"
                  : isDark
                    ? "border-red-300/40 bg-red-500/15 text-red-200 hover:bg-red-500/25"
                    : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              Clear All Trips
            </button>
          </div>

          {loading ? (
            <p
              className={`py-10 text-center ${isDark ? "text-white" : "text-gray-500"}`}
            >
              Loading...
            </p>
          ) : itineraries.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {itineraries.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`dashboard-trip-card flex min-h-96 flex-col justify-between rounded-[28px] border p-4 shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-2xl ${
                    isDark
                      ? "border-amber-200/20 bg-white/4"
                      : "border-white/40 bg-white/80"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-500">
                          {trip.title || trip.destination}
                        </h3>
                        <p
                          className={`mt-1 text-xs ${isDark ? "text-white" : "text-gray-600"}`}
                        >
                          A quick overview of your saved itinerary.
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          trip.status === "Planned"
                            ? isDark
                              ? "bg-primary-500/20 text-primary-300"
                              : "bg-primary-100 text-primary-500"
                            : isDark
                              ? "bg-primary-600/20 text-primary-300"
                              : "bg-primary-200/70 text-primary-700"
                        }`}
                      >
                        {trip.status || "Saved"}
                      </span>
                    </div>

                    <div
                      className={`dashboard-trip-meta space-y-2 rounded-2xl p-3 ${
                        isDark ? "bg-white/4" : "bg-white/70"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm ${isDark ? "text-white" : "text-gray-700"}`}
                      >
                        <MapPin size={16} className="shrink-0" />
                        <span>{trip.destination}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-sm ${isDark ? "text-white" : "text-gray-700"}`}
                      >
                        <Calendar size={16} className="shrink-0" />
                        <span>
                          {trip.start_date || "-"} - {trip.end_date || "-"}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-sm ${isDark ? "text-white" : "text-gray-700"}`}
                      >
                        <DollarSign size={16} className="shrink-0" />
                        <span>{trip.budget || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => setSelected(trip)}
                      className="flex-1 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="btn-delete inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p
              className={`py-10 text-center ${isDark ? "text-white" : "text-gray-500"}`}
            >
              No trips yet.{" "}
              <a href="/planner" className="text-primary-500 hover:underline">
                Create your first trip!
              </a>
            </p>
          )}
        </motion.div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              className={`dashboard-modal w-full max-w-4xl rounded-2xl p-6 shadow-xl ${
                isDark
                  ? "border border-amber-200/20 bg-[#0b0b0b]/95"
                  : "bg-white"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary-500">
                    {selected.title || selected.destination}
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                  >
                    {selected.start_date || "-"} - {selected.end_date || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selected.itinerary_json && (
                    <>
                      <button
                        onClick={() => handleDownloadTxt(selected)}
                        className="rounded-2xl border px-3 py-2 text-sm font-medium bg-white/90 hover:bg-white"
                      >
                        Download TXT
                      </button>
                      <button
                        onClick={() => handleDownloadDoc(selected)}
                        className="rounded-2xl border px-3 py-2 text-sm font-medium bg-white/90 hover:bg-white"
                      >
                        Download DOC
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className={
                      isDark
                        ? "text-white/70 hover:text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-1">
                {selected.itinerary_json ? (
                  <ItineraryDocument
                    title={selected.itinerary_json.title || selected.title}
                    summary={selected.itinerary_json.summary}
                    destination={selected.destination}
                    budget={selected.budget}
                    planningDate={selected.planning_date || selected.created_at}
                    startDate={selected.start_date}
                    endDate={selected.end_date}
                    duration={selected.duration}
                    hotels={selected.itinerary_json.hotels}
                    days={selected.itinerary_json.days}
                  />
                ) : (
                  <p
                    className={`text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                  >
                    No generated itinerary stored for this trip.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {showClearAllModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div
              className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                isDark
                  ? "border-amber-200/20 bg-[#0b0b0b]/95"
                  : "border-white/40 bg-white"
              }`}
            >
              <h3 className="text-xl font-semibold text-primary-500">
                Clear All Trips
              </h3>
              <p
                className={`mt-2 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
              >
                This will permanently delete all your trips from the database.
                Enter your password to confirm.
              </p>

              <label className="mt-5 block">
                <span
                  className={`mb-2 block text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-700"
                  }`}
                >
                  Password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleConfirmClearAllTrips();
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                    isDark
                      ? "border-amber-200/30 bg-white/6 text-white placeholder:text-white/50 focus:border-primary-300"
                      : "border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 focus:border-primary-400"
                  }`}
                  placeholder="Enter your account password"
                />
              </label>

              {clearAllError && (
                <p className="mt-3 text-sm text-red-500">{clearAllError}</p>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    if (clearingAll) return;
                    setShowClearAllModal(false);
                    setClearAllError("");
                    setConfirmPassword("");
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    isDark
                      ? "border-amber-200/30 bg-white/6 text-white hover:bg-white/10"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleConfirmClearAllTrips()}
                  disabled={clearingAll}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {clearingAll ? "Deleting..." : "Delete All"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
