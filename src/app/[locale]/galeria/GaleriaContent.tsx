"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";
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
  image: string;
  aspect: "square" | "tall" | "wide";
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    caption: "Pico de Orizaba al amanecer",
    category: "montanas",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    aspect: "tall",
  },
  {
    id: "2",
    caption: "Equipo rumbo a la cumbre del Izta",
    category: "expediciones",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    aspect: "wide",
  },
  {
    id: "3",
    caption: "Nevado de Toluca y sus lagunas",
    category: "montanas",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
    aspect: "square",
  },
  {
    id: "4",
    caption: "Nuestro equipo de guias certificados",
    category: "equipo",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    aspect: "square",
  },
  {
    id: "5",
    caption: "Vista panoramica desde La Malinche",
    category: "paisajes",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    aspect: "wide",
  },
  {
    id: "6",
    caption: "Glaciar de Jamapa, Pico de Orizaba",
    category: "montanas",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    aspect: "tall",
  },
  {
    id: "7",
    caption: "Campamento base en Iztaccihuatl",
    category: "expediciones",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
    aspect: "square",
  },
  {
    id: "8",
    caption: "Atardecer en el volcan de Fuego",
    category: "paisajes",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    aspect: "wide",
  },
  {
    id: "9",
    caption: "Giovanna en la cumbre del Cotopaxi",
    category: "equipo",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    aspect: "tall",
  },
  {
    id: "10",
    caption: "Sierra Negra bajo la niebla",
    category: "montanas",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
    aspect: "square",
  },
  {
    id: "11",
    caption: "Preparacion del equipo tecnico",
    category: "expediciones",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80",
    aspect: "square",
  },
  {
    id: "12",
    caption: "Amanecer sobre el Valle de Puebla",
    category: "paisajes",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    aspect: "wide",
  },
  {
    id: "13",
    caption: "Ruta de ascenso al Nevado de Toluca",
    category: "expediciones",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    aspect: "tall",
  },
  {
    id: "14",
    caption: "Crater del Nevado de Toluca",
    category: "paisajes",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    aspect: "square",
  },
  {
    id: "15",
    caption: "Equipo en cumbre del Pico de Orizaba",
    category: "equipo",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
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
    src: item.image.replace(/w=\d+/, "w=1600").replace(/q=\d+/, "q=90"),
    alt: item.caption ?? "",
    width: 1600,
    height: 1067,
  }));

  return (
    <main className="pt-20 lg:pt-24">
      {/* ============================================================ */}
      {/* Hero                                                          */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden py-20 md:py-28"
        aria-labelledby="gallery-hero-title"
      >
        <Image
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/70" />

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
                  onClick={() => openLightbox(index)}
                  aria-label={`${t("viewFullscreen")}: ${item.caption}`}
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

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
