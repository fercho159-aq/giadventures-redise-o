import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ConfirmationContent from "@/components/booking/ConfirmationContent";

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

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    session_id?: string;
    status?: string;
    provider?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const isSuccess = query.status === "success";

  return (
    <main className="bg-slate-50 pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <ConfirmationContent
          isSuccess={isSuccess}
          provider={query.provider || "stripe"}
          sessionId={query.session_id}
        />
      </div>
    </main>
  );
}
