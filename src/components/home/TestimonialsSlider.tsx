"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Testimonial {
  id: string;
  name: string;
  expedition: string;
  comment: string;
  rating: number;
}

// ---------------------------------------------------------------------------
// Mock data — will be replaced by Sanity fetch (getFeaturedReviewsQuery)
// ---------------------------------------------------------------------------

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Maria Garcia",
    expedition: "Iztaccihuatl",
    comment:
      "La experiencia en el Iztaccihuatl fue increible. Los guias son muy profesionales y la organizacion impecable. Sin duda volvere a subir con Adventures GI.",
    rating: 5,
  },
  {
    id: "2",
    name: "Laura Hernandez",
    expedition: "La Malinche",
    comment:
      "Mi primer ascenso fue a La Malinche con Adventures GI. Me senti segura en todo momento gracias al equipo. Una experiencia que recomiendo a todos.",
    rating: 5,
  },
  {
    id: "3",
    name: "Roberto Sanchez",
    expedition: "Pico de Orizaba",
    comment:
      "El Pico de Orizaba fue un sueno cumplido. La preparacion, logistica y acompanamiento de Giovanna y su equipo fueron perfectos. Profesionalismo de primer nivel.",
    rating: 5,
  },
  {
    id: "4",
    name: "Carlos Martinez",
    expedition: "Nevado de Toluca",
    comment:
      "Hicimos el Nevado de Toluca como actividad de empresa. Excelente experiencia de team building. Giovanna es una lider inspiradora que transmite pasion por la montana.",
    rating: 5,
  },
  {
    id: "5",
    name: "Ana Lopez",
    expedition: "Cotopaxi, Ecuador",
    comment:
      "La expedicion al Cotopaxi supero todas mis expectativas. Desde la planificacion hasta la cumbre, todo fue impecable. Una aventura que cambio mi vida.",
    rating: 5,
  },
];

// ---------------------------------------------------------------------------
// Star rating sub-component
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-summit-400 text-summit-400" : "text-slate-300"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TestimonialsSlider() {
  const tHome = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const testimonials = MOCK_TESTIMONIALS;
  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, next]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-24"
      aria-labelledby="testimonials-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          <h2
            id="testimonials-title"
            className="text-3xl font-heading font-bold text-slate-900 md:text-4xl"
          >
            {tHome("testimonialsTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {tHome("testimonialsSubtitle")}
          </p>
        </motion.div>

        {/* Slider */}
        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label={tHome("testimonialsTitle")}
        >
          {/* Card area */}
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={shouldReduceMotion ? undefined : slideVariants}
                initial={shouldReduceMotion ? { opacity: 1 } : "enter"}
                animate={shouldReduceMotion ? { opacity: 1 } : "center"}
                exit={shouldReduceMotion ? { opacity: 1 } : "exit"}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`${current + 1} of ${total}`}
              >
                <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-slate-50 p-8 text-center sm:p-10">
                  {/* Quote icon */}
                  <Quote
                    className="mb-4 h-8 w-8 text-summit-300"
                    aria-hidden="true"
                  />

                  {/* Stars */}
                  <div className="mb-4">
                    <StarRating rating={testimonials[current].rating} />
                  </div>

                  {/* Comment */}
                  <blockquote className="mb-6 text-base leading-relaxed text-slate-700 sm:text-lg">
                    &ldquo;{testimonials[current].comment}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div>
                    <p className="font-heading font-bold text-slate-900">
                      {testimonials[current].name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonials[current].expedition}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-summit-500 sm:-translate-x-6"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-summit-500 sm:translate-x-6"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2" role="tablist">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2",
                  i === current
                    ? "w-8 bg-summit-500"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                )}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
