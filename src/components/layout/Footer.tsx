import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Send,
  Mail,
  ArrowUpRight,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReviewWidget from "@/components/shared/ReviewWidget";

const testimonials = [
  {
    name: "Maya L.",
    role: "Weekend traveler",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "The planning flow feels calmer than other itinerary tools. I can get from idea to plan without fighting the interface.",
  },
  {
    name: "Jordan T.",
    role: "Frequent flyer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "The dashboard, map, and export options make it feel like a real travel workspace instead of a demo.",
  },
  {
    name: "Sofia A.",
    role: "Family trip planner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "The product feels polished and easy to trust. The footer FAQ is also useful when I need a quick reminder.",
  },
  {
    name: "Liam R.",
    role: "Backpacker",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    quote:
      "I planned a two-week route in under 30 minutes — saved me hours of research.",
  },
  {
    name: "Priya S.",
    role: "Couples getaway",
    quote:
      "The recommendations were surprisingly thoughtful and matched our interests perfectly.",
  },
  {
    name: "Carlos M.",
    role: "Business traveler",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "Fast exports and clear itineraries make it easy to share plans with colleagues.",
  },
  {
    name: "Hana K.",
    role: "Solo adventurer",
    quote:
      "I love the curated discovery section — found hidden spots I wouldn't have searched for.",
  },
  {
    name: "Ethan P.",
    role: "Road tripper",
    quote:
      "Route planning across multiple stops was simple and the map view is very helpful.",
  },
  {
    name: "Zara N.",
    role: "Holiday planner",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    quote:
      "Saved our whole family's trip details and shared a DOC with my parents — they loved it.",
  },
  {
    name: "Omar F.",
    role: "City hopper",
    quote:
      "Great balance between automation and control — I can tweak things easily.",
  },
  {
    name: "Lina V.",
    role: "Photographer",
    avatar: "https://randomuser.me/api/portraits/women/39.jpg",
    quote:
      "Discovery suggestions included picturesque spots that made my portfolio pop.",
  },
  {
    name: "Noah B.",
    role: "Family organizer",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    quote:
      "Managing multiple children's schedules was painless with the day-by-day breakdown.",
  },
];

