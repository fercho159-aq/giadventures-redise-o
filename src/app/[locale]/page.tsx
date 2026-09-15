import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";
import DifficultyLevels from "@/components/home/DifficultyLevels";
import FeaturedExpeditions from "@/components/home/FeaturedExpeditions";
import TestimonialsSlider from "@/components/home/TestimonialsSlider";
import CTASection from "@/components/home/CTASection";
import { getFeaturedExpeditions } from "@/lib/expeditions";

// Featured expeditions come from the database; render per request so admin edits show immediately
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: `Adventures GI | ${t("heroSubtitle")}`,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featured = await getFeaturedExpeditions(locale);

  return (
    <main>
      <HeroSection />
      <StatsCounter />
      <DifficultyLevels />
      <FeaturedExpeditions packages={featured} />
      <TestimonialsSlider />
      <CTASection />
    </main>
  );
}
