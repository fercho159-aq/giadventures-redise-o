import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ConfirmationContent from "@/components/booking/ConfirmationContent";
import { getStripe } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";
import { markBookingPaid } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: t("confirmationTitle"),
  };
}

/** Confirms a Stripe Checkout session server-side and marks its booking as paid. */
async function confirmStripeSession(sessionId: string): Promise<boolean> {
  if (!isStripeConfigured()) return false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return false;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) await markBookingPaid(bookingId, session.id);
    return true;
  } catch (error) {
    console.error("[Confirmacion] Stripe verification", error);
    return false;
  }
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    session_id?: string;
    status?: string;
    provider?: string;
    booking?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const provider = query.provider || "stripe";
  let isSuccess = query.status === "success";
  if (isSuccess && provider === "stripe") {
    isSuccess = query.session_id ? await confirmStripeSession(query.session_id) : false;
  }

  return (
    <main className="bg-slate-50 pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <ConfirmationContent
          isSuccess={isSuccess}
          provider={provider}
          sessionId={query.session_id}
          bookingId={query.booking}
        />
      </div>
    </main>
  );
}
