import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/constants";
import { BookingError, createBooking, type BookingRequest } from "@/lib/bookings";
import { isStripeConfigured } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe no esta configurado" }, { status: 503 });
  }

  try {
    const body: BookingRequest & { locale?: string } = await request.json();
    // Default locale (es) has no URL prefix
    const localePrefix = body.locale === "en" ? "/en" : "";

    // Booking is stored as pending; confirmation page marks it paid after Stripe confirms.
    const booking = await createBooking(body, { paymentMethod: "stripe", status: "pending" });
    const unitAmount = Math.round((booking.totalPrice / booking.people) * 100);

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: booking.customerEmail,
      line_items: [
        {
          price_data: {
            currency: booking.currency.toLowerCase(),
            product_data: {
              name: booking.expeditionName,
              description: `Expedición ${booking.expeditionName} — ${body.selectedDate} — ${booking.people} persona(s)`,
            },
            unit_amount: unitAmount,
          },
          quantity: booking.people,
        },
      ],
      mode: "payment",
      success_url: `${SITE_URL}${localePrefix}/reservar/confirmacion?session_id={CHECKOUT_SESSION_ID}&status=success&booking=${booking.id}`,
      cancel_url: `${SITE_URL}${localePrefix}/reservar/${body.packageSlug}?cancelled=true`,
      metadata: {
        bookingId: booking.id,
        packageSlug: body.packageSlug,
        packageName: booking.expeditionName,
        selectedDate: body.selectedDate,
        participants: String(booking.people),
        contactName: booking.customerName,
        contactPhone: booking.customerPhone ?? "",
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 }
    );
  }
}
