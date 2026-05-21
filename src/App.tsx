import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/context/ThemeContext";
import CustomerServiceAiWidget from "@/components/shared/CustomerServiceAiWidget";

import Home from "@/components/pages/Home";
import Login from "@/components/features/auth/components/Login";
import Register from "@/components/features/auth/components/Register";

import { useAuthStore } from "@/components/features/auth/store/authStore";
import BlogPost from "./components/pages/BlogPost";
import Blog from "./components/pages/Blog";
import DestinationsPage from "@/components/pages/DestinationsPage";
import TravelIdeasPage from "@/components/pages/TravelIdeasPage";
import WhyPlanItPage from "@/components/pages/WhyPlanItPage";
import AboutUsPage from "@/components/pages/AboutUsPage";
import PartnersPage from "@/components/pages/PartnersPage";
import CareersPage from "@/components/pages/CareersPage";
import ContactPage from "@/components/pages/ContactPage";

const Planner = lazy(() => import("@/components/pages/Planner"));
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const MapPage = lazy(() => import("@/components/pages/MapPage"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const hasTopSpacing = location.pathname !== "/";
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-primary-50 flex flex-col">
      <Navbar />
      <main
        className={`flex-1 w-full overflow-x-hidden ${hasTopSpacing ? "pt-12 md:pt-16" : ""}`}
      >
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full w-full"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/planner"
                  element={
                    <ProtectedRoute>
                      <Planner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <MapPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/travel-ideas" element={<TravelIdeasPage />} />
                <Route path="/why-plan-it" element={<WhyPlanItPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </Suspense>
        </AnimatePresence>
      </main>

      <CustomerServiceAiWidget />
      <Footer />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const cleanup = useAuthStore.getState().initializeAuth();
    return cleanup;
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" />
      </Router>
    </ThemeProvider>
  );
}
