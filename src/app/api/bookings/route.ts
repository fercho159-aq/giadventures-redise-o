import { NextRequest, NextResponse } from "next/server";
import { BookingError, createBooking, type BookingRequest } from "@/lib/bookings";
import { isTestPaymentMode } from "@/lib/payments";

/** Test-mode checkout: registers the booking as paid without charging. */
export async function POST(request: NextRequest) {
  if (!isTestPaymentMode()) {
    return NextResponse.json({ error: "El modo de pago de prueba no esta activo" }, { status: 403 });
  }

  try {
    const body: BookingRequest = await request.json();
    const booking = await createBooking(body, { paymentMethod: "test", status: "paid" });
    return NextResponse.json({ bookingId: booking.id }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[Bookings POST]", error);
    return NextResponse.json({ error: "Error al registrar la reserva" }, { status: 500 });
  }
}
