import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const heroBackground = "/tourist.jpg";
const heroVideos = ["/4khd.mp4", "/chinVid.mp4"];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] w-full items-center overflow-hidden">
      {/* Static background fallback */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroBackground}
          alt="Travel backdrop"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {heroVideos.map((video, index) => (
          <motion.video
            key={video}
            src={video}
            autoPlay
            muted
            loop={true}
            playsInline
            preload="auto"
            poster={heroBackground}
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ opacity: index === currentVideoIndex ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <h1 className="font-raleway text-[clamp(2.7rem,10vw,4.75rem)] font-semibold leading-[0.9] tracking-tighter text-white">
            Your perfect trip,
            <br />
            AI-crafted.
          </h1>
          <p className="mt-5 text-base text-white/90 font-poiret sm:mt-6 sm:text-2xl">
            Tell us where, when, and how you want to travel.
            <br />
            Let AI handle the rest.
          </p>
          <a
            href="#explore"
            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-primary-500 px-4 py-3 text-base font-medium text-white transition-all active:scale-95 hover:bg-primary-600 hover:animate-pulse font-poiret sm:mt-10 sm:px-5 sm:py-4 sm:text-xl"
          >
            Explore
          </a>
        </motion.div>
      </div>
    </section>
  );
}
