import type { Booking, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUnitPrice } from "@/lib/utils";

export const BOOKING_STATUSES = ["pending", "paid", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type PaymentMethod = "test" | "stripe" | "paypal";

export class BookingError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export interface BookingRequest {
  packageSlug: string;
  selectedDate: string; // YYYY-MM-DD
  participants: number;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}

function dateKeyToUtc(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/**
 * Validates the request against the database (price, date, spots) and creates
 * the booking. Price always comes from the DB, never from the client.
 */
export async function createBooking(
  input: BookingRequest,
  opts: { paymentMethod: PaymentMethod; status: BookingStatus }
): Promise<Booking> {
  const { packageSlug, selectedDate, contactName, contactEmail, contactPhone } = input;
  const participants = Number(input.participants);

  if (!packageSlug || !selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    throw new BookingError("Faltan campos requeridos");
  }
  if (!contactName || contactName.trim().length < 2) {
    throw new BookingError("El nombre es requerido");
  }
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    throw new BookingError("Correo electronico invalido");
  }
  if (!Number.isInteger(participants) || participants < 1) {
    throw new BookingError("Numero de participantes invalido");
  }

  const expedition = await prisma.expedition.findFirst({
    where: { slug: packageSlug, isActive: true },
    include: { priceTiers: true },
  });
  if (!expedition) throw new BookingError("Expedicion no encontrada", 404);

  if (expedition.groupSizeMax && participants > expedition.groupSizeMax) {
    throw new BookingError(`El grupo maximo es de ${expedition.groupSizeMax} personas`);
  }

  const date = await prisma.expeditionDate.findFirst({
    where: { expeditionId: expedition.id, startDate: dateKeyToUtc(selectedDate) },
  });
  if (!date) throw new BookingError("La fecha seleccionada no esta disponible");

  const spotsLeft = date.spotsTotal - date.spotsTaken;
  if (date.status === "full" || spotsLeft < participants) {
    throw new BookingError(
      spotsLeft > 0
        ? `Solo quedan ${spotsLeft} lugares para esta fecha`
        : "Esta fecha ya esta llena"
    );
  }

  const unitPrice = getUnitPrice(expedition.pricePerPerson, expedition.priceTiers, participants);

  return prisma.$transaction(async (tx) => {
    if (opts.status === "paid") {
      // Conditional increment so two simultaneous bookings can't overbook
      const reserved = await tx.expeditionDate.updateMany({
        where: { id: date.id, spotsTaken: { lte: date.spotsTotal - participants } },
        data: { spotsTaken: { increment: participants } },
      });
      if (reserved.count === 0) throw new BookingError("Esta fecha ya no tiene lugares suficientes");
      await syncDateStatus(tx, date.id);
    }

    return tx.booking.create({
      data: {
        expeditionId: expedition.id,
        expeditionSlug: expedition.slug,
        expeditionName: expedition.titleEs,
        customerName: contactName.trim(),
        customerEmail: contactEmail.trim(),
        customerPhone: contactPhone?.trim() || null,
        people: participants,
        totalPrice: unitPrice * participants,
        currency: expedition.currency,
        status: opts.status,
        paymentMethod: opts.paymentMethod,
        dateSelected: date.startDate,
        dateEnd: date.endDate,
      },
    });
  });
}

/** Marks a booking as paid once (idempotent) and takes its spots. */
export async function markBookingPaid(id: string, paymentId?: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id } });
    if (!booking) return false;
    if (booking.status === "paid") return true;

    await tx.booking.update({
      where: { id },
      data: { status: "paid", paymentId: paymentId ?? booking.paymentId },
    });
    await adjustSpots(tx, booking, booking.people);
    return true;
  });
}

/** Admin status change; keeps the date's taken spots in sync. */
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id } });
    if (!booking) return null;

    const wasPaid = booking.status === "paid";
    const isPaid = status === "paid";
    if (wasPaid && !isPaid) await adjustSpots(tx, booking, -booking.people);
    if (!wasPaid && isPaid) await adjustSpots(tx, booking, booking.people);

    return tx.booking.update({ where: { id }, data: { status } });
  });
}

/** Deletes a booking, releasing its spots if it was paid. */
export async function deleteBooking(id: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id } });
    if (!booking) return false;
    if (booking.status === "paid") await adjustSpots(tx, booking, -booking.people);
    await tx.booking.delete({ where: { id } });
    return true;
  });
}

async function adjustSpots(tx: Prisma.TransactionClient, booking: Booking, delta: number) {
  if (!booking.expeditionId || !booking.dateSelected) return;
  const date = await tx.expeditionDate.findFirst({
    where: { expeditionId: booking.expeditionId, startDate: booking.dateSelected },
  });
  if (!date) return; // date was removed/edited in admin; nothing to sync

  await tx.expeditionDate.update({
    where: { id: date.id },
    data: { spotsTaken: Math.max(0, date.spotsTaken + delta) },
  });
  await syncDateStatus(tx, date.id);
}

/** "full" when no spots remain; back to "available" when spots free up. "guaranteed" is kept. */
async function syncDateStatus(tx: Prisma.TransactionClient, dateId: string) {
  const date = await tx.expeditionDate.findUnique({ where: { id: dateId } });
  if (!date) return;
  const isFull = date.spotsTaken >= date.spotsTotal;
  if (isFull && date.status === "available") {
    await tx.expeditionDate.update({ where: { id: dateId }, data: { status: "full" } });
  } else if (!isFull && date.status === "full") {
    await tx.expeditionDate.update({ where: { id: dateId }, data: { status: "available" } });
  }
}
