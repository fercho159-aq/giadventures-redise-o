"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { Mountain, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

/* ------------------------------------------------------------------ */
/*  Gallery item types & mock data                                     */
/* ------------------------------------------------------------------ */

type GalleryCategory =
  | "montanas"
  | "expediciones"
  | "equipo"
  | "paisajes";

interface GalleryItem {
  id: string;
  caption: string;
  category: GalleryCategory;
  gradient: string;
  aspect: "square" | "tall" | "wide";
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    caption: "Pico de Orizaba al amanecer",
    category: "montanas",
    gradient: "linear-gradient(135deg, #14532d 0%, #15803d 40%, #4ade80 100%)",
    aspect: "tall",
  },
  {
    id: "2",
    caption: "Equipo rumbo a la cumbre del Izta",
    category: "expediciones",
    gradient: "linear-gradient(135deg, #1e293b 0%, #475569 50%, #94a3b8 100%)",
    aspect: "wide",
  },
  {
    id: "3",
    caption: "Nevado de Toluca y sus lagunas",
    category: "montanas",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #38bdf8 100%)",
    aspect: "square",
  },
  {
    id: "4",
    caption: "Nuestro equipo de guias certificados",
    category: "equipo",
    gradient: "linear-gradient(135deg, #431407 0%, #9a3412 40%, #fb923c 100%)",
    aspect: "square",
  },
  {
    id: "5",
    caption: "Vista panoramica desde La Malinche",
    category: "paisajes",
    gradient: "linear-gradient(135deg, #3b0764 0%, #7e22ce 40%, #d8b4fe 100%)",
    aspect: "wide",
  },
  {
    id: "6",
    caption: "Glaciar de Jamapa, Pico de Orizaba",
    category: "montanas",
    gradient: "linear-gradient(135deg, #164e63 0%, #0e7490 40%, #67e8f9 100%)",
    aspect: "tall",
  },
  {
    id: "7",
    caption: "Campamento base en Iztaccihuatl",
    category: "expediciones",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #334155 40%, #cbd5e1 100%)",
    aspect: "square",
  },
  {
    id: "8",
    caption: "Atardecer en el volcan de Fuego",
    category: "paisajes",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 40%, #fdba74 100%)",
    aspect: "wide",
  },
  {
    id: "9",
    caption: "Giovanna en la cumbre del Cotopaxi",
    category: "equipo",
    gradient: "linear-gradient(135deg, #052e16 0%, #166534 40%, #86efac 100%)",
    aspect: "tall",
  },
  {
    id: "10",
    caption: "Sierra Negra bajo la niebla",
    category: "montanas",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #475569 100%)",
    aspect: "square",
  },
  {
    id: "11",
    caption: "Preparacion del equipo tecnico",
    category: "expediciones",
    gradient: "linear-gradient(135deg, #312e81 0%, #4338ca 40%, #a5b4fc 100%)",
    aspect: "square",
  },
  {
    id: "12",
    caption: "Amanecer sobre el Valle de Puebla",
    category: "paisajes",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 40%, #fde68a 100%)",
    aspect: "wide",
  },
  {
    id: "13",
    caption: "Ruta de ascenso al Nevado de Toluca",
    category: "expediciones",
    gradient: "linear-gradient(135deg, #1a2e05 0%, #3f6212 40%, #a3e635 100%)",
    aspect: "tall",
  },
  {
    id: "14",
    caption: "Crater del Nevado de Toluca",
    category: "paisajes",
    gradient: "linear-gradient(135deg, #083344 0%, #155e75 40%, #22d3ee 100%)",
    aspect: "square",
  },
  {
    id: "15",
    caption: "Equipo en cumbre del Pico de Orizaba",
    category: "equipo",
    gradient: "linear-gradient(135deg, #14532d 0%, #ea580c 40%, #fbbf24 100%)",
    aspect: "wide",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter tabs                                                        */
/* ------------------------------------------------------------------ */

interface FilterTab {
  key: string;
  labelKey: string;
  category: GalleryCategory | null;
}

const FILTER_TABS: FilterTab[] = [
  { key: "all", labelKey: "filterAll", category: null },
  { key: "montanas", labelKey: "filterMountains", category: "montanas" },
  {
    key: "expediciones",
    labelKey: "filterExpeditions",
    category: "expediciones",
  },
  { key: "equipo", labelKey: "filterTeam", category: "equipo" },
  { key: "paisajes", labelKey: "filterLandscapes", category: "paisajes" },
];

/* ------------------------------------------------------------------ */
/*  Aspect ratio helper                                                */
/* ------------------------------------------------------------------ */

function aspectToClass(aspect: GalleryItem["aspect"]): string {
  switch (aspect) {
    case "tall":
      return "row-span-2";
    case "wide":
      return "col-span-2 sm:col-span-2";
    default:
      return "";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GaleriaContent() {
  const t = useTranslations("galleryPage");
  const shouldReduceMotion = useReducedMotion();

  const [activeFilter, setActiveFilter] = useState<GalleryCategory | null>(
    null
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-40px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const filteredItems = activeFilter
    ? GALLERY_ITEMS.filter((item) => item.category === activeFilter)
    : GALLERY_ITEMS;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const staggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 },
    },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  /* ---------------------------------------------------------------- */
  /*  Lightbox custom slide render (CSS gradient placeholders)         */
  /* ---------------------------------------------------------------- */

  const lightboxSlides = filteredItems.map((item) => ({
    src: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"/>`,
    alt: item.caption,
    width: 1200,
    height: 800,
  }));

  return (
    <main className="pt-20 lg:pt-24">
      {/* ============================================================ */}
      {/* Hero                                                          */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 md:py-28"
        aria-labelledby="gallery-hero-title"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 150% 60% at 20% 90%, #14532d 0%, transparent 50%)",
                "radial-gradient(ellipse 120% 50% at 80% 80%, #431407 0%, transparent 50%)",
                "linear-gradient(to bottom, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
              ].join(", "),
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            id="gallery-hero-title"
            className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.15,
            }}
          >
            {t("heroSubtitle")}
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Filters                                                       */}
      {/* ============================================================ */}
      <section className="sticky top-16 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md lg:top-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex gap-1 overflow-x-auto py-3 scrollbar-hide"
            aria-label="Gallery filters"
          >
            {FILTER_TABS.map((tab) => {
              const isActive =
                tab.category === activeFilter ||
                (tab.category === null && activeFilter === null);
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.category)}
                  className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-forest-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-pressed={isActive}
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Gallery Grid                                                  */}
      {/* ============================================================ */}
      <section
        ref={gridRef}
        className="py-12 md:py-16"
        aria-label="Gallery"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-3 md:gap-4 lg:auto-rows-[260px] lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
            key={activeFilter ?? "all"}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  variants={itemVariant}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${aspectToClass(
                    item.aspect
                  )}`}
                  style={{ background: item.gradient }}
                  onClick={() => openLightbox(index)}
                  aria-label={`${t("viewFullscreen")}: ${item.caption}`}
                >
                  {/* Mountain icon placeholder */}
                  <Mountain
                    className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/15"
                    strokeWidth={1}
                    aria-hidden="true"
                  />

                  {/* Mountain silhouette */}
                  <svg
                    className="absolute bottom-0 left-0 w-full text-black/10"
                    viewBox="0 0 400 80"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,80 L0,50 L60,25 L100,40 L150,15 L200,35 L250,10 L300,30 L350,20 L400,35 L400,80 Z"
                      fill="currentColor"
                    />
                  </svg>

                  {/* Hover overlay with caption */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <div className="flex w-full items-center gap-2 p-4">
                      <Camera
                        className="h-4 w-4 flex-shrink-0 text-white/80"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-white">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Lightbox                                                      */}
      {/* ============================================================ */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        render={{
          slide: ({ slide, rect }) => {
            const item = filteredItems[lightboxSlides.indexOf(slide)];
            if (!item) return null;
            return (
              <div
                className="flex h-full w-full flex-col items-center justify-center"
                style={{
                  maxWidth: rect?.width ?? "100%",
                  maxHeight: rect?.height ?? "100%",
                }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-lg"
                  style={{
                    background: item.gradient,
                    maxWidth: Math.min(rect?.width ?? 900, 900),
                    height: Math.min(rect?.height ? rect.height * 0.8 : 600, 600),
                  }}
                >
                  <Mountain
                    className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white/20"
                    strokeWidth={1}
                  />
                  <svg
                    className="absolute bottom-0 left-0 w-full text-white/10"
                    viewBox="0 0 400 80"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,80 L0,50 L60,25 L100,40 L150,15 L200,35 L250,10 L300,30 L350,20 L400,35 L400,80 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-center text-base font-medium text-white">
                  {item.caption}
                </p>
              </div>
            );
          },
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
        labels={{
          Previous: t("previous"),
          Next: t("next"),
          Close: t("close"),
        }}
      />
    </main>
  );
}
