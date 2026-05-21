import { motion } from "framer-motion";
import { CheckCircle2, Gem, Layers3 } from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const reasons = [
  [
    "One workspace",
    "Plan routes, maps, trips, and reading without switching tools.",
  ],
  [
    "Premium feel",
    "Warm gold accents, glossy glass, and calmer visual rhythm.",
  ],
  ["Faster planning", "Move from inspiration to itinerary with less friction."],
];

export default function WhyPlanItPage() {
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
          title="Why Plan-It"
          subtitle="A travel planner designed to feel polished, focused, and easy to come back to."
          items={[{ label: "Home", to: "/" }, { label: "Why Plan-It" }]}
          dark={isDark}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map(([title, text], index) => {
            const Icon = [Layers3, Gem, CheckCircle2][index] ?? CheckCircle2;

            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-3xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
                  isDark
                    ? "border-amber-200/20 bg-white/4"
                    : "border-white/50 bg-white"
                }`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
                  <Icon size={22} />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-primary-500">
                  {title}
                </h2>
                <p className={isDark ? "text-white" : "text-gray-600"}>
                  {text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
