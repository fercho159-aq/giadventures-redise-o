import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import BookingForm from "@/components/booking/BookingForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${t("title")} — ${title}`,
  };
}

const MOCK_PACKAGES: Record<
  string,
  {
    name: string;
    slug: string;
    price: number;
    currency: string;
    duration: string;
    altitude: number;
    difficulty: string;
    groupSizeMax: number;
    dates: { start: string; end: string; spots: number }[];
  }
> = {
  "pico-de-orizaba": {
    name: "Pico de Orizaba",
    slug: "pico-de-orizaba",
    price: 8500,
    currency: "MXN",
    duration: "3 días / 2 noches",
    altitude: 5636,
    difficulty: "avanzado",
    groupSizeMax: 10,
    dates: [
      { start: "2026-11-14", end: "2026-11-16", spots: 3 },
      { start: "2026-12-12", end: "2026-12-14", spots: 5 },
      { start: "2027-01-09", end: "2027-01-11", spots: 8 },
    ],
  },
  "iztaccihuatl": {
    name: "Iztaccíhuatl",
    slug: "iztaccihuatl",
    price: 4500,
    currency: "MXN",
    duration: "2 días / 1 noche",
    altitude: 5230,
    difficulty: "intermedio",
    groupSizeMax: 12,
    dates: [
      { start: "2026-10-18", end: "2026-10-19", spots: 6 },
      { start: "2026-11-08", end: "2026-11-09", spots: 4 },
    ],
  },
  "nevado-de-toluca": {
    name: "Nevado de Toluca",
    slug: "nevado-de-toluca",
    price: 2200,
    currency: "MXN",
    duration: "1 día",
    altitude: 4680,
    difficulty: "principiante",
    groupSizeMax: 15,
    dates: [
      { start: "2026-10-05", end: "2026-10-05", spots: 10 },
      { start: "2026-10-19", end: "2026-10-19", spots: 12 },
    ],
  },
  "la-malinche": {
    name: "La Malinche",
    slug: "la-malinche",
    price: 1800,
    currency: "MXN",
    duration: "1 día",
    altitude: 4461,
    difficulty: "principiante",
    groupSizeMax: 15,
    dates: [
      { start: "2026-10-12", end: "2026-10-12", spots: 8 },
      { start: "2026-11-02", end: "2026-11-02", spots: 15 },
    ],
  },
  cotopaxi: {
    name: "Cotopaxi, Ecuador",
    slug: "cotopaxi",
    price: 25000,
    currency: "MXN",
    duration: "5 días / 4 noches",
    altitude: 5897,
    difficulty: "alto-rendimiento",
    groupSizeMax: 8,
    dates: [{ start: "2027-02-15", end: "2027-02-19", spots: 4 }],
  },
  alpamayo: {
    name: "Alpamayo, Perú",
    slug: "alpamayo",
    price: 45000,
    currency: "MXN",
    duration: "12 días / 11 noches",
    altitude: 5947,
    difficulty: "alto-rendimiento",
    groupSizeMax: 6,
    dates: [{ start: "2027-06-20", end: "2027-07-01", spots: 3 }],
  },
};

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ date?: string; people?: string; cancelled?: string }>;
}) {
  const { locale, slug } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const pkg = MOCK_PACKAGES[slug];

  if (!pkg) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600">Paquete no encontrado</p>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <BookingForm
          packageName={pkg.name}
          packageSlug={pkg.slug}
          pricePerPerson={pkg.price}
          currency={pkg.currency}
          duration={pkg.duration}
          altitude={pkg.altitude}
          difficulty={pkg.difficulty}
          groupSizeMax={pkg.groupSizeMax}
          availableDates={pkg.dates}
          initialDate={query.date}
          initialPeople={query.people ? parseInt(query.people, 10) : undefined}
          cancelled={query.cancelled === "true"}
        />
      </div>
    </main>
  );
}
