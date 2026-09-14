"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Minus,
  Plus,
  Mountain,
  Clock,
  CreditCard,
  AlertCircle,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import PayPalCheckout from "./PayPalCheckout";

interface AvailableDate {
  start: string;
  end: string;
  spots: number;
}

interface BookingFormProps {
  packageName: string;
  packageSlug: string;
  pricePerPerson: number;
  currency: string;
  duration: string;
  altitude: number;
  difficulty: string;
  groupSizeMax: number;
  availableDates: AvailableDate[];
  initialDate?: string;
  initialPeople?: number;
  cancelled?: boolean;
}

type PaymentMethod = "stripe" | "paypal";
type Step = "details" | "payment";

export default function BookingForm({
  packageName,
  packageSlug,
  pricePerPerson,
  currency,
  duration,
  altitude,
  difficulty,
  groupSizeMax,
  availableDates,
  initialDate,
  initialPeople,
  cancelled,
}: BookingFormProps) {
  const t = useTranslations("booking");
  const tDiff = useTranslations("difficulty");

  const initialDateIdx = initialDate
    ? availableDates.findIndex((d) => d.start === initialDate)
    : -1;

  const [step, setStep] = useState<Step>("details");
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(
    initialDateIdx >= 0 ? initialDateIdx : 0
  );
  const [participants, setParticipants] = useState(
    Math.min(initialPeople || 1, groupSizeMax)
  );
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    cancelled ? t("paymentCancelled") : null
  );

  const totalPrice = pricePerPerson * participants;
  const selectedDate = availableDates[selectedDateIndex];

  const isFormValid =
    contactName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
    selectedDate !== undefined;

  function handleContinueToPayment() {
    if (!isFormValid) return;
    setError(null);
    setStep("payment");
  }

  async function handleStripeCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName,
          packageSlug,
          pricePerPerson,
          currency,
          participants,
          selectedDate: selectedDate.start,
          contactName,
          contactEmail,
          contactPhone,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || t("paymentError"));
        setIsLoading(false);
      }
    } catch {
      setError(t("paymentError"));
      setIsLoading(false);
    }
  }

  const difficultyKey = difficulty as keyof typeof DIFFICULTY_COLORS;
  const colors = DIFFICULTY_COLORS[difficultyKey] || DIFFICULTY_COLORS.principiante;

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/expediciones/${packageSlug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-forest-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("backToPackage")}
      </Link>

      {/* Package summary card */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">
              {t("title")}
            </h1>
            <p className="mt-1 text-lg font-heading font-semibold text-forest-700">
              {packageName}
            </p>
          </div>
          <span
            className={cn(
              "self-start rounded-full px-3 py-1 text-xs font-semibold",
              colors.bg,
              colors.text
            )}
          >
            {tDiff(difficultyKey)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            {duration}
          </div>
          <div className="flex items-center gap-1.5">
            <Mountain className="h-4 w-4 text-slate-400" />
            {altitude.toLocaleString("es-MX")} msnm
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-400" />
            {t("maxGroup", { max: groupSizeMax })}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => step === "payment" && setStep("details")}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
            step === "details"
              ? "bg-forest-600 text-white"
              : "bg-forest-100 text-forest-700 hover:bg-forest-200"
          )}
        >
          1
        </button>
        <span
          className={cn(
            "text-sm font-medium",
            step === "details" ? "text-slate-900" : "text-slate-500"
          )}
        >
          {t("stepDetails")}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
            step === "payment"
              ? "bg-forest-600 text-white"
              : "bg-slate-100 text-slate-400"
          )}
        >
          2
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            step === "payment" ? "text-slate-900" : "text-slate-400"
          )}
        >
          {t("stepPayment")}
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {step === "details" ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date selection */}
            <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <legend className="flex items-center gap-2 text-base font-heading font-bold text-slate-900 px-1">
                <Calendar className="h-5 w-5 text-forest-600" />
                {t("selectDate")}
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {availableDates.map((date, i) => (
                  <button
                    key={date.start}
                    type="button"
                    onClick={() => setSelectedDateIndex(i)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all",
                      selectedDateIndex === i
                        ? "border-forest-500 bg-forest-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDate(date.start)}
                    </p>
                    {date.end !== date.start && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        al {formatDate(date.end)}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-forest-600">
                      {date.spots} {t("spotsAvailable")}
                    </p>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Participants */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="flex items-center gap-2 text-base font-heading font-bold text-slate-900">
                <Users className="h-5 w-5 text-forest-600" />
                {t("participants")}
              </label>
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setParticipants((p) => Math.max(1, p - 1))}
                  disabled={participants <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[48px] text-center text-xl font-bold text-slate-900">
                  {participants}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setParticipants((p) => Math.min(groupSizeMax, p + 1))
                  }
                  disabled={participants >= groupSizeMax}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Contact info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-base font-heading font-bold text-slate-900">
                {t("contactInfo")}
              </h3>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("fullName")} *
                </label>
                <input
                  id="name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("email")} *
                </label>
                <input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("phone")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                />
              </div>
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-heading font-bold text-slate-900 mb-4">
                {t("orderSummary")}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{packageName}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between text-slate-600">
                    <span>{t("date")}</span>
                    <span className="font-medium text-slate-900">
                      {formatDate(selectedDate.start)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{t("participants")}</span>
                  <span className="font-medium text-slate-900">
                    {participants}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t("pricePerPerson")}</span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(pricePerPerson, currency)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-base font-heading font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-xl font-heading font-bold text-forest-700">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={!isFormValid}
                className="mt-6 w-full rounded-xl bg-summit-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-summit-500/25 transition-all hover:bg-summit-600 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("continueToPayment")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2: Payment */
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Summary recap */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-heading font-bold text-slate-900 mb-3">
              {t("orderSummary")}
            </h3>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-slate-500">{t("expedition")}:</span>{" "}
                <span className="font-medium text-slate-900">{packageName}</span>
              </div>
              <div>
                <span className="text-slate-500">{t("date")}:</span>{" "}
                <span className="font-medium text-slate-900">
                  {formatDate(selectedDate.start)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">{t("participants")}:</span>{" "}
                <span className="font-medium text-slate-900">{participants}</span>
              </div>
              <div>
                <span className="text-slate-500">{t("name")}:</span>{" "}
                <span className="font-medium text-slate-900">{contactName}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-heading font-bold text-slate-900">Total</span>
              <span className="text-2xl font-heading font-bold text-forest-700">
                {formatPrice(totalPrice, currency)}
              </span>
            </div>
          </div>

          {/* Payment method selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-heading font-bold text-slate-900 mb-4">
              <CreditCard className="h-5 w-5 text-forest-600" />
              {t("selectPaymentMethod")}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                  paymentMethod === "stripe"
                    ? "border-forest-500 bg-forest-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#635bff] text-white font-bold text-sm">
                  S
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("creditDebit")}
                  </p>
                  <p className="text-xs text-slate-500">Visa, Mastercard, Amex</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                  paymentMethod === "paypal"
                    ? "border-forest-500 bg-forest-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003087] text-white font-bold text-sm">
                  P
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">PayPal</p>
                  <p className="text-xs text-slate-500">{t("paypalDescription")}</p>
                </div>
              </button>
            </div>

            {/* Payment action */}
            <div className="mt-6">
              {paymentMethod === "stripe" ? (
                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#635bff] px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#5046e5] focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("payWithStripe")
                  )}
                </button>
              ) : (
                <PayPalCheckout
                  packageName={packageName}
                  packageSlug={packageSlug}
                  pricePerPerson={pricePerPerson}
                  currency={currency}
                  participants={participants}
                  selectedDate={selectedDate.start}
                  contactName={contactName}
                  contactEmail={contactEmail}
                  contactPhone={contactPhone}
                />
              )}
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              {t("securePayment")}
            </p>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={() => setStep("details")}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToDetails")}
          </button>
        </div>
      )}
    </div>
  );
}