const faqs = [
  {
    question: "How do I generate an itinerary?",
    answer:
      "Go to the Planner, enter your trip details, and the app will build a day-by-day plan you can save to your dashboard.",
  },
  {
    question: "Can I export my trip plan?",
    answer:
      "Yes. Open a saved itinerary in the Dashboard and use the Download TXT or Download DOC buttons from the modal.",
  },
  {
    question: "Where do I get help?",
    answer:
      "Use the floating customer service assistant on the right side of the screen or reach out through the contact details below.",
  },
  {
    question: "Is the FAQ available on every page?",
    answer:
      "Yes. The testimonial, FAQ, and footer are part of the shared footer layout, so they appear across the app.",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.footer
      className="bg-[#0a0602e8] py-14 text-white"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <section id="testimonials" className="mb-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-200">
                Testimonials
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Travelers who use Plan-It regularly
              </h3>
            </div>
          </div>

          <div className="-mx-4 relative">
            <div className="absolute left-2 top-1/2 z-30 -translate-y-1/2">
              <button
                aria-label="Previous testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 shadow-md transition hover:bg-white/8"
                onClick={() => {
                  const el = scrollerRef.current;
                  if (el)
                    el.scrollBy({
                      left: -el.clientWidth * 0.8,
                      behavior: "smooth",
                    });
                }}
                disabled={!canScrollLeft}
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <div
              ref={scrollerRef}
              onScroll={updateScrollState}
              className="overflow-x-auto px-4 py-2 hide-scrollbar"
            >
              <div className="flex gap-4 w-max snap-x snap-mandatory">
                {testimonials.map((testimonial) => (
                  <article
                    key={testimonial.name}
                    className="snap-start shrink-0 w-[min(84vw,20rem)] md:w-80 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
                  >
                    <Quote className="text-amber-200/70" size={22} />
                    <p className="mt-4 text-sm leading-6 text-white/80">
                      {testimonial.quote}
                    </p>
                    <div className="mt-5 pt-4 text-sm flex items-center gap-3">
                      <img
                        src={
                          testimonial.avatar ??
                          `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
                            testimonial.name,
                          )}.svg?background=%23b9914c&color=%23111111`
                        }
                        alt={`${testimonial.name} avatar`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-amber-100">
                          {testimonial.name}
                        </p>
                        <p className="text-white/55">{testimonial.role}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="absolute right-2 top-1/2 z-30 -translate-y-1/2">
              <button
                aria-label="Next testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 shadow-md transition hover:bg-white/8"
                onClick={() => {
                  const el = scrollerRef.current;
                  if (el)
                    el.scrollBy({
                      left: el.clientWidth * 0.8,
                      behavior: "smooth",
                    });
                }}
                disabled={!canScrollRight}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section id="faq" className="mb-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-200">
                FAQ
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Common questions
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-white outline-none">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-amber-200 transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            <div>
              <h3 className="text-lg font-semibold tracking-[0.14em] text-amber-100 uppercase">
                Plan-It
              </h3>
              <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
                AI-powered travel planning with polished itineraries, curated
                discovery, and a premium experience that stays simple to use.
              </p>
            </div>
            <a
              href="#about-us"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/25 px-4 py-2 text-sm text-amber-100 transition hover:border-amber-200/60 hover:bg-white/5"
            >
              About Us
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div
            id="about-us"
            className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
          >
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
              About Us
            </h4>
            <p className="text-sm leading-6 text-white/75">
              Plan-It is built for travelers who want inspiration and planning
              without the clutter. We combine elegant design, smart tools, and
              practical trip organization in one place.
            </p>
          </div>

          <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href="mailto:hello@plan-it.travel"
                  className="transition hover:text-amber-100"
                >
                  hello@plan-it.travel
                </a>
              </li>
              <li>
                <a
                  href="tel:+15550199"
                  className="transition hover:text-amber-100"
                >
                  +1 (555) 019-9
                </a>
              </li>
              <li>
                <span className="block leading-6 text-white/65">
                  24 Willow Street, Suite 12
                  <br />
                  San Francisco, CA
                </span>
              </li>
            </ul>
          </div>

          <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a href="/" className="transition hover:text-amber-100">
                  Home
                </a>
              </li>
              <li>
                <a href="/planner" className="transition hover:text-amber-100">
                  Planner
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="transition hover:text-amber-100"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/map" className="transition hover:text-amber-100">
                  Map
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
              Newsletter
            </h4>
            <p className="mb-4 text-sm leading-6 text-white/75">
              Get travel inspiration, product updates, and thoughtful trip ideas
              in a low-noise monthly note.
            </p>
            <form className="mt-auto space-y-3">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email address"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-amber-200/50"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-amber-200 px-4 py-3 text-sm font-medium text-[#1a140d] transition hover:bg-amber-100"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="rounded-full border border-white/10 p-3 text-white/80 transition hover:border-amber-200/40 hover:bg-white/5 hover:text-amber-100"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                className="rounded-full border border-white/10 p-3 text-white/80 transition hover:border-amber-200/40 hover:bg-white/5 hover:text-amber-100"
              >
                <Send size={20} />
              </a>
              <a
                href="#"
                className="rounded-full border border-white/10 p-3 text-white/80 transition hover:border-amber-200/40 hover:bg-white/5 hover:text-amber-100"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <ReviewWidget />
        </div>

        <div className="border-t border-amber-100/15 pt-8 mt-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-white/65">
              © {currentYear} Plan-It. All rights reserved.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-amber-200/40 hover:bg-white/10 hover:text-amber-100"
            >
              Back to top
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
