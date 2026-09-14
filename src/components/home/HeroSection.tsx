"use client";

import Image from "next/image";
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
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
        alt="Montaña al amanecer"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 text-4xl font-heading font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
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

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl drop-shadow"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: shouldReduceMotion ? 0 : 0.7 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: shouldReduceMotion ? 0 : 0.95 }}
        >
          <Link
            href="/expediciones"
            className="inline-flex items-center rounded-lg bg-summit-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-summit-600 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            {t("cta")}
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center rounded-lg border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
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
          className="flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-white/90"
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
