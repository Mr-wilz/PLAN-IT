import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Compass,
  LucideIcon,
  Rocket,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

export default function CareersPage() {
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
          title="Careers"
          subtitle="Join us in building a travel platform that feels premium, calm, and useful."
          items={[{ label: "Home", to: "/" }, { label: "Careers" }]}
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
              Open Roles
            </h2>
            <p className={isDark ? "text-white" : "text-gray-600"}>
              We are currently building the team. If you want to collaborate,
              reach out through the contact flow in the footer.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                [
                  BriefcaseBusiness,
                  "Product",
                  "Shape premium features and travel workflows.",
                ],
                [
                  Compass,
                  "Design",
                  "Craft glossy, intuitive interfaces and motion.",
                ],
              ].map(([Icon, title, text], index) => {
                const IconComponent = Icon as LucideIcon;

                return (
                  <motion.div
                    key={title as string}
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
                      <IconComponent size={22} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-primary-500">
                      {title as string}
                    </h3>
                    <p className={isDark ? "text-white" : "text-gray-600"}>
                      {text as string}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                [
                  Rocket,
                  "Fast shipping",
                  "Small, focused teams that ship polished releases quickly.",
                ],
                [
                  Users2,
                  "Cross-functional",
                  "Work closely across design, product, and engineering.",
                ],
                [
                  ShieldCheck,
                  "High trust",
                  "Own real problems with a lot of autonomy and clarity.",
                ],
              ].map(([Icon, title, text], index) => {
                const IconComponent = Icon as LucideIcon;

                return (
                  <motion.div
                    key={title as string}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + index * 0.06 }}
                    className={`rounded-3xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
                      isDark
                        ? "border-amber-200/20 bg-white/4"
                        : "border-white/50 bg-white"
                    }`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
                      <IconComponent size={22} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-primary-500">
                      {title as string}
                    </h3>
                    <p className={isDark ? "text-white" : "text-gray-600"}>
                      {text as string}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div
              className={`rounded-3xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${isDark ? "border-amber-200/20 bg-white/4" : "border-white/50 bg-white"}`}
            >
              <h2 className="mb-4 text-2xl font-semibold text-primary-500">
                Hiring process
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  [
                    "1. Intro",
                    "Tell us what role you’re exploring and what excites you.",
                  ],
                  [
                    "2. Craft review",
                    "Share a sample of your work or past projects.",
                  ],
                  [
                    "3. Team chat",
                    "Meet the people you’ll collaborate with day to day.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}
                  >
                    <p className="text-sm font-semibold text-primary-500">
                      {title}
                    </p>
                    <p
                      className={`mt-2 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
                    >
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
