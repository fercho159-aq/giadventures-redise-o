import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Backpack, ClipboardCheck } from "lucide-react";
import {
  PackageHero,
  MediaGallery,
  ItineraryTimeline,
  IncludesExcludes,
  PricingCard,
  PackageReviews,
  RelatedPackages,
} from "@/components/package-detail";
import { getExpeditionBySlug, getRelatedExpeditions } from "@/lib/expeditions";

// Always read fresh data so admin edits show immediately
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  Sample reviews (no reviews module in the database yet)             */
/* ------------------------------------------------------------------ */

interface Review {
  author: string;
  date: string;
  rating: number;
  text: string;
  expedition: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    author: "Carlos Martinez",
    date: "2026-03-15",
    rating: 5,
    text: "Una experiencia increible. El guia fue muy profesional y nos hizo sentir seguros en todo momento. Llegar a la cumbre fue el momento mas emocionante de mi vida. Totalmente recomendado para cualquier alpinista con experiencia.",
    expedition: "Pico de Orizaba - Marzo 2026",
  },
  {
    author: "Ana Laura Gonzalez",
    date: "2026-01-20",
    rating: 5,
    text: "Organizacion impecable desde el transporte hasta la alimentacion. Los guias tienen un conocimiento profundo de la montana y las condiciones climaticas. El amanecer desde la cumbre es algo que no olvidare jamas.",
    expedition: "Pico de Orizaba - Enero 2026",
  },
  {
    author: "Roberto Sanchez",
    date: "2025-12-08",
    rating: 4,
    text: "Muy buena expedicion. El unico detalle fue que el clima no nos permitio ver la salida del sol desde la cumbre, pero el equipo manejo la situacion con mucha profesionalidad. El equipo proporcionado es de primera calidad.",
    expedition: "Pico de Orizaba - Diciembre 2025",
  },
  {
    author: "Maria Fernanda Lopez",
    date: "2025-11-22",
    rating: 5,
    text: "Mi tercera expedicion con Adventures GI y siempre superan las expectativas. El Pico de Orizaba es una montana exigente pero con estos guias te sientes acompanado y seguro. El briefing previo es muy completo y te preparan para cada escenario.",
    expedition: "Pico de Orizaba - Noviembre 2025",
  },
];

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pkg = await getExpeditionBySlug(slug, locale);
  if (!pkg) return {};

  const title = pkg.seoTitle || pkg.title;
  const description = pkg.seoDescription || pkg.excerpt;
  const image = pkg.seoImage || pkg.image;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Adventures GI`,
      description,
      type: "website",
      ...(image ? { images: [image] } : {}),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const pkg = await getExpeditionBySlug(slug, locale);
  if (!pkg) notFound();

  const related = await getRelatedExpeditions(pkg, locale);

  return (
    <main className="pb-24 lg:pb-0">
      {/* Hero */}
      <PackageHero
        title={pkg.title}
        subtitle={pkg.subtitle}
        mainImageAlt={pkg.title}
        image={pkg.image ?? undefined}
        duration={{ days: pkg.durationDays, nights: pkg.durationNights }}
        altitude={pkg.altitude}
        difficulty={pkg.difficulty}
        groupSize={
          pkg.groupSizeMin || pkg.groupSizeMax
            ? { min: pkg.groupSizeMin ?? 1, max: pkg.groupSizeMax ?? pkg.groupSizeMin ?? 1 }
            : null
        }
      />

      {/* Main content + sidebar layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10 xl:gap-12">
          {/* Left content column (2/3 on desktop) */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {pkg.gallery.length > 0 && <MediaGallery items={pkg.gallery} />}

            {/* Description */}
            {pkg.description && (
              <section aria-label="Descripcion" className="py-8 md:py-12">
                <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl mb-6">
                  Acerca de esta expedicion
                </h2>
                <div className="prose prose-slate max-w-none">
                  {pkg.description.split(/\n\s*\n/).map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-slate-600 mb-4 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {pkg.itinerary.length > 0 && <ItineraryTimeline days={pkg.itinerary} />}

            {/* Includes/Excludes */}
            {(pkg.included.length > 0 || pkg.notIncluded.length > 0) && (
              <IncludesExcludes
                included={pkg.included}
                notIncluded={pkg.notIncluded}
              />
            )}

            {/* Requirements / what to bring */}
            {(pkg.requirements || pkg.whatToBring) && (
              <section aria-label="Requisitos y que llevar" className="py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {pkg.requirements && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                      <h2 className="text-xl font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-forest-700" aria-hidden="true" />
                        {locale === "en" ? "Requirements" : "Requisitos"}
                      </h2>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line md:text-base">
                        {pkg.requirements}
                      </p>
                    </div>
                  )}
                  {pkg.whatToBring && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                      <h2 className="text-xl font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Backpack className="h-5 w-5 text-forest-700" aria-hidden="true" />
                        {locale === "en" ? "What to bring" : "Que llevar"}
                      </h2>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line md:text-base">
                        {pkg.whatToBring}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Reviews */}
            <PackageReviews
              reviews={MOCK_REVIEWS}
              averageRating={4.8}
              totalCount={47}
            />
          </div>

          {/* Right sidebar (1/3 on desktop) */}
          <div className="lg:col-span-1">
            <PricingCard
              pricePerPerson={pkg.pricePerPerson}
              currency={pkg.currency}
              availableDates={pkg.dates}
              groupSizeMax={pkg.groupSizeMax ?? 15}
              packageName={pkg.title}
              packageSlug={pkg.slug}
            />
          </div>
        </div>
      </div>

      {/* Related packages (full width) */}
      {related.length > 0 && (
        <RelatedPackages
          packages={related.map((r) => ({
            slug: r.slug,
            title: r.title,
            difficulty: r.difficulty,
            pricePerPerson: r.pricePerPerson,
            currency: r.currency,
            altitude: r.altitude,
            duration: { days: r.durationDays, nights: r.durationNights },
            placeholderColor: "from-forest-600 to-slate-700",
            image: r.image ?? undefined,
          }))}
        />
      )}
    </main>
  );
}
