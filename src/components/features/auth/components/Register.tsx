import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "@/components/features/auth/store/authStore";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  User,
  X,
} from "lucide-react";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { useTheme } from "@/components/context/ThemeContext";

const slides = [
  {
    title: "Interactive Maps",
    description:
      "Explore destinations with interactive maps, local attractions, and real-time navigation for your journey.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=1400&fit=crop",
    accent: "Map-based planning",
  },
  {
    title: "Plan Smarter Trips",
    description:
      "Build travel plans around the places you care about most, then adjust them as your itinerary changes.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=1400&fit=crop",
    accent: "Personalized routes",
  },
  {
    title: "Everything in One Place",
    description:
      "Keep destinations, notes, and route ideas close while you create a trip that feels organized from the start.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=1400&fit=crop",
    accent: "Trip workspace",
  },
  {
    title: "Travel With Confidence",
    description:
      "See the journey before you go with a visual travel board that keeps every idea easy to revisit.",
    image:
      "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=1200&h=1400&fit=crop",
    accent: "Visual planning",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? slides.length - 1 : previous - 1,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res = await register(fullName, userName, email, password);
      if (res.success) {
        if (res.data?.session) {
          toast.success("Registered and signed in");
          navigate("/dashboard");
        } else {
          toast.success("Registered — check your email to confirm");
        }
      } else {
        const msg = (res.error || "Registration failed").toString();
        if (/rate limit/i.test(msg))
          toast.error("Email rate limit exceeded — try again later");
        else toast.error(msg);
        setError(msg);
      }
    } catch (err) {
      toast.error("Registration error");
      setError("Registration error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserName("");
    setPassword("");
    setError("");
    setLoading(false);
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          isDark
            ? "bg-linear-to-br from-[#070707] via-[#111111] to-[#1a140d]"
            : "bg-linear-to-br from-primary-50 to-white"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md rounded-2xl p-8 text-center shadow-xl ${
            isDark
              ? "border border-amber-200/15 bg-[#111111]/90 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <h1 className="text-3xl font-bold text-primary-500 mb-3">
            Register closed
          </h1>
          <p className={`mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
            The registration form has been removed from view.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition"
            >
              Reopen form
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-400 hover:bg-primary-500 text-white font-semibold transition"
            >
              Go home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 mt-24 sm:p-6 ${
        isDark
          ? "bg-linear-to-br from-[#070707] via-[#111111] to-[#1a140d]"
          : "bg-linear-to-br from-primary-50 via-white to-primary-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-6xl overflow-hidden rounded-4xl shadow-[0_25px_80px_rgba(15,23,42,0.12)] ring-1 ${
          isDark
            ? "border border-amber-200/15 bg-[#111111]/95 ring-white/10"
            : "bg-white ring-black/5"
        }`}
      >
        <div className="px-5 pt-5 sm:px-8 sm:pt-8">
          <BreadcrumbHeader
            title="Register"
            subtitle="Create an account to save itineraries, routes, and blog preferences."
            items={[{ label: "Home", to: "/" }, { label: "Register" }]}
            dark={isDark}
          />
        </div>

        <div className="grid min-h-170 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative min-h-95 overflow-hidden bg-slate-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-black/65 via-black/35 to-black/15" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,145,76,0.35),transparent_48%)]" />
                <div className="absolute inset-0 flex items-center p-6 sm:p-8">
                  <div className="max-w-sm text-white">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-white/85 backdrop-blur-sm">
                      <MapPin size={14} /> {slides[currentSlide].accent}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="mt-4 text-sm sm:text-base leading-6 text-white/90">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-500/85 text-white shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-primary-600"
                aria-label="Previous slide"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "w-8 bg-primary-400"
                        : "w-2 bg-white/70 hover:bg-white"
                    }`}
                    aria-label={`Go to ${slide.title}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-500/85 text-white shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-primary-600"
                aria-label="Next slide"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
            <div className="w-full max-w-md">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-500">
                  Register
                </h1>
                <p
                  className={`mt-2 ${isDark ? "text-white/70" : "text-gray-600"}`}
                >
                  Join Plan-It today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm ${
                      isDark
                        ? "border border-red-400/20 bg-red-500/10 text-red-200"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDark ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    />
                    <input
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:ring-2 ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                          : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-100"
                      }`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDark ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    User Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    />
                    <input
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:ring-2 ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                          : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-100"
                      }`}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="john_doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDark ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:ring-2 ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                          : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-100"
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDark ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-12 outline-none focus:ring-2 ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                          : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-100"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-white/60" : "text-gray-500"
                      }`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      isDark ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-12 outline-none focus:ring-2 ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                          : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-100"
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-white/60" : "text-gray-500"
                      }`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-3 font-semibold text-white transition hover:bg-primary-600 disabled:bg-gray-400"
                  >
                    {loading ? "Registering…" : "Register"}
                    <ArrowRight size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold transition ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-primary-200 text-primary-900 hover:bg-primary-300"
                  }`}
                >
                  Cancel <X size={18} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
