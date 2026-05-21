import { motion } from "framer-motion";
import { Building2, CalendarRange, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/context/ThemeContext";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

// Import local logo assets (if present). Vite's import.meta.glob with eager:true
// returns an object mapping file paths to URLs which we can inspect at runtime.
const localLogos = import.meta.glob(
  "../../assets/logos/*.{png,jpg,jpeg,svg,webp}",
  { eager: true, query: "?url", import: "default" },
);

// Explicit filename mapping to guarantee exact images for important partners.
// Keys should match `partnerEcosystem.name` values.
const partnerLogoFilename: Record<string, string> = {
  Airbnb: "icons8-airbnb",
  "Booking.com": "icons8-booking-100",
  Tripadvisor: "icons8-tripadvisor-50",
  Skyscanner: "icons8-scanner-50",
  Expedia: "expedia",
  "Lonely Planet": "lonely planet",
  "Google Maps": "icons8-google-maps-100",
  Klook: "klook",
  "Marriott Bonvoy": "icons8-marriott-hotels",
  "National Geographic": "icons8-national-park-100",
};

function getMappedLocalLogo(partnerName: string): string | null {
  const expected = partnerLogoFilename[partnerName];
  if (!expected) return null;

  for (const path in localLogos) {
    const file = path.split("/").pop()?.toLowerCase() || "";
    if (file.includes(expected.toLowerCase())) {
      // @ts-ignore
      return (localLogos as Record<string, string>)[path];
    }
  }

  return null;
}

function findLocalLogo(partnerName: string, domain: string): string | null {
  const partnerNorm = partnerName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const domainKey = domain.split(".")[0].toLowerCase();

  for (const path in localLogos) {
    const fileName = path.split("/").pop() || "";
    const fileBase = fileName.replace(/\.[^/.]+$/, "");
    const fileNorm = fileBase.toLowerCase().replace(/[^a-z0-9]/g, "");

    // exact normalized match
    if (fileNorm === partnerNorm || fileNorm === domainKey) {
      // @ts-ignore
      return (localLogos as Record<string, string>)[path];
    }

    // substring matches either direction (covers cases like 'scanner' vs 'skyscanner')
    if (
      fileNorm.includes(partnerNorm) ||
      partnerNorm.includes(fileNorm) ||
      fileNorm.includes(domainKey) ||
      domainKey.includes(fileNorm)
    ) {
      // @ts-ignore
      return (localLogos as Record<string, string>)[path];
    }

    // token-based loose matching (icons8-airbnb, lonely planet.png, etc.)
    const fileTokens = fileBase
      .toLowerCase()
      .split(/[-_\.\s]+/)
      .filter(Boolean);
    const partnerTokens = partnerName
      .toLowerCase()
      .split(/[-_\.\s]+/)
      .filter(Boolean);

    for (const ft of fileTokens) {
      for (const pt of partnerTokens) {
        if (
          ft.length >= 3 &&
          pt.length >= 3 &&
          (ft === pt || ft.includes(pt) || pt.includes(ft))
        ) {
          // @ts-ignore
          return (localLogos as Record<string, string>)[path];
        }
      }
    }
  }

  return null;
}

const partnerEcosystem = [
  {
    name: "Airbnb",
    domain: "airbnb.com",
    description:
      "Home stays, local experiences, and neighborhood-first planning.",
  },
  {
    name: "Booking.com",
    domain: "booking.com",
    description:
      "Hotel inventory and stay options that fit different trip budgets.",
  },
  {
    name: "Tripadvisor",
    domain: "tripadvisor.com",
    description:
      "Ratings, reviews, and attraction discovery for planning confidence.",
  },
  {
    name: "Skyscanner",
    domain: "skyscanner.net",
    description: "Flight discovery and budget-friendly travel timing.",
  },
  {
    name: "Expedia",
    domain: "expedia.com",
    description:
      "Trip bundles and accommodation planning for broader itineraries.",
  },
  {
    name: "Lonely Planet",
    domain: "lonelyplanet.com",
    description:
      "Editorial inspiration that supports the journal-led experience.",
  },
  {
    name: "Google Maps",
    domain: "google.com",
    description:
      "Navigation and map discovery that keeps itinerary planning grounded in real geography.",
  },
  {
    name: "Klook",
    domain: "klook.com",
    description:
      "Tours and experiences that help travelers fill in the details between anchor stops.",
  },
  {
    name: "Marriott Bonvoy",
    domain: "marriott.com",
    description:
      "Loyalty-friendly hotel inventory that suits premium trip planning workflows.",
  },
  {
    name: "National Geographic",
    domain: "nationalgeographic.com",
    description:
      "Destination storytelling that complements editorial trip discovery.",
  },
];

const logoStrip = [
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Booking.com", domain: "booking.com" },
  { name: "Tripadvisor", domain: "tripadvisor.com" },
  { name: "Skyscanner", domain: "skyscanner.net" },
  { name: "Expedia", domain: "expedia.com" },
  { name: "Lonely Planet", domain: "lonelyplanet.com" },
  { name: "Google Maps", domain: "google.com" },
  { name: "Klook", domain: "klook.com" },
  { name: "Marriott", domain: "marriott.com" },
  { name: "National Geographic", domain: "nationalgeographic.com" },
];

export default function PartnersPage() {
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
          title="For Partners"
          subtitle="Build beautiful travel experiences with Plan-It as a distribution and planning layer."
          items={[{ label: "Home", to: "/" }, { label: "For Partners" }]}
          dark={isDark}
        />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 rounded-3xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-8 ${
            isDark
              ? "border-amber-200/20 bg-white/4"
              : "border-white/50 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
                Partner ecosystem
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-primary-500 md:text-3xl">
                Organizations Plan-It can sit beside in a travel stack
              </h2>
              <p className={`mt-3 ${isDark ? "text-white" : "text-gray-600"}`}>
                These are illustrative ecosystem examples with logo-backed cards
                so the page feels like a serious B2B destination.
              </p>
            </div>

            <Link
              to="/contact"
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              Start a partnership conversation
            </Link>
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            [
              "Hotels",
              "Present stays inside itinerary planning and route contexts.",
            ],
            [
              "Tour Operators",
              "Offer guided experiences tied to destinations and days.",
            ],
            [
              "Creators",
              "Publish premium travel content into the journal ecosystem.",
            ],
          ].map(([title, text], index) => {
            const Icon = [Building2, Users2, CalendarRange][index] ?? Building2;

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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {partnerEcosystem.map((partner, index) => (
            <motion.article
              key={partner.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.04 }}
              className={`rounded-3xl border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
                isDark
                  ? "border-amber-200/20 bg-white/4"
                  : "border-white/50 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    getMappedLocalLogo(partner.name) ||
                    findLocalLogo(partner.name, partner.domain) ||
                    `https://logo.clearbit.com/${partner.domain}`
                  }
                  alt={`${partner.name} logo`}
                  className="h-12 w-12 rounded-2xl bg-white object-contain p-2 shadow-sm"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary-500">
                    {partner.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
                    Featured ecosystem
                  </p>
                </div>
              </div>
              <p
                className={`mt-4 text-sm ${isDark ? "text-white" : "text-gray-600"}`}
              >
                {partner.description}
              </p>
            </motion.article>
          ))}
        </div>

        <div
          className={`relative mt-10 overflow-hidden rounded-3xl border py-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
            isDark
              ? "border-amber-200/20 bg-white/4"
              : "border-white/50 bg-white"
          }`}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-[rgba(255,255,255,0.98)] to-transparent dark:from-[rgba(5,5,5,0.98)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-[rgba(255,255,255,0.98)] to-transparent dark:from-[rgba(5,5,5,0.98)]" />

          <motion.div
            className="flex w-max items-center gap-5 px-6"
            animate={{ x: [0, -1280] }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          >
            {[...logoStrip, ...logoStrip].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className={`flex items-center gap-3 rounded-full border px-4 py-3 shadow-sm ${
                  isDark
                    ? "border-white/10 bg-white/5"
                    : "border-gray-100 bg-white"
                }`}
              >
                <img
                  src={
                    getMappedLocalLogo(partner.name) ||
                    findLocalLogo(partner.name, partner.domain) ||
                    `https://logo.clearbit.com/${partner.domain}`
                  }
                  alt={`${partner.name} logo`}
                  className="h-8 w-8 rounded-full bg-white object-contain p-1"
                  loading="lazy"
                />
                <span
                  className={`whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-700"
                  }`}
                >
                  {partner.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
