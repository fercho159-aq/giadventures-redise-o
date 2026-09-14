"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HeroSection() {
  const t = useTranslations("hero");
  const tHome = useTranslations("home");
  const shouldReduceMotion = useReducedMotion();

  const title = t("title");
  const words = title.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-label={title}
    >
      {/* Layered mountain-like gradient background */}
      <div className="absolute inset-0 bg-slate-900" aria-hidden="true">
        {/* Base mountain landscape gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 180% 60% at 20% 80%, #1e3a2f 0%, transparent 50%)",
              "radial-gradient(ellipse 160% 55% at 80% 75%, #1e293b 0%, transparent 50%)",
              "radial-gradient(ellipse 200% 50% at 50% 85%, #334155 0%, transparent 40%)",
              "radial-gradient(ellipse 100% 40% at 35% 70%, #14532d 0%, transparent 50%)",
              "linear-gradient(to bottom, #0c1220 0%, #0f172a 30%, #1e293b 60%, #0f172a 100%)",
            ].join(", "),
          }}
        />
        {/* Stars/speckle overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(1px 1px at 20% 15%, white 1px, transparent 0), radial-gradient(1px 1px at 60% 25%, white 1px, transparent 0), radial-gradient(1px 1px at 80% 10%, white 1px, transparent 0), radial-gradient(1px 1px at 40% 20%, white 1px, transparent 0), radial-gradient(1px 1px at 10% 30%, white 1px, transparent 0), radial-gradient(1px 1px at 70% 8%, white 1px, transparent 0), radial-gradient(1px 1px at 50% 5%, white 1px, transparent 0), radial-gradient(1px 1px at 90% 18%, white 1px, transparent 0)",
          }}
        />
        {/* Dark vignette for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-slate-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Staggered heading */}
        <motion.h1
          className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 text-4xl font-heading font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, i) => (
            <motion.span key={i} className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: shouldReduceMotion ? 0 : 0.7 }}
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: shouldReduceMotion ? 0 : 0.95 }}
        >
          <Link
            href="/expediciones"
            className="inline-flex items-center rounded-lg bg-summit-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-summit-600 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {t("cta")}
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 1.4, duration: 0.6 }}
      >
        <a
          href="#stats"
          className="flex flex-col items-center gap-1 text-white/50 transition-colors hover:text-white/80"
          aria-label={tHome("scrollDown")}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
            {tHome("scrollDown")}
          </span>
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
