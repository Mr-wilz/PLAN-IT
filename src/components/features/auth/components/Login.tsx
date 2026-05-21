import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "@/components/features/auth/store/authStore";
import { Mail, Lock, ArrowRight, X, User } from "lucide-react";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { useTheme } from "@/components/context/ThemeContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success("Login successful! Welcome back.");
        navigate("/dashboard");
      } else {
        const errorMsg = result.error || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Login failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
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
            Login closed
          </h1>
          <p className={`mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
            The login form has been removed from view.
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
      className={`min-h-screen flex items-center justify-center mt-8 p-4 ${
        isDark
          ? "bg-linear-to-br from-[#070707] via-[#111111] to-[#1a140d]"
          : "bg-linear-to-br from-primary-50 to-white"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <BreadcrumbHeader
          title=""
          items={[{ label: "Home", to: "/" }, { label: "Login" }]}
          dark={isDark}
        />

        <div
          className={`rounded-2xl p-8 shadow-xl ${
            isDark
              ? "border border-amber-200/15 bg-[#111111]/90 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <h1 className="text-3xl font-bold text-primary-500 mb-2">Login</h1>
          <p className={`mb-8 ${isDark ? "text-white/70" : "text-gray-600"}`}>
            Welcome back to Plan-It
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className={`rounded-lg p-3 text-sm ${
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
                Email
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-3 h-5 w-5 ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={`w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:ring-2 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                      : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  }`}
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
                  className={`absolute left-3 top-3 h-5 w-5 ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:ring-2 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-primary-500 focus:ring-primary-500/25"
                      : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Login"} <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-primary-200 hover:bg-primary-300 text-primary-900 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              Cancel <X size={18} />
            </button>
          </form>

          <p
            className={`mt-6 text-center ${isDark ? "text-white/70" : "text-gray-600"}`}
          >
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-primary-500 hover:underline font-semibold"
            >
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
