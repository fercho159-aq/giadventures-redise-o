"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Clock, Mountain, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, formatPrice } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DifficultyKey = keyof typeof DIFFICULTY_COLORS;

interface MockPackage {
  id: string;
  title: string;
  slug: string;
  difficulty: DifficultyKey;
  duration: string;
  altitude: number;
  price: number;
  currency: string;
  country: string;
}

// ---------------------------------------------------------------------------
// Mock data — will be replaced by Sanity fetch (getFeaturedPackagesQuery)
// ---------------------------------------------------------------------------

const MOCK_PACKAGES: MockPackage[] = [
  {
    id: "1",
    title: "La Malinche",
    slug: "la-malinche",
    difficulty: "principiante",
    duration: "1 día",
    altitude: 4461,
    price: 1800,
    currency: "MXN",
    country: "México",
  },
  {
    id: "2",
    title: "Nevado de Toluca",
    slug: "nevado-de-toluca",
    difficulty: "principiante",
    duration: "1 día",
    altitude: 4680,
    price: 2200,
    currency: "MXN",
    country: "México",
  },
  {
    id: "3",
    title: "Iztaccíhuatl",
    slug: "iztaccihuatl",
    difficulty: "avanzado",
    duration: "2 días / 1 noche",
    altitude: 5230,
    price: 4500,
    currency: "MXN",
    country: "México",
  },
  {
    id: "4",
    title: "Pico de Orizaba",
    slug: "pico-de-orizaba",
    difficulty: "alto-rendimiento",
    duration: "3 días / 2 noches",
    altitude: 5636,
    price: 7500,
    currency: "MXN",
    country: "México",
  },
  {
    id: "5",
    title: "Cotopaxi, Ecuador",
    slug: "cotopaxi",
    difficulty: "alto-rendimiento",
    duration: "5 días / 4 noches",
    altitude: 5897,
    price: 25000,
    currency: "MXN",
    country: "Ecuador",
  },
  {
    id: "6",
    title: "Alpamayo, Perú",
    slug: "alpamayo",
    difficulty: "alto-rendimiento",
    duration: "12 días / 11 noches",
    altitude: 5947,
    price: 45000,
    currency: "MXN",
    country: "Perú",
  },
];

// ---------------------------------------------------------------------------
// Gradient backgrounds to simulate unique card images per mountain
// ---------------------------------------------------------------------------

const CARD_GRADIENTS: string[] = [
  "linear-gradient(135deg, #166534 0%, #15803d 40%, #4ade80 100%)",
  "linear-gradient(135deg, #1e3a5f 0%, #334155 40%, #94a3b8 100%)",
  "linear-gradient(135deg, #1e293b 0%, #475569 50%, #cbd5e1 100%)",
  "linear-gradient(135deg, #431407 0%, #9a3412 40%, #fb923c 100%)",
  "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #38bdf8 100%)",
  "linear-gradient(135deg, #3b0764 0%, #7e22ce 40%, #d8b4fe 100%)",
];

// ---------------------------------------------------------------------------
// Package card component
// ---------------------------------------------------------------------------

function PackageCardHome({
  pkg,
  gradient,
  index,
}: {
  pkg: MockPackage;
  gradient: string;
  index: number;
}) {
  const tPkg = useTranslations("package");
  const tDiff = useTranslations("difficulty");
  const tCommon = useTranslations("common");
  const colors = DIFFICULTY_COLORS[pkg.difficulty];

  return (
    <Link
      href={`/expediciones/${pkg.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2"
    >
      {/* Image placeholder with gradient + mountain silhouette */}
      <div
        className="relative h-48 w-full overflow-hidden sm:h-52"
        style={{ background: gradient }}
      >
        {/* Mountain silhouette SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full text-white/10"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,120 L0,80 L60,40 L100,70 L150,20 L200,60 L250,30 L300,55 L350,15 L400,50 L400,120 Z"
            fill="currentColor"
          />
        </svg>

        {/* Country badge (for international) */}
        {pkg.country !== "México" && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur-sm">
            {pkg.country}
          </span>
        )}

        {/* Difficulty badge */}
        <span
          className={cn(
            "absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm",
            colors.bg,
            colors.text
          )}
        >
          {tDiff(pkg.difficulty)}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-heading font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
          {pkg.title}
        </h3>

        {/* Meta info */}
        <div className="mb-4 flex flex-col gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>
              {pkg.altitude.toLocaleString("es-MX")} {tPkg("meters")}
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-xs text-slate-500">{tPkg("from")}</span>
            <p className="text-xl font-heading font-bold text-forest-700">
              {formatPrice(pkg.price, pkg.currency)}
              <span className="ml-1 text-xs font-normal text-slate-500">
                {pkg.currency}
              </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-summit-600 transition-all group-hover:gap-2">
            {tCommon("learnMore")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export default function FeaturedExpeditions() {
  const tHome = useTranslations("home");
  const tPkg = useTranslations("package");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  // In production, fetch from Sanity:
  // const packages = await client.fetch(getFeaturedPackagesQuery, { locale });
  const packages = MOCK_PACKAGES;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-slate-50 py-16 md:py-24"
      aria-labelledby="featured-title"
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
            id="featured-title"
            className="text-3xl font-heading font-bold text-slate-900 md:text-4xl"
          >
            {tHome("featuredTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {tHome("featuredSubtitle")}
          </p>
        </motion.div>

        {/* Cards: horizontal scroll mobile, 3-col grid desktop */}
        <motion.div
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              className="w-[82vw] flex-shrink-0 snap-center sm:w-[65vw] md:w-auto"
              variants={cardVariants}
            >
              <PackageCardHome
                pkg={pkg}
                gradient={CARD_GRADIENTS[i % CARD_GRADIENTS.length]}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: 0.5 }}
        >
          <Link
            href="/expediciones"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-forest-700 px-6 py-3 text-sm font-bold text-forest-700 transition-colors hover:bg-forest-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-forest-700 focus:ring-offset-2"
          >
            {tPkg("viewAll")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
