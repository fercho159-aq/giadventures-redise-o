import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import {
  BOOKING_STATUSES,
  deleteBooking,
  updateBookingStatus,
  type BookingStatus,
} from "@/lib/bookings";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body: { status?: string; notes?: string } = await request.json();

    if (body.status !== undefined && !BOOKING_STATUSES.includes(body.status as BookingStatus)) {
      return NextResponse.json({ error: "Estado invalido" }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    if (body.status !== undefined && body.status !== existing.status) {
      await updateBookingStatus(id, body.status as BookingStatus);
    }
    if (body.notes !== undefined) {
      await prisma.booking.update({ where: { id }, data: { notes: body.notes } });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    return NextResponse.json(booking);
  } catch (error) {
    console.error("[Admin Reserva PATCH]", error);
    return NextResponse.json(
      { error: "Error al actualizar reserva" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteBooking(id);
    if (!deleted) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Reserva DELETE]", error);
    return NextResponse.json(
      { error: "Error al eliminar reserva" },
      { status: 500 }
    );
  }
}
