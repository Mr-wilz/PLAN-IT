import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/components/features/auth/store/authStore";
import {
  ChevronDown,
  HelpCircle,
  Heart,
  LogOut,
  MoonStar,
  Settings2,
  SunMedium,
  User,
} from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;
  const discoverRef = useRef<HTMLDivElement>(null);
  const discoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const profileRef = useRef<HTMLDivElement>(null);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const lastScrollYRef = useRef(0);

  const navLinkClass =
    "inline-flex items-center rounded-full border border-amber-200/70 bg-gradient-to-b from-[#b88445] to-[#9a672f] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(85,56,18,0.18)] transition duration-200 hover:-translate-y-0.5 hover:from-[#c18d4f] hover:to-[#8f5d27] hover:text-white";
  const navActionClass =
    "rounded-full px-4 py-2.5 text-sm font-medium shadow-sm transition duration-200";

  const openDiscover = () => {
    if (discoverCloseTimeoutRef.current) {
      clearTimeout(discoverCloseTimeoutRef.current);
      discoverCloseTimeoutRef.current = null;
    }
    setDiscoverOpen(true);
  };

  const closeDiscover = () => {
    discoverCloseTimeoutRef.current = setTimeout(() => {
      setDiscoverOpen(false);
    }, 120);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      if (currentScrollY <= 10) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollYRef.current) {
        // Scrolling down: hide the navbar.
        setNavVisible(false);
        setDiscoverOpen(false);
        setProfileOpen(false);
        setAuthMenuOpen(false);
      } else if (currentScrollY < lastScrollYRef.current) {
        // Scrolling up: show the navbar.
        setNavVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (discoverCloseTimeoutRef.current) {
        clearTimeout(discoverCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        discoverRef.current &&
        !discoverRef.current.contains(event.target as Node)
      ) {
        setDiscoverOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        authMenuRef.current &&
        !authMenuRef.current.contains(event.target as Node)
      ) {
        setAuthMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDiscoverOpen(false);
        setProfileOpen(false);
        setAuthMenuOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const handleAuthLinkClick = () => setAuthMenuOpen(false);

  const handleSettingsClick = () => {
    setProfileOpen(false);
    setSettingsOpen(true);
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-380 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          navVisible
            ? "translate-y-0 opacity-100 blur-0"
            : "-translate-y-5 opacity-0 blur-[2px] pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6">
          <div
            className={`flex items-center justify-between gap-4 rounded-[1.75rem] border px-4 py-3 backdrop-blur-2xl transition-all duration-380 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 ${
              isDark
                ? scrolled
                  ? "border-amber-200/20 bg-[rgba(8,8,8,0.92)] shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
                  : "border-amber-200/15 bg-[rgba(10,10,10,0.72)] shadow-[0_18px_55px_rgba(0,0,0,0.48)]"
                : scrolled
                  ? "border-white/30 bg-[rgba(255,250,244,0.92)] shadow-[0_18px_55px_rgba(64,42,12,0.12)]"
                  : "border-white/30 bg-[rgba(255,255,255,0.58)] shadow-[0_16px_45px_rgba(64,42,12,0.07)]"
            }`}
          >
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-100/90 bg-linear-to-br from-amber-100 via-white to-amber-50 shadow-[0_12px_24px_rgba(120,80,20,0.15)] transition group-hover:scale-105">
                <img src="/planitIcon.ico" alt="Plan-It" className="h-7 w-7" />
              </span>
              <span
                className={`hidden text-[1.05rem] font-semibold tracking-[0.12em] sm:inline ${isDark ? "text-primary-400" : "text-[#7c4f22]"}`}
              >
                PLAN-IT
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div
                ref={discoverRef}
                className="relative"
                onMouseEnter={openDiscover}
                onMouseLeave={closeDiscover}
              >
                <button
                  type="button"
                  onClick={() => setDiscoverOpen((open) => !open)}
                  aria-expanded={discoverOpen}
                  className={`${navLinkClass} flex items-center gap-1.5`}
                >
                  Discover
                  <ChevronDown
                    size={18}
                    className={`transition duration-200 ${discoverOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {discoverOpen && (
                  <div
                    className={`absolute left-0 top-full z-50 mt-3 w-[min(48rem,calc(100vw-2rem))] rounded-[1.75rem] border p-7 shadow-[0_24px_80px_rgba(120,80,20,0.12)] backdrop-blur-2xl ${
                      isDark
                        ? "border-amber-200/20 bg-[#0b0b0b]/95"
                        : "border-amber-100/80 bg-white/95"
                    }`}
                    onMouseEnter={openDiscover}
                    onMouseLeave={closeDiscover}
                  >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7 items-start">
                      <div className="flex flex-col">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.34em] text-primary-400 whitespace-nowrap leading-none">
                          Top Activities
                        </h3>
                        <ul
                          className={`flex flex-col h-full rounded-2xl border divide-y ${isDark ? "border-amber-200/20 divide-amber-200/10 bg-white/2" : "border-amber-100/60 divide-amber-100/40 bg-amber-50/30"}`}
                        >
                          <li>
                            <Link
                              to="/planner"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Planner
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/map"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Explore Map
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/why-plan-it"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Why Plan-It
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.34em] text-primary-400 whitespace-nowrap leading-none">
                          Guides
                        </h3>
                        <ul
                          className={`flex flex-col h-full rounded-2xl border divide-y ${isDark ? "border-amber-200/20 divide-amber-200/10 bg-white/2" : "border-amber-100/60 divide-amber-100/40 bg-amber-50/30"}`}
                        >
                          <li>
                            <Link
                              to="/blog"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Travel Journal
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/travel-ideas"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Travel Ideas
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/destinations"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Destinations
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.34em] text-primary-400 whitespace-nowrap leading-none">
                          Resources
                        </h3>
                        <ul
                          className={`flex flex-col h-full rounded-2xl border divide-y ${isDark ? "border-amber-200/20 divide-amber-200/10 bg-white/2" : "border-amber-100/60 divide-amber-100/40 bg-amber-50/30"}`}
                        >
                          <li>
                            <Link
                              to="/partners"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              For Partners
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/about"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/careers"
                              onClick={() => setDiscoverOpen(false)}
                              className={`block w-full px-4 py-3 text-sm transition ${isDark ? "text-white hover:bg-white/6 hover:text-primary-300" : "text-gray-700 hover:bg-white/80 hover:text-primary-500"}`}
                            >
                              Careers
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/blog" className={navLinkClass}>
                Journal
              </Link>
              <Link to="/about" className={navLinkClass}>
                About Us
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                aria-pressed={theme === "dark"}
                className={`group flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition duration-200 hover:-translate-y-0.5 ${
                  isDark
                    ? "border-amber-200/20 bg-white/6 text-white hover:border-amber-200/40 hover:bg-white/10"
                    : "border-amber-100/80 bg-white/80 text-gray-700 hover:border-amber-200 hover:bg-white"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-700 transition group-hover:bg-amber-100">
                  {theme === "dark" ? (
                    <SunMedium size={16} />
                  ) : (
                    <MoonStar size={16} />
                  )}
                </span>
              </button>

              {isAuthenticated ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen((open) => !open)}
                    className={`${navActionClass} flex items-center gap-2 hover:-translate-y-0.5 ${
                      isDark
                        ? "border-amber-200/20 bg-white/6 text-white hover:bg-white/12 hover:text-primary-300"
                        : "border-white/20 bg-white/80 text-gray-700 hover:bg-white hover:text-primary-500"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#b88445] to-[#8f5d27] text-sm font-medium text-white shadow-[0_8px_18px_rgba(85,56,18,0.2)]">
                      {(user?.user_metadata?.full_name as string)
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition ${profileOpen ? "rotate-180" : ""} ${isDark ? "text-white/80" : "text-gray-600"}`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className={`absolute right-0 top-full z-50 mt-3 w-64 rounded-3xl border shadow-[0_24px_80px_rgba(120,80,20,0.12)] backdrop-blur-2xl ${isDark ? "border-amber-200/20 bg-[#0b0b0b]/95" : "border-amber-100/80 bg-white/95"}`}
                    >
                      <div
                        className={`px-4 py-4 ${isDark ? "border-b border-amber-200/20" : "border-b border-amber-100/80"}`}
                      >
                        <p
                          className={`font-semibold ${isDark ? "text-primary-400" : "text-gray-900"}`}
                        >
                          {(user?.user_metadata?.full_name as string) || "User"}
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-white" : "text-gray-500"}`}
                        >
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className={`flex items-center gap-3 px-4 py-2.5 transition ${isDark ? "text-white hover:bg-white/10 hover:text-primary-300" : "text-gray-700 hover:bg-amber-50 hover:text-primary-500"}`}
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={18} />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard"
                          className={`flex items-center gap-3 px-4 py-2.5 transition ${isDark ? "text-white hover:bg-white/10 hover:text-primary-300" : "text-gray-700 hover:bg-amber-50 hover:text-primary-500"}`}
                          onClick={() => setProfileOpen(false)}
                        >
                          <Heart size={18} />
                          Wishlist
                        </Link>
                        <button
                          type="button"
                          onClick={handleSettingsClick}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${isDark ? "text-white hover:bg-white/10 hover:text-primary-300" : "text-gray-700 hover:bg-amber-50 hover:text-primary-500"}`}
                        >
                          <Settings2 size={18} />
                          Settings
                        </button>
                        <Link
                          to="/why-plan-it"
                          className={`flex items-center gap-3 px-4 py-2.5 transition ${isDark ? "text-white hover:bg-white/10 hover:text-primary-300" : "text-gray-700 hover:bg-amber-50 hover:text-primary-500"}`}
                          onClick={() => setProfileOpen(false)}
                        >
                          <HelpCircle size={18} />
                          Help
                        </Link>
                      </div>

                      <div
                        className={`py-2 ${isDark ? "border-t border-amber-200/20" : "border-t border-gray-100"}`}
                      >
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div ref={authMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAuthMenuOpen((open) => !open)}
                    aria-expanded={authMenuOpen}
                    aria-label="Open account menu"
                    className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition duration-200 hover:-translate-y-0.5 ${
                      isDark
                        ? "border-amber-200/20 bg-white/6 text-white hover:border-amber-200/40 hover:bg-white/10 hover:text-primary-300"
                        : "border-amber-100/80 bg-white/80 text-gray-600 hover:border-amber-200 hover:bg-white hover:text-primary-500"
                    }`}
                  >
                    <User size={20} />
                  </button>

                  {authMenuOpen && (
                    <div
                      className={`absolute right-0 top-full z-50 mt-3 w-52 rounded-3xl border p-2 shadow-[0_24px_80px_rgba(120,80,20,0.12)] backdrop-blur-2xl ${isDark ? "border-amber-200/20 bg-[#0b0b0b]/95" : "border-amber-100/80 bg-white/95"}`}
                    >
                      <Link
                        to="/login"
                        onClick={handleAuthLinkClick}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isDark ? "text-white hover:bg-white/10 hover:text-primary-300" : "text-gray-700 hover:bg-amber-50 hover:text-primary-500"}`}
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={handleAuthLinkClick}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isDark ? "text-white hover:bg-white/10 hover:text-primary-300" : "text-gray-700 hover:bg-amber-50 hover:text-primary-500"}`}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {settingsOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl backdrop-blur-xl ${isDark ? "border-amber-200/20 bg-[#0b0b0b]/95 text-white" : "border-gray-100 bg-white/95"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                  Settings
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-primary-500">
                  Appearance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-full px-3 py-1 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light theme"
                      : "Switch to dark theme"
                  }
                  aria-pressed={theme === "dark"}
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white transition hover:bg-primary-600"
                >
                  {theme === "dark" ? (
                    <SunMedium size={18} />
                  ) : (
                    <MoonStar size={18} />
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-primary-500">
                  Theme preview
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Dark mode uses black glass surfaces, coffee-gold accents, and
                  glossy depth.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
