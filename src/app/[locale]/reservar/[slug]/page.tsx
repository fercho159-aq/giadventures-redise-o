import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";
import { getExpeditionBySlug } from "@/lib/expeditions";
import { isPayPalConfigured, isStripeConfigured, isTestPaymentMode } from "@/lib/payments";

// Always read fresh data so admin edits and new bookings show immediately
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  const pkg = await getExpeditionBySlug(slug, locale);
  return {
    title: `${t("title")} — ${pkg?.title ?? slug}`,
  };
}

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

  const pkg = await getExpeditionBySlug(slug, locale);
  if (!pkg) notFound();

  const groupSizeMax = pkg.groupSizeMax ?? 15;
  const dates = pkg.dates
    .filter((d) => d.status !== "full" && d.spotsTotal - d.spotsTaken > 0)
    .map((d) => ({
      start: d.startDate,
      end: d.endDate,
      spots: d.spotsTotal - d.spotsTaken,
    }));

  return (
    <main className="bg-slate-50 pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <BookingForm
          packageName={pkg.title}
          packageSlug={pkg.slug}
          pricePerPerson={pkg.pricePerPerson}
          priceTiers={pkg.priceTiers}
          currency={pkg.currency}
          duration={pkg.duration}
          altitude={pkg.altitude}
          difficulty={pkg.difficulty}
          groupSizeMax={groupSizeMax}
          availableDates={dates}
          paymentOptions={{
            stripe: isStripeConfigured(),
            paypal: isPayPalConfigured(),
            test: isTestPaymentMode(),
          }}
          initialDate={query.date}
          initialPeople={query.people ? parseInt(query.people, 10) : undefined}
          cancelled={query.cancelled === "true"}
        />
      </div>
    </main>
  );
}
