import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const heroVideos = ["/colvid.mp4", "/4khd.mp4", "/chinVid.mp4"];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="h-[calc(100vh-8rem)] flex items-center relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {heroVideos.map((video, index) => (
          <motion.video
            key={video}
            src={video}
            autoPlay
            muted
            loop={true}
            className="absolute inset-0 w-full h-full object-fill"
            animate={{ opacity: index === currentVideoIndex ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl text-center mx-auto"
        >
          <h1 className="text-7xl font-semibold leading-none tracking-tighter text-white font-poiret">
            Your perfect trip,
            <br />
            AI-crafted.
          </h1>
          <p className="mt-6 text-2xl text-white/90 font-poiret">
            Tell us where, when, and how you want to travel.
            <br />
            Let AI handle the rest.
          </p>
          <a
            href="#explore"
            className="mt-10 inline-flex items-center gap-3 px-4 py-4 bg-primary-500 hover:bg-primary-600 hover:animate-pulse text-white rounded-lg text-xl font-medium transition-all active:scale-95 font-poiret"
          >
            Explore
          </a>
        </motion.div>
      </div>
    </section>
  );
}
