"use client";

import { useState } from "react";
import { Calendar, Users, Minus, Plus, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { Link } from "@/i18n/navigation";

interface AvailableDate {
  startDate: string;
  endDate: string;
  spotsTotal: number;
  spotsTaken: number;
  status: "available" | "full" | "guaranteed";
}

interface PricingCardProps {
  pricePerPerson: number;
  currency: string;
  availableDates: AvailableDate[];
  groupSizeMax: number;
  packageName: string;
  packageSlug: string;
}

function DateOption({
  date,
  isSelected,
  onSelect,
}: {
  date: AvailableDate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const spotsRemaining = date.spotsTotal - date.spotsTaken;
  const isFull = date.status === "full";
  const isGuaranteed = date.status === "guaranteed";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isFull}
      className={cn(
        "w-full rounded-lg border-2 p-3 text-left transition-all",
        isSelected
          ? "border-summit-500 bg-summit-50 shadow-sm"
          : isFull
            ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
            : "border-slate-200 bg-white hover:border-slate-300 cursor-pointer"
      )}
      aria-label={`Fecha: ${formatDate(date.startDate)} - ${isFull ? "Agotado" : spotsRemaining + " lugares disponibles"}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {formatDate(date.startDate)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            al {formatDate(date.endDate)}
          </p>
        </div>
        <div className="text-right">
          {isFull ? (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              Agotado
            </span>
          ) : isGuaranteed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Garantizada
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {spotsRemaining} disponibles
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function PricingCard({
  pricePerPerson,
  currency,
  availableDates,
  groupSizeMax,
  packageName,
  packageSlug,
}: PricingCardProps) {
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [participants, setParticipants] = useState(1);

  const totalPrice = pricePerPerson * participants;

  const selectedDate = selectedDateIndex !== null ? availableDates[selectedDateIndex] : undefined;
  const bookingQuery = new URLSearchParams({ people: String(participants) });
  if (selectedDate) bookingQuery.set("date", selectedDate.startDate);
  const bookingHref = `/reservar/${packageSlug}?${bookingQuery.toString()}`;

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa el paquete: ${packageName}. Podrian darme mas informacion?`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  function decrementParticipants() {
    setParticipants((prev) => Math.max(1, prev - 1));
  }

  function incrementParticipants() {
    setParticipants((prev) => Math.min(groupSizeMax, prev + 1));
  }

  return (
    <>
      {/* Desktop sidebar card */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          {/* Price */}
          <div className="mb-6">
            <p className="text-sm text-slate-500 font-medium">Desde</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-heading font-bold text-slate-900">
                {formatPrice(pricePerPerson, currency)}
              </span>
              <span className="text-sm text-slate-500">/ persona</span>
            </p>
          </div>

          {/* Date selector */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="h-4 w-4 text-forest-600" aria-hidden="true" />
              Selecciona una fecha
            </label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {availableDates.length === 0 && (
                <p className="text-sm text-slate-500">
                  No hay fechas programadas por ahora. Escribenos para consultar proximas salidas.
                </p>
              )}
              {availableDates.map((date, index) => (
                <DateOption
                  key={date.startDate}
                  date={date}
                  isSelected={selectedDateIndex === index}
                  onSelect={() => setSelectedDateIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Participants */}
          <div className="mb-6">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Users className="h-4 w-4 text-forest-600" aria-hidden="true" />
              Numero de personas
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrementParticipants}
                disabled={participants <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Reducir participantes"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 min-w-[48px] items-center justify-center text-lg font-bold text-slate-900">
                {participants}
              </span>
              <button
                type="button"
                onClick={incrementParticipants}
                disabled={participants >= groupSizeMax}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Aumentar participantes"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="mb-6 rounded-lg bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                {formatPrice(pricePerPerson, currency)} x {participants}{" "}
                {participants === 1 ? "persona" : "personas"}
              </span>
              <span className="font-medium">{formatPrice(totalPrice, currency)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
              <span className="text-base font-heading font-bold text-slate-900">Total</span>
              <span className="text-xl font-heading font-bold text-slate-900">
                {formatPrice(totalPrice, currency)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={bookingHref}
            className="block w-full text-center rounded-xl bg-summit-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-summit-500/25 transition-all hover:bg-summit-600 hover:shadow-xl hover:shadow-summit-500/30 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            Reservar ahora
          </Link>

          {/* WhatsApp link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
            Preguntas? Escribenos
          </a>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Desde</p>
            <p className="text-lg font-heading font-bold text-slate-900">
              {formatPrice(pricePerPerson, currency)}
              <span className="text-xs font-normal text-slate-500 ml-1">/ persona</span>
            </p>
          </div>
          <Link
            href={bookingHref}
            className="rounded-xl bg-summit-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-summit-500/25 transition-all hover:bg-summit-600 active:scale-[0.98]"
          >
            Reservar
          </Link>
        </div>
      </div>
    </>
  );
}
