import { motion } from "framer-motion";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import MostVisitedPlaces from "@/components/features/landing/components/MostVisitedPlaces";

export default function DestinationsPage() {
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
      <div className="mx-auto max-w-7xl">
        <BreadcrumbHeader
          title="Destinations"
          subtitle="Explore the places people visit most and search for any destination on the map."
          items={[{ label: "Home", to: "/" }, { label: "Destinations" }]}
          dark={isDark}
        />

        
      </div>
      <MostVisitedPlaces />
    </div>
  );
}
