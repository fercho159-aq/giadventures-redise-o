"use client";

import { CheckCircle, XCircle, ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ConfirmationContentProps {
  isSuccess: boolean;
  provider: string;
  sessionId?: string;
  bookingId?: string;
}

const PROVIDER_LABELS: Record<string, string> = {
  paypal: "PayPal",
  stripe: "Stripe",
};

export default function ConfirmationContent({
  isSuccess,
  provider,
  bookingId,
}: ConfirmationContentProps) {
  const t = useTranslations("booking");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t("whatsappMessage")
  )}`;

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>

        <h1 className="mt-6 text-2xl font-heading font-bold text-slate-900">
          {t("confirmationSuccess")}
        </h1>

        <p className="mt-3 text-slate-600">{t("confirmationMessage")}</p>

        <p className="mt-2 text-sm text-slate-500">
          {t("paymentProvider")}: {PROVIDER_LABELS[provider] ?? t("creditDebit")}
        </p>

        {bookingId && (
          <p className="mt-1 text-sm text-slate-500">
            {t("bookingReference")}:{" "}
            <span className="font-mono font-medium text-slate-700">{bookingId}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/expediciones"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-700"
          >
            {t("exploreMore")}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            {t("contactWhatsApp")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>

      <h1 className="mt-6 text-2xl font-heading font-bold text-slate-900">
        {t("confirmationFailed")}
      </h1>

      <p className="mt-3 text-slate-600">{t("confirmationFailedMessage")}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/expediciones"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-summit-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-summit-600"
        >
          {t("tryAgain")}
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
          {t("needHelp")}
        </a>
      </div>
    </div>
  );
}
