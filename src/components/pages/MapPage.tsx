import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import { motion } from "framer-motion";
import {
  LocateFixed,
  Loader,
  MapPin,
  Search,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  CornerDownRight,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/components/features/auth/store/authStore";
import { supabase } from "@/components/services/supabase";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

type MapFocus = {
  lat: number;
  lng: number;
  zoom: number;
};

function MapFocusController({ focus }: { focus: MapFocus | null }) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;
    map.flyTo([focus.lat, focus.lng], focus.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [focus, map]);

  return null;
}

export default function MapPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([
    {
      name: "Paris, France",
      lat: 48.8566,
      lng: 2.3522,
      description: "City of Light - Famous for the Eiffel Tower",
    },
    {
      name: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
      description: "Modern metropolis with rich culture",
    },
    {
      name: "New York, USA",
      lat: 40.7128,
      lng: -74.006,
      description: "The city that never sleeps",
    },
  ]);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [routeGeo, setRouteGeo] = useState<any | null>(null);
  const [routeSummary, setRouteSummary] = useState<{
    distance: number;
    duration: number;
    legs?: Array<{ distance: number; duration: number }>;
  } | null>(null);
  const [routeSteps, setRouteSteps] = useState<Array<string>>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const [provider, setProvider] = useState<string>(
    mapboxToken ? "mapbox" : "osrm",
  );

  const { user } = useAuthStore();
  const [savingName, setSavingName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [routeMessage, setRouteMessage] = useState("");
  const [mode, setMode] = useState<"driving" | "walking" | "cycling">(
    "driving",
  );

  const hasLocations = locations.length > 0;
  const defaultCenter = useMemo<[number, number]>(() => [20, 0], []);

  const searchLocation = async (event: FormEvent) => {
    event.preventDefault();

    const cleanedQuery = query.trim();
    if (!cleanedQuery) return;

    setLoading(true);
    setSearchError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(cleanedQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as Array<{
        display_name: string;
        lat: string;
        lon: string;
      }>;

      if (!data.length) {
        throw new Error("Location not found");
      }

      const result = data[0];
      const newLocation: Location = {
        name: result.display_name.split(",")[0] || cleanedQuery,
        lat: Number(result.lat),
        lng: Number(result.lon),
        description: result.display_name,
      };

      setLocations((previous) => {
        const alreadyExists = previous.some(
          (location) =>
            Math.abs(location.lat - newLocation.lat) < 0.0001 &&
            Math.abs(location.lng - newLocation.lng) < 0.0001,
        );

        return alreadyExists ? previous : [newLocation, ...previous];
      });

      setFocus({ lat: newLocation.lat, lng: newLocation.lng, zoom: 17 });
    } catch {
      setSearchError("Location not found. Try a more specific place name.");
    } finally {
      setLoading(false);
    }
  };

  const planRoute = async () => {
    if (locations.length < 2) return;

    // Build coordinates in lon,lat;lon,lat order for OSRM
    const coords = locations
      .map((l) => `${l.lng.toFixed(6)},${l.lat.toFixed(6)}`)
      .join(";");

    try {
      setLoading(true);
      setRouteGeo(null);
      setRouteSummary(null);

      let data: any = null;

      if (provider === "mapbox" && mapboxToken) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coords}?overview=full&geometries=geojson&steps=true&access_token=${mapboxToken}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Mapbox routing failed");
        data = await res.json();

        if (!data?.routes?.length) throw new Error("No route found");

        const route = data.routes[0];
        setRouteGeo(route.geometry);
        const legs = route.legs?.map((leg: any) => ({
          distance: leg.distance,
          duration: leg.duration,
        }));
        // flatten steps instructions
        const steps: string[] = [];
        route.legs?.forEach((leg: any, li: number) => {
          leg.steps?.forEach((step: any, si: number) => {
            const instr =
              step?.maneuver?.instruction ||
              step?.name ||
              `${step?.maneuver?.type || ""}`;
            steps.push(instr);
          });
        });

        setRouteSteps(steps);
        setRouteSummary({
          distance: route.distance,
          duration: route.duration,
          legs,
        });

        if (route.geometry?.coordinates?.length) {
          const mid =
            route.geometry.coordinates[
              Math.floor(route.geometry.coordinates.length / 2)
            ];
          setFocus({ lat: mid[1], lng: mid[0], zoom: 13 });
        }
      } else {
        const url = `https://router.project-osrm.org/route/v1/${mode}/${coords}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Routing failed");
        data = await res.json();

        if (!data?.routes?.length) throw new Error("No route found");

        const route = data.routes[0];
        setRouteGeo(route.geometry);
        const legs = route.legs?.map((leg: any) => ({
          distance: leg.distance,
          duration: leg.duration,
        }));

        // OSRM steps may include maneuver and name
        const steps: string[] = [];
        route.legs?.forEach((leg: any) => {
          leg.steps?.forEach((step: any) => {
            const instr =
              step?.maneuver?.instruction ||
              step?.name ||
              `${step?.maneuver?.type || ""}`;
            steps.push(instr);
          });
        });

        setRouteSteps(steps);
        setRouteSummary({
          distance: route.distance,
          duration: route.duration,
          legs,
        });

        if (route.geometry?.coordinates?.length) {
          const mid =
            route.geometry.coordinates[
              Math.floor(route.geometry.coordinates.length / 2)
            ];
          setFocus({ lat: mid[1], lng: mid[0], zoom: 13 });
        }
      }
    } catch (err) {
      console.error(err);
      setSearchError(
        "Failed to compute route. Try fewer stops or try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setRouteGeo(null);
    setRouteSummary(null);
    setSearchError("");
  };

  // Drag handlers for reordering stops
  const onDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
  };

  const onDropStop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from)) return;
    const to = index;
    if (from === to) return;

    setLocations((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });

    // replan route after short delay
    setTimeout(() => void planRoute(), 300);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exportGPX = () => {
    if (!routeGeo?.coordinates?.length) return;
    const coords = routeGeo.coordinates;
    const header = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="plan-it">\n<trk><name>Planned Route</name><trkseg>`;
    const pts = coords
      .map((c: any) => `<trkpt lat="${c[1]}" lon="${c[0]}"></trkpt>`)
      .join("\n");
    const footer = `</trkseg></trk>\n</gpx>`;
    const gpx = `${header}\n${pts}\n${footer}`;
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "route.gpx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    const el = document.getElementById("map-canvas");
    if (!el) return;

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const pdf = new jsPDF({ orientation: "landscape" });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("map-route.pdf");
  };

  const fetchSavedRoutes = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("saved_routes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSavedRoutes(data || []);
    } catch (err) {
      console.error("Failed to fetch saved routes:", err);
    }
  };

  const saveRoute = async () => {
    if (!user?.id) {
      setRouteMessage("Please sign in to save routes.");
      return;
    }
    if (!routeGeo) return;
    const payload = {
      user_id: user.id,
      name: savingName || `Route ${new Date().toLocaleString()}`,
      geojson: routeGeo,
      stops: locations,
      summary: routeSummary,
    };

    try {
      const { error } = await supabase.from("saved_routes").insert(payload);
      if (error) throw error;
      setShowSaveModal(false);
      setSavingName("");
      setRouteMessage("Route saved.");
      await fetchSavedRoutes();
    } catch (err) {
      console.error("Failed to save route:", err);
      setRouteMessage("Failed to save route.");
    }
  };

  const loadSavedRoute = (r: any) => {
    if (!r) return;
    setLocations(r.stops || []);
    setRouteGeo(r.geojson || null);
    setRouteSummary(r.summary || null);
    setRouteSteps([]);
    setRouteMessage(`Loaded ${r.name}`);
    if (r.geojson?.coordinates?.length) {
      const mid =
        r.geojson.coordinates[Math.floor(r.geojson.coordinates.length / 2)];
      setFocus({ lat: mid[1], lng: mid[0], zoom: 12 });
    }
  };

  const deleteSavedRoute = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from("saved_routes")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setRouteMessage("Deleted");
      await fetchSavedRoutes();
    } catch (err) {
      console.error("Failed to delete route:", err);
      setRouteMessage("Failed to delete saved route.");
    }
  };

  useEffect(() => {
    void fetchSavedRoutes();
  }, [user?.id]);

  return (
    <div
      className={`min-h-screen px-4 py-12 ${
        isDark
          ? "bg-linear-to-br from-[#030303] via-[#0b0b0b] to-[#1a140d]"
          : "bg-linear-to-br from-primary-50 to-white"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <BreadcrumbHeader
          title="Destinations Map"
          subtitle="Type any place, city, or address and jump straight to it at street-level zoom."
          items={[{ label: "Home", to: "/" }, { label: "Map" }]}
          dark={isDark}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="sr-only">
            <h1>Destinations Map</h1>
          </div>
        </motion.div>
        {routeMessage && (
          <div className="mt-4 text-sm text-primary-500">{routeMessage}</div>
        )}

        {/* Saved Routes */}
        {savedRoutes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 rounded-2xl border p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] ${
              isDark
                ? "border-amber-200/20 bg-white/4"
                : "border-white/40 bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-500">
                Saved Routes
              </h3>
            </div>
            <div className="space-y-3">
              {savedRoutes.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.created_at}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadSavedRoute(r)}
                      className="rounded-md border px-3 py-1 text-sm"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteSavedRoute(r.id)}
                      className="rounded-md border px-3 py-1 text-sm text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {showSaveModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div
              className={`w-full max-w-md rounded-2xl border p-6 ${isDark ? "bg-[#0b0b0b]/95 border-amber-200/20" : "bg-white border-white/30"}`}
            >
              <h3 className="text-lg font-semibold text-primary-500">
                Save Route
              </h3>
              <p
                className={`mt-2 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
              >
                Give this route a name to save it to your account.
              </p>
              <input
                value={savingName}
                onChange={(e) => setSavingName(e.target.value)}
                className="mt-4 w-full rounded-lg border px-3 py-2"
                placeholder="My Weekend Route"
              />
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="rounded-lg border px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void saveRoute()}
                  className="rounded-lg bg-primary-500 px-4 py-2 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <motion.form
          onSubmit={searchLocation}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 flex flex-col gap-3 rounded-2xl border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:flex-row md:items-center ${
            isDark
              ? "border-amber-200/20 bg-white/4"
              : "border-white/40 bg-white/80"
          }`}
        >
          <div className="relative flex-1">
            <Search
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-white/70" : "text-gray-400"}`}
              size={18}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a location, landmark, or full address"
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition ${
                isDark
                  ? "border-amber-200/20 bg-white/6 text-white placeholder:text-white/55 focus:border-primary-300"
                  : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-primary-400"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <LocateFixed size={16} />
            )}
            {loading ? "Locating..." : "Find on Map"}
          </button>
        </motion.form>

        {searchError && (
          <p className="mb-6 text-sm text-red-500">{searchError}</p>
        )}

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500">Routing:</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="osrm">OSRM (free)</option>
              {mapboxToken && <option value="mapbox">Mapbox (token)</option>}
            </select>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="driving">Driving</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={!routeGeo}
              className="rounded-xl border px-3 py-2 text-sm font-medium transition"
            >
              Save Route
            </button>
            <button
              onClick={() => exportGPX()}
              disabled={!routeGeo}
              className="rounded-xl border px-3 py-2 text-sm font-medium transition"
            >
              Export GPX
            </button>
            <button
              onClick={() => void exportPDF()}
              disabled={!routeGeo}
              className="rounded-xl border px-3 py-2 text-sm font-medium transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.12)] ${
            isDark
              ? "border-amber-200/20 bg-[#0b0b0b]/80"
              : "border-white/40 bg-white"
          }`}
        >
          <div id="map-canvas" className="h-[70vh] min-h-105">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin" size={40} />
              </div>
            ) : (
              <MapContainer
                center={defaultCenter}
                zoom={3}
                maxZoom={19}
                minZoom={2}
                zoomControl={false}
                style={{ height: "100%" }}
              >
                <MapFocusController focus={focus} />
                <ZoomControl position="bottomright" />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                  maxZoom={19}
                />
                {locations.map((location, idx) => (
                  <Marker key={idx} position={[location.lat, location.lng]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-semibold mb-1">{location.name}</h3>
                        <p className="text-sm text-gray-600">
                          {location.description}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {routeGeo && (
                  <GeoJSON
                    data={routeGeo}
                    style={{ color: "#d4af37", weight: 5, opacity: 0.9 }}
                  />
                )}
              </MapContainer>
            )}
          </div>
        </motion.div>

        {/* Locations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-8 rounded-2xl border p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ${
            isDark
              ? "border-amber-200/20 bg-white/4"
              : "border-white/40 bg-white"
          }`}
        >
          <h2 className="mb-6 text-2xl font-semibold text-primary-500">
            Searched Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hasLocations ? (
              <>
                {locations.map((location, idx) => (
                  <div
                    key={`${location.name}-${idx}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDropStop(e, idx)}
                    className={`rounded-xl border p-4 text-left transition ${
                      isDark
                        ? "border-amber-200/20 bg-white/4 hover:bg-white/10"
                        : "border-gray-200 bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="text-primary-500" size={20} />
                      <h3 className="text-lg font-semibold text-primary-500">
                        {location.name}
                      </h3>
                    </div>
                    <p
                      className={`text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                    >
                      {location.description}
                    </p>
                  </div>
                ))}

                {routeSummary && (
                  <div
                    className={`mt-6 rounded-lg p-3 ${isDark ? "bg-white/6" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Total</div>
                        <div className="text-lg font-semibold text-primary-500">
                          {(routeSummary.distance / 1000).toFixed(1)} km •{" "}
                          {Math.round(routeSummary.duration / 60)} min
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {routeSummary.legs?.length || 0} legs
                      </div>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      {routeSummary.legs?.map((leg, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div>Leg {i + 1}</div>
                          <div>
                            {(leg.distance / 1000).toFixed(1)} km •{" "}
                            {Math.round(leg.duration / 60)} min
                          </div>
                        </div>
                      ))}
                    </div>
                    {routeSteps.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-primary-500">
                          Turn-by-turn directions
                        </summary>
                        <ol className="mt-2 list-decimal list-inside text-sm text-gray-600 space-y-2">
                          {routeSteps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p
                className={`text-sm ${isDark ? "text-white" : "text-gray-600"}`}
              >
                No location saved yet. Search above to pin your first place.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
