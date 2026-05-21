import { motion } from "framer-motion";
import { Mail, MessageSquare, PhoneCall } from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen px-4 py-12 ${
        isDark
          ? "bg-linear-to-br from-[#050505] via-[#101010] to-[#1b140e]"
          : "bg-linear-to-br from-primary-50 to-white"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <BreadcrumbHeader
          title="Contact Plan-It"
          subtitle="Reach out for partnerships, product inquiries, or travel collaboration ideas."
          items={[{ label: "Home", to: "/" }, { label: "Contact" }]}
          dark={isDark}
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
              isDark
                ? "border-amber-200/20 bg-white/4"
                : "border-white/50 bg-white"
            }`}
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary-500">
              Get in touch
            </h2>
            <div className="space-y-4">
              {[
                [Mail, "Email", "hello@plan-it.app"],
                [PhoneCall, "Partnerships", "+1 (555) 014-2026"],
                [MessageSquare, "Response time", "Within 1-2 business days"],
              ].map(([Icon, label, value]) => (
                <div
                  key={label as string}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
                      {label as string}
                    </p>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                    >
                      {value as string}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className={`rounded-3xl border p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
              isDark
                ? "border-amber-200/20 bg-white/4"
                : "border-white/50 bg-white"
            }`}
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary-500">
              Partnership notes
            </h2>
            <p className={isDark ? "text-white" : "text-gray-600"}>
              Tell us what you’d like to build, and we’ll route it to the right
              team.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Hotel integrations",
                "Travel content collaborations",
                "Destination campaigns",
                "Product co-marketing",
              ].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}
                >
                  <p
                    className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
