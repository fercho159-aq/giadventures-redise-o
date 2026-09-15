import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { Mountain, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { DifficultyBadge } from "@/components/package-detail";
import { getActiveExpeditions } from "@/lib/expeditions";

// Always read fresh data so admin edits show immediately
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Our Expeditions" : "Nuestras Expediciones",
    description:
      locale === "en"
        ? "Explore our mountaineering expeditions across Mexico and the world."
        : "Explora nuestras expediciones de alpinismo en Mexico y el mundo.",
  };
}

export default async function ExpedicionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const packages = await getActiveExpeditions(locale);

  return (
    <main className="pt-20 lg:pt-24">
      {/* Page header with background image */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl">
            {locale === "en" ? "Our Expeditions" : "Nuestras Expediciones"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            {locale === "en"
              ? "From your first summit to the highest peaks in the Americas. Find the expedition that matches your level."
              : "Desde tu primera cumbre hasta los picos mas altos de America. Encuentra la expedicion que se adapte a tu nivel."}
          </p>
        </div>
      </section>

      {/* Packages grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {packages.length === 0 && (
            <p className="py-12 text-center text-slate-500">
              {locale === "en"
                ? "No expeditions available right now."
                : "No hay expediciones disponibles por ahora."}
            </p>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Link
                key={pkg.slug}
                href={`/expediciones/${pkg.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {/* Card image */}
                <div className="relative h-52 overflow-hidden">
                  {pkg.image ? (
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-forest-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <DifficultyBadge difficulty={pkg.difficulty} size="sm" />
                  </div>
                  {pkg.location && (
                    <div className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                      {pkg.location}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="font-heading font-bold text-lg text-slate-900 group-hover:text-forest-700 transition-colors">
                    {pkg.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {pkg.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    {pkg.altitude ? (
                      <span className="flex items-center gap-1">
                        <Mountain className="h-3 w-3" aria-hidden="true" />
                        {pkg.altitude.toLocaleString("es-MX")} msnm
                      </span>
                    ) : null}
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p>
                      <span className="text-xs text-slate-500">Desde </span>
                      <span className="text-lg font-heading font-bold text-slate-900">
                        {formatPrice(pkg.pricePerPerson, pkg.currency)}
                      </span>
                    </p>
                    <span className="flex items-center gap-1 text-sm font-semibold text-summit-600 group-hover:text-summit-700 transition-colors">
                      {locale === "en" ? "See details" : "Ver detalles"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
