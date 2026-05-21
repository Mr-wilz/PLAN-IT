import { motion } from "framer-motion";
import { Compass, Globe2, Layers3 } from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

export default function AboutUsPage() {
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
          title="About Plan-It"
          subtitle="A premium trip planning workspace built for ideas, routes, and beautiful travel storytelling."
          items={[{ label: "Home", to: "/" }, { label: "About Us" }]}
          dark={isDark}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Purpose",
              text: "Make travel planning feel calm, visual, and refined.",
            },
            {
              icon: Globe2,
              title: "Experience",
              text: "Turn destinations, maps, and journals into one fluid flow.",
            },
            {
              icon: Layers3,
              title: "Style",
              text: "Keep the interface glossy, warm, and easy to use.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
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
                  {item.title}
                </h2>
                <p className={isDark ? "text-white" : "text-gray-600"}>
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
